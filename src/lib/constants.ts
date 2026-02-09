// Tier descriptions for the info popups -- legally compliant (no forbidden terms)
export const TIER_DESCRIPTIONS: Record<string, { stars: number; summary: string }> = {
  Essential: {
    stars: 1,
    summary:
      'Essential Protection covers the engine, transmission/transaxle, and transfer case (or all-wheel drive mechanism). Ideal for high-mileage vehicles you want to keep on the road.',
  },
  'Essential Plus': {
    stars: 2,
    summary:
      'Essential Plus includes everything in Essential, plus CV joints, water pump, oil pump, fuel system, timing belt, electrical components, factory turbo/supercharger, A/C, seals and gaskets, and more.',
  },
  Premium: {
    stars: 3,
    summary:
      'Premium is the most extensive listed-component contract. Includes Essential Plus coverage, plus the cooling system, brake system, steering, fluids, and more.',
  },
  Exclusive: {
    stars: 4,
    summary:
      'Exclusive is the most comprehensive protection plan. Covers all vehicle components EXCEPT specifically listed exclusions (light bulbs, brake pads/rotors, keys/fobs, manual clutches, batteries, routine maintenance, tires, body panels, spark plugs). See Service Contract for full exclusion list.',
  },
};

export const TIER_ORDER = ['Essential', 'Essential Plus', 'Premium', 'Exclusive'];

// Home coverage package labels
export const HOME_PACKAGE_LABELS: Record<string, string> = {
  appliance: 'Appliance Package',
  system: 'Systems Package',
  total: 'Total Home Package',
};

export const HOME_PACKAGE_DESCRIPTIONS: Record<string, string> = {
  appliance: 'Covers kitchen and laundry appliances including dishwasher, range/oven, refrigerator, garbage disposal, and more.',
  system: 'Covers HVAC, plumbing, electrical systems, water heater, and more.',
  total: 'Complete coverage combining both Appliance and Systems packages for maximum protection.',
};

export const HOME_SIZE_LABELS: Record<string, string> = {
  'less-than-5': 'Homes less than 5,000 sq. ft',
  'between-5-and-8': 'Homes from 5,000 to 8,000 sq. ft',
  'more-than-8': 'Homes from 8,001 to 12,000 sq. ft',
  condo: 'Condominiums less than 5,000 sq. ft',
};

// Home add-on pricing by year
export const HOME_ADDON_PRICING: Record<number, Record<string, { name: string; price: number; lossCodePrefix: string; lossCodeSuffix: string }>> = {
  1: {
    'additional-ac': { name: 'Additional A/C', price: 94.47, lossCodePrefix: 'BEEAAC', lossCodeSuffix: 'Y100D' },
    boiler: { name: 'Boiler', price: 30.89, lossCodePrefix: 'BEEBL', lossCodeSuffix: 'Y100D' },
    'vacuum-system': { name: 'Central Vacuum System', price: 12.41, lossCodePrefix: 'BEECV', lossCodeSuffix: 'Y100D' },
    freezer: { name: 'Free-Standing Freezer', price: 59.83, lossCodePrefix: 'BEEFSF', lossCodeSuffix: 'Y100D' },
    thermostat: { name: 'Programmable Thermostat', price: 54.38, lossCodePrefix: 'BEEPTH', lossCodeSuffix: 'Y100D' },
    'sec-fridge': { name: 'Secondary Refrigerator', price: 43.49, lossCodePrefix: 'BEESRF', lossCodeSuffix: 'Y100D' },
    septic: { name: 'Septic System', price: 16.26, lossCodePrefix: 'BEESEPT', lossCodeSuffix: 'Y100D' },
    spa: { name: 'Spa Equipment', price: 180.38, lossCodePrefix: 'BEESPA', lossCodeSuffix: 'Y100D' },
    pool: { name: 'Swimming Pool Equipment', price: 180.38, lossCodePrefix: 'BEESPE', lossCodeSuffix: 'Y100D' },
    well: { name: 'Well Pump', price: 128.83, lossCodePrefix: 'BEEWP', lossCodeSuffix: 'Y100D' },
    wine: { name: 'Wine Cooler', price: 21.75, lossCodePrefix: 'BEEWC', lossCodeSuffix: 'Y100D' },
  },
  2: {
    'additional-ac': { name: 'Additional A/C', price: 147.43, lossCodePrefix: 'BEEAAC', lossCodeSuffix: 'Y100D' },
    boiler: { name: 'Boiler', price: 38.63, lossCodePrefix: 'BEEBL', lossCodeSuffix: 'Y100D' },
    'vacuum-system': { name: 'Central Vacuum System', price: 14.13, lossCodePrefix: 'BEECV', lossCodeSuffix: 'Y100D' },
    freezer: { name: 'Free-Standing Freezer', price: 88.12, lossCodePrefix: 'BEEFSF', lossCodeSuffix: 'Y100D' },
    thermostat: { name: 'Programmable Thermostat', price: 78.83, lossCodePrefix: 'BEEPTH', lossCodeSuffix: 'Y100D' },
    'sec-fridge': { name: 'Secondary Refrigerator', price: 60.20, lossCodePrefix: 'BEESRF', lossCodeSuffix: 'Y100D' },
    septic: { name: 'Septic System', price: 17.16, lossCodePrefix: 'BEESEPT', lossCodeSuffix: 'Y100D' },
    spa: { name: 'Spa Equipment', price: 294.42, lossCodePrefix: 'BEESPA', lossCodeSuffix: 'Y100D' },
    pool: { name: 'Swimming Pool Equipment', price: 294.42, lossCodePrefix: 'BEESPE', lossCodeSuffix: 'Y100D' },
    well: { name: 'Well Pump', price: 206.22, lossCodePrefix: 'BEEWP', lossCodeSuffix: 'Y100D' },
    wine: { name: 'Wine Cooler', price: 30.11, lossCodePrefix: 'BEEWC', lossCodeSuffix: 'Y100D' },
  },
  3: {
    'additional-ac': { name: 'Additional A/C', price: 206.68, lossCodePrefix: 'BEEAAC', lossCodeSuffix: 'Y100D' },
    boiler: { name: 'Boiler', price: 47.30, lossCodePrefix: 'BEEBL', lossCodeSuffix: 'Y100D' },
    'vacuum-system': { name: 'Central Vacuum System', price: 16.05, lossCodePrefix: 'BEECV', lossCodeSuffix: 'Y100D' },
    freezer: { name: 'Free-Standing Freezer', price: 119.75, lossCodePrefix: 'BEEFSF', lossCodeSuffix: 'Y100D' },
    thermostat: { name: 'Programmable Thermostat', price: 106.18, lossCodePrefix: 'BEEPTH', lossCodeSuffix: 'Y100D' },
    'sec-fridge': { name: 'Secondary Refrigerator', price: 78.89, lossCodePrefix: 'BEESRF', lossCodeSuffix: 'Y100D' },
    septic: { name: 'Septic System', price: 18.16, lossCodePrefix: 'BEESEPT', lossCodeSuffix: 'Y100D' },
    spa: { name: 'Spa Equipment', price: 422.04, lossCodePrefix: 'BEESPA', lossCodeSuffix: 'Y100D' },
    pool: { name: 'Swimming Pool Equipment', price: 422.04, lossCodePrefix: 'BEESPE', lossCodeSuffix: 'Y100D' },
    well: { name: 'Well Pump', price: 292.82, lossCodePrefix: 'BEEWP', lossCodeSuffix: 'Y100D' },
    wine: { name: 'Wine Cooler', price: 39.45, lossCodePrefix: 'BEEWC', lossCodeSuffix: 'Y100D' },
  },
};

export const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' }, { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
