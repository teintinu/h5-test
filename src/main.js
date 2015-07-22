var declaring = require('./declaring.js'),
  templating = require('./templating.js'),
  packing = require('./packing.js'),
  serving = require('./serving.js'),
  testing = require('./testing.js'),
  path = require('path');

module.exports = function (root, localization) {


  this.root = path.resolve(root);
  this.temp_root = this.root + '/temp/test';

  declaring(this, localization);
  templating(this);
  packing(this);
  serving(this);
  testing(this);

  this.declare_tests();

}
