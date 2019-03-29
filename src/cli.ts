#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import { getProjectData } from './figma';
import { getAllRules } from './utils';
import { walk } from './walker';

const [nodeBin, scriptPath, projectKey] = process.argv;

async function main() {
  const projectData = await getProjectData(projectKey);

  const rulesPath = path.resolve(__dirname, 'rules');
  const rules = getAllRules([rulesPath]);

  const allFailures = walk(projectData.document, rules);

  if (allFailures.length > 0) {
    allFailures.forEach(failure => {
      const ruleName = chalk.bgRed.whiteBright(failure.ruleName);
      console.error(ruleName, failure.node.name, ':', failure.message);
    });

    console.log(`\nTotal errors: ${allFailures.length}`);
  } else {
    console.log('No errors.');
  }
}

main();
