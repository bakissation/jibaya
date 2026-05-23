import { Dinar } from '@bakissation/dinar';
import { JibayaError } from './errors.js';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';

function requireLife(usefulLifeYears: number): number {
  if (!Number.isFinite(usefulLifeYears) || usefulLifeYears < 1) {
    throw new JibayaError('usefulLifeYears must be ≥ 1', 'INVALID_INPUT');
  }
  return usefulLifeYears;
}

/** Straight-line annuity (Art. 174-1, default): base ÷ useful life. */
export function amortizationLinear(base: Dinar, usefulLifeYears: number): Dinar {
  requireNonNegative(base, 'base');
  requireLife(usefulLifeYears);
  return base.multiply(1 / usefulLifeYears);
}

/**
 * Declining-balance annuity (Art. 174-2): the straight-line rate × a coefficient
 * (1.5 for a 3–4 yr life, 2 for 5–6, 2.5 for >6), applied to the **current book
 * value** — pass the residual each year.
 */
export function amortizationDegressive(currentBookValue: Dinar, usefulLifeYears: number, year?: number): Dinar {
  requireNonNegative(currentBookValue, 'currentBookValue');
  requireLife(usefulLifeYears);
  const { amortissement } = getRates(year);
  const coefficient =
    usefulLifeYears <= 4 ? amortissement.short : usefulLifeYears <= 6 ? amortissement.medium : amortissement.long;
  return currentBookValue.multiply(coefficient / usefulLifeYears);
}

/**
 * Progressive annuity (Art. 174-3) for depreciation year `yearIndex` (1-based):
 * base × yearIndex ÷ (n(n+1)/2), i.e. the sum-of-years-digits reading of the
 * article (its text phrases the denominator as "n(n+1)").
 */
export function amortizationProgressive(base: Dinar, usefulLifeYears: number, yearIndex: number): Dinar {
  requireNonNegative(base, 'base');
  const n = requireLife(usefulLifeYears);
  if (!Number.isInteger(yearIndex) || yearIndex < 1 || yearIndex > n) {
    throw new JibayaError('yearIndex must be an integer in 1..usefulLifeYears', 'INVALID_INPUT');
  }
  return base.multiply(yearIndex / ((n * (n + 1)) / 2));
}
