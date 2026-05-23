# @bakissation/jibaya

**Algerian tax & fiscal formulas in TypeScript** — IRG, IBS, IFU, VAT, droit de timbre, enregistrement, taxe foncière, social contributions (CNAS/CASNOS/CACOBATPH), penalties and indirect duties. Every figure is **cited to its article**, **versioned by Loi de Finances year**, and returned as a **[`Dinar`](https://github.com/bakissation/dinar)** so the money math never drifts.

[![npm](https://img.shields.io/npm/v/@bakissation/jibaya?label=npm&color=cb3837)](https://www.npmjs.com/package/@bakissation/jibaya)
[![CI](https://github.com/bakissation/jibaya/actions/workflows/ci.yml/badge.svg)](https://github.com/bakissation/jibaya/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

```bash
npm install @bakissation/jibaya @bakissation/dinar
```

## Why

Algerian fiscal rules are scattered across six codes and change every Loi de Finances. `jibaya` encodes them as plain, tree-shakeable functions: money in, money out, each one law-cited in its JSDoc and keyed to the LF year (defaulting to the latest). Its only dependency is `@bakissation/dinar`.

```ts
import { Dinar } from '@bakissation/dinar';
import { computeIRG, computeVAT, payroll, invoice } from '@bakissation/jibaya';

computeIRG(Dinar.fromDinars(1_500_000)).format();      // → "346 800,00 DA" (Art. 104, LF 2026)
computeVAT(Dinar.fromDinars(100_000)).format();        // → "19 000,00 DA" (19%, Art. 21 CTCA)

// Composite helpers for real workflows
const slip = payroll(Dinar.fromDinars(80_000));        // CNAS-before-IRG ordering
slip.net.format();                                     // → "60 844,00 DA"

const bill = invoice({ ht: Dinar.fromDinars(100_000), paidInCash: true });
bill.ttc.format();                                     // → "121 380,00 DA" (VAT + cash stamp)
```

## What it covers

| Area | Functions |
|---|---|
| **IRG** | `computeIRG` · `computeSalaryIRG` · `computeRentalIRG` · `computeOccasionalIncomeTax` · `computeDividendTax` · `computeInterestTax` · `computeRealEstateGainTax` · `computeSecuritiesGainTax` |
| **Company / forfait** | `computeIBS` · `computeIBSWithholding` · `computeIFU` |
| **Property / depreciation** | `computeFoncierBati` · `computeFoncierNonBati` · `amortizationLinear/Degressive/Progressive` |
| **VAT** | `computeVAT` · `vatDue` · `isVATDeductible` · `vatDeductibleProrata` |
| **Stamp / registration** | `computeStampDuty` (+ constants) · `computeRegistrationDuty` · `registrationFixedDuty` · `lateRegistrationPenalty` |
| **Penalties** | `computeLatePaymentPenalty` · `computeInsufficiencyPenalty` |
| **Social** | `cnasEmployee` · `cnasEmployer` · `cnasBreakdown` · `casnos` · `cacobatph` |
| **Indirect duties** | `droitCirculationAlcool` · `droitCirculationVin` · `droitGarantie` · `droitEssai` · `taxeTabac` |
| **Helpers** | `payroll` · `grossFromNet` · `payrollBatch` · `invoice` · `ttcToHt` · `vatReturn` · `corporateTaxDue` · `ibsInstallments` · `dividendNet` · `interestNet` · `capitalGainNet` · `rentalIncomeNet` · `propertyTransferDuties` · `annualPropertyTax` · `selfEmployedAnnual` · `amountDueWithPenalties` |

## Years

```ts
import { computeDividendTax, LATEST_YEAR, supportedYears } from '@bakissation/jibaya';
import { Dinar } from '@bakissation/dinar';

computeDividendTax(Dinar.fromDinars(100_000));         // 10% — LF 2026 (default)
computeDividendTax(Dinar.fromDinars(100_000), 2025);   // 15% — LF 2025
supportedYears();                                      // [2025, 2026]
```

Every function takes an optional trailing `year` argument; omit it for the latest (`LATEST_YEAR`).

## Notes

- **Not tax advice.** Rates are encoded from the official codes (see `docs/`), but edge cases, exemptions and rulings vary — verify against the current texts for filing.
- Tax is computed at centime precision; round to the dinar for filing if your administration requires it.

See [`docs/`](./docs) for the full API reference and the per-tax legal sources.

## License

MIT © Abdelbaki Berkati
