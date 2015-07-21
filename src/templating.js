/* jslint node: true */
/* global scenarios, featureFile */

"use strict";


/* este arquivo é responsável por gerar a aplicação na pasta temp
a partir da pasta template */

var fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp');

module.exports = function (h5_test) {
  var replaces = {};

  h5_test.replace = replace;
  h5_test.file = file;

  /* define quais variáveis serão substituidas pelo generate */

  function replace(match, value) {
    replaces[match] = value;
  }

  /* copia o arquivo de template para temp fazendo as substituições necessárias */

  function file(src) {

    var conteudo = fs.readFileSync(h5_test.root + '/test/template/' + src, {
      encoding: 'utf8'
    });

    for (var variavel in replaces) {
      var valor = replaces[variavel];
      if (typeof valor !== 'string') {
        valor = JSON.stringify(valor);
      }
      conteudo = conteudo.replace(
        new RegExp(variavel, 'g'), valor);
    }

    var output_file = path.resolve(h5_test.temp + src);
    var output_folder = path.dirname(output_file);
    mkdirp.sync(output_folder);

    fs.writeFileSync(output_file, conteudo, {
      encoding: 'utf8'
    });
  };
}
