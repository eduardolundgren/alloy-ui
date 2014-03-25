A.HTMLScreen = A.Base.create('htmlScreen', A.Screen, [], {
    /**
     * Loads the content for all surfaces in one AJAX request from the server.
     *
     * @method getSurfacesContent
     * @param {Array} surfaces An array of surfaces which content should be
     *     loaded from the server.
     * @return {A.Promise} Promise, which should be resolved with the returned
     *     content from the server.
     */
    getSurfacesContent: function(surfaces, req) {
        var url = new A.Url(req.url);

        url.addParameter('pjax', '1');

        return this._loadContent(url);
    },

    /**
     * Returns content for given surface from the provided content.
     *
     * @method getSurfaceContent
     * @param {String} surfaceId The ID of the surface, which content should be
     *     loaded.
     * @req {Object} The request object.
     * @contents {Node} The content container from which the surface content
     *     will be retrieved.
     * @return {String|Node} String or Node instance which contains the content
     *     of the surface.
     */
    getSurfaceContent: function(surfaceId, req, contents) {
        var frag = contents.one('#' + surfaceId);

        if (frag) {
            return frag.get('innerHTML');
        }
    },

    /**
     * Loads the content from server via single AJAX request.
     *
     * @method _loadContent
     * @protected
     * @return {A.Promise} Promise, which should be resolved with the returned
     *     content from the server.
     */
    _loadContent: function(url, opt_selector) {
        return new A.Promise(function(resolve, reject) {
            A.io(url, {
                on: {
                    failure: function(id, response) {
                        reject(response.responseText);
                    },

                    success: function(id, response) {
                        var frag = A.Node.create(response.responseText);

                        if (opt_selector) {
                            frag = frag.one(opt_selector);
                        }

                        resolve(frag);
                    }
                }
            });
        });
    }
}, {});
