#!/usr/bin/env node

import chalk from 'chalk';
import {dslint} from './dslint';

const [nodeBin, scriptPath, fileKey] = process.argv;

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
if (!FIGMA_TOKEN) {
  throw new Error('Missing Figma Token');
}

async function main() {
  const allFailures = await dslint(fileKey, FIGMA_TOKEN);

  if (allFailures.length > 0) {
    allFailures.forEach(failure => {
      const ruleName = chalk.bgRed.whiteBright(failure.ruleName + ':');
      console.error(ruleName, failure.message);
      if (failure.description) {
        console.error(`\n   ${failure.description}`);
        console.error('');
      }
    });

    console.log(`\nTotal errors: ${allFailures.length}`);
  } else {
    console.log('No errors.');
  }
}

main();
