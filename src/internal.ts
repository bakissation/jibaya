import { Dinar } from '@bakissation/dinar';
import { JibayaError } from './errors.js';
import type { Bracket } from './rates/types.js';

/** Lesser of two amounts. */
export function minDinar(a: Dinar, b: Dinar): Dinar {
  return a.lessThanOrEqual(b) ? a : b;
}

/** Greater of two amounts. */
export function maxDinar(a: Dinar, b: Dinar): Dinar {
  return a.greaterThanOrEqual(b) ? a : b;
}

/** Reject negative amounts on inputs that must be ≥ 0. */
export function requireNonNegative(amount: Dinar, label: string): Dinar {
  if (amount.isNegative()) {
    throw new JibayaError(`${label} must not be negative`, 'INVALID_INPUT');
  }
  return amount;
}

/**
 * Apply a progressive bracket scale to an amount: each bracket's rate applies to
 * the slice of the amount falling within it (`upTo` in DZD; `null` = no ceiling).
 */
export function applyBrackets(amount: Dinar, brackets: Bracket[]): Dinar {
  let tax = Dinar.zero();
  let lower = Dinar.zero();
  for (const bracket of brackets) {
    const upper = bracket.upTo === null ? amount : Dinar.fromDinars(bracket.upTo);
    const capped = minDinar(amount, upper);
    if (capped.greaterThan(lower)) {
      tax = tax.add(capped.subtract(lower).percentage(bracket.rate));
    }
    if (bracket.upTo === null || amount.lessThanOrEqual(upper)) break;
    lower = upper;
  }
  return tax;
}
