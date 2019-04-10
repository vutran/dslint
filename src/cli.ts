#!/usr/bin/env node

import {dslint} from './dslint';
import {getCoreRulesPath} from './utils';
import {logResults} from './logger';

const [nodeBin, scriptPath, fileKey, ...matchName] = process.argv;

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
if (!FIGMA_TOKEN) {
  throw new Error('Missing Figma Token');
}

async function main() {
  const rulesPath = getCoreRulesPath();
  const startTime = Date.now();
  const failures = await dslint(fileKey, FIGMA_TOKEN, [rulesPath], {
    matchName: matchName.join(' '),
  });
  const endTime = Date.now();
  const diffTime = endTime - startTime;
  logResults(fileKey, failures, diffTime);
}

main();
