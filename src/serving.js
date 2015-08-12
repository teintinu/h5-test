var express = require('express'),
  network = require('network'),
  expect = require('chai').expect;

module.exports = function (h5_test) {
  h5_test.serve = serve;
  h5_test.start_server = start_server;
  h5_test.stop_server = stop_server;
    h5_test.cookie = function( cookieName, cookieValue)
    {
        cookies.push({name: cookieName, value: cookieValue, options: {path: '/'+h5_test.galen_case.case_folder}});
    }
  var app_express = express(),
    server, cookies = [];

  function serve(arq) {
    h5_test.file(arq);

    h5_test.galen_case.http_index = arq;


    //    app_express.get(h5_test.galen_case.case_folder, function (req, res) {
    //      res.redirect(h5_test.galen_case.case_folder + '/');
    //    });

    //    console.log('express '+h5_test.galen_case.case_folder + ' ---- '+h5_test.temp);

    //    app_express.use(h5_test.galen_case.case_folder  , express.static(h5_test.temp));

    //    app_express.get(h5_test.galen_case.case_folder + '/', function (req, res) {
    //      res.send('index.html');
    //    });
  }

  function start_server(callback) {
    network.get_interfaces_list(function (err, myips) {
      //expect(err).to.not.exist;
      if (err)
      {
        myip = '127.0.0.1';
      }
      else
      {
        var myip = myips.filter(function (i) {
          return i.ip_address && i.ip_address.match(/^192\.168\.25.\d\d?\d?$/);
        });
		if(myip.length == 0)
           myip = '127.0.0.1';
        else{
          expect(myip).to.have.length(1);
          myip = myip[0].ip_address;
        }
      }
      h5_test.listenning = {
        addr: myip,
        port: '48001'
      };

      server = app_express.listen(h5_test.listenning.port, h5_test.listenning.addr);


        cookies.forEach(function(cookie){
            app_express.use(cookie.options.path, function(req, res, next){
                res.cookie(cookie.name, cookie.value, cookie.options);
                next();
            });

        });


        app_express.use(express.static(h5_test.temp_root));

      h5_test.http_root = 'http://' + h5_test.listenning.addr + ':' + h5_test.listenning.port;
      console.log('Server running at: ' + h5_test.http_root);

      app_express.get('/', function (req, res, next) {
        res.set('Content-Type', 'text/html');
        res.write('<html><body>');
        h5_test.galen_cases.forEach(function (_case) {
          var link = h5_test.http_root + '/' + _case.case_folder;
          res.write('<a href="' + link + _case.http_index + '">' + _case.case_folder +
                    ' - ' + _case.scenario.title + '</a><br>');
        });

        res.write('<a href="' + h5_test.http_root + 'report/report.html">Relatório</a><br>');

        res.end('</body></html>');
      });

      callback();
    });
  }

  function stop_server(timeout) {
    //server.close();
  }
}
