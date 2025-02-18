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
export default function parse(string, options) {
    if (options === void 0) { options = {}; }
    var _a = options.propMap, propMap = _a === void 0 ? {} : _a, _b = options.arrayProps, arrayProps = _b === void 0 ? [] : _b, _c = options.noTypeGuessing, noTypeGuessing = _c === void 0 ? [] : _c;
    var config = string.match(/[A-Z]+([0-9a-z]|$)+/g) || [];
    // Convert a string to arrays for selected options.
    arrayProps = makeArray(arrayProps);
    noTypeGuessing = makeArray(noTypeGuessing);
    var result = config
        .map(function (str) {
        var _a = str.match(/^([A-Z]+)([0-9a-z]*$)/) || [], keyStr = _a[1], valueStr = _a[2];
        if (typeof keyStr !== 'string' || typeof valueStr !== 'string') {
            throw new Error('Error reading key/value pair');
        }
        var key = propMap[keyStr.toLowerCase()] || keyStr.toLowerCase();
        // Do some type guessing
        var value = noTypeGuessing.includes(key)
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
        return { key: key, value: value };
    })
        .reduce(
    /** @param {Object<string,any>} obj */
    function (obj, _a, _, arr) {
        var key = _a.key, value = _a.value;
        // Get out early if we've already done this key
        if (typeof obj[key] !== 'undefined')
            return obj;
        var allKeyValues = arr
            .filter(function (_a) {
            var k = _a.key;
            return k === key;
        })
            .map(function (d) { return d.value; });
        var isArray = arrayProps.includes(key) || allKeyValues.length > 1;
        if (isArray) {
            var types = new Set(allKeyValues.map(function (val) { return typeof val; }));
            if (types.size > 1) {
                throw new Error("Inconsistent types in array property '".concat(key, "'"));
            }
            obj[key] = allKeyValues;
        }
        else {
            obj[key] = value;
        }
        return obj;
    }, {});
    arrayProps.forEach(function (key) {
        if (typeof result[key] === 'undefined') {
            result[key] = [];
        }
    });
    return result;
}
//# sourceMappingURL=parse.js.map