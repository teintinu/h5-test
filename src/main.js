var declaring = require('./declaring.js'),
  templating = require('./templating.js'),
  packing = require('./packing.js'),
  serving = require('./serving.js'),
  testing = require('./testing.js'),
  running = require('./running.js'),
  optimist = require("optimist"),
  path = require('path');

module.exports = function (root, localization) {

  var h5_test = this;

  h5_test.root = path.resolve(root);
  h5_test.temp_root = h5_test.root + '/temp/';
  h5_test.galen_cases = [];

  declaring(h5_test, localization);
  templating(h5_test);
  packing(h5_test);
  serving(h5_test);
  testing(h5_test);
  running(h5_test);

  var bug_run=false;
  h5_test.declare_tests(function () {
    if (bug_run){
      console.log('bug_run');
      return;
    }
    bug_run=true;
    h5_test.start_server(function () {
      h5_test.generate_test_file();
      h5_test.execute_galen(function (failed) {
        if (failed) {
          console.log('O servidor será finalizado em 60s');
          h5_test.stop_server(60000);
        } else
          h5_test.stop_server();
      });
    });
  });

}
