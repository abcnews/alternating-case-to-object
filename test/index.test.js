const test = require('ava');
const alternatingCaseToObject = require('../src/index');

test('it can read basic config', t => {
  const config = alternatingCaseToObject('FIRSTvalueSECONDthing');

  t.is(typeof config, 'object');
  t.is(config.first, 'value');
  t.is(config.second, 'thing');
});

test('it handles empty values in the last property', t => {
  const config = alternatingCaseToObject('FIRSTvalueEMPTY');

  t.is(typeof config, 'object');
  t.is(config.first, 'value');
  t.is(config.empty, null);
});

test('it can group multiple keys', t => {
  const config = alternatingCaseToObject('GROUPfirstGROUPsecondGROUPthird');

  t.true(Array.isArray(config.group));
  t.is(config.group.length, 3);
  t.is(config.group[2], 'third');
});

test('it can do some basic type guessing', t => {
  const config = alternatingCaseToObject('THINGS10ALLOWEDyesAVAILABLEfalse');

  t.true(config.things === 10);
  t.true(config.allowed === true);
  t.true(config.available === false);
});

test('it can map props', t => {
  const config = alternatingCaseToObject(
    'KEBABCASE1SNAKECASE2CAMELCASE3PASCALCASE4DIFFERENT5',
    {
      propMap: {
        kebabcase: 'kebab-case',
        snakecase: 'snake_case',
        camelcase: 'camelCase',
        pascalcase: 'PascalCase',
        different: 'entirely',
      },
    }
  );

  t.is(config['kebab-case'], 1);
  t.is(config.snake_case, 2);
  t.is(config.camelCase, 3);
  t.is(config.PascalCase, 4);
  t.is(config.entirely, 5);
  t.not(config.different, 5);
});

test('it can ensure arrays are returned for props which appear zero-or-more times', t => {
  const options = {
    arrayProps: ['list'],
  };
  const configEmpty = alternatingCaseToObject('', options);
  const configZero = alternatingCaseToObject('NOTEMPTYtrue', options);
  const configOne = alternatingCaseToObject('LIST1', options);
  const configMultiple = alternatingCaseToObject('LIST1LIST2LIST3', options);

  t.true(Array.isArray(configEmpty.list));
  t.true(Array.isArray(configZero.list));
  t.true(Array.isArray(configOne.list));
  t.true(Array.isArray(configMultiple.list));
  t.is(configEmpty.list.length, 0);
  t.is(configZero.list.length, 0);
  t.is(configOne.list.length, 1);
  t.is(configMultiple.list.length, 3);
  t.is(configMultiple.list[1], 2);
});

test('it allows arrayProps to be a string (representing a single prop)', t => {
  const config = alternatingCaseToObject('LIST1LIST2LIST3', {
    arrayProps: 'list',
  });

  t.true(Array.isArray(config.list));
  t.is(config.list.length, 3);
});

test('it allows arrayProps to contain props in propMap', t => {
  const config = alternatingCaseToObject('LIST1LIST2LIST3', {
    arrayProps: 'things',
    propMap: {
      list: 'things',
    },
  });

  t.true(Array.isArray(config.things));
  t.is(config.things.length, 3);
});
