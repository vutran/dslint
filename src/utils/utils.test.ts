import path from 'path';
import { getAllRules } from './utils';

describe('getAllRules', () => {
  const rulesPath = path.resolve(__dirname, '..', 'rules');
  const ruleNames = getAllRules([rulesPath]).map(rule => rule[0]);

  it('should have the ban-numbers-in-components rule', () => {
    expect(ruleNames).toContain('prefer-local-style');
  });
});
