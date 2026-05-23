import { Dinar } from '@bakissation/dinar';
import { JibayaError } from './errors.js';
import { getRates } from './rates/index.js';
import type { AlcoholCategory, Metal } from './types.js';

function requirePositiveQuantity(qty: number, label: string): number {
  if (!Number.isFinite(qty) || qty < 0) {
    throw new JibayaError(`${label} must be a non-negative number`, 'INVALID_INPUT');
  }
  return qty;
}

/** Droit de circulation on alcohols (Art. 47 Code des Impôts Indirects): per hectolitre of pure alcohol, by category. */
export function droitCirculationAlcool(hectolitres: number, category: AlcoholCategory, year?: number): Dinar {
  requirePositiveQuantity(hectolitres, 'hectolitres');
  const rate = getRates(year).indirect.alcoholCirculation[category];
  if (rate === undefined) throw new JibayaError(`Unknown alcohol category: ${category}`, 'UNKNOWN_CATEGORY');
  return Dinar.fromDinars(rate * hectolitres);
}

/** Droit de circulation on wine (Art. 176): DA 50 000 per hectolitre. */
export function droitCirculationVin(hectolitres: number, year?: number): Dinar {
  requirePositiveQuantity(hectolitres, 'hectolitres');
  return Dinar.fromDinars(getRates(year).indirect.wineCirculation * hectolitres);
}

/** Droit de garantie on precious-metal works (Art. 340): per hectogramme — gold 16 000, platinum 30 000, silver 250 DA. */
export function droitGarantie(grams: number, metal: Metal, year?: number): Dinar {
  requirePositiveQuantity(grams, 'grams');
  const rate = getRates(year).indirect.garantiePerHectogram[metal];
  return Dinar.fromDinars((rate * grams) / 100);
}

/** Droit d'essai à la coupelle / voie humide per operation (Art. 342): platinum 300, gold 160, silver 60 DA. */
export function droitEssai(metal: Metal, operations = 1, _year?: number): Dinar {
  requirePositiveQuantity(operations, 'operations');
  const perOperation = metal === 'platinum' ? 300 : metal === 'gold' ? 160 : 60;
  return Dinar.fromDinars(perOperation * operations);
}

/** Specific tobacco duty (Art. 271–321 + tariffs): cigarettes DA 3/packet, cigars DA 15/box (on top of TIC). */
export function taxeTabac(quantity: number, product: 'cigarettes' | 'cigars', year?: number): Dinar {
  requirePositiveQuantity(quantity, 'quantity');
  const { indirect } = getRates(year);
  const rate = product === 'cigars' ? indirect.tobaccoCigarsPerBox : indirect.tobaccoCigarettesPerPacket;
  return Dinar.fromDinars(rate * quantity);
}
