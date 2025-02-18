/**
 * @typedef {import('./types.js').ACTOObject} ACTOObject
 */
import { __assign } from "tslib";
import { makeArray } from './utils.js';
/**
 * Strip unsafe string characters
 * @param {any} str
 */
var safeString = function (str) {
    var safeString = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (safeString !== str) {
        throw new Error("Illegal characters found: \"".concat(str, "\""));
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
export default function stringify(obj, options) {
    if (options === void 0) { options = {}; }
    /** @type {Object<string,string>} */
    var propMap = Object.entries(options.propMap || {}).reduce(function (props, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        return __assign(__assign({}, props), (_b = {}, _b[value] = String(key), _b));
    }, {});
    return Object.entries(obj)
        .flatMap(function (_a) {
        var keyStr = _a[0], value = _a[1];
        if (typeof value === 'undefined' || value === null) {
            return [];
        }
        var key = propMap[keyStr] || keyStr;
        var arrayValue = makeArray(value);
        return arrayValue.map(function (thisValue) {
            return [safeString(key).toUpperCase(), safeString(thisValue)].join('');
        });
    })
        .join('');
}
//# sourceMappingURL=stringify.js.map