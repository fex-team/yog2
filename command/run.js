'use strict';

var util = require('util');
var spawn = require('child_process').spawn;
var yogUtil = require('../lib/util.js');

exports.name = 'run';
exports.desc = 'run yog2 server with a simple daemon';
exports.register = function (commander) {
    commander
        .option('--fis3', 'fis3 mode', Boolean, false)
        .option('-n, --nodebug', 'run server without debug mode', Boolean, false)
        .option('-e, --env [env]', 'set YOG_ENV', String, 'dev')
        .action(function () {
            if (!yogUtil.checkProject()) {
                fis.log.error('current folder is not a valid yog project'.red);
            }
            var options = arguments[arguments.length - 1];
            fis.log.throw = true;
            start(options);
        });
};

function start(options) {
    var server;
    var env = process.env;
    env.YOG_ENV = options.env || '';
    if (options.nodebug) {
        server = spawn('node', ['app'], {
            env: env
        });
    }
    else {
        var isWin = /^win/.test(process.platform);
        if (isWin) {
            server = spawn('npm.cmd', ['run', 'debug-win'], {
                env: env
            });
        }
        else {
            server = spawn('npm', ['run', 'debug'], {
                env: env
            });
        }
    }
    server.stdout.pipe(process.stdout);
    server.stderr.pipe(process.stderr);
    server.on('exit', function (code) {
        fis.log.warning(('yog2 server exit with code ' + code + ', restarting...').yellow);
        start(options);
    });
}
