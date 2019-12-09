// dependencies
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const read = (path) => promisify(fs.readFile)(path, 'utf8');
const exists = promisify(fs.exists);
const cwd = process.cwd();

// configuration
const localConfigPath = path.join(cwd, 'sftp.json');

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

const regenerate = async (config) => {
  try {
    let { privateKey, localPath } = config;

    localPath = path.join(cwd, localPath);

    if (privateKey) {
      privateKey = await read(privateKey);
    }
    
    return {...config, localPath, privateKey};
  } catch (error) {
    console.error(error);
  }
};

// config library
const lib = {};

lib.build = async (arguments) => {
  const acceptedConfigKeys = ['host', 'port', 'username', 'password', 'privateKey', 'passphrase', 'localPath', 'serverPath'];
  const defaultConfig = {port: 22, localPath: '', serverPath: ''};
  const localConfig = await readLocalConfig();
  const argumentConfig = {};

  for (const argument of arguments) {
    const [key, value] = argument.split('=');

    if (!key || !value || !acceptedConfigKeys.includes(key)) {
      continue;
    }

    argumentConfig[key.trim()] = value.trim();
  }

  return await regenerate({...defaultConfig, ...localConfig, ...argumentConfig});
};

// export module
module.exports = lib;