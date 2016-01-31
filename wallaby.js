var babel = require('babel-core');
var path = require('path');
var fs = require('fs');

module.exports = function (wallaby) {
  var babelCompiler = wallaby.compilers.babel({
    babel: babel,
    presets: ['react', 'es2015', 'stage-0'],
    plugins: ['transform-decorators-legacy']
  });

  process.env.NODE_PATH += path.delimiter +
    path.join(wallaby.localProjectDir, 'node_modules');

  process.env.NODE_PATH += path.delimiter +
    path.join(wallaby.projectCacheDir, 'src', 'imports');

  process.env.NODE_PATH += path.delimiter +
    path.join(
      wallaby.localProjectDir,
      'src/.meteor/local/build/programs/server/node_modules'
    );

  var serverAppPath = path.resolve(
    wallaby.localProjectDir,
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

  return {
    files: [
      {pattern: 'src/imports/**/*-spec.@(js|jsx)', ignore: true},
      {pattern: 'src/imports/**/*.@(js|jsx)', load: false},
      {pattern: '__mocks__/*.js'},
    ],

    tests: [
      {pattern: 'src/imports/**/*-spec.@(js|jsx)'},
      {pattern: 'tests/jasmine/server/unit/**/*-spec.@(js|jsx)'},
      {pattern: 'tests/jasmine/server/unit/quarantine/**/*.@(js|jsx)', ignore: true},
    ],

    compilers: {
      // Important: Make sure that src/.meteor/ is excluded from the pattern
      'src/imports/**/*.@(js|jsx)': babelCompiler,
      'tests/jasmine/server/unit/**/*.@(js|jsx)': babelCompiler,
      '__mocks__/*.js': babelCompiler,
    },

    env: {
      type: 'node'
    },

    testFramework: 'jest',

    bootstrap: function (wallaby) {
      var path = require('path');
      var packageConfigPath = path.resolve(wallaby.localProjectDir, 'package.json');
      var packageConfig = require(packageConfigPath);
      var jestConfig = packageConfig.jest;
      delete jestConfig.scriptPreprocessor;
      wallaby.testFramework.configure(jestConfig);
    },

    debug: true
  };
};
