import type { RateSet } from './types.js';

/**
 * Rates in force for the 2026 Loi de Finances year. All figures are cited to
 * their article in `docs/` and the research dossier. This is the canonical set;
 * other years are expressed as overrides of it.
 */
export const RATES_2026: RateSet = {
  year: 2026,

  irg: {
    // Art. 104 CIDTA
    brackets: [
      { upTo: 240_000, rate: 0 },
      { upTo: 480_000, rate: 23 },
      { upTo: 960_000, rate: 27 },
      { upTo: 1_920_000, rate: 30 },
      { upTo: 3_840_000, rate: 33 },
      { upTo: null, rate: 35 },
    ],
    jointFilingAbatement: 10,
    salaryAbatement: 40,
    salaryAbatementMin: 12_000,
    salaryAbatementMax: 18_000,
    salaryExemptThreshold: 30_000,
    rental: { habitation: 7, commercial: 15, nonBati: 15, agricultural: 10 },
    rentalLiberatoireCeiling: 1_800_000,
    rentalProvisional: 7,
    occasional: { intellectual: 10, other: 15 },
    dividend: 10, // LF 2026 cut this from 15% (Art. 104-II-4)
    interest: 10,
    anonymousSecurities: 50,
    savingsLow: 1,
    savingsHigh: 10,
    savingsThreshold: 50_000,
    realEstateGain: 15,
    realEstateGainPrimaryReduction: 50,
    securitiesGain: 15,
    securitiesGainReinvested: 5,
  },

  ibs: {
    production: 19,
    construction: 23,
    tourism: 23,
    other: 26,
    reinvested: 10,
    withholding: { interest: 10, anonymousSecurities: 40, management: 20, foreignServices: 30 },
  },

  ifu: {
    goods: 5,
    services: 12,
    autoEntrepreneur: 0.5,
    minimum: 30_000, // Art. 365 bis
    minimumAutoEntrepreneur: 10_000,
  },

  foncier: {
    bati: 3,
    batiVacantSecondary: 11,
    nonBatiUnurbanized: 5,
    nonBatiSmall: 5,
    nonBatiMedium: 7,
    nonBatiLarge: 10,
    nonBatiAgricultural: 3,
    surfaceSmall: 500,
    surfaceMedium: 1_000,
  },

  amortissement: { short: 1.5, medium: 2, long: 2.5 },

  vat: { normal: 19, reduced: 9, cashDeductibilityCap: 1_000_000 },

  timbre: {
    quittanceLow: 1,
    quittanceMid: 1.5,
    quittanceHigh: 2,
    quittanceBand1: 30_000,
    quittanceBand2: 100_000,
    quittanceFloor: 5,
    quittanceExemptBelow: 300,
    receiptFlat: 50,
    dimension: 30,
    effet: 233,
  },

  enregistrement: {
    propertySale: 5,
    donation: 5,
    succession: 5,
    shareTransfer: 2.5,
    realEstateExchange: 2.5,
    companyContribution: 1,
    fixed: { simple: 10, standard: 500, mid: 1_500, high: 3_000, major: 1_500_000 },
    lateInterest: 5,
    lateMonthly: 3,
    lateCap: 25,
  },

  penalties: {
    recoveryBase: 10,
    recoveryMonthly: 3,
    recoveryCap: 25,
    recoveryDeclarationCumul: 15,
    insufficiencyLow: 10,
    insufficiencyMid: 15,
    insufficiencyHigh: 25,
    insufficiencyLowCeiling: 50_000,
    insufficiencyMidCeiling: 200_000,
  },

  social: {
    cnasEmployee: 9,
    cnasEmployer: 25,
    fnpos: 0.5,
    btphSurcharge: 0.375,
    cnasBranches: [
      { branch: 'assurances-sociales', employer: 11.5, employee: 1.5 },
      { branch: 'accidents-travail', employer: 1.25, employee: 0 },
      { branch: 'retraite', employer: 11, employee: 6.75 },
      { branch: 'retraite-anticipee', employer: 0.25, employee: 0.25 },
      { branch: 'chomage', employer: 1, employee: 0.5 },
    ],
    casnos: 15,
    casnosMinIncome: 216_000,
    casnosMaxIncome: 4_320_000,
    cacobatph: 12.21,
  },

  indirect: {
    alcoholCirculation: {
      medicinal: 60,
      perfumery: 1_200,
      'sparkling-base': 5_000,
      aperitif: 150_000,
      whisky: 300_000,
      other: 150_000,
    },
    wineCirculation: 50_000,
    garantiePerHectogram: { gold: 16_000, silver: 250, platinum: 30_000 },
    tobaccoCigarettesPerPacket: 3,
    tobaccoCigarsPerBox: 15,
  },

  acomptes: { rate: 30, count: 2 },
};
