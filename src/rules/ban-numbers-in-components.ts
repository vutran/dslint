import * as Figma from 'figma-js';
import { AbstractRule } from '../rule';

/**
 * Bans usage of numbers in component names.
 */
export class Rule extends AbstractRule {
  static ruleName = 'ban-numbers-in-components';

  apply(node: Figma.Node) {
    if (node.type === 'COMPONENT') {
      if (/[\d]+/.test(node.name)) {
        return [
          { ruleName: Rule.ruleName, message: 'No numbers in names', node },
        ];
      }
    }
    return [];
  }
}
