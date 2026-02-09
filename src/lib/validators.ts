import { z } from 'zod';

export const vinSchema = z
  .string()
  .check(
    z.refine((val) => val.length === 17, 'VIN must be exactly 17 characters'),
    z.refine(
      (val) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(val),
      'VIN contains invalid characters (I, O, Q are not allowed)'
    )
  );

export const mileageSchema = z
  .number({ message: 'Mileage must be a number' })
  .check(
    z.refine((val) => Number.isInteger(val), 'Mileage must be a whole number'),
    z.refine((val) => val >= 0, 'Mileage cannot be negative'),
    z.refine((val) => val <= 300000, 'Mileage cannot exceed 300,000')
  );

export const vehicleYearSchema = z
  .number()
  .check(
    z.refine((val) => Number.isInteger(val), 'Year must be a whole number'),
    z.refine((val) => val >= 1990, 'Vehicle year must be 1990 or later'),
    z.refine((val) => val <= new Date().getFullYear() + 1, 'Invalid vehicle year')
  );

export const vehicleInfoSchema = z.object({
  year: vehicleYearSchema,
  make: z.string().check(z.refine((val) => val.length >= 1, 'Please select a vehicle make')),
  model: z.string().check(z.refine((val) => val.length >= 1, 'Please select a vehicle model')),
  mileage: mileageSchema,
  vin: vinSchema,
});

export const customerSchema = z.object({
  firstName: z.string().check(z.refine((val) => val.length >= 1, 'First name is required')),
  lastName: z.string().check(z.refine((val) => val.length >= 1, 'Last name is required')),
  phone: z.string().check(
    z.refine((val) => val.length >= 10, 'Phone number must be at least 10 digits'),
    z.refine((val) => /^[\d\-() +]+$/.test(val), 'Invalid phone number format')
  ),
  email: z.email('Invalid email address'),
  address: z.object({
    address1: z.string().check(z.refine((val) => val.length >= 1, 'Address is required')),
    city: z.string().check(z.refine((val) => val.length >= 1, 'City is required')),
    state: z.string().check(z.refine((val) => val.length === 2, 'State must be a 2-letter code')),
    postalCode: z.string().check(z.refine((val) => /^\d{5}(-\d{4})?$/.test(val), 'Invalid ZIP code')),
  }),
});

export type VehicleInfoForm = z.infer<typeof vehicleInfoSchema>;
export type CustomerForm = z.infer<typeof customerSchema>;
