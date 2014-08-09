var path = require('path');
var fs = require('fs');

var root;
if (process.platform === 'win32') {
  root = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || '/tmp';
}

var configPath = path.join(root, '.mtplrc');

exports.get = function () {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    return {};
  }
};

exports.set = function (config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
};
