var Lab       = require('lab')
  , Code      = require('code')
  , AppConfig = require('../config')
  , expect    = Code.expect
  , lab       = exports.lab = Lab.script();

lab.experiment('Config', function () {

    lab.test('should get config data', function (done) {

        expect(AppConfig.get('/')).to.be.an.object();

        done();
    });


    lab.test('should get config meta data', function (done) {

        expect(AppConfig.meta('/')).to.match(/Our main Application config/i);

        done();
    });
});