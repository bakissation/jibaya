import { describe, it, expect } from 'vitest';
import { Dinar } from '@bakissation/dinar';
import {
  computeIRG,
  computeSalaryIRG,
  computeRentalIRG,
  computeOccasionalIncomeTax,
  computeDividendTax,
  computeInterestTax,
  computeRealEstateGainTax,
  computeSecuritiesGainTax,
  computeIBS,
  computeIBSWithholding,
  computeIFU,
  computeFoncierBati,
  computeFoncierNonBati,
  amortizationLinear,
  amortizationDegressive,
  amortizationProgressive,
} from '../src/index.js';

const da = (n: number) => Dinar.fromDinars(n);

describe('IRG', () => {
  it('applies the progressive barème (Art. 104)', () => {
    // 240k@23 + 480k@27 + 540k@30 = 55 200 + 129 600 + 162 000
    expect(computeIRG(da(1_500_000)).toDinars()).toBe(346_800);
  });
  it('is zero below the first bracket', () => {
    expect(computeIRG(da(200_000)).isZero()).toBe(true);
  });
  it('applies the 10% joint-filing abatement', () => {
    expect(computeIRG(da(1_500_000), { jointFiling: true }).toDinars()).toBe(
      computeIRG(da(1_350_000)).toDinars(),
    );
  });
  it('salary IRG: caps the 40% abatement at DA 1 500/month', () => {
    // taxable 72 800 → raw 13 456, abatement capped 1 500 → 11 956
    expect(computeSalaryIRG(da(72_800)).toDinars()).toBe(11_956);
  });
  it('salary IRG: exempt at or below DA 30 000', () => {
    expect(computeSalaryIRG(da(30_000)).isZero()).toBe(true);
  });
  it('rental: 7% habitation under the ceiling, 7% provisional above', () => {
    expect(computeRentalIRG(da(1_000_000), { use: 'habitation' }).toDinars()).toBe(70_000);
    expect(computeRentalIRG(da(2_000_000), { use: 'commercial' }).toDinars()).toBe(140_000);
  });
  it('occasional intellectual 10% / other 15%', () => {
    expect(computeOccasionalIncomeTax(da(100_000), { kind: 'intellectual' }).toDinars()).toBe(10_000);
    expect(computeOccasionalIncomeTax(da(100_000), { kind: 'other' }).toDinars()).toBe(15_000);
  });
  it('dividends 10% in 2026, 15% in 2025', () => {
    expect(computeDividendTax(da(100_000)).toDinars()).toBe(10_000);
    expect(computeDividendTax(da(100_000), 2025).toDinars()).toBe(15_000);
  });
  it('interest: créances 10%, anonymous 50%, savings 1%/10%', () => {
    expect(computeInterestTax(da(100_000)).toDinars()).toBe(10_000);
    expect(computeInterestTax(da(100_000), { anonymous: true }).toDinars()).toBe(50_000);
    // 50k@1% + 50k@10% = 500 + 5 000
    expect(computeInterestTax(da(100_000), { savings: true }).toDinars()).toBe(5_500);
  });
  it('capital gains: real estate 15% (−50% primary), securities 15%/5%', () => {
    expect(computeRealEstateGainTax(da(1_000_000)).toDinars()).toBe(150_000);
    expect(computeRealEstateGainTax(da(1_000_000), { principalResidence: true }).toDinars()).toBe(75_000);
    expect(computeSecuritiesGainTax(da(1_000_000), { reinvest: true }).toDinars()).toBe(50_000);
  });
});

describe('IBS / IFU', () => {
  it('IBS 19/23/26 + reinvested 10', () => {
    expect(computeIBS(da(1_000_000), 'production').toDinars()).toBe(190_000);
    expect(computeIBS(da(1_000_000), 'construction').toDinars()).toBe(230_000);
    expect(computeIBS(da(1_000_000), 'other').toDinars()).toBe(260_000);
    expect(computeIBS(da(1_000_000), 'other', { reinvested: true }).toDinars()).toBe(100_000);
  });
  it('IBS withholding 10/40/20/30', () => {
    expect(computeIBSWithholding(da(100_000), 'interest').toDinars()).toBe(10_000);
    expect(computeIBSWithholding(da(100_000), 'foreign-services').toDinars()).toBe(30_000);
  });
  it('IFU 5/12/0.5', () => {
    expect(computeIFU(da(2_000_000), 'goods').toDinars()).toBe(100_000);
    expect(computeIFU(da(2_000_000), 'services').toDinars()).toBe(240_000);
    expect(computeIFU(da(2_000_000), 'auto-entrepreneur').toDinars()).toBe(10_000);
  });
});

describe('Foncier & amortissement', () => {
  it('foncier bâti 3% / vacant secondary 11%', () => {
    expect(computeFoncierBati(da(100_000)).toDinars()).toBe(3_000);
    expect(computeFoncierBati(da(100_000), { vacantSecondary: true }).toDinars()).toBe(11_000);
  });
  it('foncier non-bâti by surface and agricultural', () => {
    expect(computeFoncierNonBati(da(100_000), { surface: 400 }).toDinars()).toBe(5_000);
    expect(computeFoncierNonBati(da(100_000), { surface: 800 }).toDinars()).toBe(7_000);
    expect(computeFoncierNonBati(da(100_000), { surface: 2_000 }).toDinars()).toBe(10_000);
    expect(computeFoncierNonBati(da(100_000), { agricultural: true }).toDinars()).toBe(3_000);
  });
  it('amortissement linear / degressive / progressive', () => {
    expect(amortizationLinear(da(1_000_000), 5).toDinars()).toBe(200_000);
    expect(amortizationDegressive(da(1_000_000), 5).toDinars()).toBe(400_000); // coeff 2 / life 5
    // progressive SYD: year 1 of 4 = 1/10 of base; full schedule sums to base
    expect(amortizationProgressive(da(1_200_000), 4, 1).toDinars()).toBe(120_000);
    const total = [1, 2, 3, 4]
      .map((k) => amortizationProgressive(da(1_200_000), 4, k).toDinars())
      .reduce((a, b) => a + b, 0);
    expect(total).toBe(1_200_000);
  });
});
