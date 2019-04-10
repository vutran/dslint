import {AbstractRule} from '../base/rule';
import {RuleWalker} from '../base/walker';

/**
 * Ensures there are no duplicate named components.
 */
export class Rule extends AbstractRule {
  static metadata: DSLint.Rules.Metadata = {
    ruleName: 'duplicate-component',
    description: 'Disallows duplicate component names.',
  };

  apply(node: Figma.Node, file: Figma.File) {
    const ruleName = this.getRuleName();
    return this.applyWithWalker(new ComponentWalker(node, {ruleName, file}));
  }
}

interface ComponentWalkerOptions {
  file: Figma.File;
}

class ComponentWalker extends RuleWalker<ComponentWalkerOptions> {
  // Map of component name -> list of tuples (component name, and id)
  count: Map<string, [string, Figma.ComponentId][]>;

  visitDocument(node: Figma.Nodes.Document) {
    const {file} = this.options;
    this.count = new Map();

    Object.entries(file.components).forEach(([cId, c]) => {
      const name = c.name.toLowerCase();
      const n = this.count.get(name) || [];
      this.count.set(name, [...n, [c.name, cId]]);
    });

    this.count.forEach(components => {
      if (components.length > 1) {
        components.forEach(component => {
          this.addFailure({
            location: component[1],
            message: `Duplicate component name "${component[0]}".`,
          });
        });
      }
    });
  }
}
