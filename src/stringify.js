/**
 * @typedef {import('./types.js').ACTOObject} ACTOObject
 */

import { makeArray } from './utils.js';

/**
 * Strip unsafe string characters
 * @param {any} str
 */
const safeString = (str) => {
  const safeString = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (safeString !== str) {
    throw new Error(`Illegal characters found: "${str}"`);
  }
  return str;
};

/**
 * Encode an object to ACTO string.
 *
 * This supports strings (lowercase, [a-z0-9] only), bools, numbers, and arrays
 * of the above. This is a lossy process and will remove undefined values and
 * sanitise strings to these criteria.
 *
 * @param {ACTOObject} obj - object containing arbitrary keys & values to encode
 * @param {object} options
 * @param {Object<string, string>} [options.propMap] - Props in the config will
 *         be renamed if they occur in this object. This is the same propMap as
 *         used in `parse()`, except it's used to map in the opposite direciton.
 * @returns {string} - ACTO encoded string
 */
export default function stringify(obj, options = {}) {
  /** @type {Object<string,string>} */
  const propMap = Object.entries(options.propMap || {}).reduce(
    (props, [key, value]) => {
      return { ...props, [value]: String(key) };
    },
    {}
  );
  return Object.entries(obj)
    .flatMap(([keyStr, value]) => {
      if (typeof value === 'undefined' || value === null) {
        return [];
      }
      const key = propMap[keyStr] || keyStr;
      const arrayValue = makeArray(value);
      return arrayValue.map((thisValue) =>
        [safeString(key).toUpperCase(), safeString(thisValue)].join('')
      );
    })
    .join('');
}
