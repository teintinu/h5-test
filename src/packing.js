/* jslint node: true */
/* global scenarios, featureFile */

"use strict";

/* este módulo executa a compactação pelo webpack */

var webpack = require('webpack'),
  webpack_convert_argv = require('../node_modules/webpack/bin/convert-argv'),
  optimist = require("optimist"),
  config_optimist = require('../node_modules/webpack/bin/config-optimist')(optimist),
  expect = require('chai').expect,
  fs = require('fs');

module.exports = function (h5_test) {
  h5_test.pack = pack;

  function pack(configPath, callback) {

    h5_test.file(configPath + '/webpack.config.js');

    process.chdir(this.temp + configPath);

    var argv = optimist.argv;
    var options = webpack_convert_argv(optimist, argv);
    options.context = h5_test.temp + configPath;

    var compiler = webpack(options);
    var outputOptions = {
      context: h5_test.temp + configPath
    }

    compiler.run(function (err, stats) {
      expect(err, 'err').to.be.not.ok;
      //process.stdout.write(stats.toString(outputOptions) + "\n");

      var result = stats.toJson(outputOptions);
      expect(result.errors).to.be.eql([]);

      expect(
        fs.existsSync(h5_test.temp + configPath + '/bundle.js'),
        'bundle.js deve existir').to.be.ok;
      callback();
    });
  }
}
