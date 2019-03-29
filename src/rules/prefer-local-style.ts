import * as Figma from 'figma-js';
import { AbstractRule, RuleFailure } from '../rule';

/**
 * Prefer local style over hard-coded colors.
 */
export class Rule extends AbstractRule {
  static ruleName = 'prefer-local-style';

  apply(node: Figma.Node): RuleFailure[] {
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      // TODO(vutran) - Implement
      // node.styles contains a mapping of a mapping of styles
      // projectData.styles contains styles mapping (id => Figma.Style)
      // Depends on: https://github.com/jongold/figma-js/pull/15
    }
    return [];
  }
}
