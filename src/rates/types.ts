/** A progressive scale bracket: rate (%) applied to the slice up to `upTo` DZD (null = ∞). */
export interface Bracket {
  upTo: number | null;
  rate: number;
}

/** All year-versioned figures, each grouped by the tax it belongs to. */
export interface RateSet {
  year: number;

  irg: {
    /** Annual progressive scale (Art. 104). */
    brackets: Bracket[];
    /** Joint-filing abattement (%). */
    jointFilingAbatement: number;
    /** Salary: proportional abattement on the tax (%), with annual floor/ceiling (DZD). */
    salaryAbatement: number;
    salaryAbatementMin: number;
    salaryAbatementMax: number;
    /** Monthly salary fully exempt at or below this (DZD). */
    salaryExemptThreshold: number;
    /** Rental withholding rates (%) and the libératoire ceiling (DZD). */
    rental: { habitation: number; commercial: number; nonBati: number; agricultural: number };
    rentalLiberatoireCeiling: number;
    rentalProvisional: number;
    /** Occasional-income rates (%). */
    occasional: { intellectual: number; other: number };
    /** RCM (capitaux mobiliers). */
    dividend: number;
    interest: number;
    anonymousSecurities: number;
    savingsLow: number;
    savingsHigh: number;
    savingsThreshold: number;
    /** Capital gains (%). */
    realEstateGain: number;
    realEstateGainPrimaryReduction: number;
    securitiesGain: number;
    securitiesGainReinvested: number;
  };

  ibs: {
    production: number;
    construction: number;
    tourism: number;
    other: number;
    reinvested: number;
    withholding: { interest: number; anonymousSecurities: number; management: number; foreignServices: number };
  };

  ifu: {
    goods: number;
    services: number;
    autoEntrepreneur: number;
    minimum: number;
    minimumAutoEntrepreneur: number;
  };

  foncier: {
    bati: number;
    batiVacantSecondary: number;
    nonBatiUnurbanized: number;
    nonBatiSmall: number;
    nonBatiMedium: number;
    nonBatiLarge: number;
    nonBatiAgricultural: number;
    /** Surface thresholds (m²) for urbanized land. */
    surfaceSmall: number;
    surfaceMedium: number;
  };

  /** Dégressif coefficients keyed by useful-life band. */
  amortissement: { short: number; medium: number; long: number };

  vat: {
    normal: number;
    reduced: number;
    /** Cash-paid invoice TTC above this is non-deductible (DZD). */
    cashDeductibilityCap: number;
  };

  timbre: {
    /** Quittance proportional brackets: per-100-DZD-tranche rates by amount band. */
    quittanceLow: number; // > 300 ≤ 30 000
    quittanceMid: number; // > 30 000 ≤ 100 000
    quittanceHigh: number; // > 100 000
    quittanceBand1: number;
    quittanceBand2: number;
    quittanceFloor: number;
    quittanceExemptBelow: number;
    receiptFlat: number;
    dimension: number;
    effet: number;
  };

  enregistrement: {
    propertySale: number;
    donation: number;
    succession: number;
    shareTransfer: number;
    realEstateExchange: number;
    companyContribution: number;
    fixed: { simple: number; standard: number; mid: number; high: number; major: number };
    lateInterest: number;
    lateMonthly: number;
    lateCap: number;
  };

  penalties: {
    recoveryBase: number;
    recoveryMonthly: number;
    recoveryCap: number;
    recoveryDeclarationCumul: number;
    insufficiencyLow: number;
    insufficiencyMid: number;
    insufficiencyHigh: number;
    insufficiencyLowCeiling: number;
    insufficiencyMidCeiling: number;
  };

  social: {
    cnasEmployee: number;
    cnasEmployer: number;
    fnpos: number;
    btphSurcharge: number;
    cnasBranches: { branch: string; employer: number; employee: number }[];
    casnos: number;
    casnosMinIncome: number;
    casnosMaxIncome: number;
    cacobatph: number;
  };

  indirect: {
    alcoholCirculation: Record<string, number>; // DA per hectolitre of pure alcohol
    wineCirculation: number; // DA per hectolitre
    garantiePerHectogram: { gold: number; silver: number; platinum: number };
    tobaccoCigarettesPerPacket: number;
    tobaccoCigarsPerBox: number;
  };

  acomptes: {
    rate: number;
    count: number;
  };
}
