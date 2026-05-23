import type { Dinar } from '@bakissation/dinar';

/** IBS activity classes (Art. 150 CIDTA): 19% / 23% / 26%. */
export type IbsActivity = 'production' | 'construction' | 'tourism' | 'other';

/** IFU activity classes (Art. 282 sexies): 5% / 12% / 0.5%. */
export type IfuActivity = 'goods' | 'services' | 'auto-entrepreneur';

/** Rental-income categories (Art. 104-II-2). */
export type RentalUse = 'habitation' | 'commercial' | 'non-bati' | 'agricultural';

/** IBS withholding categories (Art. 150-2). */
export type IbsWithholdingKind =
  | 'interest'
  | 'anonymous-securities'
  | 'management'
  | 'foreign-services';

/** Registration-duty categories (Code de l'Enregistrement). */
export type RegistrationKind =
  | 'property-sale'
  | 'donation'
  | 'succession'
  | 'share-transfer'
  | 'real-estate-exchange'
  | 'company-contribution';

/** VAT rate selector. Either a named rate or an explicit percentage. */
export type VatRate = 'normal' | 'reduced' | number;

/** Precious metals subject to the droit de garantie (Art. 340). */
export type Metal = 'gold' | 'silver' | 'platinum';

/** Alcohol categories for the droit de circulation (Art. 47). */
export type AlcoholCategory =
  | 'medicinal'
  | 'perfumery'
  | 'sparkling-base'
  | 'aperitif'
  | 'whisky'
  | 'other';

/** A full payslip produced by {@link payroll}. */
export interface Payslip {
  gross: Dinar;
  cnasEmployee: Dinar;
  taxableAfterCnas: Dinar;
  irg: Dinar;
  net: Dinar;
  cnasEmployer: Dinar;
  cacobatph: Dinar;
  employerCost: Dinar;
}

/** A single invoice line. */
export interface InvoiceLine {
  ht: Dinar;
  vat?: VatRate;
}

/** Invoice totals produced by {@link invoice}. */
export interface Invoice {
  ht: Dinar;
  vat: Dinar;
  stamp: Dinar;
  ttc: Dinar;
}

/** A monthly VAT (G50) return produced by {@link vatReturn}. */
export interface VatReturn {
  collected: Dinar;
  deductible: Dinar;
  due: Dinar;
  creditCarried: Dinar;
}

/** Total cost of registering a transfer, from {@link propertyTransferDuties}. */
export interface TransferCost {
  registration: Dinar;
  stamp: Dinar;
  total: Dinar;
}

/** Tax owed once penalties are added, from {@link amountDueWithPenalties}. */
export interface AmountDue {
  principal: Dinar;
  recoveryPenalty: Dinar;
  total: Dinar;
}

/** Corporate tax decision from {@link corporateTaxDue}. */
export interface CorporateTax {
  regime: 'IBS' | 'IFU';
  computed: Dinar;
  minimum: Dinar;
  due: Dinar;
}

/** Provisional-acompte schedule from {@link ibsInstallments}. */
export interface InstallmentSchedule {
  acomptes: Dinar[];
  solde: Dinar;
}
