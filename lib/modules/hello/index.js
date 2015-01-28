module.exports = function(server) {

  // Add the route
  server.route({
      method: 'GET',
      path:'/hello',
      handler: function (request, reply) {
        reply('hello world');
      }
  });

}