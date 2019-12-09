// dependencies
const config = require('./lib/config');

(async function () {
  // arguments
  const arguments = process.argv.filter((item, index) => index > 1);
  // config
  const serverConfig = await config.build(arguments);

  console.log(serverConfig);
}());

