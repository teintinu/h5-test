/* jslint node: true */

var fs = require('fs'),
  path = require('path');

var test_folder = process.cwd() + '/test';

fs.readdirSync(test_folder).filter(function (file) {
  return file.substr(-3) === '.js';
}).forEach(function (file) {
  require(path.join(test_folder, file));
});

//var Mocha = require('mocha'),
//  fs = require('fs'),
//  path = require('path');
//
//var mocha = new Mocha({
//  timeout: 10000
//});
//
//fs.readdirSync('test').filter(function (file) {
//  return file.substr(-3) === '.js';
//}).forEach(function (file) {
//  mocha.addFile(
//    path.join('test', file)
//  );
//});
//
//mocha.run(function (failures) {
//  if (mocha.options.grep) {
//    console.warn('ATENÇÃO: Nem todos os testes foram executados\n  grep=('+mocha.options.grep+')');
//    failures++;
//  }
//  if (!mocha.run_galen_tests) {
//    console.error('ATENÇÃO: h5-test não foi iniciado corretamente');
//    failures++;
//    mocha.run_galen_tests = function (cb) {
//      cb()
//    };
//  }
//  mocha.run_galen_tests(function (err) {
//    if (err)
//      failures++;
//    process.on('exit', function () {
//      process.exit(failures);
//    });
//  });
//});
