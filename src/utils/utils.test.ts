import path from 'path';
import {getAllRules} from './';

describe('getAllRules', () => {
  const config: DSLint.Configuration = {fileKey: ''};
  const options: any = {}; // TODO(vutran)
  const rulesPath = path.resolve(__dirname, '..', 'rules');
  const rules = getAllRules([rulesPath], config, options);
  const ruleNames = rules.map(rule => rule.metadata.ruleName);

  it('should have the prefer-local-style rule', () => {
    expect(ruleNames).toContain('prefer-local-style');
  });
});
