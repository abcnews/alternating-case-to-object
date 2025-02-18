/**
 * @param {string | string[] | number | number[] | boolean | boolean[]} val
 * @returns {string[]}
 */
export var makeArray = function (val) {
    return Array.isArray(val) ? val.map(String) : [String(val)];
};
//# sourceMappingURL=utils.js.map