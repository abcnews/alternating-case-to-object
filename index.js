module.exports = function(string, options) {
  var config = string.match(/[A-Z]+[0-9a-z]+/g);

  if (typeof options !== 'object') {
    options = {};
  }

  if (typeof options.propMap !== 'object') {
    options.propMap = {};
  }

  var o = {};

  if (typeof options.arrayProps === 'string') {
    options.arrayProps = [options.arrayProps];
  } else if (!Array.isArray(options.arrayProps)) {
    options.arrayProps = [];
  }

  // Initialise arrays, accounting for mapped props in arrayProps
  options.arrayProps.forEach(function(prop) {
    o[options.propMap[prop] || prop] = [];
  });

  // Exit early if possible, with any empty arrays defined in arrayProps
  if (!config) return o;

  config.forEach(function(match) {
    var pairs = match.match(/([A-Z]+)([0-9a-z]+)/);
    var prop = pairs[1].toLowerCase();
    var value = pairs[2];

    prop = options.propMap[prop] || prop;

    // Do some type guessing
    if (parseFloat(value).toString() === value) {
      value = parseFloat(value);
    } else if (value === 'true' || value === 'yes') {
      value = true;
    } else if (value === 'false' || value === 'no') {
      value = false;
    }

    if (o[prop]) {
      // Prop exists so assume it should be an array
      if (!Array.isArray(o[prop])) {
        o[prop] = [o[prop]];
      }
      o[prop].push(value);
    } else {
      o[prop] = value;
    }
  });

  return o;
};
