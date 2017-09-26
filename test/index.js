const { test } = require('ava');

const alternatingCaseToObject = require('..');

test('it can read basic config', t => {
  const config = alternatingCaseToObject('FIRSTvalueSECONDthing');

  t.is(typeof config, 'object');
  t.is(config.first, 'value');
  t.is(config.second, 'thing');
});

test('it can group multiple keys', t => {
  const config = alternatingCaseToObject('GROUPfirstGROUPsecondGROUPthird');

  t.true(config.group instanceof Array);
  t.is(config.group.length, 3);
  t.is(config.group[2], 'third');
});

test('it can do some basic type guessing', t => {
  const config = alternatingCaseToObject('THINGS10ALLOWEDyesAVAILABLEfalse');

  t.true(config.things === 10);
  t.true(config.allowed === true);
  t.true(config.available === false);
});
