#!/usr/bin/env node

import {dslint} from './dslint';
import {getCoreRulesPath} from './utils';
import {logResults} from './logger';

const [nodeBin, scriptPath, fileKey] = process.argv;

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
if (!FIGMA_TOKEN) {
  throw new Error('Missing Figma Token');
}

async function main() {
  const rulesPath = getCoreRulesPath();
  const failures = await dslint(fileKey, FIGMA_TOKEN, [rulesPath]);
  logResults(failures);
}

main();
