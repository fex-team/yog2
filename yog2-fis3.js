var fis = module.exports = require('fis3');
var path = require('path');
fis.require.prefixes.unshift('yog2');
fis.require.prefixes.unshift('yogurt');
fis.cli.name = 'yog2';
fis.cli.info = require('./package.json');

fis.set('modules.commands', ['init', 'install', 'release', 'run', 'inspect', 'util']);

fis.set('template', '/views');
fis.set('app', '/app');
fis.set('static', '/static');
fis.set('config', '/conf');
fis.set('component.dir', '/client/components');
fis.set('project.fileType.text', 'es');
fis.set('project.fileType.text', 'ts');

var clientRoadmap = {
    // all release to $static dir
    'client/(**)': {
        id: '$1',
        moduleId: '${namespace}:$1',
        release: '/${static}/${namespace}/$1'
    },
    'client/**.less': {
        parser: fis.plugin('less'),
        rExt: '.css'
    },
    'client/**.tpl': {
        preprocessor: fis.plugin('extlang'),
        postprocessor: fis.plugin('require-async'),
        useMap: true
    },
    'client/**.{tpl,js}': {
        useSameNameRequire: true
    },
    'client/page/**.tpl': {
        extras: {
            isPage: true
        }
    },
    'client/(page/**.tpl)': {
        url: '${namespace}/$1',
        release: '/${template}/${namespace}/$1',
        useMap: true
    },
    'client/(widget/**.tpl)': {
        url: '${namespace}/$1',
        release: '/${template}/${namespace}/$1',
        useMap: true
    },
    'client/{components,widget}/**.{js,css}': {
        isMod: true
    },
    'client/test/(**)': {
        useMap: false,
        release: '/test/${namespace}/$1'
    },
    '${namespace}-map.json': {
        release: '${config}/fis/${namespace}-map.json'
    },
    '::package': {}
};

var commonRoadmap = {
    '**.sh': {
        release: false
    },
    '**': {
        release: '${static}/${namespace}/$0'
    }
};

var serverRoadmap = {
    'server/(**)': {
        useMap: false,
        preprocessor: false,
        standard: false,
        postprocessor: false,
        optimizer: false,
        useHash: false,
        useDomain: false,
        isMod: false,
        release: '${app}/${namespace}/$1'
    },
    'server/**.es': {
        parser: fis.plugin('typescript', {
            module: 1,
            target: 2
        }),
        rExt: 'js'
    },
    'server/**.ts': {
        parser: fis.plugin('typescript', {
            module: 1,
            target: 2
        }),
        rExt: 'js'
    }
};

var prodRoadmap = {
    'client/**.{js,css,less}': {
        useHash: true
    },
    'client/**.js': {
        optimizer: fis.plugin('uglify-js')
    },
    'client/**.{css,less}': {
        optimizer: fis.plugin('clean-css')
    },
    '::image': {
        useHash: true
    },
    'client/**.png': {
        optimizer: fis.plugin('png-compressor')
    }
};

// 添加自定义命令

fis.require._cache['command-run'] = require('./command/run.js');
fis.require._cache['command-util'] = require('./command/util.js');

[commonRoadmap, clientRoadmap, serverRoadmap, prodRoadmap].forEach(function (roadmap) {
    fis.util.map(roadmap, function (selector, rules) {
        fis.match(selector, rules);
    });
});

// 模块化支持
fis.hook('module', {
    mode: 'commonJs'
});

// map.json
fis.match('::package', {
    postpackager: function createMap(ret) {
        var path = require('path');
        var root = fis.project.getProjectPath();
        var map = fis.file.wrap(path.join(root, fis.get('namespace') + '-map.json'));
        map.setContent(JSON.stringify(ret.map, null, 4));
        ret.pkg[map.subpath] = map;
    }
});
