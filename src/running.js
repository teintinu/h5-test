var
  fs = require('fs'),
  path = require('path'),
  expect = require('chai').expect,
  child_process = require('child_process');

var galen_folder = path.resolve(__dirname + '/../node_modules/galenframework-cli');

module.exports = function (h5_test) {

  h5_test.generate_test_file = generate_test_file;
  h5_test.execute_galen = execute_galen;

  var isSelenioum = h5_test.argv.type == 'selenium';

  function generate_test_file() {
    var test_file = [];
    if (isSelenioum) {
      test_file = [
       '@@ set',
       '    gridUrl         http://192.168.25.102:4444/wd/hub',
       '',
       '@@ table browsers',
       '    | browserName   | gridArgs                            |',
       '    | Firefox       | --browser "firefox"                 |',
       '    | Chrome        | --browser "chrome"                  |',
       ''
      ];
    }

    h5_test.galen_cases.forEach(function (_case) {

      test_file.push('');
//        test_file.push('# '+ _case.scenario);
     if (isSelenioum) {
        test_file.push('@@ parameterized using browsers');
        test_file.push(_case.scenario.title + ' (${browserName})');
        test_file.push('  selenium grid ${gridUrl} --page ' +

        h5_test.http_root + '/' + _case.case_folder + _case.http_index +
        ' ${gridArgs}');
      }
      else {
         test_file.push(_case.scenario.title);
         test_file.push('  '+ h5_test.http_root + '/' + _case.case_folder + _case.http_index + ' ' + (_case.size ? _case.size : h5_test.argv.size))
      }

      _case.stmts.forEach(function (stmt) {
        if (stmt.check)
          test_file.push('     check ' + _case.case_folder + stmt.check);
        else if (stmt.run)
          test_file.push('     run ' + _case.case_folder + stmt.run + ' ' + stmt.args)
        else if (stmt.wait)
          test_file.push('     wait ' + stmt.wait)
        else if (stmt.open)
          test_file.push('     open ' + stmt.open)
        else if (stmt.resize)
          test_file.push('     resize ' + stmt.resize)
        else if (stmt.inject)
          test_file.push('     inject ' + _case.case_folder + stmt.inject)
        else if (stmt.dump && h5_test.dev_mode)
          test_file.push('     dump ' + stmt.dump)
        else
          expect(stmt, 'comando invalido para o galen use check ou run').to.be.false;
      });
    });

    h5_test.galen_test_file = h5_test.temp_root + new Date().toISOString().replace(/:/g, '_') + '.test';
    fs.writeFileSync(h5_test.galen_test_file, test_file.join('\n'), 'utf-8');
  }

  function execute_galen(callback) {

      if (h5_test.argv.generate)
      {
          console.log('galen nao foi executado');
          h5_test.stop_server(60000);
          return;
      } 
      
    var cmd = ['galen', 'test', h5_test.galen_test_file, //
               '--htmlreport', 'report', '--jsonreport', 'report'];

    console.log('executando testes');

    child_process.exec(cmd.join(' '), {
        cwd: h5_test.temp_root
      },
      function (err, stdout, stderr) {
        expect(err).to.not.exist;
        var result = JSON.parse(fs.readFileSync(h5_test.temp_root + '/report/report.json'));
        var failed = false,
          passed = 0,
          errors = 0,
          warnings = 0,
          duration = 0;
        result.tests.forEach(function (test) {
          if (test.failed)
            failed = true;
          passed += test.statistic.passed;
          errors += test.statistic.errors;
          warnings += test.statistic.warnings;
          duration += test.duration;
        });
        failed = failed || errors > 0;
        if (failed)
          console.log('Erro nos testes, acesse o relatório em: ' + h5_test.http_root + '/report/report.html');
        else
          console.log('SUCESSO!!! Acesse o relatório em: ' + h5_test.http_root + '/report/report.html');
        callback(failed);
      }
    );
  }

};
