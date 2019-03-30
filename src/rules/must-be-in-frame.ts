import { AbstractRule, RuleFailure } from '../utils/abstractRule';

/**
 * All nodes must belong in a Frame.
 */
export class Rule extends AbstractRule {
  apply(): RuleFailure[] {
    const node = this.getNode();
    if (node.type !== 'DOCUMENT' && node.type !== 'CANVAS') {
      // TODO(vutran) - Implement
    }
    return [];
  }
}
