import { Dinar } from '@bakissation/dinar';
import { maxDinar } from '../internal.js';
import type { VatReturn } from '../types.js';

/**
 * Monthly VAT (G50) settlement from the collected (output) and deductible (input)
 * VAT totals: when deductible exceeds collected, the excess becomes a credit
 * carried forward (Art. 33) and nothing is due.
 */
export function vatReturn(input: { collected: Dinar; deductible: Dinar }): VatReturn {
  const { collected, deductible } = input;
  const net = collected.subtract(deductible);
  return {
    collected,
    deductible,
    due: maxDinar(net, Dinar.zero()),
    creditCarried: maxDinar(net.negate(), Dinar.zero()),
  };
}
