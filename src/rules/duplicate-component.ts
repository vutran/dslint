import {AbstractRule} from '../utils/abstractRule';

/**
 * Ensures there are no duplicate named components.
 */
export class Rule extends AbstractRule {
  // Map of component name -> list of tuples (component name, and id)
  count: Map<string, [string, Figma.ComponentId][]>;

  init(client: Figma.Client.Client, file: Figma.File) {
    this.count = new Map();

    Object.entries(file.components).forEach(([cId, c]) => {
      const name = c.name.toLowerCase();
      const n = this.count.get(name) || [];
      this.count.set(name, [...n, [c.name, cId]]);
    });

    const ruleName = this.getRuleName();
    this.count.forEach(components => {
      if (components.length > 1) {
        components.forEach(component => {
          this.addFailure({
            ruleName,
            message: `Duplicate component name: ${component[0]}.`,
          });
        });
      }
    });
  }
}
