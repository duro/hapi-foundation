var Glue = require('glue');
var Manifest = require('./manifest');

var composeOptions = {
    relativeTo: __dirname
};

var Composer = module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);

if (!module.parent) {
  Composer(function(err, server) {
    if (err) throw err;
    server.start(function () {
      server.log(['server', 'info'], 'Server started at ' + server.info.uri);
    });
  })
}


// var Hapi      = require('hapi')
//   , Hoek      = require('hoek')
//   , P         = require('bluebird')
//   , AppConfig = require('./config');

// // Create a server
// var server = new Hapi.Server();

// console.log('App Environment: ' + process.env.NODE_ENV);

// // Create connection
// server.connection({
//     host: AppConfig.get('/server/host'),
//     port: AppConfig.get('/server/port')
// });

// // Load plugins
// function boot() {
//   return new P(function(resolve, reject) {
//     server.register(
//       require('./lib/plugins')(server),
//       function (err) {
//         // Handle error
//         if (err) {
//           console.error(err);
//           return reject(err);
//         }

//         // Setup Auth strategies


//         // Start server (if not being included by test Lab)
//         if (!module.parent) {
//           server.start(function () {
//             server.log(['server', 'info'], 'Server started at ' + server.info.uri);
//             return resolve(server);
//           });
//         } else {
//           return resolve(server);
//         }
//       }
//     );
//   });
// }


// module.exports = {
//   server: server,
//   boot: boot()
// };
