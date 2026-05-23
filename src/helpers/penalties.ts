import { computeLatePaymentPenalty } from '../penalties.js';
import type { AmountDue } from '../types.js';
import type { Dinar } from '@bakissation/dinar';

/**
 * What a taxpayer actually owes once a late-payment penalty is added
 * (CIDTA Art. 402): principal + recovery penalty (10% + 3%/month, capped 25%).
 */
export function amountDueWithPenalties(
  taxDue: Dinar,
  options: { monthsLate?: number; lateDeclarationCumul?: boolean } = {},
  year?: number,
): AmountDue {
  const recoveryPenalty = computeLatePaymentPenalty(taxDue, options, year);
  return { principal: taxDue, recoveryPenalty, total: taxDue.add(recoveryPenalty) };
}
