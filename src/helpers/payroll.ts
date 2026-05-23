import { Dinar } from '@bakissation/dinar';
import { computeSalaryIRG } from '../irg.js';
import { cacobatph, cnasEmployee, cnasEmployer } from '../social.js';
import type { Payslip } from '../types.js';

export interface PayrollOptions {
  disabled?: boolean;
  retiree?: boolean;
  btph?: boolean;
}

/**
 * Build a full monthly payslip from a gross salary. Encodes the correct order:
 * the CNAS employee share (9%) comes off first, then IRG is computed on the
 * resulting taxable salary. Also returns the employer-side cost.
 */
export function payroll(grossMonthly: Dinar, options: PayrollOptions = {}, year?: number): Payslip {
  const gross = grossMonthly;
  const cnasEmp = cnasEmployee(gross, year);
  const taxableAfterCnas = gross.subtract(cnasEmp);
  const irg = computeSalaryIRG(taxableAfterCnas, { disabled: options.disabled, retiree: options.retiree }, year);
  const net = taxableAfterCnas.subtract(irg);
  const employerCnas = cnasEmployer(gross, { btph: options.btph }, year);
  const caco = options.btph ? cacobatph(gross, year) : Dinar.zero();
  return {
    gross,
    cnasEmployee: cnasEmp,
    taxableAfterCnas,
    irg,
    net,
    cnasEmployer: employerCnas,
    cacobatph: caco,
    employerCost: gross.add(employerCnas).add(caco),
  };
}

/**
 * Inverse of {@link payroll}: find the gross salary that yields a target net,
 * returning the full payslip. Solved by binary search to the centime.
 */
export function grossFromNet(netTarget: Dinar, options: PayrollOptions = {}, year?: number): Payslip {
  let lo = netTarget.toCentimes();
  let hi = Math.max(lo * 2, lo + 100_000);
  for (let i = 0; i < 60; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const slip = payroll(Dinar.fromCentimes(mid), options, year);
    if (slip.net.toCentimes() < netTarget.toCentimes()) lo = mid + 1;
    else hi = mid;
  }
  return payroll(Dinar.fromCentimes(hi), options, year);
}

export interface PayrollBatch {
  payslips: Payslip[];
  totals: {
    gross: Dinar;
    cnasEmployee: Dinar;
    irg: Dinar;
    net: Dinar;
    cnasEmployer: Dinar;
    employerCost: Dinar;
  };
}

/** Run payroll for many employees and sum the figures an employer must remit. */
export function payrollBatch(
  employees: { gross: Dinar; options?: PayrollOptions }[],
  year?: number,
): PayrollBatch {
  const payslips = employees.map((e) => payroll(e.gross, e.options ?? {}, year));
  return {
    payslips,
    totals: {
      gross: Dinar.sum(payslips.map((p) => p.gross)),
      cnasEmployee: Dinar.sum(payslips.map((p) => p.cnasEmployee)),
      irg: Dinar.sum(payslips.map((p) => p.irg)),
      net: Dinar.sum(payslips.map((p) => p.net)),
      cnasEmployer: Dinar.sum(payslips.map((p) => p.cnasEmployer)),
      employerCost: Dinar.sum(payslips.map((p) => p.employerCost)),
    },
  };
}
