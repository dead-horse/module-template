#!/usr/bin/env node

var prompt = require('prompt');
var pkg = require('./package.json');
var Config = require('./config');
var multiline = require('multiline');

var config = Config.get();

var actions = {
  add: add,
  rm: remove,
  remove: remove,
  edit: edit,
  list: list,
  ls: list,
  default: def
};

var action = process.argv[2];
var config = Config.get();

if (!actions[action]) {
  usage();
}

actions[action]();

/**
 * add new user
 */

function add() {
  var exits = config.users
    ? Object.keys(config.users)
    : [];

  var schema = {
    properties: {
      id: {
        description: 'user template id',
        required: true,
        message: 'template id exist',
        conform: function (id) {
          return !~exits.indexOf(id);
        }
      },
      name: {
        description: 'username',
        required: true,
      },
      email: {
        description: 'email',
        required: false
      },
      git: {
        description: 'repository git host',
        required: true,
        default: 'https://github.com/'
      },
      url: {
        description: 'url',
        require: false
      }
    }
  };
  prompt.message = "xtpl user add".green;
  prompt.delimiter = ": ";
  prompt.start();
  prompt.get(schema, function (err, result) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }
    if (empty()) {
      config.users = {};
      config.default = result.id;
    }
    config.users[result.id] = result;

    Config.set(config);
    console.log('add user success');
    process.exit(0);
  });
}

/**
 * remove user by id
 */

function remove() {
  var id = process.argv[3];
  if (!id) {
    return usage();
  }
  if (empty()) {
    return console.log('user template list is empty\n'.yellow);
  }

  if (!config.users[id]) {
    return console.log('user template %s not exist\n', id);
  }
  delete config.users[id];
  Config.set(config);
  console.log('remove user template %s success\n', id);
}

function edit() {
  var id = process.argv[3];
  if (!id) {
    return usage();
  }
  if (empty()) {
    return console.log('user template list is empty\n'.yellow);
  }

  var user = config.users[id];
  if (!user) {
    return console.log('user template %s not exist\n', id);
  }

  var schema = {
    properties: {
      name: {
        description: 'username',
        required: true,
        default: user.name
      },
      email: {
        description: 'email',
        required: false,
        default: user.email,
      },
      git: {
        description: 'repository git host',
        required: true,
        default: user.git || 'https://github.com'
      },
      url: {
        description: 'url',
        require: false,
        default: user.url
      }
    }
  };
  prompt.message = "xtpl edit add".green;
  prompt.delimiter = ": ";
  prompt.start();
  prompt.get(schema, function (err, result) {
    result.id = id;
    config.users[id] = result;
    Config.set(config);
    console.log('edit template %s success\n', id);
    process.exit(0);
  });
}

/**
 * list all users
 */

function list() {
  var users = config.users;
  if (empty()) {
    return console.log('user template list is empty\n'.yellow);
  }

  for (var id in users) {
    var user = users[id];
    console.log('%s:\n  user name: %s\n  email: %s\n  git: %s\n  url: %s\n',
                id, user.name, user.email, user.git, user.url);
  }

  if (config.default) {
    console.log('default is %s', config.default);
  }
}

function def() {
  var users = config.users;
  if (empty()) {
    return console.log('user template list is empty\n'.yellow);
  }

  var id = process.argv[3];
  if (!id) {
    return usage();
  }
  if (empty()) {
    return console.log('user template list is empty\n'.yellow);
  }

  var user = config.users[id];
  if (!user) {
    return console.log('user template %s not exist\n', id);
  }

  config.default = id;
  Config.set(config);
  console.log('set default user template to %s\n', id);
}
/**
 * check user list is empty
 */

function empty() {
  return !config.users || !Object.keys(config.users).length;
}

/**
 * output usage info
 */

function usage() {
  var u = multiline(function () {;/*
Usage:
  mtpl user add
  mtpl user ls|list
  mtpl user rm|remove <id>
  mtpl user edit <id>
  mtpl user default <id>
  */});
  console.log(u);
  process.exit(0);
}
