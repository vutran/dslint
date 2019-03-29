import path from 'path';
import { connectNodes, getAllRules } from './utils';

describe.only('getAllRules', () => {
  const rulesPath = path.resolve(__dirname, 'rules');
  const ruleNames = getAllRules([rulesPath]).map(rule => rule.ruleName);

  it('should have the ban-numbers-in-components rule', () => {
    expect(ruleNames).toContain('ban-numbers-in-components');
  });
});

describe('connectNodes', () => {
  const data = {
    a: {
      a1: {},
      a2: {},
    },
    b: {
      b1: {},
      b2: {},
    },
  };

  it('should have a parent', () => {
    const result = connectNodes(data);
    console.log(result);
    expect(result.a.a1).toHaveProperty('parent');
    expect(result.b.b1).toHaveProperty('parent');

    // NOTE(vutran) - These should be ConnectedNodes
    expect((result.a.a1 as any).parent).toEqual(data.a.a1);
    expect((result.b.b1 as any).parent).toEqual(data.b.b1);
  });
});
