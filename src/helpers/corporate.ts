import { Dinar } from '@bakissation/dinar';
import { computeIBS } from '../ibs.js';
import { computeIFU } from '../ifu.js';
import { getRates } from '../rates/index.js';
import { maxDinar } from '../internal.js';
import type { CorporateTax, IbsActivity, IfuActivity, InstallmentSchedule } from '../types.js';

export type CorporateInput =
  | { regime: 'IBS'; activity: IbsActivity; reinvested?: boolean }
  | { regime: 'IFU'; activity: IfuActivity };

/**
 * Corporate income tax due: computes IBS (on profit) or IFU (on turnover) and
 * applies the IFU minimum d'imposition (Art. 365 bis — DA 30 000, or DA 10 000
 * for auto-entrepreneurs). Returns the computed amount, the floor, and what's due.
 */
export function corporateTaxDue(base: Dinar, options: CorporateInput, year?: number): CorporateTax {
  if (options.regime === 'IBS') {
    const computed = computeIBS(base, options.activity, { reinvested: options.reinvested }, year);
    return { regime: 'IBS', computed, minimum: Dinar.zero(), due: computed };
  }
  const computed = computeIFU(base, options.activity, year);
  const { ifu } = getRates(year);
  const minimum = Dinar.fromDinars(
    options.activity === 'auto-entrepreneur' ? ifu.minimumAutoEntrepreneur : ifu.minimum,
  );
  return { regime: 'IFU', computed, minimum, due: maxDinar(computed, minimum) };
}

/**
 * Provisional-acompte schedule (Art. 355): two acomptes of 30% of the reference
 * (prior-year) tax, with the balance (solde de liquidation) settled afterwards.
 */
export function ibsInstallments(referenceTax: Dinar, year?: number): InstallmentSchedule {
  const { acomptes: cfg } = getRates(year);
  const acompte = referenceTax.percentage(cfg.rate);
  const acomptes = Array.from({ length: cfg.count }, () => acompte);
  return { acomptes, solde: referenceTax.subtract(Dinar.sum(acomptes)) };
}
