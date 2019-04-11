import path from 'path';
import {getAllRules} from './';

describe('getAllRules', () => {
  const rulesPath = path.resolve(__dirname, '..', 'rules');
  const rules = getAllRules([rulesPath]);
  const ruleNames = rules.map(rule => rule.metadata.ruleName);

  it('should have the prefer-local-style rule', () => {
    expect(ruleNames).toContain('prefer-local-style');
  });
});
