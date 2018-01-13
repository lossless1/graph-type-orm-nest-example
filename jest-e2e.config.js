require('ts-node/register');
require('./server/polyfills');

module.exports = {
  'moduleFileExtensions': [
    'ts',
    'js',
    'json'
  ],
  'transform': {
    '^.+\\.tsx?$': 'ts-jest'
  },
  'testRegex': '.*\\.e2e-spec.(ts|js)$',
  'collectCoverageFrom': [
    'server/**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  'coverageReporters': [
    'json',
    'lcov'
  ]
};
