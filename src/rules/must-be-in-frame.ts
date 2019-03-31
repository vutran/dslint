import {AbstractRule} from '../utils/abstractRule';

/**
 * All nodes must belong in a Frame.
 */
export class Rule extends AbstractRule {
  apply(node: Figma.Node): DSLint.Rules.Failure[] {
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      // TODO(vutran) - Implement
    }
    return [];
  }
}
