/**
 * @param {string} string - ACTO string to decode
 * @param {object} [options] - options object
 * @param {Object<string, string>} [options.propMap] - Props in the config will be renamed if they occur in this object.
 * @param {string | string[]} [options.arrayProps] - Props in this array will always be returned as arrays, even if they occur in the config string zero or one time.
 * @param {string | string[]} [options.noTypeGuessing] - Props in this array will be returned verbatim as strings
 * @returns {ACTOObject} object representing decoded version of the string
 */
export default function parse(string: string, options?: {
    propMap?: {
        [x: string]: string;
    } | undefined;
    arrayProps?: string | string[] | undefined;
    noTypeGuessing?: string | string[] | undefined;
} | undefined): ACTOObject;
export type ACTOObject = import('./types.js').ACTOObject;
export type ACTOValue = import('./types.js').ACTOValue;
export type ACTOPrimativeValue = import('./types.js').ACTOPrimativeValue;
//# sourceMappingURL=parse.d.ts.map