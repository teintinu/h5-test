var express = require('express'),
  network = require('network'),
  expect = require('chai').expect;

module.exports = function (h5_test) {
  h5_test.serve = serve;
  h5_test.start_server = start_server;
  h5_test.stop_server = stop_server;

  var app_express = express(),
    server;

  function serve(arq) {
    h5_test.file(arq);

    app_express.get(h5_test.case_id, function (req, res) {
      res.redirect(h5_test.case_id + '/');
    });

    app_express.use(h5_test.case_id + '/', express.static(h5_test.temp_root));

    app_express.get(h5_test.case_id + '/', function (req, res) {
      res.send('index.html');
    });
  }


  function start_server(callback) {
    network.get_interfaces_list(function (err, myips) {
      expect(err).to.not.exist;
      var myip = myips.filter(function (i) {
        return i.ip_address && i.ip_address.match(/^192\.168\.25.\d\d?\d?$/);
      });
      expect(myip).to.have.length(1);
      myip = myip[0].ip_address;
      h5_test.listenning = {
        addr: myip,
        port: '48000'
      };

      console.log('Server running at ' + h5_test.listenning.addr + ':' + h5_test.listenning.port);
      server = app_express.listen(h5_test.listenning.port, h5_test.listenning.addr);
      callback();
    });
  }

  function stop_server(callback) {
    server.close();
  }
}
