# Getting started

```bash
npm install @bakissation/jibaya @bakissation/dinar
```

`@bakissation/dinar` is a peer you import for amounts; `jibaya` returns `Dinar` values.

## Money in, money out

```ts
import { Dinar } from '@bakissation/dinar';
import { computeIRG, computeIBS } from '@bakissation/jibaya';

const taxable = Dinar.fromDinars(1_500_000);
computeIRG(taxable).toDinars();   // 346800
computeIRG(taxable).format();     // "346 800,00 DA"

computeIBS(Dinar.fromDinars(1_000_000), 'production').format(); // "190 000,00 DA"
```

## The `year` argument

Every function takes an optional **trailing** `year`. Omit it for the latest Loi de Finances year.

```ts
import { computeDividendTax, LATEST_YEAR, supportedYears, getRates } from '@bakissation/jibaya';
import { Dinar } from '@bakissation/dinar';

computeDividendTax(Dinar.fromDinars(100_000));       // 10 000 — LF 2026 (default)
computeDividendTax(Dinar.fromDinars(100_000), 2025); // 15 000 — LF 2025
LATEST_YEAR;        // 2026
supportedYears();   // [2025, 2026]
getRates(2026).vat; // { normal: 19, reduced: 9, cashDeductibilityCap: 1000000 }
```

An unknown year throws `JibayaError` with code `UNKNOWN_YEAR`.

## Helpers for whole workflows

```ts
import { payroll, invoice, vatReturn } from '@bakissation/jibaya';
import { Dinar } from '@bakissation/dinar';

const slip = payroll(Dinar.fromDinars(80_000));
slip.net.format();          // "60 844,00 DA"
slip.employerCost.format(); // "100 400,00 DA"

invoice({ ht: Dinar.fromDinars(100_000), paidInCash: true }).ttc.format(); // "121 380,00 DA"

vatReturn({ collected: Dinar.fromDinars(50_000), deductible: Dinar.fromDinars(30_000) }).due.format(); // "20 000,00 DA"
```

## Rounding

Tax is computed at centime precision (the `Dinar` granularity). If your administration files in whole dinars, round the result yourself (`Dinar.fromCentimes` / `multiply` with a rounding mode) at the edge.
