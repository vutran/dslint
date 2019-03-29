import * as Figma from 'figma-js';
import { AbstractRule, RuleFailure } from '../rule';

/**
 * All nodes must belong in a Frame
 */
export class Rule extends AbstractRule {
  static ruleName = 'must-be-in-frame';

  apply(node: Figma.Node): RuleFailure[] {
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      // TODO(vutran) - Implement
    }
    return [];
  }
}
