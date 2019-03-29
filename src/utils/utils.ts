import path from 'path';
import fs from 'fs';
import * as Figma from 'figma-js';
import { AbstractRule, RuleConstructor } from './rule';

export function getAllRules(rulesPaths: Array<string>): Array<RuleConstructor> {
  const rules: Array<RuleConstructor> = [];
  rulesPaths.forEach(p => {
    const st = fs.statSync(p);

    if (st.isDirectory) {
      const rulesFiles = fs.readdirSync(p);
      rulesFiles.forEach(file => {
        const f = path.resolve(p, file);
        const rule = (require(f) as { Rule: RuleConstructor }).Rule;
        rules.push(rule);
      });
    }
  });

  return rules;
}
