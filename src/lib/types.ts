// ─── Vehicle & Auto Coverage ───────────────────────────────────────

export interface VehicleInfo {
  vehicleYear: number;
  make: string;
  model: string;
  vin: string;
  vehicleAgeType: 'New' | 'Used';
}

export interface Deductible {
  type: string;
  amount: number;
}

export interface LossCode {
  coverageLossCodeId: number;
  description: string;
  dealerCost: number;
  isSelectable: boolean;
  isSelected: boolean;
}

export interface CoverageComponent {
  lossCodes: LossCode[];
}

export interface CoverageTerm {
  termMonths: number;
  termOdometer: number;
  dealerCost: number;
  deductible: Deductible;
  components: CoverageComponent[];
}

export interface CoverageRate {
  code: string;
  description: string;
  terms: CoverageTerm[];
}

export interface CoverageRatesResponse {
  rates: CoverageRate[];
  error?: {
    details: Array<{ message: string; code: string }>;
  };
}

export interface SelectedCoverage {
  planCode: string;
  planDescription: string;
  retailCost: number;
  termMonths: number;
  termOdometer: number;
  deductible: Deductible;
  coverageLossCodes: number[];
}

export interface CostBreakdown {
  basePrice: number;
  surchargeCost: number;
  optionsCost: number;
  totalPrice: number;
}

export interface VehicleCoverage {
  dealerNumber: string;
  saleDate: string;
  saleOdometer: number;
  startingOdometer: number;
  endingOdometer: number;
  vehicle: VehicleInfo;
  coverage: SelectedCoverage;
  costs: CostBreakdown;
  previewBuckets: PreviewBucket[] | null;
}

export interface PreviewBucket {
  amount: number;
  description: string;
}

// ─── Home Coverage ─────────────────────────────────────────────────

export type HomeCoverageType = 'appliance' | 'system' | 'total';
export type HomeSize = 'less-than-5' | 'between-5-and-8' | 'more-than-8' | 'condo';
export type CoverageDuration = 1 | 2 | 3;

export interface HomePriceBreakdown {
  term: string;
  admin: string;
  reserve: string;
  commision: string;
  total: string;
  suggestedRetail: string;
  coverageRate: string;
}

export interface HomeAddOn {
  code: string;
  name: string;
  price: number;
}

export interface HomeCoverage {
  coverageCode: string;
  coverageTitle: string;
  coverageType: HomeCoverageType;
  duration: CoverageDuration;
  homeSize: HomeSize;
  homeSizeLabel: string;
  priceBreakdown: HomePriceBreakdown;
  addOns: HomeAddOn[];
  addOnPrice: number;
  totalFinalPrice: number;
}

// ─── Customer ──────────────────────────────────────────────────────

export interface CustomerAddress {
  countryCode: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: CustomerAddress;
}

// ─── Cart & Transaction ────────────────────────────────────────────

export interface Cart {
  vehicles: VehicleCoverage[];
  home: HomeCoverage | null;
  masterPrice: number;
  paymentType: 'full' | 'buydown';
}

export interface FortPointPayload {
  card: { number: string; exp: string };
  token: string;
  tokenType: string;
  amount: string;
}

export interface FortPointResponse {
  response: string;
  response_code: string;
  transactionid?: string;
  responsetext?: string;
}

// ─── API Payloads ──────────────────────────────────────────────────

export interface GetCoverageRatesPayload {
  saleDate: string;
  dealerNumber: string;
  saleOdometer: number;
  vehicle: VehicleInfo;
}

export interface CreateAutoContractPayload {
  coverages: SelectedCoverage[];
  dealerNumber: string;
  saleDate: string;
  saleOdometer: number;
  startingOdometer: number;
  endingOdometer: number;
  vehicle: VehicleInfo;
  customer: Customer;
}

export interface CreateHomeContractPayload {
  dealerNumber: string;
  dealerInvoiceNumber: string;
  storeLocationNumber: string;
  status: string;
  coverage: {
    warrantySKUCode: string;
    additionalWarranty: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    address: {
      address1: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    contact: {
      phone: { mainPhone: string; mobilePhone: string };
      email: string;
    };
  };
  transactionDate: string;
  products: Array<{ productPurchaseDate: string }>;
}

// ─── Quote Wizard State ────────────────────────────────────────────

export type WizardStep =
  | 'vehicle-info'
  | 'plan-selection'
  | 'bundle-prompt'
  | 'home-selection'
  | 'cart-review'
  | 'checkout'
  | 'success';
