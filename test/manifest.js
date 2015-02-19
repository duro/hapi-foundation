var Lab       = require('lab')
  , Code      = require('code')
  , Manifest  = require('../manifest')
  , expect    = Code.expect
  , lab       = exports.lab = Lab.script();

lab.experiment('Manifest', function () {

    lab.test('should get manifest data', function (done) {

        Code.expect(Manifest.get('/')).to.be.an.object();

        done();
    });


    lab.test('should get manifest meta data', function (done) {

        Code.expect(Manifest.meta('/')).to.match(/Our main server manifest/i);

        done();
    });
});