import { Dinar } from '@bakissation/dinar';
import { computeRegistrationDuty } from '../enregistrement.js';
import { STAMP_DIMENSION } from '../timbre.js';
import { computeFoncierBati, computeFoncierNonBati } from '../foncier.js';
import type { RegistrationKind, TransferCost } from '../types.js';

/**
 * Total duties to register a property/share transfer: the proportional
 * registration duty + a base timbre de dimension. (Per-page stamp may add more.)
 */
export function propertyTransferDuties(
  price: Dinar,
  options: { kind?: RegistrationKind } = {},
  year?: number,
): TransferCost {
  const registration = computeRegistrationDuty(price, options.kind ?? 'property-sale', year);
  const stamp = STAMP_DIMENSION;
  return { registration, stamp, total: registration.add(stamp) };
}

/**
 * Annual taxe foncière on a property's valeur locative fiscale — built by default,
 * or unbuilt land via `built: false`.
 */
export function annualPropertyTax(
  valeurLocative: Dinar,
  options: {
    built?: boolean;
    vacantSecondary?: boolean;
    agricultural?: boolean;
    urbanized?: boolean;
    surface?: number;
  } = {},
  year?: number,
): Dinar {
  if (options.built === false) {
    return computeFoncierNonBati(
      valeurLocative,
      { agricultural: options.agricultural, urbanized: options.urbanized, surface: options.surface },
      year,
    );
  }
  return computeFoncierBati(valeurLocative, { vacantSecondary: options.vacantSecondary }, year);
}
