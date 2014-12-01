var fis = module.exports = require('fis');

// 让 yogurt 打头的先加载。
fis.require.prefixes.unshift('yog2');
fis.require.prefixes.unshift('yogurt');

fis.cli.name = 'yog2';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.set('template', '/views');
fis.config.set('app', '/app');
fis.config.set('static', '/static');
fis.config.set('config', '/conf');

fis.config.merge({
    modules: {
        parser: {
            less: 'less'
        },
        preprocessor: {
            tpl: 'extlang'
        },
        postprocessor: {
            tpl: 'require-async',
            js: 'jswrapper, require-async'
        }
    }
});

fis.config.set('settings.postprocessor.jswrapper.type', 'amd');

var clientRoadmap = [
    {
        reg: /^\/client\/widget\/(.*\.tpl)$/i,
        isMod : true,
        id: 'widget/$1',
        url: '${namespace}/widget/$1',
        release : '${template}/${namespace}/widget/$1'
    },
    {
        reg: /^\/client\/widget\/(.*\.(js|css))$/i,
        isMod : true,
        id: 'widget/$1',
        release : '${static}/${namespace}/widget/$1'
    },
    {
        reg: /^\/client\/page\/(.+\.tpl)$/i,
        isMod: true,
        id: 'page/$1',
        url: '${namespace}/page/$1',
        release: '${template}/${namespace}/page/$1',
        extras: {
            isPage: true
        }
    },
    {
        reg: /^\/client\/static\/(.*)/i,
        id: 'static/$1',
        release: '${static}/${namespace}/$1'
    },
    {
        reg: /^\/client\/test\/(.*)/i,
        useMap: false,
        release: '/test/${namespace}/$1'
    },
    {
        reg: '/client/server.conf',
        useMap: false,
        release: '${config}/server.conf'
    },
    {
        reg: /^\/client\/(.*)/i,
        id: '$1',
        useMap: true,
        release: '${static}/${namespace}/$1'
    }
];

var serverRoadmap = [
    {
        reg: /^\/server\/(.+)/i,
        useMap: false,
        useCompile: false,
        useHash: false,
        useDomain: false,
        release: '${app}/${namespace}/$1'
    }
];

var commonRoadmap = [
    {
        reg: "**.sh",
        release: false
    },
    {
        reg: '${namespace}-map.json',
        release: '${config}/fis/${namespace}-map.json'
    }
];

fis.config.set('roadmap.path',clientRoadmap.concat(serverRoadmap).concat(commonRoadmap));
