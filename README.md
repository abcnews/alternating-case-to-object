# Alternating Case to Object

A function to convert ALTERNATINGcase strings to objects.

## Usage

```javascript
const alternatingCaseToObject = require('alternating-case-to-object');

const config = alternatingCaseToObject('KEYvalueSECONDthingALLOWEDyesTHINGS100');

/*
  config is

    {
      key: 'value',
      second: 'thing',
      allowed: true,
      things: 100
    }
    
*/
```