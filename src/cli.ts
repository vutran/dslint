#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import {Client} from './figma';
import {getAllRules} from './utils';
import {lint} from './dslint';

const [nodeBin, scriptPath, fileKey] = process.argv;

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
if (!FIGMA_TOKEN) {
  throw new Error('Missing Figma Token');
}

async function main() {
  const client = new Client({personalAccessToken: FIGMA_TOKEN});

  const rulesPath = path.resolve(__dirname, 'rules');
  const rules = getAllRules([rulesPath]);

  const file = (await client.file(fileKey)).body;

  try {
    const allFailures = await lint(file, rules, client);

    if (allFailures.length > 0) {
      allFailures.forEach(failure => {
        const ruleName = chalk.bgRed.whiteBright(failure.ruleName + ':');
        console.error(ruleName, failure.message);
      });

      console.log(`\nTotal errors: ${allFailures.length}`);
    } else {
      console.log('No errors.');
    }
  } catch (err) {
    console.trace(err);
  }
}

main();
