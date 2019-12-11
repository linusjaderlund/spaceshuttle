// dependencies
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const helper = require('./helper');
const read = promisify(fs.readFile);
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
    helper.handle.error(error);
  }
};

const cleanConfig = async (config) => {
  try {
    const {localPath, privateKey, passphrase, cleanServerPath, serverPath} = config;
    
    config.localPath = path.isAbsolute(localPath) ? localPath : path.join(cwd, localPath);

    if (cleanServerPath) {
      config.cleanServerPath = cleanServerPath === 'true';  
    }

    if (config.cleanServerPath && helper.validate.isRoot(serverPath)) {
      throw new Error('Due to security reasons cleanServerPath can\'t be used while serverPath is pointing at server root');
    }

    if (privateKey) {
      config.privateKey = await read(privateKey);
      config.passphrase = passphrase || '';
    }
    
    return config;
  } catch (error) {
    helper.handle.error(error);
  }
};

// config library
const lib = {};

lib.build = async (arguments) => {
  const acceptedConfigKeys = ['host', 'port', 'username', 'password', 'privateKey', 'passphrase', 'localPath', 'serverPath', 'cleanServerPath'];
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

  return await cleanConfig({...defaultConfig, ...localConfig, ...argumentConfig});
};

// export module
module.exports = lib;