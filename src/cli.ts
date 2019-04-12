#!/usr/bin/env node

import mri from 'mri';
import {dslint} from './dslint';
import {getCoreRulesPath} from './utils';
import {logResults} from './logger';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
if (!FIGMA_TOKEN) {
  throw new Error('Missing Figma Token');
}

async function main() {
  const argv = process.argv.slice(2);
  const args = mri(argv);
  const config: DSLint.Configuration = {}; // TODO(vutran)
  const fileKey = args._.join('');
  const rulesPath = getCoreRulesPath();
  const startTime = Date.now();
  const failures = await dslint(fileKey, FIGMA_TOKEN, [rulesPath], config);
  const endTime = Date.now();
  const diffTime = endTime - startTime;
  logResults(fileKey, failures, diffTime);
}

main();
