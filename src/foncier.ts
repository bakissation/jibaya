import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';

/**
 * Taxe foncière on built property (Art. 261-b CIDTA): 3% of the valeur locative
 * fiscale, or 11% for a vacant secondary residence held by an individual.
 */
export function computeFoncierBati(valeurLocative: Dinar, options: { vacantSecondary?: boolean } = {}, year?: number): Dinar {
  requireNonNegative(valeurLocative, 'valeurLocative');
  const { foncier } = getRates(year);
  return valeurLocative.percentage(options.vacantSecondary ? foncier.batiVacantSecondary : foncier.bati);
}

/**
 * Taxe foncière on unbuilt land (Art. 261-g CIDTA). Agricultural land 3%;
 * urbanized land 5% (≤500 m²) / 7% (≤1000 m²) / 10% (>1000 m²); land outside
 * urbanized sectors 5%.
 */
export function computeFoncierNonBati(
  valeurLocative: Dinar,
  options: { agricultural?: boolean; urbanized?: boolean; surface?: number } = {},
  year?: number,
): Dinar {
  requireNonNegative(valeurLocative, 'valeurLocative');
  const { foncier } = getRates(year);
  if (options.agricultural) return valeurLocative.percentage(foncier.nonBatiAgricultural);
  if (options.urbanized === false) return valeurLocative.percentage(foncier.nonBatiUnurbanized);
  const surface = options.surface ?? 0;
  const rate =
    surface <= foncier.surfaceSmall
      ? foncier.nonBatiSmall
      : surface <= foncier.surfaceMedium
        ? foncier.nonBatiMedium
        : foncier.nonBatiLarge;
  return valeurLocative.percentage(rate);
}
