import path from 'path';
import {
  RuleConstructor,
  RuleFailure,
  RuleMetadata,
  RuleNameAndConstructor,
} from './utils/abstractRule';
import { PRIVATE_MARKER } from './constants';

export async function lint(
  node: AnyType,
  rules: Array<RuleNameAndConstructor>
): Promise<RuleFailure[]> {
  const allFailures: RuleFailure[] = [];

  // Iterate through all rules and apply it to the given node.
  rules.forEach(async ([ruleName, ctor]) => {
    const metadata: RuleMetadata = { ruleName };
    const r = new ctor(metadata, node);
    // Ignore `@private` nodes
    if (!node.name.includes(PRIVATE_MARKER)) {
      const ruleFailures = await r.apply();
      ruleFailures.forEach(failure => {
        allFailures.push(failure);
      });
    }
  });

  // NOTE(vutran) - vector doesn't have children so we're asserting AnyType
  if ((node as AnyType).children) {
    (node as AnyType).children.forEach(async (child: AnyType) => {
      const childFailures = await lint(child, rules);
      childFailures.forEach(failure => {
        allFailures.push(failure);
      });
    });
  }

  return allFailures;
}
