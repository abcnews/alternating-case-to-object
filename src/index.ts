type ACTOPrimativeValue = boolean | number | string | null;
type ACTOPrimativeArray = boolean[] | number[] | string[];
type ACTOValue = ACTOPrimativeValue | ACTOPrimativeArray;
type ACTOObject = {
  [key: string]: ACTOValue;
};

type PropMap = {
  [key: string]: string;
};

type ACTOOptions = {
  propMap?: PropMap;
  arrayProps?: string[] | string;
  noTypeGuessing?: string[] | string;
};

const makeArray = (val: string | string[]) =>
  typeof val === 'string' ? [val] : val;

export function alternatingCaseToObject(
  string: string,
  { propMap = {}, arrayProps = [], noTypeGuessing = [] }: ACTOOptions = {}
): ACTOObject {
  const config = string.match(/[A-Z]+([0-9a-z]|$)+/g) || [];

  // Convert a string to arrays for selected options.
  arrayProps = makeArray(arrayProps);
  noTypeGuessing = makeArray(noTypeGuessing);

  const result: ACTOObject = config
    .map((str: string) => {
      const [, keyStr, valueStr] = str.match(/^([A-Z]+)([0-9a-z]*$)/) || [];

      if (typeof keyStr !== 'string' || typeof valueStr !== 'string') {
        throw new Error('Error reading key/value pair');
      }

      const key = propMap[keyStr.toLowerCase()] || keyStr.toLowerCase();

      // Do some type guessing
      const value: ACTOPrimativeValue = noTypeGuessing.includes(key)
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
    .reduce((obj, { key, value }, _, arr) => {
      // Get out early if we've already done this key
      if (typeof obj[key] !== 'undefined') return obj;

      const allKeyValues = arr
        .filter(({ key: k }) => k === key)
        .map((d) => d.value);

      const makeArray = arrayProps.includes(key) || allKeyValues.length > 1;

      if (makeArray) {
        const err = new Error(
          "Inconsistent types in array property '" + key + "'"
        );

        if (typeof value === 'string') {
          const vals: string[] = allKeyValues.filter(
            (d): d is string => typeof d === 'string'
          );
          if (vals.length !== allKeyValues.length) throw err;
          obj[key] = vals;
        }

        if (typeof value === 'number') {
          const vals: number[] = allKeyValues.filter(
            (d): d is number => typeof d === 'number'
          );
          if (vals.length !== allKeyValues.length) throw err;
          obj[key] = vals;
        }

        if (typeof value === 'boolean') {
          const vals: boolean[] = allKeyValues.filter(
            (d): d is boolean => typeof d === 'boolean'
          );
          if (vals.length !== allKeyValues.length) throw err;
          obj[key] = vals;
        }
      } else {
        obj[key] = value;
      }

      return obj;
    }, {} as ACTOObject);

  arrayProps.forEach((key) => {
    if (typeof result[key] === 'undefined') {
      result[key] = [];
    }
  });

  return result;
}

export default alternatingCaseToObject;
