var path = require('path');
var fs = require('fs');

var rootDir = path.resolve(__dirname, '..');

process.env.NODE_PATH += path.delimiter +
  path.join(rootDir, 'node_modules');

process.env.NODE_PATH += path.delimiter +
  path.join(rootDir, 'src', 'imports');

process.env.NODE_PATH += path.delimiter +
  path.join(
    rootDir,
    'src/.meteor/local/build/programs/server/node_modules'
  );

var serverAppPath = path.resolve(
  rootDir,
  'src/.meteor/local/build/programs/server'
);
var serverJsonPath = path.resolve(serverAppPath, 'program.json');
var serverJson = JSON.parse(fs.readFileSync(serverJsonPath, 'utf8'));

serverJson.load
  .filter(function (entry) { return !!entry.node_modules; })
  .map(function (entry) { return entry.node_modules; })
  .forEach(function (nodeModulesPath) {
    process.env.NODE_PATH += path.delimiter +
      path.join(serverAppPath, nodeModulesPath);
  });
