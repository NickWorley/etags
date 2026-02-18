'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Script from 'next/script';
import { useQuoteStore } from '@/store/quote-store';
import { US_STATES, formatCurrency } from '@/lib/constants';
import { AlertCircle, Lock, CreditCard } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    CollectJS?: {
      configure: (config: Record<string, unknown>) => void;
      startPaymentRequest: () => void;
    };
  }
}

export default function CheckoutStep() {
  const {
    vehicles,
    homeCoverage,
    customer,
    setCustomer,
    paymentType,
    setPaymentType,
    getMasterPrice,
    setStep,
  } = useQuoteStore();

  const [firstName, setFirstName] = useState(customer?.firstName ?? '');
  const [lastName, setLastName] = useState(customer?.lastName ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [address1, setAddress1] = useState(customer?.address?.address1 ?? '');
  const [city, setCity] = useState(customer?.address?.city ?? '');
  const [state, setState] = useState(customer?.address?.state ?? '');
  const [zip, setZip] = useState(customer?.address?.postalCode ?? '');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collectReady, setCollectReady] = useState(false);

  const masterPrice = getMasterPrice();
  const configuredRef = useRef(false);

  const tokenizationKey = process.env.NEXT_PUBLIC_FORT_POINT_TOKENIZATION_KEY ?? '';

  const handleCollectResponse = useCallback(
    async (response: { token?: string; card?: { number?: string; exp?: string }; tokenType?: string }) => {
      if (!response.token) {
        setError('Payment tokenization failed. Please try again.');
        setLoading(false);
        return;
      }

      const {
        firstName,
        lastName,
        phone,
        email,
        address1,
        city,
        state,
        zip,
      } = latestFormRef.current;

      // Save customer to store
      const customerData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: {
          countryCode: 'USA',
          address1: address1.trim(),
          city: city.trim(),
          state,
          postalCode: zip.trim(),
        },
      };
      
      setCustomer(customerData);

      try {
        // Process payment
        const paymentRes = await fetch('/api/payment/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: response.token,
            tokenType: response.tokenType,
            card: response.card,
            amount: masterPrice.toFixed(2),
            paymentType,
            customerInfo: customerData,
            //customer: customerData,
          }),
        });

        const paymentData = await paymentRes.json();

        if (!paymentRes.ok || paymentData.response_code !== '100') {
          setError(
            paymentData.responsetext ||
              'Transaction declined. Please check your payment information.'
          );
          setLoading(false);
          return;
        }

        // Create auto contracts
        const coveredVehicles = vehicles.filter((v) => v.vehicle && v.coverage);
        if (coveredVehicles.length > 0) {
          const contracts = coveredVehicles.map((v) => {
            const today = new Date().toISOString().split('T')[0];
            return {


              coverages: [
                {                
                  term: {
                    termOdometer: v.coverage!.termOdometer,
                    termMonths: v.coverage!.termMonths,
                    deductible: v.coverage!.deductible,
                  },
                  ...v.coverage,
                },
              ],

              // coverages: [v.coverage],
              dealerNumber: process.env.NEXT_PUBLIC_DEALER_NUMBER_AUTO ?? '',
              saleDate: today,
              saleOdometer: v.saleOdometer,
              startingOdometer: v.saleOdometer,
              endingOdometer: v.saleOdometer + (v.coverage!.termOdometer ?? 0),
              vehicle: v.vehicle,
              customer: customerData,
            };
          });
          
          const autoContractRes = await fetch('/api/contract/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contracts }),
          });

          const autoConData = await autoContractRes.json();
          if (!autoConData.results[0].success) {
            setError(
              autoConData.results[0].error.error.details[0].message || 
              'Auto contract failed to create. Please make sure you have filled out all vehicle descriptors or do not have a current plan active.'
            );

            const cancelConRes = await fetch('/api/payment/cancel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transactionId: paymentData.transactionid,
              }),
            });

            //const cancelData = await cancelConRes.json();
            
            setLoading(false);
            return;
          }
          else {

            const captureRes = await fetch('/api/payment/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transactionId: paymentData.transactionid,
                amount: masterPrice.toFixed(2),
              }),
            });

            const captureData = await captureRes.json();
            //console.log('Here is the response from the capture api:', captureData);


          }

        }

        // Create home contract
        if (homeCoverage) {
          const addOnCodes = homeCoverage.addOns.map((a) => a.code);
          await fetch('/api/contract/home', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              homeDetails: {
                homeCoverageCode: homeCoverage.coverageCode,
                lossCodes: addOnCodes,
              },
              customer: {
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phone: customerData.phone,
                email: customerData.email,
                address: customerData.address,
              },
            }),
          });
        }

        setStep('success');
      } catch {
        setError('An error occurred while processing your order. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [
      masterPrice, paymentType, vehicles, homeCoverage, setCustomer, setStep,
    ]
  );

  const latestFormRef = useRef({
    firstName,
    lastName,
    phone,
    email,
    address1,
    city,
    state,
    zip,
  });

  // Configure Collect.js after script loads
  useEffect(() => {

    latestFormRef.current = {
      firstName,
      lastName,
      phone,
      email,
      address1,
      city,
      state,
      zip,
    };


    if (collectReady && window.CollectJS && !configuredRef.current) {
      
      configuredRef.current = true;
      window.CollectJS.configure({
        paymentSelector: '#payButton',
        variant: 'inline',
        styleSniffer: true,
        fields: {
          ccnumber: {
            selector: '#ccnumber',
            placeholder: 'Card Number',
          },
          ccexp: {
            selector: '#ccexp',
            placeholder: 'MM / YY',
          },
          cvv: {
            selector: '#cvv',
            placeholder: 'CVV',
          },
        },
        callback: (response: { token?: string; card?: { number?: string; exp?: string }; tokenType?: string }) => {
          handleCollectResponse(response);
        },
      });
    }
  }, [firstName, lastName, phone, email, address1, city, state, zip, collectReady, handleCollectResponse]);

  function validateForm(): boolean {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid phone number.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!address1.trim() || !city.trim() || !state || !zip.trim()) {
      setError('Please complete your full address.');
      return false;
    }
    if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) {
      setError('Please enter a valid ZIP code.');
      return false;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Vehicle Service Contract Terms to proceed.');
      return false;
    }
    return true;
  }

  function handlePayClick() {
    setError('');
    if (!validateForm()) return;
    
    setLoading(true);

    if (!window.CollectJS) {
      setError('Payment form is still loading. Please try again.');
      setLoading(false);
      return;
    }

    window.CollectJS.startPaymentRequest();
    
    // Collect.js will handle tokenization and call the callback
    // The pay button triggers Collect.js automatically via its ID
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Collect.js Script */}
      <Script
        src="https://secure.fppgateway.com/token/Collect.js"
        data-tokenization-key={tokenizationKey}
        onLoad={() => setCollectReady(true)}
        strategy="afterInteractive"
      />

      <h2 className="text-2xl font-bold font-display text-navy-900">Checkout</h2>

      {/* Payment Type Toggle */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide mb-3">
          Payment Option
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setPaymentType('full')}
            className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
              paymentType === 'full'
                ? 'border-accent bg-accent/5 text-accent'
                : 'border-navy-100 bg-navy-50 text-navy-600 hover:border-navy-100'
            }`}
          >
            Pay in Full
          </button>
          <button
            onClick={() => setPaymentType('buydown')}
            className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
              paymentType === 'buydown'
                ? 'border-accent bg-accent/5 text-accent'
                : 'border-navy-100 bg-navy-50 text-navy-600 hover:border-navy-100'
            }`}
          >
            Buy-Down Plan
          </button>
        </div>
        <div className="mt-3 text-right">
          <span className="text-lg font-bold text-navy-900">
            Total: {formatCurrency(masterPrice)}
          </span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide mb-4">
          Your Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-firstName" className="block text-sm font-medium text-navy-700">
              First Name
            </label>
            <input
              id="checkout-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-lastName" className="block text-sm font-medium text-navy-700">
              Last Name
            </label>
            <input
              id="checkout-lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-phone" className="block text-sm font-medium text-navy-700">
              Phone Number
            </label>
            <input
              id="checkout-phone"
              type="tel"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-email" className="block text-sm font-medium text-navy-700">
              Email Address
            </label>
            <input
              id="checkout-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="checkout-address" className="block text-sm font-medium text-navy-700">
            Street Address
          </label>
          <input
            id="checkout-address"
            type="text"
            placeholder="123 Main Street"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
            required
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="checkout-city" className="block text-sm font-medium text-navy-700">
              City
            </label>
            <input
              id="checkout-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-state" className="block text-sm font-medium text-navy-700">
              State
            </label>
            <select
              id="checkout-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy-700 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            >
              <option value="">Select...</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="checkout-zip" className="block text-sm font-medium text-navy-700">
              ZIP Code
            </label>
            <input
              id="checkout-zip"
              type="text"
              maxLength={10}
              placeholder="12345"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm placeholder-navy-500 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Fields (Collect.js iframes) */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide">
            Secure Payment
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Card Number</label>
            <div
              id="ccnumber"
              className="h-12 rounded-lg border border-navy-100 bg-navy-50 px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Expiration</label>
              <div
                id="ccexp"
                className="h-12 rounded-lg border border-navy-100 bg-navy-50 px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">CVV</label>
              <div
                id="cvv"
                className="h-12 rounded-lg border border-navy-100 bg-navy-50 px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-navy-500" />
          <span className="text-xs text-navy-500">
            Your payment is processed securely. We never store your card details.
          </span>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-navy-100 text-accent focus:ring-accent/20"
          />
          <span className="text-sm text-navy-700">
            I have read and agree to the{' '}
            <Link href="/terms" className="font-semibold text-accent underline underline-offset-2">
              Vehicle Service Contract Terms
            </Link>
            .
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pay Button */}
      <button
        id="payButton"
        onClick={handlePayClick}
        disabled={loading}
        className="w-full rounded-lg bg-accent px-6 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-[1.01] active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ${formatCurrency(masterPrice)}`
        )}
      </button>

      {/* Back */}
      <button
        onClick={() => setStep('cart-review')}
        className="w-full text-center text-sm text-navy-500 hover:text-accent transition"
      >
        Back to Review
      </button>
    </div>
  );
}
