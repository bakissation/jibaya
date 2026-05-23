import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';
import type { IfuActivity } from './types.js';

/**
 * IFU on turnover (Art. 282 sexies CIDTA): 5% goods · 12% services · 0.5%
 * auto-entrepreneur. This is the raw rate × turnover; the annual minimum
 * d'imposition (Art. 365 bis) is applied by {@link corporateTaxDue}.
 */
export function computeIFU(turnover: Dinar, activity: IfuActivity, year?: number): Dinar {
  requireNonNegative(turnover, 'turnover');
  const { ifu } = getRates(year);
  const rate =
    activity === 'goods' ? ifu.goods : activity === 'auto-entrepreneur' ? ifu.autoEntrepreneur : ifu.services;
  return turnover.percentage(rate);
}
