import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';

/**
 * Recovery penalty on a late tax payment (CIDTA Art. 402): 10% once the due date
 * passes, plus 3% per month (or fraction) of further delay, with the total capped
 * at 25%. If it cumulates with a late-declaration penalty, the combined rate is
 * reduced to 15% (when declaration + payment are cured by month-end).
 */
export function computeLatePaymentPenalty(
  taxDue: Dinar,
  options: { monthsLate?: number; lateDeclarationCumul?: boolean } = {},
  year?: number,
): Dinar {
  requireNonNegative(taxDue, 'taxDue');
  const { penalties } = getRates(year);
  const months = Math.max(0, Math.floor(options.monthsLate ?? 0));
  let pct = Math.min(penalties.recoveryBase + penalties.recoveryMonthly * months, penalties.recoveryCap);
  if (options.lateDeclarationCumul) pct = penalties.recoveryDeclarationCumul;
  return taxDue.percentage(pct);
}

/**
 * Insufficiency-of-declaration penalty (CPF): 10% when the evaded duty ≤ DA 50 000,
 * 15% up to DA 200 000, 25% beyond.
 */
export function computeInsufficiencyPenalty(evaded: Dinar, year?: number): Dinar {
  requireNonNegative(evaded, 'evaded');
  const { penalties } = getRates(year);
  const amount = evaded.toDinars();
  const pct =
    amount <= penalties.insufficiencyLowCeiling
      ? penalties.insufficiencyLow
      : amount <= penalties.insufficiencyMidCeiling
        ? penalties.insufficiencyMid
        : penalties.insufficiencyHigh;
  return evaded.percentage(pct);
}
