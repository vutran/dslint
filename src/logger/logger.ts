import chalk from 'chalk';

export function logError(failure: DSLint.Rules.Failure) {
  const ruleName = chalk.bgRed.whiteBright(failure.ruleName + ':');
  console.error(ruleName, failure.message);
  if (failure.description) {
    console.error(`\n   ${failure.description}`);
    console.error('');
  }
}

export function logResults(failures: DSLint.Rules.Failure[]) {
  if (failures.length > 0) {
    failures.forEach(logError);
    console.error(`\nTotal errors: ${failures.length}`);
  } else {
    console.log('No errors.');
  }
}
