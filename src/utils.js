/**
 * @param {string | string[] | number | number[] | boolean | boolean[]} val
 * @returns {string[]}
 */
export const makeArray = (val) =>
  Array.isArray(val) ? val.map(String) : [String(val)];
