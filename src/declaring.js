/* jslint node: true */
/* global scenarios, featureFile */

"use strict";

/* este módulo integra yadda, mocha e chai */

var Yadda = require('yadda'),
  chai = require('chai');

chai.use(require('chai-subset'));

module.exports = function (h5_test, localization) {

  Yadda.localisation.default = Yadda.localisation[localization];
  Yadda.plugins.mocha.ScenarioLevelPlugin.init();

  h5_test.chai = chai;
  h5_test.declare_tests = declare_tests;

  function declare_tests() {
    var library = search_steps();
    this.search_features(library);
  }

  /* procura todos os arquivos .feature e integra com o mocha */

  function search_features(library) {

    var feature_dir = root + '/test/features';
    var case_idx = 0;

    new Yadda.FeatureFileSearch(feature_dir).each(function (file) {
      featureFile(file, function (feature) {

        var yadda = Yadda.createInstance(library);

        scenarios(feature.scenarios,
          function (scenario_mocha, scenario, done) {
            var idx = -1;
            exec_next_step();

            function exec_next_step(err) {
              idx++;
              if (err || idx >= scenario.steps.length)
                done(err);
              else {
                var case_id = '00000' + (++case_idx),
                  case_id = case_id.substr(id.length - 5);
                this.temp = this.temp_root + case_id + '/';
                yadda.run(scenario.steps[idx], exec_next_step);
              }
            }
          });
      });
    });

  }

  /**
    pesquisa todos arquivos na pasta test/steps e executa a função exporta com (library, expect)
  */
  function search_steps(steps, library) {
    if (!library) library = create_library();

    var steps_dir = root + '/test/steps';

    var files = fs.readdirSync(steps_dir);
    files.forEach(function (file) {
      var step = require(steps_dir + '/' + file);
      step(library, chai.expect, this);
    });

    return library;
  }


  function create_library() {
    var cases = {};

    var dictionary = new Dictionary()
      .define('CASE', /(\w+)/, function unique(key, next) {
        if (cases[key])
          return next(new Error('Duplicated key: ' + key));
        cases[key] = true;
        next(null, key);
      });

    library = Yadda.localisation.default.library(dictionary);
    return library;
  }

}
