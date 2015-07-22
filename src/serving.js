module.exports = function (h5_test) {
  h5_test.serve = serve;
  function serve(arq){
    h5_test.file(arq);
  }
}
