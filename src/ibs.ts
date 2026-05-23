import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';
import type { IbsActivity, IbsWithholdingKind } from './types.js';

/**
 * IBS on company profit (Art. 150 CIDTA): 19% production · 23% construction/tourism
 * · 26% other. A reinvestment commitment (Art. 142 bis) drops the rate to 10%.
 */
export function computeIBS(
  profit: Dinar,
  activity: IbsActivity,
  options: { reinvested?: boolean } = {},
  year?: number,
): Dinar {
  requireNonNegative(profit, 'profit');
  const { ibs } = getRates(year);
  if (options.reinvested) return profit.percentage(ibs.reinvested);
  const rate =
    activity === 'production'
      ? ibs.production
      : activity === 'construction'
        ? ibs.construction
        : activity === 'tourism'
          ? ibs.tourism
          : ibs.other;
  return profit.percentage(rate);
}

/**
 * IBS withholding at source (Art. 150-2): 10% interest · 40% anonymous securities
 * · 20% management contracts · 30% foreign-company service contracts.
 */
export function computeIBSWithholding(amount: Dinar, kind: IbsWithholdingKind, year?: number): Dinar {
  requireNonNegative(amount, 'amount');
  const { withholding } = getRates(year).ibs;
  const rate =
    kind === 'interest'
      ? withholding.interest
      : kind === 'anonymous-securities'
        ? withholding.anonymousSecurities
        : kind === 'management'
          ? withholding.management
          : withholding.foreignServices;
  return amount.percentage(rate);
}
