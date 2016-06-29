'use strict';

var fis = module.exports = require('fis');

// 让 yogurt 打头的先加载。
fis.require.prefixes.unshift('yog2');
fis.require.prefixes.unshift('yogurt');

fis.cli.name = 'yog2';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
fis.cli.help.commands = ['init', 'install', 'release', 'run', 'util'];

fis.config.set('template', '/views');
fis.config.set('app', '/app');
fis.config.set('static', '/static');
fis.config.set('config', '/conf');
fis.config.set('project.fileType.text', 'es,ts,tsx,jsx');

// 配置插件，引入less、fis-components等功能
fis.config.set('modules.parser.less', 'less');
fis.config.set('roadmap.ext.less', 'css');
fis.config.set('modules.preprocessor.tpl', 'components, extlang');
fis.config.set('modules.postprocessor.tpl', 'require-async');
fis.config.set('modules.postprocessor.js', 'jswrapper, require-async');

fis.config.set('project.ignore', [
    'issue.info',
    'README.md',
    'BCLOUD',
    'GIT_COMMIT',
    'fis.yml',
    'cooder',
    'build.sh',
    'component.json',
    'output/**',
    'fis-conf.js'
]);

// hack for server es compile

fis.config.set('typescript.server.target', 2);
fis.config.set('typescript.client.target', 0);

function typescriptParser(content, file) {
    var typescriptParser = require('fis3-parser-typescript');
    if (file.subpath.indexOf('/server') === -1) {
        return typescriptParser(content, file, {
            module: 1,
            target: fis.config.get('typescript.client.target')
        });
    }
    return typescriptParser(content, file, {
        module: 1,
        target: fis.config.get('typescript.server.target')
    });
}

// fis.config.set('modules.optimizer.tpl', 'html-minifier');
// fis.config.set('settings.optimizer.html-minifier', {
//     ignoreCustomFragments: [
//         / ?\{\%[\s\S]*?\%\} ?/g,
//         / ?\{\{[\s\S]*?\}\} ?/g
//     ],
//     collapseWhitespace: true,
//     conservativeCollapse: true,
//     preserveLineBreaks: true
// });
fis.config.set('roadmap.ext.es', 'js');
fis.config.set('modules.parser.es', typescriptParser);
fis.config.set('roadmap.ext.ts', 'js');
fis.config.set('modules.parser.ts', typescriptParser);
fis.config.set('roadmap.ext.tsx', 'js');
fis.config.set('modules.parser.tsx', typescriptParser);
fis.config.set('roadmap.ext.jsx', 'js');
fis.config.set('modules.parser.jsx', typescriptParser);

fis.config.set('settings.postprocessor.jswrapper.type', 'amd');
fis.config.set('component.dir', '/client/components');

// 设置目录规范
var clientRoadmap = [{
    reg: /^\/client\/components\/(.*\.js)$/i,
    isMod: true,
    id: 'components/$1',
    release: '${static}/${namespace}/components/$1'
}, {
    reg: /^\/client\/widget\/(.+\.tpl)$/i,
    isMod: true,
    id: 'widget/$1',
    url: '${namespace}/widget/$1',
    release: '${template}/${namespace}/widget/$1'
}, {
    reg: /^\/client\/widget\/(.*\.(js|tsx|es|ts|jsx))$/i,
    isMod: true,
    id: 'widget/$1',
    release: '${static}/${namespace}/widget/$1'
}, {
    reg: /^\/client\/page\/(.+\.tpl)$/i,
    isMod: true,
    id: 'page/$1',
    url: '${namespace}/page/$1',
    release: '${template}/${namespace}/page/$1',
    extras: {
        isPage: true
    }
}, {
    reg: /^\/client\/test\/(.*)/i,
    useMap: false,
    release: '/test/${namespace}/$1'
}, {
    reg: '/client/server.conf',
    useMap: false,
    release: '${config}/server.conf'
}, {
    reg: /^\/client\/(.*)/i,
    id: '$1',
    release: '${static}/${namespace}/$1'
}];

var serverRoadmap = [{
    reg: /^\/server\/(.+)/i,
    useMap: false,
    usePreprocessor: false,
    useStandard: false,
    usePostprocessor: false,
    useOptimizer: false,
    useHash: false,
    useDomain: false,
    release: '${app}/${namespace}/$1'
}, {
    reg:/(^\/node_modules\/(.*)|^\/package\.json)/,
    useCompile: false,
    useHash: false,
    useDomain: false,
    release: 'app/${namespace}/$&'
}];

var commonRoadmap = [{
    reg: '**.sh',
    release: false
}, {
    reg: '${namespace}-map.json',
    release: '${config}/fis/${namespace}-map.json'
}, {
    reg: '**',
    release: '${static}/${namespace}/$&'
}];

fis.config.set('roadmap.path', clientRoadmap.concat(serverRoadmap).concat(commonRoadmap));

// 添加自定义命令

fis.require._cache['command-run'] = require('./command/run.js');
fis.require._cache['command-util'] = require('./command/util.js');

fis.enableNPM = function(options) {
    fis.log.error('fis.enableNPM() only supported in FIS3 mode, use --fis3 to enable FIS3');
};
