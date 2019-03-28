import path from 'path';
import * as Figma from 'figma-js';
import { RuleConstructor } from './rule';

export function walk(node: Figma.Node, rules: Array<RuleConstructor>) {
  rules.forEach(ctor => {
    const r = new ctor();
    r.visit(node);
  });

  // NOTE(vutran) - vector doesn't have children so we're asserting any type
  if ((node as any).children) {
    (node as any).children.forEach((child: Figma.Node) => {
      walk(child, rules);
    });
  }
}
