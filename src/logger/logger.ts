import kleur from 'kleur';
import wcwidth from 'wcwidth';

const COLUMN_PADDING = 3;

export function logError(fileKey: string, failure: DSLint.Rules.Failure) {
  console.error(
    kleur.gray(failure.location),
    failure.message,
    kleur.gray(failure.ruleName)
  );
}

export function logResults(
  fileKey: string,
  failures: DSLint.Rules.Failure[],
  timeSpent: number
) {
  if (failures.length > 0) {
    const maxIdLen = Math.max(...failures.map(f => f.location.length));
    const maxMsgLen = Math.max(...failures.map(f => f.message.length));

    failures
      .map(f => ({
        ...f,
        location: f.location.padEnd(maxIdLen + COLUMN_PADDING, ' '),
        message: f.message.padEnd(maxMsgLen + COLUMN_PADDING, ' '),
      }))
      .forEach(f => logError(fileKey, f));
    console.error('');
    console.error(`${kleur.red(`Total errors: ${failures.length}`)}`);
    console.error(`${kleur.red(`Time spent: ${timeSpent / 1000}s`)}`);
  } else {
    console.error('');
    console.log('No errors.');
  }
}
