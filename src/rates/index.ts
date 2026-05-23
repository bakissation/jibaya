import { JibayaError } from '../errors.js';
import type { RateSet } from './types.js';
import { RATES_2025 } from './2025.js';
import { RATES_2026 } from './2026.js';

export type { RateSet, Bracket } from './types.js';
export { RATES_2025, RATES_2026 };

const REGISTRY: Record<number, RateSet> = {
  2025: RATES_2025,
  2026: RATES_2026,
};

/** The most recent Loi de Finances year jibaya has rates for. */
export const LATEST_YEAR = 2026;

/** Resolve the rate set for a year (defaults to the latest). Throws on unknown years. */
export function getRates(year: number = LATEST_YEAR): RateSet {
  const rates = REGISTRY[year];
  if (!rates) {
    const known = Object.keys(REGISTRY).join(', ');
    throw new JibayaError(`No rates for year ${year} (known: ${known})`, 'UNKNOWN_YEAR');
  }
  return rates;
}

/** Years jibaya currently has rate sets for. */
export function supportedYears(): number[] {
  return Object.keys(REGISTRY).map(Number).sort();
}
