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

  walk(projectData.document, rules);
}

main();
