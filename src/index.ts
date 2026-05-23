// Errors, types, rate tables
export { JibayaError, type JibayaErrorCode } from './errors.js';
export type {
  IbsActivity,
  IfuActivity,
  RentalUse,
  IbsWithholdingKind,
  RegistrationKind,
  VatRate,
  Metal,
  AlcoholCategory,
  Payslip,
  InvoiceLine,
  Invoice,
  VatReturn,
  TransferCost,
  AmountDue,
  CorporateTax,
  InstallmentSchedule,
} from './types.js';
export { getRates, supportedYears, LATEST_YEAR, RATES_2025, RATES_2026, type RateSet, type Bracket } from './rates/index.js';

// Direct taxes — IRG
export {
  computeIRG,
  computeSalaryIRG,
  computeRentalIRG,
  computeOccasionalIncomeTax,
  computeDividendTax,
  computeInterestTax,
  computeRealEstateGainTax,
  computeSecuritiesGainTax,
} from './irg.js';

// Company / forfait
export { computeIBS, computeIBSWithholding } from './ibs.js';
export { computeIFU } from './ifu.js';

// Property & depreciation
export { computeFoncierBati, computeFoncierNonBati } from './foncier.js';
export { amortizationLinear, amortizationDegressive, amortizationProgressive } from './amortissement.js';

// VAT
export { computeVAT, vatDue, isVATDeductible, vatDeductibleProrata, resolveVatRate } from './tva.js';

// Stamp & registration
export { computeStampDuty, STAMP_RECEIPT_FLAT, STAMP_DIMENSION, STAMP_EFFET } from './timbre.js';
export { computeRegistrationDuty, registrationFixedDuty, lateRegistrationPenalty } from './enregistrement.js';

// Penalties
export { computeLatePaymentPenalty, computeInsufficiencyPenalty } from './penalties.js';

// Social contributions
export { cnasEmployee, cnasEmployer, cnasBreakdown, casnos, cacobatph } from './social.js';

// Indirect duties
export {
  droitCirculationAlcool,
  droitCirculationVin,
  droitGarantie,
  droitEssai,
  taxeTabac,
} from './indirect.js';

// Composite helpers
export { payroll, grossFromNet, payrollBatch, type PayrollOptions, type PayrollBatch } from './helpers/payroll.js';
export { invoice, ttcToHt, type InvoiceInput } from './helpers/invoice.js';
export { vatReturn } from './helpers/vat-return.js';
export { corporateTaxDue, ibsInstallments, type CorporateInput } from './helpers/corporate.js';
export { dividendNet, interestNet, capitalGainNet, rentalIncomeNet } from './helpers/investment.js';
export { propertyTransferDuties, annualPropertyTax } from './helpers/property.js';
export { selfEmployedAnnual, type SelfEmployedResult } from './helpers/self-employed.js';
export { amountDueWithPenalties } from './helpers/penalties.js';
