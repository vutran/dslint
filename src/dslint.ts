import path from 'path';
import * as Figma from 'figma-js';
import {
  RuleConstructor,
  RuleFailure,
  RuleMetadata,
  RuleNameAndConstructor,
} from './utils/abstractRule';
import { PRIVATE_MARKER } from './constants';

export function lint(
  node: Figma.Node,
  rules: Array<RuleNameAndConstructor>
): RuleFailure[] {
  const allFailures: RuleFailure[] = [];

  // Iterate through all rules and apply it to the given node.
  rules.forEach(([ruleName, ctor]) => {
    const metadata: RuleMetadata = { ruleName };
    const r = new ctor(metadata, node);
    // Ignore `@private` nodes
    if (!node.name.includes(PRIVATE_MARKER)) {
      const ruleFailures = r.apply();
      ruleFailures.forEach(failure => {
        allFailures.push(failure);
      });
    }
  });

  // NOTE(vutran) - vector doesn't have children so we're asserting any type
  if ((node as any).children) {
    (node as any).children.forEach((child: Figma.Node) => {
      const childFailures = lint(child, rules);
      childFailures.forEach(failure => {
        allFailures.push(failure);
      });
    });
  }

  return allFailures;
}
