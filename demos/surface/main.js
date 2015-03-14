YUI({
    filter: 'raw',
    filters: {
        'aui-surface': 'debug'
    }
}).use('aui-surface-app', 'aui-surface-screen-html', 'transition', function(Y) {
    var initialRequest = Y.one('#initial-request'),
        loading = Y.one('#loading'),
        pageLoad = Date.now(),
        surfaceUpdate = Y.one('#surface-update');

    initialRequest.setHTML(pageLoad);

    var startProgress = function() {
        loading.setStyle({
            opacity: 1,
            width: '75%'
        });
    };

    var stopProgress = function() {
        loading.setStyle('opacity', 0);
        loading.setStyle('width', 0);
    };

    var endProgress = function() {
        loading.setStyle('opacity', 1);
        loading.setStyle('width', '100%');
        setTimeout(stopProgress, 550);
    };

    var fade = function(from, to) {
        return new Y.Promise(function(resolve) {
            if (from) {
                from.setStyle('opacity', 0).hide();
                resolve();
            }
            if (to) {
                to.show(true, resolve);
            }
        });
    };

    // Uncomment to change the default transition for all surfaces
    // Y.Surface.TRANSITION = fade;

    /**
     * Screens
     */
    var dummyScreen = Y.Base.create('dummyScreen', Y.Screen, [], {
        getSurfaceContent: function(surfaceId) {
            var res = {
                header: '<h1>Dummy header</h1><p>For a dummy page address that doesn\'t really exists. ' +
                    'Your history now has an invalid page entry. ' +
                    'If you try to refresh / reload the page now, you will end up with a 404.',
                main: '<h2>Dummy content</h2>' +
                    '<p>Content for the #main surface on /dummy. Surface #footer not given, ' +
                    'using the Surface\'s default content.'
            };

            // Uncomment to update the footer
            // res.footer = 'Footer updated';

            return res[surfaceId];
        }
    }, {
        ATTRS: {
            title: {
                value: 'Dummy page title'
            }
        }
    });

    // Y.HTMLScreen caches by default, let's create a uncacheableHTMLScreen
    // See the Y.HTMLScreen code to see other useful attributes
    var uncacheableHTMLScreen = Y.Base.create('uncacheableHTMLScreen', Y.HTMLScreen, [], {}, {
        ATTRS: {
            cacheable: {
                value: false
            }
        }
    });

    var homeScreen = Y.Base.create('homeScreen', Y.HTMLScreen, [], {
        beforeDeactivate: function() {
            var cancel,
                cancellableNotice = Y.one('#cancellable-notice'),
                cancellableTextarea = Y.one('#cancellable-textarea');

            cancel = cancellableTextarea.get('value').length !== 0;

            if (cancel) {
                cancellableNotice.setStyle('opacity', 1).show();
            }

            return cancel;
        }
    });

    /**
     * App
     */
    var app = new Y.SurfaceApp({
        linkSelector: 'a',
        basePath: '/demos/surface',
        on: {
            startNavigate: function(event) {
                Y.log(event);
                startProgress();
            },
            endNavigate: function(event) {
                Y.log(event);
                surfaceUpdate.setHTML((Date.now() - pageLoad) / 1000 + 's after load');
                endProgress();
            }
        }
    });

    app.addScreenRoutes([
        {
            path: '/dummy',
            screen: dummyScreen
        },
        {
            path: '/example.html',
            screen: Y.HTMLScreen
        },
        {
            path: /^\/example\.html\?sid=[0-9]+/,
            screen: uncacheableHTMLScreen
        },
        {
            path: function(value) {
                // anything other (like /index.html?foo=bar) won't route
                return value === '/index.html';
            },
            screen: homeScreen
        }
    ]);

    app.addSurfaces([
        new Y.Surface({
            id: 'header',
            transition: fade
        }),
        'main',
        'footer'
    ]);

    app.dispatch();
});
