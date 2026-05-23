import { Dinar } from '@bakissation/dinar';
import { computeVAT, resolveVatRate } from '../tva.js';
import { computeStampDuty } from '../timbre.js';
import type { Invoice, InvoiceLine, VatRate } from '../types.js';

export type InvoiceInput =
  | { ht: Dinar; vat?: VatRate; paidInCash?: boolean }
  | { lines: InvoiceLine[]; paidInCash?: boolean };

/**
 * Invoice totals: HT → VAT (per line, 19/9) → TTC, adding the cash-payment
 * droit de timbre (Art. 100) only when settled in cash.
 */
export function invoice(input: InvoiceInput, year?: number): Invoice {
  const lines: InvoiceLine[] = 'lines' in input ? input.lines : [{ ht: input.ht, vat: input.vat }];
  const ht = Dinar.sum(lines.map((l) => l.ht));
  const vat = Dinar.sum(lines.map((l) => computeVAT(l.ht, l.vat ?? 'normal', year)));
  const subtotal = ht.add(vat);
  const stamp = input.paidInCash ? computeStampDuty(subtotal, year) : Dinar.zero();
  return { ht, vat, stamp, ttc: subtotal.add(stamp) };
}

/**
 * Back out HT and VAT from a tax-inclusive (TTC) price for a given rate —
 * the everyday "this price includes VAT, what's the HT?" question.
 */
export function ttcToHt(ttc: Dinar, rate: VatRate = 'normal', year?: number): Invoice {
  const pct = resolveVatRate(rate, year);
  const ht = ttc.multiply(1 / (1 + pct / 100));
  return { ht, vat: ttc.subtract(ht), stamp: Dinar.zero(), ttc };
}
