/**
 * @typedef {import('./types.js').ACTOObject} ACTOObject
 * @typedef {import('./types.js').ACTOValue} ACTOValue
 * @typedef {import('./types.js').ACTOPrimativeValue} ACTOPrimativeValue
 */

import { makeArray } from './utils.js';

/**
 * @param {string} string - ACTO string to decode
 * @param {object} [options] - options object
 * @param {Object<string, string>} [options.propMap] - Props in the config will be renamed if they occur in this object.
 * @param {string | string[]} [options.arrayProps] - Props in this array will always be returned as arrays, even if they occur in the config string zero or one time.
 * @param {string | string[]} [options.noTypeGuessing] - Props in this array will be returned verbatim as strings
 * @returns {ACTOObject} object representing decoded version of the string
 */
export default function parse(string, options = {}) {
  let { propMap = {}, arrayProps = [], noTypeGuessing = [] } = options;
  const config = string.match(/[A-Z]+([0-9a-z]|$)+/g) || [];

  // Convert a string to arrays for selected options.
  arrayProps = makeArray(arrayProps);
  noTypeGuessing = makeArray(noTypeGuessing);

  const result = config
    .map((str) => {
      const [, keyStr, valueStr] = str.match(/^([A-Z]+)([0-9a-z]*$)/) || [];

      if (typeof keyStr !== 'string' || typeof valueStr !== 'string') {
        throw new Error('Error reading key/value pair');
      }

      const key = propMap[keyStr.toLowerCase()] || keyStr.toLowerCase();

      // Do some type guessing
      const value = noTypeGuessing.includes(key)
        ? valueStr
        : parseFloat(valueStr).toString() === valueStr
        ? parseFloat(valueStr)
        : valueStr === 'true' || valueStr === 'yes'
        ? true
        : valueStr === 'false' || valueStr === 'no'
        ? false
        : valueStr === ''
        ? null
        : valueStr;

      return { key, value };
    })
    .reduce(
      /** @param {Object<string,any>} obj */
      (obj, { key, value }, _, arr) => {
        // Get out early if we've already done this key
        if (typeof obj[key] !== 'undefined') return obj;

        const allKeyValues = arr
          .filter(({ key: k }) => k === key)
          .map((d) => d.value);

        const isArray = arrayProps.includes(key) || allKeyValues.length > 1;

        if (isArray) {
          const types = new Set(allKeyValues.map((val) => typeof val));
          if (types.size > 1) {
            throw new Error(`Inconsistent types in array property '${key}'`);
          }
          obj[key] = allKeyValues;
        } else {
          obj[key] = value;
        }

        return obj;
      },
      {}
    );

  arrayProps.forEach((key) => {
    if (typeof result[key] === 'undefined') {
      result[key] = [];
    }
  });

  return result;
}
