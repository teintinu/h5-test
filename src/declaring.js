/* jslint node: true */
/* global scenarios, featureFile */

"use strict";

/* este módulo integra yadda, mocha e chai */

var Yadda = require('yadda'),
  chai = require('chai'),
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf'),
  asap = require('asap');

chai.use(require('chai-subset'));

module.exports = function (h5_test, localization) {

  Yadda.localisation.default = Yadda.localisation[localization];
  var expect = chai.expect;

  h5_test.chai = chai;
  h5_test.declare_tests = declare_tests;

  function declare_tests(callback) {
    var library = search_steps();
    search_features(library, function (err) {
      expect(err).to.not.exists;
      return callback();
    });
  }

  /* procura todos os arquivos .feature e integra com o mocha */

  function search_features(library, callback) {

    h5_test.run_only = undefined;
    h5_test.run_skips = 0;

    var feature_dir = h5_test.root + '/test/features';
    var case_id_gen = 0;

    rimraf(h5_test.temp_root + '*', function (err) {

      expect(err).to.not.exist;

      new Yadda.FeatureFileSearch(feature_dir).each(function (file) {

        console.log(file);
        var parser = new Yadda.parsers.FeatureFileParser(Yadda.localisation.default);
        var feature = parser.parse(file);
        feature.scenarios.some(function (scenario) {
          if (scenario.annotations.only) {
            h5_test.run_only = scenario;
            return true;
          }
        });

        var yadda = Yadda.createInstance(library);
        var idx_scenario = -1;

        asap(exec_next_scenario);

        function exec_next_scenario(err) {

          idx_scenario++;
          if (err || idx_scenario >= feature.scenarios.length)
            return callback(err);

          var scenario = feature.scenarios[idx_scenario];
          if (scenario.annotations.pending || (h5_test.run_only && h5_test.run_only != scenario)) {
            h5_test.run_skips++;
            return asap(exec_next_scenario);
          }
          console.log('  ' + scenario.title);

          var idx_step = -1;
          var case_id = '00000' + (++case_id_gen);
          case_id = case_id.substr(case_id.length - 5);
          var case_folder = path.basename(file, '.feature') + '_' + case_id + '/';

          h5_test.case_id = case_id;
          h5_test.temp = h5_test.temp_root + case_folder;

          h5_test.galen_case = {
            scenario: scenario,
            case_id: case_id,
            case_folder: case_folder,
            stmts: []
          };
          h5_test.galen_cases.push(h5_test.galen_case);

          asap(exec_next_step);

          function exec_next_step(err) {
            idx_step++;
            if (err || idx_step >= scenario.steps.length)
              exec_next_scenario(err);
            else {
              yadda.run(scenario.steps[idx_step], exec_next_step);
            }
          }
        }
      });
    });
  }

  /**
    pesquisa todos arquivos na pasta test/steps e executa a função exporta com (library, expect)
  */
  function search_steps(steps, library) {
    if (!library) library = create_library();

    var steps_dir = h5_test.root + '/test/steps';

    var files = fs.readdirSync(steps_dir);
    files.forEach(function (file) {
      var step = require(steps_dir + '/' + file);
      step(library, chai.expect, h5_test);
    });

    return library;
  }

  function create_library() {
    var cases = {};

    var dictionary = new Yadda.Dictionary()
      .define('CASE', /(\w+)/, function unique(key, next) {
        if (cases[key])
          return next(new Error('Duplicated key: ' + key));
        cases[key] = true;
        next(null, key);
      });

    return Yadda.localisation.default.library(dictionary);
  }

}
