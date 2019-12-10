const lib = {};

lib.handle = {};

lib.handle.error = (error) => {
  console.error('\x1b[31m%s\x1b[0m', '  ' + error.message);
  console.log('  💥 SPACESHUTTLE going down! 💥\n');
  process.exit(1);
};

module.exports = lib;