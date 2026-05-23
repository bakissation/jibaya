import type { Dinar } from '@bakissation/dinar';
import {
  computeDividendTax,
  computeInterestTax,
  computeRealEstateGainTax,
  computeRentalIRG,
  computeSecuritiesGainTax,
} from '../irg.js';
import type { RentalUse } from '../types.js';

/** Net dividend after the RCM withholding (10% in 2026). */
export function dividendNet(gross: Dinar, year?: number): Dinar {
  return gross.subtract(computeDividendTax(gross, year));
}

/** Net interest after withholding (créances 10% / anonymous 50% / savings 1–10%). */
export function interestNet(gross: Dinar, options: { anonymous?: boolean; savings?: boolean } = {}, year?: number): Dinar {
  return gross.subtract(computeInterestTax(gross, options, year));
}

/** Net proceeds of a capital gain after the libératoire tax. */
export function capitalGainNet(
  gain: Dinar,
  options: { type: 'real-estate'; principalResidence?: boolean } | { type: 'securities'; reinvest?: boolean },
  year?: number,
): Dinar {
  const tax =
    options.type === 'real-estate'
      ? computeRealEstateGainTax(gain, { principalResidence: options.principalResidence }, year)
      : computeSecuritiesGainTax(gain, { reinvest: options.reinvest }, year);
  return gain.subtract(tax);
}

/** Net rental income after the libératoire IRG (Art. 104-II-2). */
export function rentalIncomeNet(grossRent: Dinar, options: { use: RentalUse }, year?: number): Dinar {
  return grossRent.subtract(computeRentalIRG(grossRent, options, year));
}
