module.exports = function (h5_test) {
  h5_test.check = check;
  h5_test.run = run;
  h5_test.wait = wait;

  function check(arq) {
    h5_test.file(arq);
    h5_test.galen_case.stmts.push({
      check: arq,
      args: ''
    });
  }

  function run(arq, args) {
    h5_test.file(arq);
    h5_test.galen_case.stmts.push({
      run: arq,
      args: args ? "'" + JSON.stringify(args) + "'" : ''
    });
  }

  function wait(timeout) {
    h5_test.galen_case.stmts.push({
      wait: timeout
    });
  }
}
