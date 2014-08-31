#!/usr/bin/env node

var dotfile = require('dotfile-config')('.mtplrc');
var exec = require('child_process').exec;
var fmt = require('util').format;
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var path = require('path');
var fs = require('fs');

var templateDir = path.join(__dirname, 'template');
var destDir = path.resolve(process.argv[2] || '.');
mkdirp.sync(destDir);

var config = dotfile.get();

var users = config.users || {};
if (!users || !Object.keys(users).length) {
  console.log('please use `mtpl user add` to create user template first\n');
  process.exit(1);
}

var ids = Object.keys(users);

var schema = {
  properties: {
    userTemplateId: {
      description: 'user template id',
      default: config.default,
      message: 'user template id not exist, `mtpl user ls` to show\n',
      conform: function (id) {
        return users[id];
      },
      required: true
    },

    name: {
      description: 'project name',
      required: true,
      default: path.basename(destDir)
    },
    repo: {
      description: 'project git repo <org/name>',
      required: false
    },
    description: {
      description: 'project description',
      required: false
    }
  }
};

prompt.message = 'xtpl init'.green;
prompt.delimiter = ": ";
prompt.start();
prompt.get(schema, function (err, result) {
  if (err) {
    return console.error(err.stack);
  }
  var data = genData(result);
  genProject(data);
});

function genProject(data) {
  var files = fs.readdirSync(data.templateDir);
  files.forEach(function (file) {
    var content = fs.readFileSync(path.join(data.templateDir, file), 'utf-8');
    file = file.replace(/^_/, '.')
    var destFile = path.join(destDir, file);
    content = replace(content, data);
    fs.writeFileSync(destFile, content);
    console.log('create file %s', destFile);
  });
  var cmd = fmt('git init && git remote add origin %s && git config user.name "%s" && git config user.email "%s"',
    data.git, data.authorName, data.authorEmail);

  exec(cmd, function (err) {
    if (err) {
      console.log('init git for project error');
      process.exit(1);
    }
    console.log('init project success');
    process.exit();
  })
}

function genData(result) {
  var user = config.users[result.userTemplateId];
  var git = user.git.replace(/\/$/, '') + ':' + result.repo;
  return {
    name: result.name,
    description: result.description,
    repo: result.repo,
    authorName: user.name,
    authorEmail: user.email,
    authorUrl: user.url,
    git: git,
    templateDir: user.template
  };
}

function replace(content, data) {
  return content.replace(/{{ *(\w+) *}}/g, function (block, key) {
    return data[key];
  });
}
