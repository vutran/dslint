import path from 'path';
import * as Figma from 'figma-js';
import { RuleConstructor, RuleFailure } from './rule';
import { PRIVATE_MARKER } from './constants';

export function walk(
  node: Figma.Node,
  rules: Array<RuleConstructor>
): RuleFailure[] {
  const allFailures: RuleFailure[] = [];

  // Iterate through all rules and apply it to the given node.
  rules.forEach(ctor => {
    const r = new ctor();
    // Ignore `@private` nodes
    if (!node.name.includes(PRIVATE_MARKER)) {
      const ruleFailures = r.apply(node);
      ruleFailures.forEach(failure => {
        allFailures.push(failure);
      });
    }
  });

  // NOTE(vutran) - vector doesn't have children so we're asserting any type
  if ((node as any).children) {
    (node as any).children.forEach((child: Figma.Node) => {
      const childFailures = walk(child, rules);
      childFailures.forEach(failure => {
        allFailures.push(failure);
      });
    });
  }

  return allFailures;
}
