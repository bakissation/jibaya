import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';

/**
 * Droit de timbre de quittance — the cash-payment stamp (Art. 100 Code du Timbre).
 * Proportional, per 100-DA tranche (or fraction): 1 DA up to DA 30 000, 1.5 DA up
 * to DA 100 000, 2 DA beyond — i.e. 1% / 1.5% / 2% — with a DA 5 floor. Amounts at
 * or below DA 300 carry no stamp. Applies only to cash-settled amounts.
 */
export function computeStampDuty(amountPaidCash: Dinar, year?: number): Dinar {
  requireNonNegative(amountPaidCash, 'amountPaidCash');
  const { timbre } = getRates(year);
  const amount = amountPaidCash.toDinars();
  if (amount <= timbre.quittanceExemptBelow) return Dinar.zero();
  const perTranche =
    amount <= timbre.quittanceBand1
      ? timbre.quittanceLow
      : amount <= timbre.quittanceBand2
        ? timbre.quittanceMid
        : timbre.quittanceHigh;
  const tranches = Math.ceil(amount / 100);
  const duty = Math.max(tranches * perTranche, timbre.quittanceFloor);
  return Dinar.fromDinars(duty);
}

/** Flat stamp on pure receipts / cash-deposit receipts (Art. 100-II): DA 50. */
export const STAMP_RECEIPT_FLAT: Dinar = Dinar.fromDinars(50);
/** Timbre de dimension, demi-feuille (Art. 58–70): DA 30. */
export const STAMP_DIMENSION: Dinar = Dinar.fromDinars(30);
/** Fixed stamp on effets de commerce (Art. 86): DA 233. */
export const STAMP_EFFET: Dinar = Dinar.fromDinars(233);
