#!/usr/bin/env node

import {dslint} from './dslint';
import {getConfig, getCoreRulesPath} from './utils';
import {logResults} from './logger';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
if (!FIGMA_TOKEN) {
  throw new Error('Missing Figma Token');
}

async function main() {
  const config = getConfig();
  const rulesPath = getCoreRulesPath();
  const startTime = Date.now();
  const failures = await dslint(
    config.fileKey,
    FIGMA_TOKEN,
    [rulesPath],
    config
  );
  const endTime = Date.now();
  const diffTime = endTime - startTime;
  logResults(config.fileKey, failures, diffTime);
}

main();
