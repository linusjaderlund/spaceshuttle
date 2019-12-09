// dependencies
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const read = (path) => promisify(fs.readFile)(path, 'utf8');
const exists = promisify(fs.exists);
const pwd = process.cwd();

// configuration
const localConfigPath = path.join(pwd, 'sftp.json');

// helpers
const readLocalConfig = async () => {
  try {
    if (!(await exists(localConfigPath))) {
      return {};
    }
  
    const json = await read(localConfigPath);
    return JSON.parse(json);
  } catch (error) {
    console.error(error);
  }
};

const addPrivateKey = async (config) => {
  try {
    const { privateKey } = config;

    if (!privateKey) {
      return config;
    }
    
    return {...config, privateKey: await read(privateKey)};
  } catch (error) {
    console.error(error);
  }
};

// config library
const lib = {};

lib.build = async (arguments) => {
  const acceptedConfigKeys = ['host', 'port', 'username', 'password', 'privateKey', 'passphrase'];
  const localConfig = await readLocalConfig();
  const argumentConfig = {};

  for (const argument of arguments) {
    const [key, value] = argument.split('=');

    if (!key || !value || !acceptedConfigKeys.includes(key)) {
      continue;
    }

    argumentConfig[key.trim()] = value.trim();
  }

  return await addPrivateKey({...localConfig, ...argumentConfig});
};

// export module
module.exports = lib;