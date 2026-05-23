import { Dinar } from '@bakissation/dinar';
import { getRates } from './rates/index.js';
import { requireNonNegative } from './internal.js';
import type { RegistrationKind } from './types.js';

/**
 * Proportional registration duty (Code de l'Enregistrement): property sale 5%
 * (Art. 252), donation/succession 5% (Art. 231), share transfer 2.5% (Art. 218),
 * real-estate exchange 2.5% (Art. 226), company contribution 1% (Art. 250).
 */
export function computeRegistrationDuty(amount: Dinar, kind: RegistrationKind, year?: number): Dinar {
  requireNonNegative(amount, 'amount');
  const { enregistrement } = getRates(year);
  const rate =
    kind === 'property-sale'
      ? enregistrement.propertySale
      : kind === 'donation'
        ? enregistrement.donation
        : kind === 'succession'
          ? enregistrement.succession
          : kind === 'share-transfer'
            ? enregistrement.shareTransfer
            : kind === 'real-estate-exchange'
              ? enregistrement.realEstateExchange
              : enregistrement.companyContribution;
  return amount.percentage(rate);
}

/** A fixed registration duty (droit fixe, Art. 207–212 bis): 10 / 500 / 1 500 / 3 000 / 1 500 000 DA. */
export function registrationFixedDuty(
  tier: 'simple' | 'standard' | 'mid' | 'high' | 'major',
  year?: number,
): Dinar {
  const { fixed } = getRates(year).enregistrement;
  return Dinar.fromDinars(fixed[tier]);
}

/** Late-registration penalty: 5% interest + 3%/month, capped at 25% of the duty. */
export function lateRegistrationPenalty(duty: Dinar, monthsLate: number, year?: number): Dinar {
  requireNonNegative(duty, 'duty');
  const { enregistrement } = getRates(year);
  const months = Math.max(0, Math.floor(monthsLate));
  const pct = Math.min(enregistrement.lateInterest + enregistrement.lateMonthly * months, enregistrement.lateCap);
  return duty.percentage(pct);
}
