module.exports = function(string) {
  var config = string.match(/[A-Z]+[0-9a-z]+/g);

  if (!config) return {};

  var o = {};

  config.forEach(function (match) {
    var pairs = match.match(/([A-Z]+)([0-9a-z]+)/);
    var key = pairs[1].toLowerCase();
    var value = pairs[2];

    // Do some type guessing
    if (parseFloat(value).toString() === value) {
      value = parseFloat(value);
    } else if (value === 'true' || value === 'yes') {
      value = true;
    } else if (value === 'false' || value === 'no') {
      value = false;
    }

    if (o[key]) {
      // Key exists so treat it as a list
      if (!(o[key] instanceof Array)) {
        o[key] = [o[key]];
      }
      o[key].push(value);
    } else {
      o[key] = value;
    }
  });

  return o;
};
