/**
 * The Node Scroll Checkpoint Utility - Execute a function whenever you scroll to an element.
 *
 * @module aui-node-checkpoints
 */

var BODY = A.getBody();

var MAP_CONTEXTS = {};

var isBody = function(node) {
    return (node === BODY);
};

/**
 * A base class for `A.Node.Checkpoint`.
 *
 * @class A.Node.Checkpoint
 * @constructor
 */
var Checkpoint = function() {
    this.init.apply(this, arguments);
};

/**
 * Static object containing default values for A.Node.Checkpoint.
 *
 * @property DEFAULTS
 * @type Object
 * @static
 */
Checkpoint.DEFAULTS = {
    axis: 'vertical',
    enabled: true,
    triggerAtTheEnd: false,
    offset: 0
};

/**
 * Init lifecycle method, invoked during construction. Sets up attributes
 * and binds events.
 *
 * @method init
 * @param {Node} node Node to be used as checkpoint.
 * @param {Function} callback Callback function to execute when the checkpoint is triggered.
 * @param {Object} options Object containing options for the checkpoint.
 */
Checkpoint.prototype.init = function(node, callback, options) {
    var instance = this;

    A.mix(options, Checkpoint.DEFAULTS);

    instance._axis = options.axis;
    instance._callback = callback;
    instance._context = options._context;
    instance._enabled = options.enabled;
    instance._node = node;
    instance._offset = options.offset;
    instance._triggerAtTheEnd = options.triggerAtTheEnd;

    instance._scrollEvent = {
        vertical: node.get('scrollTop'),
        horizontal: node.get('scrollLeft')
    };

    instance.bindResizeUI();

    instance.bindScrollUI();

    instance._handles = [instance._resizeHandler, instance._scrollHandler];
};

/**
 * Destroy lifecycle method. Invokes destructors for the class hierarchy.
 *
 * @method destroy
 */
Checkpoint.prototype.destroy = function() {
    var instance = this;

    A.Array.invoke(instance._handles, 'detach');
};

/**
 * Binds refresh checkpoint method to the resize/resize:end events.
 *
 * @method bindResizeUI
 */
Checkpoint.prototype.bindResizeUI = function() {
    var instance = this;

    var node = instance._node;

    var refreshFn = A.bind(instance.refresh, instance);

    var resizeHandler;

    if (isBody(node)) {
        resizeHandler = node.on('resize', A.debounce(refreshFn, 400));
    }
    else {
        resizeHandler = node.on('resize:end', refreshFn);
    }

    instance._resizeHandler = resizeHandler;
};

/**
 * Sets up scroll event handlers depending on axis and triggerAtTheEnd.
 *
 * @method bindScrollUI
 */
Checkpoint.prototype.bindScrollUI = function() {
    var instance = this;

    var scrollHandler;

    if (instance._triggerAtTheEnd) {
        scrollHandler = instance._context.on(
            (instance._axis === 'vertical') ? 'scrollToBottom' : 'scrollToRight',
            function(event) {
                if (instance._enabled) {
                    instance._scrollEvent = event;

                    instance._triggerCallback();
                }
            },
            instance
        );
    }
    else {
        instance._reachedCheckpoint = instance.reachedCheckpoint();

        scrollHandler = instance._context.on(
            'scroll',
            function(event) {
                if (instance._enabled) {
                    instance._scrollEvent = event;

                    if (instance._crossed()) {
                        instance._triggerCallback();
                    }
                }
            },
            instance
        );
    }

    instance._scrollHandler = scrollHandler;
};

/**
 * Disables the node checkpoint.
 *
 * @method disable
 */
Checkpoint.prototype.disable = function() {
    var instance = this;

    instance._enabled = false;
};

/**
 * Enables the node checkpoint.
 *
 * @method enable
 */
Checkpoint.prototype.enable = function() {
    var instance = this;

    instance._enabled = true;

    instance.refresh();
};

/**
 * Gets the context associated with the node.
 *
 * @method getContext
 * @return {Object} Context object
 */
Checkpoint.prototype.getContext = function() {
    var instance = this;

    return instance._context;
};

/**
 * Gets the node being used as the trigger for the checkpoint.
 *
 * @method getNode
 * @return {Node}
 */
Checkpoint.prototype.getNode = function() {
    var instance = this;

    return instance._node;
};

/**
 * Gets the offset associated with the checkpoint.
 *
 * @method getOffset
 * @return {Number}
 */
Checkpoint.prototype.getOffset = function() {
    var instance = this;

    return instance._offset;
};

/**
 * Checks if the checkpoint has been reached within
 * the scroll context.
 *
 * @method reachedCheckpoint
 * @return {Boolean}
 */
Checkpoint.prototype.reachedCheckpoint = function() {
    var instance = this;

    var scrollPosition = instance._getScrollPosition();

    var triggerPosition = instance._getTriggerPosition();

    return (scrollPosition >= triggerPosition);
};

/**
 * Refreshes the trigger position and checks if it has been
 * reached.
 *
 * @method refresh
 */
Checkpoint.prototype.refresh = function() {
    var instance = this;

    if (instance._triggerPosition) {
        delete instance._triggerPosition;
    }

    instance._reachedCheckpoint = instance.reachedCheckpoint();
};

/**
 * Sets the offset for the node.
 *
 * @method setOffset
 * @param {Number} offset Represents the offset to be used when calculating node position.
 */
Checkpoint.prototype.setOffset = function(offset) {
    var instance = this;

    instance._offset = offset;
};

/**
 * Checks if the checkpoint node has been crossed.
 *
 * @method _crossed
 * @return {Boolean}
 * @protected
 */
Checkpoint.prototype._crossed = function() {
    var instance = this;

    var reachedCheckpoint = instance.reachedCheckpoint();

    var crossed = (reachedCheckpoint !== instance._reachedCheckpoint);

    instance._reachedCheckpoint = reachedCheckpoint;

    return crossed;
};

/**
 * Gets the direction of the scroll based on the scrollEvent.
 *
 * @method _getEventScrollDirection
 * @return {String}
 * @protected
 */
Checkpoint.prototype._getEventScrollDirection = function() {
    var instance = this;

    var scrollEvent = instance._scrollEvent;

    var direction;

    if (scrollEvent.isScrollDown) {
        direction = 'down';
    }
    else if (scrollEvent.isScrollLeft) {
        direction = 'left';
    }
    else if (scrollEvent.isScrollRight) {
        direction = 'right';
    }
    else if (scrollEvent.isScrollUp) {
        direction = 'up';
    }

    return direction;
};

/**
 * Gets the latest scroll position based on the axis and
 * scroll event.
 *
 * @method _getScrollPosition
 * @return {Number} Ending position of the scroll event.
 * @protected
 */
Checkpoint.prototype._getScrollPosition = function() {
    var instance = this;

    var scrollEvent = instance._scrollEvent;

    return (instance._axis === 'vertical') ? scrollEvent.scrollTop : scrollEvent.scrollLeft;
};

/**
 * Gets the current trigger position.
 *
 * @method _getTriggerPosition
 * @return {Number} Number representing trigger position based on axis.
 * @protected
 */
Checkpoint.prototype._getTriggerPosition = function() {
    var instance = this;

    var triggerPosition = instance._triggerPosition;

    if (!triggerPosition) {
        var offsetEdgeNameByAxis = (instance._axis === 'vertical') ? 'offsetTop' : 'offsetLeft';

        var offset = instance._node.get(offsetEdgeNameByAxis);

        var contextNode = instance._context.getNode();

        var contextNodeOffset = isBody(contextNode) ? 0 : contextNode.get(offsetEdgeNameByAxis);

        var optionalOffset = instance._offset;

        triggerPosition = offset - contextNodeOffset - optionalOffset;

        instance._triggerPosition = triggerPosition;
    }

    return triggerPosition;
};

/**
 * Executes the provided callback method.
 *
 * @method _triggerCallback
 * @protected
 */
Checkpoint.prototype._triggerCallback = function() {
    var instance = this;

    var direction = instance._getEventScrollDirection();

    instance._callback(direction);
};

/**
 * A base class for `Context`.
 *
 * @class Context
 * @constructor
 */
var Context = function() {
    Context.superclass.constructor.apply(this, arguments);
};

/**
 * Gets a Context instance based on node or creates a new
 * Context if none exists.
 *
 * @method get
 * @param {Object} options Object containing options for Context.
 * @return {Context}
 * @static
 */
Context.get = function(options) {
    options = options || {};

    options = A.mix(options, Context.DEFAULTS);

    var id = A.stamp(options.node);

    var context = Context.getById(id);

    if (!context) {
        context = new Context(options);

        MAP_CONTEXTS[id] = context;
    }

    return context;
};

/**
 * Gets a Context instance based on node or creates a new
 * Context if none exists.
 *
 * @method getById
 * @param {String} id Id of the node Belonging to the Context.
 * @return {Context}
 * @static
 */
Context.getById = function(id) {
    return MAP_CONTEXTS[id];
};

/**
 * Static object containing default values for Context.
 *
 * @property DEFAULTS
 * @type Object
 * @static
 */
Context.DEFAULTS = {
    enabled: true,
    node: BODY,
    scrollDelay: 0
};

A.extend(
    Context,
    A.Base, {
        /**
         * Init lifecycle method, invoked during construction. Sets up attributes
         * and binds events.
         *
         * @method init
         * @param {Object} options Object containing options for the Context.
         */
        init: function(options) {
            var instance = this;

            instance._enabled = options.enabled;
            instance._node = options.node;
            instance._offset = {};
            instance._scrollDelay = options.scrollDelay;

            instance.bindUI();
        },

        /**
         * Binds the UI scroll events.
         *
         * @method bindUI
         */
        bindUI: function() {
            var instance = this;

            var node = instance._node;

            node.plug(
                A.Plugin.ScrollInfo, {
                    scrollDelay: instance._scrollDelay
                }
            );

            var scrollHandler = node.scrollInfo.on(
                'scroll',
                function(event) {
                    if (instance._enabled) {
                        instance.fire('scroll', event);
                    }
                },
                instance
            );

            var scrollBottomHandler = node.scrollInfo.on(
                'scrollToBottom',
                function(event) {
                    if (instance._enabled) {
                        instance.fire('scrollToBottom', event);
                    }
                },
                instance
            );

            var scrollRightHandler = node.scrollInfo.on(
                'scrollToRight',
                function(event) {
                    if (instance._enabled) {
                        instance.fire('scrollToRight', event);
                    }
                },
                instance
            );

            instance._handles = [scrollHandler, scrollBottomHandler, scrollRightHandler];
        },

        /**
         * Destroy lifecycle method. Invokes destructors for the class hierarchy.
         *
         * @method destroy
         */
        destroy: function() {
            var instance = this;

            A.Array.invoke(instance._handles, 'detach');
        },

        /**
         * Enables the Context.
         *
         * @method enable
         */
        enable: function() {
            var instance = this;

            instance._enabled = true;
        },

        /**
         * Disables the Context.
         *
         * @method disable
         */
        disable: function() {
            var instance = this;

            instance._enabled = false;
        },

        /**
         * Gets the node belonging to the Context.
         *
         * @method getNode
         * @return {Node}
         */
        getNode: function() {
            var instance = this;

            return instance._node;
        }
    }
);

/**
 * Adds a checkpoint to the current node.  The callback will be executed
 * when the checkpoint is triggered.
 *
 * @method checkpoint
 * @param {Function} callback A function that will be invoked when the checkpoint is triggered.
 * @param {Object} options An object containing options for the checkpoint and context.
 */
A.Node.prototype.checkpoint = function(callback, options) {
    options = options || {};

    var context = options._context;

    if (!context) {
        var contextOptions = options.context;

        if (contextOptions) {
            var contextNode = A.one(contextOptions);

            if (contextNode) {
                contextOptions = {
                    node: contextNode
                };
            }

            if (options.scrollDelay) {
                contextOptions.scrollDelay = options.scrollDelay;
            }

        }
        else if (options.scrollDelay) {
            contextOptions = {
                scrollDelay: options.scrollDelay
            };
        }

        context = Context.get(contextOptions);
    }

    options._context = context;

    this.nodeCheckpoint = new Checkpoint(this, callback, options);
};

/**
 * Adds a checkpoint to all Nodes in the list.  Duplicates the pattern
 * from 'Y.NodeList.prototype.plug'
 *
 * @method checkpoint
 * @return {NodeList} The instance this method was called on.
 */
A.NodeList.prototype.checkpoint = function() {
    var args = arguments;

    A.NodeList.each(this, function(node) {
        A.Node.prototype.checkpoint.apply(A.one(node), args);
    });

    return this;
};

A.Node.Checkpoint = Checkpoint;