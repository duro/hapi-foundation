module.exports = function(server) {

  return [
    require('./logging')(server),
    require('./mongoose')(server),
    require('./swagger')(server)
  ]

}