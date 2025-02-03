import assert from 'assert';
import alternatingCaseToObject from '../src/parse.js';
import { propMap } from './constants.js';

describe('parse', () => {
  it('can read basic config', () => {
    const config = alternatingCaseToObject('FIRSTvalueSECONDthing');

    assert.equal(typeof config, 'object');
    assert.equal(config.first, 'value');
    assert.equal(config.second, 'thing');
  });

  it('handles empty values in the last property', () => {
    const config = alternatingCaseToObject('FIRSTvalueEMPTY');

    assert.equal(typeof config, 'object');
    assert.equal(config.first, 'value');
    assert.equal(config.empty, null);
  });

  it('can group multiple keys', () => {
    const config = alternatingCaseToObject('GROUPfirstGROUPsecondGROUPthird');

    assert.equal(Array.isArray(config.group), true);
    assert.equal(Array.isArray(config.group) && config.group.length, 3);
    assert.equal(Array.isArray(config.group) && config.group[2], 'third');
  });

  it('can do some basic type guessing', () => {
    const config = alternatingCaseToObject('THINGS10ALLOWEDyesAVAILABLEfalse');

    assert.equal(config.things === 10, true);
    assert.equal(config.allowed === true, true);
    assert.equal(config.available === false, true);
  });

  it("it doesn't type guess values if we ask it not to", () => {
    const config = alternatingCaseToObject(
      'THINGS10ALLOWEDyesAVAILABLEfalseTHINGSA10ALLOWEDAyesAVAILABLEAfalseEMPTYA',
      { noTypeGuessing: ['thingsa', 'alloweda', 'availablea', 'emptya'] }
    );

    assert.equal(config.thingsa === '10', true);
    assert.equal(config.alloweda === 'yes', true);
    assert.equal(config.availablea === 'false', true);
    assert.equal(config.emptya === '', true);
  });

  it('can map props', () => {
    const config = alternatingCaseToObject(
      'KEBABCASE1SNAKECASE2CAMELCASE3PASCALCASE4DIFFERENT5',
      { propMap: propMap }
    );

    assert.equal(config['kebab-case'], 1);
    assert.equal(config.snake_case, 2);
    assert.equal(config.camelCase, 3);
    assert.equal(config.PascalCase, 4);
    assert.equal(config.entirely, 5);
    assert.equal(config.different, undefined);
  });

  it('can ensure arrays are returned for props which appear zero-or-more times', () => {
    const options = {
      arrayProps: ['list'],
    };
    const configEmpty = alternatingCaseToObject('', options);
    const configZero = alternatingCaseToObject('NOTEMPTYtrue', options);
    const configOne = alternatingCaseToObject('LIST1', options);
    const configMultiple = alternatingCaseToObject('LIST1LIST2LIST3', options);

    assert.equal(Array.isArray(configEmpty.list), true);
    assert.equal(Array.isArray(configZero.list), true);
    assert.equal(Array.isArray(configOne.list), true);
    assert.equal(Array.isArray(configMultiple.list), true);
    assert.equal(Array.isArray(configEmpty.list) && configEmpty.list.length, 0);
    assert.equal(Array.isArray(configZero.list) && configZero.list.length, 0);
    assert.equal(Array.isArray(configOne.list) && configOne.list.length, 1);
    assert.equal(
      Array.isArray(configMultiple.list) && configMultiple.list.length,
      3
    );
    assert.equal(
      Array.isArray(configMultiple.list) && configMultiple.list[1],
      2
    );
  });

  it('allows arrayProps to be a string (representing a single prop)', () => {
    const config = alternatingCaseToObject('LIST1LIST2LIST3', {
      arrayProps: 'list',
    });

    assert.equal(Array.isArray(config.list), true);
    assert.equal(Array.isArray(config.list) && config.list.length, 3);
  });

  it('allows arrayProps to contain props in propMap', () => {
    const config = alternatingCaseToObject('LIST1LIST2LIST3', {
      arrayProps: 'things',
      propMap: {
        list: 'things',
      },
    });

    assert.equal(Array.isArray(config.things), true);
    assert.equal(Array.isArray(config.things) && config.things.length, 3);
  });

  it('throws an error when an array prop has differing types', () => {
    const throws = () => alternatingCaseToObject('LIST1LISTtwo');
    assert.throws(throws);
  });
});
