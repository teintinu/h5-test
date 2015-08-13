/* jslint node: true */
/* global scenarios, featureFile */

"use strict";

/* este módulo executa a compactação pelo webpack */

var webpack = require('webpack'),
    Module = require('module'),
    optimist = require("optimist"),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path');


var webpack_filename = Module._resolveFilename('webpack', module);
var webpack_folder = path.resolve(path.dirname(webpack_filename) + '/..');

var
    webpack_convert_argv = require(webpack_folder + '/bin/convert-argv'),
    config_optimist = require(webpack_folder + '/bin/config-optimist')(optimist);

module.exports = function (h5_test) {
    h5_test.pack = pack;

    function pack(configPath, callback) {


        console.log(configPath + '/webpack.config.js - PACKING');
        h5_test.file(configPath + '/webpack.config.js');

        process.chdir(this.temp + configPath);

        global.webpack = webpack;
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

            console.log(configPath + '/webpack.config.js - PACKED');

            var result = stats.toJson(outputOptions);
            if (result.errors.length) {
                console.log('webpack.config.js error:');
                result.errors.forEach(function (err) {
                    console.log('  ' + err);
                });
                expect(result.errors).to.be.eql([]);
            }
            expect(
                fs.existsSync(h5_test.temp + configPath + '/bundle.js'),
                'bundle.js deve existir').to.be.ok;
            callback();
        });

    }
}
