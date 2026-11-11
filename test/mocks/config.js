let configData = {};
try {
  configData = require('../../config/test.json');
} catch {
  try {
    configData = require('../../config/default.json');
  } catch {
    configData = {};
  }
}

module.exports = {
  get: (key) => {
    if (key in configData) {
      return configData[key];
    }
    throw new Error(`Configuration property "${key}" is not defined`);
  },
  has: (key) => key in configData,
  util: {
    getEnv: () => 'test',
  },
};
