import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { maxDinar, minDinar, requireNonNegative } from './internal.js';

/** Employee social-security contribution (CNAS): 9% of the gross salary (décret 21-137). */
export function cnasEmployee(gross: Dinar, year?: number): Dinar {
  requireNonNegative(gross, 'gross');
  return gross.percentage(getRates(year).social.cnasEmployee);
}

/**
 * Employer social-security contribution: 25% + 0.5% FNPOS (décret 21-137), plus a
 * 0.375% surcharge in BTPH sectors managed by CACOBATPH.
 */
export function cnasEmployer(gross: Dinar, options: { btph?: boolean } = {}, year?: number): Dinar {
  requireNonNegative(gross, 'gross');
  const { social } = getRates(year);
  let rate = social.cnasEmployer + social.fnpos;
  if (options.btph) rate += social.btphSurcharge;
  return gross.percentage(rate);
}

/** Per-branch breakdown of the CNAS contribution (employer + employee shares). */
export function cnasBreakdown(
  gross: Dinar,
  year?: number,
): { branch: string; employer: Dinar; employee: Dinar }[] {
  requireNonNegative(gross, 'gross');
  return getRates(year).social.cnasBranches.map((b) => ({
    branch: b.branch,
    employer: gross.percentage(b.employer),
    employee: gross.percentage(b.employee),
  }));
}

/**
 * CASNOS contribution for the self-employed: 15% of annual income, taken on the
 * income clamped to the DA 216 000 – 4 320 000 band.
 */
export function casnos(annualIncome: Dinar, year?: number): Dinar {
  requireNonNegative(annualIncome, 'annualIncome');
  const { social } = getRates(year);
  const floor = Dinar.fromDinars(social.casnosMinIncome);
  const ceil = Dinar.fromDinars(social.casnosMaxIncome);
  const base = minDinar(maxDinar(annualIncome, floor), ceil);
  return base.percentage(social.casnos);
}

/** CACOBATPH paid-leave contribution for BTPH employers: 12.21% of gross (décret 97-46). */
export function cacobatph(gross: Dinar, year?: number): Dinar {
  requireNonNegative(gross, 'gross');
  return gross.percentage(getRates(year).social.cacobatph);
}
