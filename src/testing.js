module.exports = function (h5_test) {
  h5_test.check = check;
  h5_test.test = test;

  function check(arq) {
    h5_test.file(arq);
  }

  function test(arq) {
    h5_test.file(arq);
  }
}
