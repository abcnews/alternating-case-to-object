type ACTOPrimativeValue = boolean | number | string | null;
type ACTOPrimativeArray = (boolean | number | string | null)[];
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
};

export default function(
  string: string,
  { propMap = {}, arrayProps = [] }: ACTOOptions = {}
): ACTOObject {
  const config = string.match(/[A-Z]+([0-9a-z]|$)+/g);

  const o: ACTOObject = {};

  if (typeof arrayProps === 'string') {
    arrayProps = [arrayProps];
  } else if (!Array.isArray(arrayProps)) {
    arrayProps = [];
  }

  // Initialise arrays, accounting for mapped props in arrayProps
  arrayProps.forEach(function(prop) {
    o[propMap[prop] || prop] = [];
  });

  // Exit early if possible, with any empty arrays defined in arrayProps
  if (config === null) return o;

  config.forEach(function(match) {
    let pairs = match.match(/([A-Z]+)(([0-9a-z]|$)+)/);
    if (pairs === null) return;
    let prop: string = pairs[1].toLowerCase();
    let value: ACTOPrimativeValue = pairs[2];

    prop = propMap[prop] || prop;

    // Do some type guessing
    if (parseFloat(value).toString() === value) {
      value = parseFloat(value);
    } else if (value === 'true' || value === 'yes') {
      value = true;
    } else if (value === 'false' || value === 'no') {
      value = false;
    } else if (value === '') {
      value = null;
    }

    let propVal = o[prop];

    if (propVal !== undefined) {
      // Prop exists so assume it should be an array
      if (!Array.isArray(propVal)) {
        propVal = [propVal];
      }
      propVal.push(value);
    } else {
      propVal = value;
    }
    o[prop] = propVal;
  });

  return o;
}
