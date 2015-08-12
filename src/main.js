var argv = require('yargs')
  .usage('Uso: $0 <cmd> [options]') // usage string of application.
  .option('type', {
    alias: 't',
    describe: 'Tipo do teste (local/selenium)',
    choices: ['local', 'selenium'],
    default: 'selenium'
  })
  .option('h', {
    description: 'IP do servidor',
    default: '192.168.25.102',
    alias: 'host'
  })
  .option('s', {
    description: 'tamanho da tela',
    default: '1024x768',
    alias: 'size'
  })
  .option('?', {
    alias: 'help',
    description: 'display help message'
  })
  .help('help')
//  .demand(1)
//  .version('1.0.1', 'version', 'display version information') // the version string.
//  .alias('version', 'v')
  // show examples of application in action.
//  .example('npm install npm@latest -g', 'install the latest version of npm')
  // final message to display when successful.
  .epilog('for more information visit https://github.com/thr0w/h5-test/')
  // disable showing help on failures, provide a final message
  // to display for errors.
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help')
  .argv;

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
  h5_test.argv = argv;

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
