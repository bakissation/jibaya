# API reference

All exports come from the package root. Every function takes an optional trailing `year` (default `LATEST_YEAR`) and returns a `Dinar` unless noted. Citations are in each function's JSDoc (IDE hover) and in [legal-sources](./legal-sources.md).

```ts
import { computeIRG, payroll /* … */ } from '@bakissation/jibaya';
```

## IRG
- `computeIRG(annualTaxable, { jointFiling? }?, year?)`
- `computeSalaryIRG(monthlyTaxable, { disabled?, retiree? }?, year?)` — input is the post-CNAS taxable salary
- `computeRentalIRG(grossRent, { use }, year?)` — `use`: `'habitation' | 'commercial' | 'non-bati' | 'agricultural'`
- `computeOccasionalIncomeTax(amount, { kind }?, year?)` — `kind`: `'intellectual' | 'other'`
- `computeDividendTax(amount, year?)`
- `computeInterestTax(amount, { anonymous?, savings? }?, year?)`
- `computeRealEstateGainTax(gain, { principalResidence? }?, year?)`
- `computeSecuritiesGainTax(gain, { reinvest? }?, year?)`

## Company / forfait
- `computeIBS(profit, activity, { reinvested? }?, year?)` — `activity`: `'production' | 'construction' | 'tourism' | 'other'`
- `computeIBSWithholding(amount, kind, year?)` — `'interest' | 'anonymous-securities' | 'management' | 'foreign-services'`
- `computeIFU(turnover, activity, year?)` — `'goods' | 'services' | 'auto-entrepreneur'`

## Property & depreciation
- `computeFoncierBati(valeurLocative, { vacantSecondary? }?, year?)`
- `computeFoncierNonBati(valeurLocative, { agricultural?, urbanized?, surface? }?, year?)`
- `amortizationLinear(base, usefulLifeYears)`
- `amortizationDegressive(currentBookValue, usefulLifeYears, year?)`
- `amortizationProgressive(base, usefulLifeYears, yearIndex)`

## VAT
- `computeVAT(ht, rate?, year?)` — `rate`: `'normal' | 'reduced' | number`
- `vatDue(collected, deductible)` · `isVATDeductible(invoiceTTC, { paidInCash? }?, year?): boolean` · `vatDeductibleProrata(inputVat, prorataPercent)` · `resolveVatRate(rate, year?): number`

## Stamp & registration
- `computeStampDuty(amountPaidCash, year?)` · constants `STAMP_RECEIPT_FLAT`, `STAMP_DIMENSION`, `STAMP_EFFET`
- `computeRegistrationDuty(amount, kind, year?)` — `'property-sale' | 'donation' | 'succession' | 'share-transfer' | 'real-estate-exchange' | 'company-contribution'`
- `registrationFixedDuty(tier, year?)` — `'simple' | 'standard' | 'mid' | 'high' | 'major'`
- `lateRegistrationPenalty(duty, monthsLate, year?)`

## Penalties
- `computeLatePaymentPenalty(taxDue, { monthsLate?, lateDeclarationCumul? }?, year?)`
- `computeInsufficiencyPenalty(evaded, year?)`

## Social contributions
- `cnasEmployee(gross, year?)` · `cnasEmployer(gross, { btph? }?, year?)` · `cnasBreakdown(gross, year?)` (→ rows) · `casnos(annualIncome, year?)` · `cacobatph(gross, year?)`

## Indirect duties
- `droitCirculationAlcool(hectolitres, category, year?)` · `droitCirculationVin(hectolitres, year?)`
- `droitGarantie(grams, metal, year?)` · `droitEssai(metal, operations?, year?)` · `taxeTabac(quantity, product, year?)`

## Composite helpers (return typed records)
- `payroll(grossMonthly, options?, year?): Payslip` · `grossFromNet(netTarget, options?, year?): Payslip` · `payrollBatch(employees, year?): PayrollBatch`
- `invoice(input, year?): Invoice` · `ttcToHt(ttc, rate?, year?): Invoice` · `vatReturn({ collected, deductible }): VatReturn`
- `corporateTaxDue(base, input, year?): CorporateTax` · `ibsInstallments(referenceTax, year?): InstallmentSchedule`
- `dividendNet` · `interestNet` · `capitalGainNet` · `rentalIncomeNet` (→ `Dinar`)
- `propertyTransferDuties(price, { kind? }?, year?): TransferCost` · `annualPropertyTax(valeurLocative, options?, year?): Dinar`
- `selfEmployedAnnual(income, options?, year?): SelfEmployedResult` · `amountDueWithPenalties(taxDue, options?, year?): AmountDue`

## Years & errors
- `getRates(year?)` · `supportedYears(): number[]` · `LATEST_YEAR` · `RATES_2025` / `RATES_2026`
- `JibayaError` (`code`: `'UNKNOWN_YEAR' | 'INVALID_INPUT' | 'UNKNOWN_CATEGORY'`)
