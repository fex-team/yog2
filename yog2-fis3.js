'use strict';

var fis = module.exports = require('fis3');
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
fis.set('project.fileType.text', 'es,ts,tsx,jsx');
fis.set('project.ignore', [
    'issue.info',
    'README.md',
    'BCLOUD',
    'GIT_COMMIT',
    'fis.yml',
    'cooder',
    'build.sh',
    'component.json',
    'output/**',
    '/client/node_modules/**',
    'fis-conf.js'
]);

var clientRoadmap = {
    // all release to $static dir
    '/client/(**)': {
        id: '$1',
        moduleId: '${namespace}:$1',
        release: '/${static}/${namespace}/$1'
    },
    '/client/**.less': {
        parser: fis.plugin('less'),
        rExt: '.css'
    },
    '/client/{**.ts,**.tsx,**.jsx,**.es}': {
        parser: fis.plugin('typescript', {
            module: 1,
            target: 0
        }),
        rExt: 'js'
    },
    '/client/**.tpl': {
        preprocessor: fis.plugin('extlang'),
        postprocessor: fis.plugin('require-async'),
        useMap: true
    },
    '/client/**.{tpl,js,ts,jsx,es,tsx}': {
        useSameNameRequire: true
    },
    '/client/page/**.tpl': {
        extras: {
            isPage: true
        }
    },
    '/client/(page/**.tpl)': {
        url: '${namespace}/$1',
        release: '/${template}/${namespace}/$1',
        useMap: true
    },
    '/client/(widget/**.tpl)': {
        url: '${namespace}/$1',
        release: '/${template}/${namespace}/$1',
        useMap: true
    },
    '/client/{components,widget}/**.{js,es,ts,tsx,jsx,css,less}': {
        isMod: true
    },
    '/client/test/(**)': {
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
    '/server/(**)': {
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
    '/server/{**.ts,**.es}': {
        parser: fis.plugin('typescript', {
            module: 1,
            target: 2
        }),
        rExt: 'js'
    },
    '/{node_modules/**,package.json}': {
        useCompile: false,
        release: 'app/${namespace}/$0'
    }
};

var prodRoadmap = {
    '/client/**.{js,css,less,ts,jsx,es,tsx}': {
        useHash: true
    },
    '/client/**.{js,ts,jsx,es,tsx}': {
        optimizer: fis.plugin('uglify-js')
    },
    '/client/**.{css,less}': {
        optimizer: fis.plugin('clean-css')
    },
    '::image': {
        useHash: true
    },
    '/client/**.png': {
        optimizer: fis.plugin('png-compressor')
    }
};

// 添加自定义命令
fis.require._cache['command-run'] = require('./command/run.js');
fis.require._cache['command-util'] = require('./command/util.js');

[commonRoadmap, clientRoadmap, serverRoadmap, prodRoadmap].forEach(function(roadmap) {
    fis.util.map(roadmap, function(selector, rules) {
        fis.match(selector, rules);
    });
});

fis.enableNPM = function(options) {
    fis.match('/client/node_modules/**.js', {
        isMod: true
    });
    if (options.autoPack) {
        fis.match('/client/node_modules/**.js', {
            packTo: options.npmBundlePath || '/client/pkg/npm/bundle.js'
        });
        fis.match('/client/node_modules/**.css', {
            packTo: options.npmCssBundlePath || '/client/pkg/npm/bundle.css'
        });
        fis.on('deploy:start', function(groups) {
            groups.forEach(function(group) {
                var modified = group.modified;
                var total = group.modified;
                var file;
                var i = modified.length - 1;
                while ((file = modified[i--])) {
                    if (file.subpath.indexOf('/client/node_modules') === 0) {
                        modified.splice(i + 1, 1);
                    }
                }
                i = total.length - 1;
                while ((file = total[i--])) {
                    if (file.subpath.indexOf('/client/node_modules') === 0) {
                        total.splice(i + 1, 1);
                    }
                }
            });
        });
    }
    fis.match('/client/**.{js,es,jsx,ts,tsx}', {
        preprocessor: [
            fis.plugin('js-require-file'),
            fis.plugin('js-require-css')
        ]
    });
    fis.unhook('components');
    fis.hook('node_modules');
};

// 模块化支持
fis.hook('commonjs', {
    extList: ['.js', '.es', '.ts', '.tsx', '.jsx']
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
