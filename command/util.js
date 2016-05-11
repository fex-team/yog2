'use strict';

var util = require('util');
var spawn = require('child_process').spawn;
var yogUtil = require('../lib/util.js');

exports.name = 'util';
exports.desc = 'yog2 util';
exports.register = function (commander) {
    var pac = require('yog-pac');
    commander.option('--fis3', 'fis3 mode', Boolean, false)
    commander.command('pack').description('pack node_modules for submit');
    commander.command('unpack').description('unpack node_modules');
    commander.action(function () {
        if (!yogUtil.checkProject()) {
            fis.log.error('current folder is not a valid yog project'.red);
        }
        fis.log.throw = true;
        var args = Array.prototype.slice.call(arguments);
        var options = args.pop();
        var cmd = args.shift();
        if (!cmd) {
            commander.outputHelp();
            return;
        }

        var strategy = new pac.NpmStrategy({
            mode: 'production',
            verbose: true
        });
        if (cmd === 'pack') {
            strategy.pack();
        }
        else if (cmd === 'unpack') {
            strategy.install();
        }
    });
};
