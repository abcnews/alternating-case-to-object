import assert from 'assert';
import stringify from '../src/stringify.js';
import { propMap } from './constants.js';

describe('stringify', () => {
  it('should encode a string', () => {
    const res = stringify({ string: 'hello' });
    assert.equal(res, 'STRINGhello');
  });
  it('should encode a string w spaces (lossy)', () => {
    const res = stringify({ string: 'hello world' });
    assert.equal(res, 'STRINGhelloworld');
  });
  it('should encode a number', () => {
    const res = stringify({ num: 13 });
    assert.equal(res, 'NUM13');
  });
  it('should encode a boolean true', () => {
    const res = stringify({ boo: true });
    assert.equal(res, 'BOOtrue');
  });
  it('should encode a boolean false', () => {
    const res = stringify({ boo: false });
    assert.equal(res, 'BOOfalse');
  });
  it('should encode an array of strings', () => {
    const res = stringify({ arr: ['hi', 'hello', 'hej'] });
    assert.equal(res, 'ARRhiARRhelloARRhej');
  });
  it('should encode an array of numbers', () => {
    const res = stringify({ arr: [1, 2, 33] });
    assert.equal(res, 'ARR1ARR2ARR33');
  });
  it('should omit undefined values', () => {
    const res = stringify({ str: 'hello', undef: undefined });
    assert.equal(res, 'STRhello');
  });
  it('should map props', () => {
    const res = stringify(
      {
        'kebab-case': 1,
        snake_case: 2,
        camelCase: 3,
        PascalCase: 4,
        entirely: 5,
      },
      { propMap: propMap }
    );

    assert.equal(res, 'KEBABCASE1SNAKECASE2CAMELCASE3PASCALCASE4DIFFERENT5');
  });
});
