/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add('io-upload-iframe', function(Y) {

/**
Extends the IO  to enable file uploads, with HTML forms 
using an iframe as the transport medium.
@module io
@submodule io-upload-iframe
@for IO
**/

var w = Y.config.win,
    d = Y.config.doc,
    _std = (d.documentMode && d.documentMode >= 8),
    _d = decodeURIComponent;

/**
 * Creates the iframe transported used in file upload
 * transactions, and binds the response event handler.
 *
 * @method _cFrame
 * @private
 * @param {Object} o Transaction object generated by _create().
 * @param {Object} c Configuration object passed to YUI.io().
 * @param {Object} io
 */
function _cFrame(o, c, io) {
    var i = Y.Node.create('<iframe src="#" id="io_iframe' + o.id + '" name="io_iframe' + o.id + '" />');
        i._node.style.position = 'absolute';
        i._node.style.top = '-1000px';
        i._node.style.left = '-1000px';
        Y.one('body').appendChild(i);
    // Bind the onload handler to the iframe to detect the file upload response.
    Y.on("load", function() { io._uploadComplete(o, c); }, '#io_iframe' + o.id);
}

/**
 * Removes the iframe transport used in the file upload 
 * transaction.
 *
 * @method _dFrame
 * @private
 * @param {Number} id The transaction ID used in the iframe's creation.
 */
function _dFrame(id) {
	Y.Event.purgeElement('#io_iframe' + id, false);
	Y.one('body').removeChild(Y.one('#io_iframe' + id));
	Y.log('The iframe transport for transaction ' + id + ' has been destroyed.', 'info', 'io');
}

Y.mix(Y.IO.prototype, {
   /**
    * Parses the POST data object and creates hidden form elements
    * for each key-value, and appends them to the HTML form object.
    * @method appendData
    * @private
    * @static
    * @param {Object} f HTML form object.
    * @param {String} s The key-value POST data.
    * @return {Array} o Array of created fields.
    */
    _addData: function(f, s) {
        // Serialize an object into a key-value string using
        // querystring-stringify-simple.
        if (Y.Lang.isObject(s)) {
            s = Y.QueryString.stringify(s);
        }

        var o = [],
            m = s.split('='),
            i, l;

        for (i = 0, l = m.length - 1; i < l; i++) {
            o[i] = d.createElement('input');
            o[i].type = 'hidden';
            o[i].name = _d(m[i].substring(m[i].lastIndexOf('&') + 1));
            o[i].value = (i + 1 === l) ? _d(m[i + 1]) : _d(m[i + 1].substring(0, (m[i + 1].lastIndexOf('&'))));
            f.appendChild(o[i]);
            Y.log('key: ' +  o[i].name + ' and value: ' + o[i].value + ' added as form data.', 'info', 'io');
        }

        return o;
    },

   /**
    * Removes the custom fields created to pass additional POST
    * data, along with the HTML form fields.
    * @method _removeData
    * @private
    * @static
    * @param {Object} f HTML form object.
    * @param {Object} o HTML form fields created from configuration.data.
    */
    _removeData: function(f, o) {
        var i, l;

        for (i = 0, l = o.length; i < l; i++) {
            f.removeChild(o[i]);
        }
    },

   /**
    * Sets the appropriate attributes and values to the HTML
    * form, in preparation of a file upload transaction.
    * @method _setAttrs
    * @private
    * @static
    * @param {Object} f HTML form object.
    * @param {Object} id The Transaction ID.
    * @param {Object} uri Qualified path to transaction resource.
    */
    _setAttrs: function(f, id, uri) {
        f.setAttribute('action', uri);
        f.setAttribute('method', 'POST');
        f.setAttribute('target', 'io_iframe' + id );
        f.setAttribute(Y.UA.ie && !_std ? 'encoding' : 'enctype', 'multipart/form-data');
    },

   /**
    * Reset the HTML form attributes to their original values.
    * @method _resetAttrs
    * @private
    * @static
    * @param {Object} f HTML form object.
    * @param {Object} a Object of original attributes.
    */
    _resetAttrs: function(f, a) {
        Y.Object.each(a, function(v, p) {
            if (v) {
                f.setAttribute(p, v);
            }
            else {
                f.removeAttribute(p);
            }
        });
    },

   /**
    * Starts timeout count if the configuration object
    * has a defined timeout property.
    *
    * @method _startUploadTimeout
    * @private
    * @static
    * @param {Object} o Transaction object generated by _create().
    * @param {Object} c Configuration object passed to YUI.io().
    */
    _startUploadTimeout: function(o, c) {
        var io = this;

        io._timeout[o.id] = w.setTimeout(
            function() {
                o.status = 0;
                o.statusText = 'timeout';
                io.complete(o, c);
                io.end(o, c);
                Y.log('Transaction ' + o.id + ' timeout.', 'info', 'io');
            }, c.timeout);
    },

   /**
    * Clears the timeout interval started by _startUploadTimeout().
    * @method _clearUploadTimeout
    * @private
    * @static
    * @param {Number} id - Transaction ID.
    */
    _clearUploadTimeout: function(id) {
        var io = this;

        w.clearTimeout(io._timeout[id]);
        delete io._timeout[id];
    },

   /**
    * Bound to the iframe's Load event and processes
    * the response data.
    * @method _uploadComplete
    * @private
    * @static
    * @param {Object} o The transaction object
    * @param {Object} c Configuration object for the transaction.
    */
    _uploadComplete: function(o, c) {
        var io = this,
            d = Y.one('#io_iframe' + o.id).get('contentWindow.document'),
            b = d.one('body'),
            p;

        if (c.timeout) {
            io._clearUploadTimeout(o.id);
        }

		try {
			if (b) {
				// When a response Content-Type of "text/plain" is used, Firefox and Safari
				// will wrap the response string with <pre></pre>.
				p = b.one('pre:first-child');
				o.c.responseText = p ? p.get('text') : b.get('text');
				Y.log('The responseText value for transaction ' + o.id + ' is: ' + o.c.responseText + '.', 'info', 'io');
			}
			else {
				o.c.responseXML = d._node;
				Y.log('The response for transaction ' + o.id + ' is an XML document.', 'info', 'io');
			}
		}
		catch (e) {
			o.e = "upload failure";
		}

        io.complete(o, c);
        io.end(o, c);
        // The transaction is complete, so call _dFrame to remove
        // the event listener bound to the iframe transport, and then
        // destroy the iframe.
        w.setTimeout( function() { _dFrame(o.id); }, 0);
    },

   /**
    * Uploads HTML form data, inclusive of files/attachments,
    * using the iframe created in _create to facilitate the transaction.
    * @method _upload
    * @private
    * @static
    * @param {Object} o The transaction object
    * @param {Object} uri Qualified path to transaction resource.
    * @param {Object} c Configuration object for the transaction.
    */
    _upload: function(o, uri, c) {
        var io = this,
            f = (typeof c.form.id === 'string') ? d.getElementById(c.form.id) : c.form.id,
            // Track original HTML form attribute values.
            attr = {
                action: f.getAttribute('action'),
                target: f.getAttribute('target')
            },
            fields;

        // Initialize the HTML form properties in case they are
        // not defined in the HTML form.
        io._setAttrs(f, o.id, uri);
        if (c.data) {
            fields = io._addData(f, c.data);
        }

        // Start polling if a callback is present and the timeout
        // property has been defined.
        if (c.timeout) {
            io._startUploadTimeout(o, c);
            Y.log('Transaction timeout started for transaction ' + o.id + '.', 'info', 'io');
        }

        // Start file upload.
        f.submit();
        io.start(o, c);
        if (c.data) {
            io._removeData(f, fields);
        }
        // Restore HTML form attributes to their original values.
        io._resetAttrs(f, attr);

        return {
            id: o.id,
            abort: function() {
                o.status = 0;
                o.statusText = 'abort';
                if (Y.one('#io_iframe' + o.id)) {
                    _dFrame(o.id);
                    io.complete(o, c);
                    io.end(o, c);
                    Y.log('Transaction ' + o.id + ' aborted.', 'info', 'io');
                }
                else {
                    Y.log('Attempted to abort transaction ' + o.id + ' but transaction has completed.', 'warn', 'io');
                    return false;
                }
            },
            isInProgress: function() {
                return Y.one('#io_iframe' + o.id) ? true : false;
            },
            io: io
        };
    },

    upload: function(o, uri, c) {
        _cFrame(o, c, this);
        return this._upload(o, uri, c);
    }
});


}, '3.5.0' ,{requires:['io-base','node-base']});
