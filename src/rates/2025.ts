import type { RateSet } from './types.js';
import { RATES_2026 } from './2026.js';

/**
 * Rates in force for the 2025 Loi de Finances year. Identical to 2026 except
 * the dividend / RCM withholding, which LF 2026 cut from 15% to 10%
 * (Art. 104-II-4). Everything else (barème, IBS, IFU, VAT, …) is unchanged.
 */
export const RATES_2025: RateSet = {
  ...RATES_2026,
  year: 2025,
  irg: { ...RATES_2026.irg, dividend: 15 },
};
