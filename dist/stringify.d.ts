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
export default function stringify(obj: ACTOObject, options?: {
    propMap?: {
        [x: string]: string;
    } | undefined;
}): string;
export type ACTOObject = import('./types.js').ACTOObject;
//# sourceMappingURL=stringify.d.ts.map