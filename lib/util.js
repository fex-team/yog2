'use strict';

var fs = require('fs');
var path = require('path');

module.exports.checkProject = function () {
	var cwd = process.cwd();
	try {
		fs.statSync(path.join(cwd, 'package.json'));
		var packageInfo = require(path.join(cwd, 'package.json'));
		if (packageInfo.scripts.debug && packageInfo.scripts['debug-win']) {
			return true;
		}
	}
	catch (e) {
		return false;
	}
};
