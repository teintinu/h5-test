module.exports = function (h5_test) {
  h5_test.check = check;
  h5_test.run = run;
  h5_test.wait = wait;
  h5_test.open = open;
  h5_test.resize = resize;
  h5_test.inject = inject;
  h5_test.dump = dump;

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

  function open(url) {
    h5_test.galen_case.stmts.push({
      open: timeout
    });
  }

  function resize(size) {
    h5_test.galen_case.stmts.push({
      resize: size
    });
  }

  function inject(script) {
    h5_test.file(arq);
    h5_test.galen_case.stmts.push({
      inject: script
    });
  }

  function dump(spec) {
    h5_test.galen_case.stmts.push({
      dump: spec
    });
  }
}
