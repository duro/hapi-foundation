module.exports = function(server) {

  // Add the route
  server.route({
      method: 'GET',
      path:'/whammy',
      handler: function (request, reply) {
        reply('whammy');
      }
  });

}