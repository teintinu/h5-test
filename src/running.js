var
  fs = require('fs'),
  expect = require('chai').expect;

module.exports = function (h5_test) {

  h5_test.generate_test_file = generate_test_file;
  h5_test.execute_galen = execute_galen;

  function generate_test_file() {
    var test_file = [
    '  @@ set',
    '    gridUrl         http://192.168.25.102:4444/wd/hub',
    '',
    '@@ table browsers',
    '    | browserName   | gridArgs                            |',
    '    | Firefox       | --browser "firefox"                 |',
    '    | Chrome        | --browser "chrome"                  |',
    ''
  ];

    h5_test.galen_cases.forEach(function (_case) {

      test_file.push('');
      test_file.push('@@ parameterized using browsers');
      test_file.push(_case.scenario.title + ' (${browserName})');
      test_file.push('  selenium grid ${gridUrl} --page ' +

        'http://' + h5_test.listenning.addr + ':' + h5_test.listenning.port + '/' + _case.case_folder

        +
        ' ${gridArgs}');

      _case.stmts.forEach(function (stmt) {
        if (stmt.check)
          test_file.push('     check ' + _case.case_folder + '/' + stmt.check);
        else if (stmt.test)
          test_file.push('     run ' + _case.case_folder + '/' + stmt.check)
        else
          expect(stmt).to.be.false;
      });
    });

    fs.writeFileSync(h5_test.temp_root + new Date().toISOString().replace(/:/g, '_') + '.test', test_file.join('\n'), 'utf-8');
  }

  function execute_galen(callback) {
    console.log('execute_galen: TODO');
  }

};
