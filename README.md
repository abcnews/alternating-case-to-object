# Alternating Case to Object

A function to convert ALTERNATINGcase strings to objects.

## Usage

```sh
npm i @abcnews/alternating-case-to-object
```

```javascript
const alternatingCaseToObject = require('@abcnews/alternating-case-to-object');

alternatingCaseToObject('PROPvalueSECONDthingALLOWEDyesTHINGS100');

// >>>

{
  prop: 'value',
  second: 'thing',
  allowed: true,
  things: 100
}
```

#### Automatic type inference

- Number values will be parsed as floats.
- The values `"true"`, `"yes"`, `"false"` & `"no"` will be converted to the booleans `true`, `true`, `false` & `false`, respectively.
- If a prop appears more than once, multiple values will be returned as an array:

```javascript
alternatingCaseToObject('GROUPfirstGROUPsecondGROUPthird');

// >>>

{
  group: ['first', 'second', 'third'];
}
```

Every value in a prop which appears multiple times must be of the same type or an exception will be thrown. For example, this will throw:

```javascript
alternatingCaseToObject('AtrueAstr');
```

### Options

You can pass an object as a second argument, defining one or more options:

#### arrayProps:Array

Props in this array will always be returned as arrays, even if they occur in the config string zero or one time.

```javascript
alternatingCaseToObject('AtrueAfalseBvalueAtrueDvalue', {
  arrayProps: ['a', 'b', 'c']
});

// >>>

{
  a: [true, false, true],
  b: ['value'],
  c: [],
  d: 'value'
}
```

#### propMap:Object

Props in the config will be renamed if they occur in this object.

```javascript
alternatingCaseToObject('CAMELCASEtrueKEBABCASE100', {
  propMap: {
    camelcase: 'camelCase',
    kebabcase: 'kebab-case'
  }
});

// >>>

{
  camelCase: true,
  'kebab-case': 100
}
```
