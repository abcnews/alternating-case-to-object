/**
 * @typedef {import('./types.js').ACTOObject} ACTOObject
 */

/**
 * Strip unsafe string characters
 * @param {any} str
 */
const safeString = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

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
    .filter(([_, value]) => typeof value !== 'undefined')
    .flatMap(([keyStr, value]) => {
      const key = propMap[keyStr] || keyStr;
      const arrayValue = Array.isArray(value) ? value : [value];
      return arrayValue.map((thisValue) =>
        [safeString(key).toUpperCase(), safeString(thisValue)].join('')
      );
    })
    .join('');
}
