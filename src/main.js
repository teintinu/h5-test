var declaring = require('./declaring.js'),
  templating = require('./templating.js'),
  packing = require('./packing.js');

module.init = function (root, localization) {


  this.root = path.resolve(root);
  this.temp_root = this.root + '/temp/test';

  declaring(this, localization);
  templating(this);
  templating(this);

  this.declare_tests();

}
