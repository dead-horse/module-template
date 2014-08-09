#!/usr/bin/env node

var pkg = require('./package.json');
var program = require('commander');
var multiline = require('multiline');

var action = process.argv[2];
if (!~['user', 'init'].indexOf(action)) {
  usage();
}

program
  .version(pkg.version)
  .command('user', 'add or remove user template')
  .command('init', 'init your app')
  .parse(process.argv);


function usage() {
  var u = multiline(function () {;/*

  Usage: mtpl [command]
  Note: please add user before init.

  Commands:

    init: init your app
      mtpl init <dir>

    user: add or remove user template
      mtpl user add
      mtpl user ls|list
      mtpl user rm|remove [id]
      mtpl user edit [id]
      mtpl user default [id]

  */});
  console.log(u);
}
