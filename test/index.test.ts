import alternatingCaseToObject from '../src/index';

test('it can read basic config', () => {
  const config = alternatingCaseToObject('FIRSTvalueSECONDthing');

  expect(typeof config).toBe('object');
  expect(config.first).toBe('value');
  expect(config.second).toBe('thing');
});

test('it handles empty values in the last property', () => {
  const config = alternatingCaseToObject('FIRSTvalueEMPTY');

  expect(typeof config).toBe('object');
  expect(config.first).toBe('value');
  expect(config.empty).toBe(null);
});

test('it can group multiple keys', () => {
  const config = alternatingCaseToObject('GROUPfirstGROUPsecondGROUPthird');

  expect(Array.isArray(config.group)).toBe(true);
  expect(Array.isArray(config.group) && config.group.length).toBe(3);
  expect(Array.isArray(config.group) && config.group[2]).toBe('third');
});

test('it can do some basic type guessing', () => {
  const config = alternatingCaseToObject('THINGS10ALLOWEDyesAVAILABLEfalse');

  expect(config.things === 10).toBe(true);
  expect(config.allowed === true).toBe(true);
  expect(config.available === false).toBe(true);
});

test('it can map props', () => {
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

  expect(config['kebab-case']).toBe(1);
  expect(config.snake_case).toBe(2);
  expect(config.camelCase).toBe(3);
  expect(config.PascalCase).toBe(4);
  expect(config.entirely).toBe(5);
  expect(config.different).not.toBe(5);
});

test('it can ensure arrays are returned for props which appear zero-or-more times', () => {
  const options = {
    arrayProps: ['list'],
  };
  const configEmpty = alternatingCaseToObject('', options);
  const configZero = alternatingCaseToObject('NOTEMPTYtrue', options);
  const configOne = alternatingCaseToObject('LIST1', options);
  const configMultiple = alternatingCaseToObject('LIST1LIST2LIST3', options);

  expect(Array.isArray(configEmpty.list)).toBe(true);
  expect(Array.isArray(configZero.list)).toBe(true);
  expect(Array.isArray(configOne.list)).toBe(true);
  expect(Array.isArray(configMultiple.list)).toBe(true);
  expect(Array.isArray(configEmpty.list) && configEmpty.list.length).toBe(0);
  expect(Array.isArray(configZero.list) && configZero.list.length).toBe(0);
  expect(Array.isArray(configOne.list) && configOne.list.length).toBe(1);
  expect(Array.isArray(configMultiple.list) && configMultiple.list.length).toBe(
    3
  );
  expect(Array.isArray(configMultiple.list) && configMultiple.list[1]).toBe(2);
});

test('it allows arrayProps to be a string (representing a single prop)', () => {
  const config = alternatingCaseToObject('LIST1LIST2LIST3', {
    arrayProps: 'list',
  });

  expect(Array.isArray(config.list)).toBe(true);
  expect(Array.isArray(config.list) && config.list.length).toBe(3);
});

test('it allows arrayProps to contain props in propMap', () => {
  const config = alternatingCaseToObject('LIST1LIST2LIST3', {
    arrayProps: 'things',
    propMap: {
      list: 'things',
    },
  });

  expect(Array.isArray(config.things)).toBe(true);
  expect(Array.isArray(config.things) && config.things.length).toBe(3);
});

test('it throws an error when an array prop has differing types', () => {
  const throws = () => alternatingCaseToObject('LIST1LISTtwo');
  expect(throws).toThrow();
});
