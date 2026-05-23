import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { applyBrackets, maxDinar, minDinar, requireNonNegative } from './internal.js';
import type { RentalUse } from './types.js';

const ZERO = Dinar.zero();

/**
 * IRG on an annual taxable income via the progressive barème (Art. 104 CIDTA).
 * Joint filing applies a 10% abattement to the taxable base first.
 */
export function computeIRG(
  annualTaxable: Dinar,
  options: { jointFiling?: boolean } = {},
  year?: number,
): Dinar {
  requireNonNegative(annualTaxable, 'annualTaxable');
  const { irg } = getRates(year);
  const base = options.jointFiling
    ? annualTaxable.subtract(annualTaxable.percentage(irg.jointFilingAbatement))
    : annualTaxable;
  return applyBrackets(base, irg.brackets);
}

/**
 * Monthly IRG withholding on a salary (Art. 104-II-3 + Art. 128). Input is the
 * monthly **taxable** salary (gross minus the CNAS employee share) — {@link payroll}
 * does that subtraction for you. Applies the mensualised barème, 40% abattement on
 * the tax (DA 1 000–1 500/month), full exemption at or below DA 30 000/month, and
 * the low-income / disabled-retiree relief formulas.
 */
export function computeSalaryIRG(
  monthlyTaxable: Dinar,
  options: { disabled?: boolean; retiree?: boolean } = {},
  year?: number,
): Dinar {
  requireNonNegative(monthlyTaxable, 'monthlyTaxable');
  const { irg } = getRates(year);
  const monthly = monthlyTaxable.toDinars();
  if (monthly <= irg.salaryExemptThreshold) return ZERO;

  const monthlyBrackets = irg.brackets.map((b) => ({
    upTo: b.upTo === null ? null : b.upTo / 12,
    rate: b.rate,
  }));
  const raw = applyBrackets(monthlyTaxable, monthlyBrackets);

  const floor = Dinar.fromDinars(irg.salaryAbatementMin / 12);
  const ceil = Dinar.fromDinars(irg.salaryAbatementMax / 12);
  let abatement = maxDinar(floor, minDinar(raw.percentage(irg.salaryAbatement), ceil));
  abatement = minDinar(abatement, raw);
  let tax = raw.subtract(abatement);

  // Relief bands replace the tax with a scaled formula (not cumulable).
  const reduced = options.disabled || options.retiree;
  if (!reduced && monthly > 30_000 && monthly < 35_000) {
    tax = tax.multiply(137 / 51).subtract(Dinar.fromDinars(27925 / 8));
  } else if (reduced && monthly > 30_000 && monthly < 42_500) {
    tax = tax.multiply(93 / 61).subtract(Dinar.fromDinars(81213 / 41));
  }
  return maxDinar(tax, ZERO);
}

/**
 * Libératoire IRG on gross rental income (Art. 104-II-2). At or below the
 * DA 1 800 000 ceiling the rate depends on the use; above it, a 7% provisional rate.
 */
export function computeRentalIRG(grossRent: Dinar, options: { use: RentalUse }, year?: number): Dinar {
  requireNonNegative(grossRent, 'grossRent');
  const { irg } = getRates(year);
  if (grossRent.toDinars() > irg.rentalLiberatoireCeiling) {
    return grossRent.percentage(irg.rentalProvisional);
  }
  const rate =
    options.use === 'habitation'
      ? irg.rental.habitation
      : options.use === 'agricultural'
        ? irg.rental.agricultural
        : options.use === 'non-bati'
          ? irg.rental.nonBati
          : irg.rental.commercial;
  return grossRent.percentage(rate);
}

/** Libératoire IRG on occasional income (Art. 104-II-3): 10% intellectual, 15% other. */
export function computeOccasionalIncomeTax(
  amount: Dinar,
  options: { kind: 'intellectual' | 'other' } = { kind: 'other' },
  year?: number,
): Dinar {
  requireNonNegative(amount, 'amount');
  const { irg } = getRates(year);
  return amount.percentage(options.kind === 'intellectual' ? irg.occasional.intellectual : irg.occasional.other);
}

/** Withholding on dividends / share income (Art. 104-II-4): 10% (2026), 15% (2025). */
export function computeDividendTax(amount: Dinar, year?: number): Dinar {
  requireNonNegative(amount, 'amount');
  return amount.percentage(getRates(year).irg.dividend);
}

/**
 * Withholding on interest income (Art. 104-II-4). Default créances/dépôts 10%;
 * anonymous securities 50%; savings accounts 1% up to DA 50 000 then 10% above.
 */
export function computeInterestTax(
  amount: Dinar,
  options: { anonymous?: boolean; savings?: boolean } = {},
  year?: number,
): Dinar {
  requireNonNegative(amount, 'amount');
  const { irg } = getRates(year);
  if (options.anonymous) return amount.percentage(irg.anonymousSecurities);
  if (options.savings) {
    const threshold = Dinar.fromDinars(irg.savingsThreshold);
    const low = minDinar(amount, threshold);
    const high = amount.subtract(low);
    return low.percentage(irg.savingsLow).add(high.percentage(irg.savingsHigh));
  }
  return amount.percentage(irg.interest);
}

/** IRG on a real-estate capital gain (Art. 77): 15%, halved for the principal residence. */
export function computeRealEstateGainTax(gain: Dinar, options: { principalResidence?: boolean } = {}, year?: number): Dinar {
  requireNonNegative(gain, 'gain');
  const { irg } = getRates(year);
  let tax = gain.percentage(irg.realEstateGain);
  if (options.principalResidence) tax = tax.subtract(tax.percentage(irg.realEstateGainPrimaryReduction));
  return tax;
}

/** IRG on a securities capital gain (Art. 77 bis): 15%, or 5% with a reinvestment commitment. */
export function computeSecuritiesGainTax(gain: Dinar, options: { reinvest?: boolean } = {}, year?: number): Dinar {
  requireNonNegative(gain, 'gain');
  const { irg } = getRates(year);
  return gain.percentage(options.reinvest ? irg.securitiesGainReinvested : irg.securitiesGain);
}
