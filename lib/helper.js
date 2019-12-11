const lib = {};

lib.handle = {};

lib.handle.error = (error) => {
  console.error('\x1b[31m%s\x1b[0m', '  ' + error.message || error);
  console.log('  💥 SPACESHUTTLE going down! 💥\n');
  process.exit(1);
};

lib.validate = {};

lib.validate.isDirectoryPath = (path) => path.replace(/[\/\\]+/, '').length > 0;

lib.validate.isRoot = (path) => !lib.validate.isDirectoryPath(path);

module.exports = lib;