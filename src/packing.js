/* jslint node: true */
/* global scenarios, featureFile */

"use strict";

/* este módulo executa a compactação pelo webpack */

var webpack = require('webpack'),
  webpack_convert_argv = require('./node_modules/webpack/bin/convert-argv'),
  optimist = require("optimist"),
  require('./node_modules/webpack/bin/config-optimist')(optimist),
  expect = require('chai').expect;

h5_test.prototype.webpack = function (h5_test) {
  h5_test.pack = pack;

  function pack(configPath, callback) {

    h5_test.file(configPath + '/webpack.config.js');

    //process.chdir(this.temp + configPath);

    //var config = require(this.root + '/temp/' + configfile);

    var argv = optimist.argv;
    var options = webpack_convert_argv(optimist, argv);
    options.context = this.temp + configPath;

    var compiler = webpack(options);
    var outputOptions = {
      context: this.temp + configPath
    }

    compiler.run(function (err, stats) {
      expect(err, 'err').to.be.not.ok;
      //process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
      process.stdout.write(stats.toString(outputOptions) + "\n");

      expect(
        fs.existsSync(_this.root + '/temp/app/bundle.js'),
        'bundle.js deve existir').to.be.ok;
      callback();
    });
  }
}
