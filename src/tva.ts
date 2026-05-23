import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';
import type { VatRate } from './types.js';

/** Resolve a {@link VatRate} to a numeric percentage for a given year. */
export function resolveVatRate(rate: VatRate, year?: number): number {
  if (typeof rate === 'number') return rate;
  const { vat } = getRates(year);
  return rate === 'reduced' ? vat.reduced : vat.normal;
}

/** VAT on an HT (pre-tax) amount (Art. 21/23 CTCA): 19% normal, 9% reduced. */
export function computeVAT(ht: Dinar, rate: VatRate = 'normal', year?: number): Dinar {
  requireNonNegative(ht, 'ht');
  return ht.percentage(resolveVatRate(rate, year));
}

/**
 * Net VAT position (Art. 29): collected − deductible. Positive = payable;
 * negative = credit to carry forward (Art. 33). See {@link vatReturn} for the
 * settled monthly G50 view.
 */
export function vatDue(collected: Dinar, deductible: Dinar): Dinar {
  return collected.subtract(deductible);
}

/**
 * Whether input VAT on an invoice is deductible (Art. 30): an invoice paid in
 * cash whose TTC exceeds DA 1 000 000 is **not** deductible.
 */
export function isVATDeductible(invoiceTTC: Dinar, options: { paidInCash?: boolean } = {}, year?: number): boolean {
  if (!options.paidInCash) return true;
  const cap = Dinar.fromDinars(getRates(year).vat.cashDeductibilityCap);
  return !invoiceTTC.greaterThan(cap);
}

/** Deductible portion of input VAT under the prorata régime (Art. 39–40). */
export function vatDeductibleProrata(inputVat: Dinar, prorataPercent: number): Dinar {
  requireNonNegative(inputVat, 'inputVat');
  return inputVat.percentage(prorataPercent);
}
