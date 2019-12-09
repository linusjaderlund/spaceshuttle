// dependencies
const Client = require('ssh2-sftp-client');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readdir = promisify(fs.readdir);
const sftp = new Client();
const queue = [];
let transferCount = 0;

// helpers
const printConfig = (config) => {
  const keys = Object.keys(config);
  const hiddenKeys = ['password', 'privateKey', 'passphrase'];
  console.log('  Deploying using configuration:');
  for (const key of keys) {
    console.log(`    ${key}: ${hiddenKeys.includes(key) ? '<hidden>' : config[key]}`);
  }
};

const handleError = (error) => console.error(error);

const listLocalPaths = async ({localPath}) => {
  const directories = [];
  const files = [];
  const queue = [localPath];

  while (queue.length) {
    const currentPath = queue.splice(0, 1)[0];
    const dirents = await readdir(currentPath, {withFileTypes: true});
    const paths = dirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(currentPath, dirent.name));
    
    for (const dirent of dirents) {
      const direntPath = path.join(currentPath, dirent.name);
      
      if (dirent.isDirectory()) {
        directories.push(direntPath);
        queue.push(direntPath);
        continue;
      }

      files.push(direntPath);
    }
  }

  return {directories, files};
};

const createServerDirectory = async (serverPath) => {
  if (!(await sftp.exists(serverPath))) {
    await sftp.mkdir(serverPath);
  }
};

const createServerDirectories = async ({localPath, serverPath}, {directories}) => {
  let created = 0;
  let total = directories.length;
  const print = () => `  Creating directories: ${created}/${total}\r`;
  
  if (serverPath && serverPath !== '/') {
    total++;
    await createServerDirectory(serverPath);
    created++;
    process.stdout.write(print());
  }
  
  for (const directory of directories) {
    const currentServerPath = path.join(serverPath, directory.replace(localPath, ''));
    await createServerDirectory(currentServerPath);
    created++;
    process.stdout.write(print());
  }

  console.log('  Creating directories: done! 🚀');
};

const uploadFiles = async ({localPath, serverPath}, {files}) => {
  let uploaded = 0;
  let total = files.length;
  const print = () => `  Uploading files: ${uploaded}/${total}\r`;
  
  for (const file of files) {
    const currentServerPath = path.join(serverPath, file.replace(localPath, ''));
    await sftp.fastPut(file, currentServerPath);
    uploaded++;
    process.stdout.write(print());
  }

  console.log('  Uploading files: done! 🚀');
};

// deploy library
const lib = {};

lib.init = async (config) => {
  try {
    console.log('\n  🚀 SPACESHUTTLE 🚀');
    console.log('  -------------------------------');
    printConfig(config);
    console.log('  -------------------------------');

    await sftp.connect(config);
    const localPaths = await listLocalPaths(config);
    await createServerDirectories(config, localPaths);
    await uploadFiles(config, localPaths);
    sftp.end();

    console.log('  -------------------------------\n');
  } catch (error) {
    handleError(error);
  }
};

// export module
module.exports = lib;
