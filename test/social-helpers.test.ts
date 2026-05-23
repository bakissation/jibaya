import { describe, it, expect } from 'vitest';
import { Dinar } from '@bakissation/dinar';
import {
  cnasEmployee,
  cnasEmployer,
  cnasBreakdown,
  casnos,
  cacobatph,
  payroll,
  grossFromNet,
  payrollBatch,
  invoice,
  ttcToHt,
  vatReturn,
  corporateTaxDue,
  ibsInstallments,
  dividendNet,
  rentalIncomeNet,
  capitalGainNet,
  propertyTransferDuties,
  annualPropertyTax,
  selfEmployedAnnual,
  amountDueWithPenalties,
  getRates,
  supportedYears,
  LATEST_YEAR,
} from '../src/index.js';

const da = (n: number) => Dinar.fromDinars(n);

describe('Social contributions', () => {
  it('CNAS employee 9%, employer 25.5% (+0.375 BTPH)', () => {
    expect(cnasEmployee(da(80_000)).toDinars()).toBe(7_200);
    expect(cnasEmployer(da(80_000)).toDinars()).toBe(20_400);
    expect(cnasEmployer(da(80_000), { btph: true }).toDinars()).toBe(20_700);
  });
  it('CNAS breakdown sums to the totals', () => {
    const rows = cnasBreakdown(da(100_000));
    // 11.5 + 1.25 + 11 + 0.25 + 1 = 25% of 100 000 = 25 000
    expect(Dinar.sum(rows.map((r) => r.employer)).toDinars()).toBe(25_000);
    expect(Dinar.sum(rows.map((r) => r.employee)).toDinars()).toBe(9_000);
  });
  it('CASNOS 15% within the income band', () => {
    expect(casnos(da(1_000_000)).toDinars()).toBe(150_000);
    expect(casnos(da(100_000)).toDinars()).toBe(32_400); // clamped to 216k floor
    expect(casnos(da(5_000_000)).toDinars()).toBe(648_000); // clamped to 4.32M ceiling
  });
  it('CACOBATPH 12.21%', () => {
    expect(cacobatph(da(80_000)).toDinars()).toBe(9_768);
  });
});

describe('Helpers', () => {
  it('payroll: CNAS-before-IRG ordering', () => {
    const slip = payroll(da(80_000));
    expect(slip.cnasEmployee.toDinars()).toBe(7_200);
    expect(slip.taxableAfterCnas.toDinars()).toBe(72_800);
    expect(slip.irg.toDinars()).toBe(11_956);
    expect(slip.net.toDinars()).toBe(60_844);
    expect(slip.employerCost.toDinars()).toBe(100_400);
  });
  it('grossFromNet inverts payroll', () => {
    const target = da(60_844);
    const slip = grossFromNet(target);
    expect(slip.net.toDinars()).toBe(60_844);
    expect(slip.gross.toDinars()).toBe(80_000);
  });
  it('payrollBatch sums remittance totals', () => {
    const batch = payrollBatch([{ gross: da(80_000) }, { gross: da(80_000) }]);
    expect(batch.totals.cnasEmployee.toDinars()).toBe(14_400);
    expect(batch.totals.net.toDinars()).toBe(121_688);
  });
  it('invoice: VAT + cash stamp; ttcToHt inverts', () => {
    expect(invoice({ ht: da(100_000) }).ttc.toDinars()).toBe(119_000);
    const cash = invoice({ ht: da(100_000), paidInCash: true });
    expect(cash.stamp.toDinars()).toBe(2_380); // 119 000 → 2/100
    expect(cash.ttc.toDinars()).toBe(121_380);
    const back = ttcToHt(da(119_000));
    expect(back.ht.toDinars()).toBe(100_000);
    expect(back.vat.toDinars()).toBe(19_000);
  });
  it('vatReturn: due vs credit carried', () => {
    expect(vatReturn({ collected: da(50_000), deductible: da(30_000) }).due.toDinars()).toBe(20_000);
    expect(vatReturn({ collected: da(30_000), deductible: da(50_000) }).creditCarried.toDinars()).toBe(20_000);
  });
  it('corporateTaxDue applies the IFU minimum; ibsInstallments splits 30/30 + solde', () => {
    expect(corporateTaxDue(da(2_000_000), { regime: 'IFU', activity: 'services' }).due.toDinars()).toBe(240_000);
    expect(corporateTaxDue(da(100_000), { regime: 'IFU', activity: 'goods' }).due.toDinars()).toBe(30_000);
    const sched = ibsInstallments(da(300_000));
    expect(sched.acomptes.map((a) => a.toDinars())).toEqual([90_000, 90_000]);
    expect(sched.solde.toDinars()).toBe(120_000);
  });
  it('investment & property helpers', () => {
    expect(dividendNet(da(100_000)).toDinars()).toBe(90_000);
    expect(rentalIncomeNet(da(1_000_000), { use: 'habitation' }).toDinars()).toBe(930_000);
    expect(capitalGainNet(da(1_000_000), { type: 'securities', reinvest: true }).toDinars()).toBe(950_000);
    expect(propertyTransferDuties(da(1_000_000)).total.toDinars()).toBe(50_030);
    expect(annualPropertyTax(da(100_000)).toDinars()).toBe(3_000);
  });
  it('selfEmployedAnnual = tax + CASNOS', () => {
    const r = selfEmployedAnnual(da(1_000_000), { regime: 'IFU', activity: 'services' });
    expect(r.tax.toDinars()).toBe(120_000);
    expect(r.casnos.toDinars()).toBe(150_000);
    expect(r.total.toDinars()).toBe(270_000);
  });
  it('amountDueWithPenalties', () => {
    const due = amountDueWithPenalties(da(100_000), { monthsLate: 4 });
    expect(due.recoveryPenalty.toDinars()).toBe(22_000);
    expect(due.total.toDinars()).toBe(122_000);
  });
});

describe('Rate years', () => {
  it('resolves years and exposes the dividend delta', () => {
    expect(LATEST_YEAR).toBe(2026);
    expect(supportedYears()).toEqual([2025, 2026]);
    expect(getRates(2025).irg.dividend).toBe(15);
    expect(getRates(2026).irg.dividend).toBe(10);
  });
});
