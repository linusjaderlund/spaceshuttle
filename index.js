// dependencies
const config = require('./lib/config');
const deploy = require('./lib/deploy');

(async function () {
  // arguments
  const arguments = process.argv.filter((item, index) => index > 1);
  // config
  const serverConfig = await config.build(arguments);
  // start client
  deploy.init(serverConfig);
}());

