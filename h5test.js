/* jslint node: true */
/* global scenarios, featureFile */

"use strict";

var Yadda = require('yadda'),
  path = require('path'),
  fs = require('fs'),
  chai = require('chai'),
  chaiSubset = require('chai-subset');

chai.use(chaiSubset);

/** função principal do h5_test */

function h5_test(root, localization) {

  this.root = root;
  this.replaces = [];

  Yadda.localisation.default = Yadda.localisation[localization];
  Yadda.plugins.mocha.ScenarioLevelPlugin.init();

  root = path.resolve(root);

  var library = search_steps(this, root + '/test/steps');
  search_features(root + '/test/features', library);
}

/* define quais variáveis serão substituidas pelo generate */

h5_test.prototype.replace = function (match, value) {
  this.replaces.push({
    match: match,
    value: value
  });
};

/* gera arquivos da pasta template para a pasta temp substituindo variaveis */

h5_test.prototype.generate = function () {
  for (var i = 0; i < arguments.length; i++) {
    this.generate_file(arguments[i]);
  }
};

h5_test.prototype.generate_file = function (arq) {

  var conteudo = fs.readFileSync(this.root + '/test/template/' + arq, {
    encoding: 'utf8'
  });

  for (var variavel in this.replaces) {
    var valor = this.replaces[variavel];
    if (typeof valor !== 'string') {
      valor = JSON.stringify(valor);
    }
    conteudo = conteudo.replace(
      new RegExp(variavel, 'g'), valor);
  }

  fs.writeFileSync(path.resolve(this.root + '/temp/' + arq), conteudo, {
    encoding: 'utf8'
  });

};

/* procura todos os arquivos .feature e integra com o mocha */

function search_features(features, library) {


  new Yadda.FeatureFileSearch(features).each(function (file) {
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
            else
              yadda.run(scenario.steps[idx], exec_next_step);
          }
        });
    });
  });

}

/**
  pesquisa todos arquivos na pasta test/steps e executa a função exporta com (library, expect)
*/
function search_steps(h5_test, steps, library) {
  if (!library) {
    library = Yadda.localisation.default.library();
  }

  var files = fs.readdirSync(steps);
  files.forEach(function (file) {
    var step = require(steps + '/' + file);
    step(library, chai.expect, h5_test);
  });

  return library;
}

module.exports = h5_test;
