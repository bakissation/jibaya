# jibaya docs

`@bakissation/jibaya` — Algerian tax & fiscal formulas, `Dinar`-backed, law-cited, versioned by Loi de Finances year.

- [Getting started](./getting-started.md) — install, the `year` argument, money in/out
- [API reference](./api-reference.md) — every function, grouped, with its article
- [Legal sources](./legal-sources.md) — the codes and articles each rate comes from

## Design in one paragraph

Plain functions take a `Dinar` (plus options) and an optional trailing `year` (default `LATEST_YEAR`) and return a `Dinar`. Rates live in `rates/<year>.ts`; the legal citation lives in each function's JSDoc. Composite **helpers** (`payroll`, `invoice`, …) return small typed records because a payslip or invoice is inherently multi-valued. The only runtime dependency is `@bakissation/dinar`.
