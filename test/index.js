var Lab       = require('lab')
  , Code      = require('code')
  , Composer = require('../index')
  , expect    = Code.expect
  , lab       = exports.lab = Lab.script();


lab.experiment('App', function () {

    lab.test('should compose a server', function (done) {

        Composer(function (err, composedServer) {

            Code.expect(composedServer).to.be.an.object();

            done(err);
        });
    });
});