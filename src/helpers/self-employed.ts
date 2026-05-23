import { Dinar } from '@bakissation/dinar';
import { casnos } from '../social.js';
import { corporateTaxDue } from './corporate.js';
import { computeIRG } from '../irg.js';
import type { IfuActivity } from '../types.js';

export interface SelfEmployedResult {
  tax: Dinar;
  casnos: Dinar;
  total: Dinar;
}

/**
 * Total annual charge for a self-employed person: income tax (IFU on turnover, or
 * IRG on net professional income) + CASNOS (15%). Combines the two systems a
 * freelancer/auto-entrepreneur actually pays.
 */
export function selfEmployedAnnual(
  income: Dinar,
  options: { regime?: 'IFU' | 'IRG'; activity?: IfuActivity } = {},
  year?: number,
): SelfEmployedResult {
  const regime = options.regime ?? 'IFU';
  const tax =
    regime === 'IFU'
      ? corporateTaxDue(income, { regime: 'IFU', activity: options.activity ?? 'services' }, year).due
      : computeIRG(income, {}, year);
  const casnosAmount = casnos(income, year);
  return { tax, casnos: casnosAmount, total: tax.add(casnosAmount) };
}
