import { describe, it, expect } from 'vitest';
import { Dinar } from '@bakissation/dinar';
import {
  computeVAT,
  vatDue,
  isVATDeductible,
  vatDeductibleProrata,
  computeStampDuty,
  STAMP_RECEIPT_FLAT,
  STAMP_DIMENSION,
  STAMP_EFFET,
  computeRegistrationDuty,
  registrationFixedDuty,
  lateRegistrationPenalty,
  computeLatePaymentPenalty,
  computeInsufficiencyPenalty,
  droitCirculationAlcool,
  droitCirculationVin,
  droitGarantie,
  droitEssai,
  taxeTabac,
} from '../src/index.js';

const da = (n: number) => Dinar.fromDinars(n);

describe('VAT', () => {
  it('19% normal, 9% reduced', () => {
    expect(computeVAT(da(100_000)).toDinars()).toBe(19_000);
    expect(computeVAT(da(100_000), 'reduced').toDinars()).toBe(9_000);
    expect(computeVAT(da(100_000), 9).toDinars()).toBe(9_000);
  });
  it('net position and the >1M cash deductibility rule', () => {
    expect(vatDue(da(50_000), da(30_000)).toDinars()).toBe(20_000);
    expect(isVATDeductible(da(900_000), { paidInCash: true })).toBe(true);
    expect(isVATDeductible(da(1_200_000), { paidInCash: true })).toBe(false);
    expect(isVATDeductible(da(1_200_000), { paidInCash: false })).toBe(true);
    expect(vatDeductibleProrata(da(100_000), 80).toDinars()).toBe(80_000);
  });
});

describe('Stamp', () => {
  it('quittance tranches with floor and exemption', () => {
    expect(computeStampDuty(da(200)).isZero()).toBe(true); // ≤ 300
    expect(computeStampDuty(da(10_000)).toDinars()).toBe(100); // 1/100
    expect(computeStampDuty(da(50_000)).toDinars()).toBe(750); // 1.5/100
    expect(computeStampDuty(da(200_000)).toDinars()).toBe(4_000); // 2/100
  });
  it('fixed stamp constants', () => {
    expect(STAMP_RECEIPT_FLAT.toDinars()).toBe(50);
    expect(STAMP_DIMENSION.toDinars()).toBe(30);
    expect(STAMP_EFFET.toDinars()).toBe(233);
  });
});

describe('Registration', () => {
  it('proportional and fixed duties', () => {
    expect(computeRegistrationDuty(da(1_000_000), 'property-sale').toDinars()).toBe(50_000);
    expect(computeRegistrationDuty(da(1_000_000), 'share-transfer').toDinars()).toBe(25_000);
    expect(computeRegistrationDuty(da(1_000_000), 'company-contribution').toDinars()).toBe(10_000);
    expect(registrationFixedDuty('standard').toDinars()).toBe(500);
  });
  it('late registration 5% + 3%/mo cap 25%', () => {
    expect(lateRegistrationPenalty(da(100_000), 2).toDinars()).toBe(11_000); // 5 + 6
    expect(lateRegistrationPenalty(da(100_000), 20).toDinars()).toBe(25_000); // capped
  });
});

describe('Penalties', () => {
  it('late payment 10% + 3%/mo capped 25%', () => {
    expect(computeLatePaymentPenalty(da(100_000), { monthsLate: 4 }).toDinars()).toBe(22_000);
    expect(computeLatePaymentPenalty(da(100_000), { monthsLate: 10 }).toDinars()).toBe(25_000);
    expect(computeLatePaymentPenalty(da(100_000), { lateDeclarationCumul: true }).toDinars()).toBe(15_000);
  });
  it('insufficiency 10/15/25 tiers', () => {
    expect(computeInsufficiencyPenalty(da(40_000)).toDinars()).toBe(4_000);
    expect(computeInsufficiencyPenalty(da(100_000)).toDinars()).toBe(15_000);
    expect(computeInsufficiencyPenalty(da(300_000)).toDinars()).toBe(75_000);
  });
});

describe('Indirect duties', () => {
  it('alcohol/wine circulation per hectolitre', () => {
    expect(droitCirculationAlcool(1, 'whisky').toDinars()).toBe(300_000);
    expect(droitCirculationAlcool(2, 'medicinal').toDinars()).toBe(120);
    expect(droitCirculationVin(2).toDinars()).toBe(100_000);
  });
  it('precious-metal garantie per hectogramme + essai', () => {
    expect(droitGarantie(100, 'gold').toDinars()).toBe(16_000);
    expect(droitGarantie(200, 'platinum').toDinars()).toBe(60_000);
    expect(droitGarantie(100, 'silver').toDinars()).toBe(250);
    expect(droitEssai('platinum').toDinars()).toBe(300);
  });
  it('tobacco specific duty', () => {
    expect(taxeTabac(1_000, 'cigarettes').toDinars()).toBe(3_000);
    expect(taxeTabac(10, 'cigars').toDinars()).toBe(150);
  });
});
