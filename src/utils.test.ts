import path from 'path';
import { getAllRules } from './utils';

describe('getAllRules', () => {
  const rulesPath = path.resolve(__dirname, 'rules');
  const ruleNames = getAllRules([rulesPath]).map(rule => rule.ruleName);

  it('should have the ban-numbers-in-components rule', () => {
    expect(ruleNames).toContain('ban-numbers-in-components');
  });
});
