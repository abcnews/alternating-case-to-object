# Alternating Case to Object

A function to convert alternating case (`"ALTERNATINGcase"`) strings to objects
(`{alternating: 'case'}`) and vice versa.

The ACTO string format supports numbers, bools, nulls, and lowercase
strings (a-z0-9), as standalone values or as arrays.

This library provides a `parse` and `stringify` method to convert objects from
and to strings respectively.

## Usage

1. Install with `npm i @abcnews/alternating-case-to-object`
2. Import the library with `import {parse, stringify} from '@abcnews/alternating-case-to-object'`

### Convert an object to a string

```js
stringify({
  prop: 'value',
  second: 'thing',
  allowed: true,
  things: [100, 101],
});

// "PROPvalueSECONDthingALLOWEDyesTHINGS100THINGS101"
```

### Options

#### propMap:Object

Props in the config will be renamed if they occur in this object. Note the
propMap is the same format as you pass to `parse()`, so the map is applied in
the opposite direction.

```javascript
stringify(
  {
    'kebab-case': 'value',
  },
  {
    propMap: {
      kebabcase: 'kebab-case',
    },
  }
);

// "KEBABCASEvalue"
```

### Parse a string to an object

```javascript

parse('PROPvalueSECONDthingALLOWEDyesTHINGS100');

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
parse('GROUPfirstGROUPsecondGROUPthird');

// >>>

{
  group: ['first', 'second', 'third'];
}
```

Every value in a prop which appears multiple times must be of the same type or an exception will be thrown. For example, this will throw:

```javascript
parse('AtrueAstr');
```

### Options

#### arrayProps:Array

Props in this array will always be returned as arrays, even if they occur in the config string zero or one time.

```javascript
parse('AtrueAfalseBvalueAtrueDvalue', {
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
parse('CAMELCASEtrueKEBABCASE100', {
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
