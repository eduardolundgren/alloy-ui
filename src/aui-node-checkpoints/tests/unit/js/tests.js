YUI.add('aui-node-checkpoints-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-node-checkpoints');

    suite.add(new Y.Test.Case({
        name: 'Node Checkpoint Tests',

        tearDown: function() {
            if (this.checkpoint) {
                if (Y.Lang.isArray(this.checkpoint)) {
                    Y.Array.invoke(this.checkpoint, 'destroy');
                }
                else {
                    this.checkpoint.destroy();
                }
            }

            window.scrollTo(0, 0);
        },

        'Scroll delay accurately delays callback execution': function() {
            var checkpointNode = Y.one('#delayTrigger'),
                context,
                endTime,
                startTime;

            checkpointNode.checkpoint(function() {
                endTime = new Date().getTime();
            },
            {
                scrollDelay: 50
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            context = this.checkpoint.getContext();

            startTime = new Date().getTime();

            window.scrollTo(0, 2000);

            this.wait(function() {
                Y.Assert.isTrue((endTime - startTime) > 50);

                window.scrollTo(0, 0);

                checkpointNode.checkpoint(function() {
                    endTime = new Date().getTime();
                },
                {
                    context: 'body',
                    scrollDelay: 50
                });

                startTime = new Date().getTime();

                window.scrollTo(0, 2000);

                this.wait(function() {
                    Y.Assert.isTrue((endTime - startTime) > 50);
                }, 500);
            }, 500);
        },

        'Context options are set correctly': function() {
            var checkpointNode = Y.one('#triggerDisabled'),
                context,
                contextNode = Y.getBody(),
                offset = 50;

            checkpointNode.checkpoint(function() {},
                {
                    context: 'body'
                }
            );

            this.checkpoint = checkpointNode.nodeCheckpoint;

            context = this.checkpoint.getContext();

            this.checkpoint.disable();
            context.disable();

            Y.Assert.isFalse(this.checkpoint._enabled);
            Y.Assert.isFalse(context._enabled);

            this.checkpoint.setOffset(offset);
            this.checkpoint.enable();
            context.enable();

            Y.Assert.isTrue(this.checkpoint._enabled);
            Y.Assert.isTrue(context._enabled);

            Y.Assert.areEqual(this.checkpoint.getOffset(), offset);

            Y.Assert.isTrue(contextNode.compareTo(context.getNode()));
            Y.Assert.isTrue(checkpointNode.compareTo(this.checkpoint.getNode()));
        },

        'triggerAtTheEnd triggers checkpoint at the end': function() {
            var container = Y.one('#triggerAtTheEnd'),
                triggered = false;

            //trigger at the end vertically
            container.checkpoint(
                function() {
                    triggered = true;
                },
                {
                    context: container,
                    triggerAtTheEnd: true
                }
            );

            this.checkpoint = container.nodeCheckpoint;

            container.set('scrollTop', container.get('scrollHeight'));

            this.wait(function() {
                Y.Assert.isTrue(triggered);

                this.checkpoint.destroy();

                triggered = false;

                container.setStyle('whiteSpace', 'nowrap');

                //trigger at the end horizontally
                container.checkpoint(
                    function() {
                        triggered = true;
                    },
                    {
                        axis: 'horizontal',
                        context: container,
                        triggerAtTheEnd: true
                    }
                );

                container.set('scrollLeft', container.get('scrollWidth'));

                this.wait(function() {
                    Y.Assert.isTrue(triggered);
                }, 100);
            }, 100);
        },

        'triggerAtTheEnd does not trigger when disabled': function() {
            var container = Y.one('#triggerAtTheEnd'),
                context,
                triggered = false;

            container.setStyle('whiteSpace', 'initial');

            container.checkpoint(
                function() {
                    triggered = true;
                },
                {
                    context: container,
                    enabled: false,
                    triggerAtTheEnd: true
                }
            );

            this.checkpoint = container.nodeCheckpoint;

            context = this.checkpoint.getContext();

            context.disable();

            container.set('scrollTop', container.get('scrollHeight'));

            this.wait(function() {
                Y.Assert.isFalse(triggered);

                triggered = false;

                this.checkpoint.destroy();

                container.setStyle('whiteSpace', 'nowrap');

                container.checkpoint(
                    function() {
                        triggered = true;
                    },
                    {
                        axis: 'horizontal',
                        context: container,
                        enabled: true,
                        triggerAtTheEnd: true
                    }
                );

                container.set('scrollLeft', 0);

                container.set('scrollLeft', container.get('scrollWidth'));

                this.wait(function() {
                    Y.Assert.isFalse(triggered);
                }, 100);
            }, 100);
        },

        'triggerAtTheEnd triggers after being enabled': function() {
            var container = Y.one('#triggerAtTheEnd'),
                context,
                triggered = false;

            container.setStyle('whiteSpace', 'initial');

            container.checkpoint(
                function() {
                    triggered = true;
                },
                {
                    context: container,
                    enabled: true,
                    triggerAtTheEnd: true
                }
            );

            this.checkpoint = container.nodeCheckpoint;

            context = this.checkpoint.getContext();

            context.enable();

            this.checkpoint.disable();

            container.set('scrollTop', container.get('scrollHeight'));

            this.wait(function() {
                Y.Assert.isFalse(triggered);
            }, 100);
        },

        'Checkpoint triggers at a specific node': function() {
            var checkpointNode = Y.one('#triggerAtNode #checkpoint'),
                triggered = false;

            checkpointNode.checkpoint(function() {
                triggered = true;
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            window.scrollTo(0, 2000);

            this.wait(function() {
                Y.Assert.isTrue(triggered);
            }, 100);
        },

        'Checkpoint triggers pass correct direction to callback method': function() {
            var checkpointNode = Y.one('#triggerDirection'),
                scrollDirection;

            checkpointNode.setStyle('top', '200px');

            checkpointNode.checkpoint(function(direction) {
                scrollDirection = direction;
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            window.scrollTo(0, 3000);

            this.wait(function() {
                Y.Assert.areEqual('down', scrollDirection);

                window.scrollTo(0, 0);

                this.wait(function() {
                    Y.Assert.areEqual('up', scrollDirection);

                    this.checkpoint.destroy();

                    checkpointNode.setStyles(
                        {
                            'top': 0,
                            'left': '2000px'
                        }
                    );

                    checkpointNode.next('.spacer').setStyle('width', '5000px');

                    checkpointNode.checkpoint(function(direction) {
                        scrollDirection = direction;
                    },
                    {
                        axis: 'horizontal'
                    });

                    window.scrollTo(2000, 0);

                    this.wait(function() {
                        Y.Assert.areEqual('right', scrollDirection);

                        window.scrollTo(0, 0);

                        this.wait(function() {
                            Y.Assert.areEqual('left', scrollDirection);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        },

        'Checkpoint does not fire when disabled': function() {
            var checkpointNode = Y.one('#triggerDisabled'),
                triggered = false;

            checkpointNode.checkpoint(function() {
                triggered = true;
            },
            {
                enabled: false
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            window.scrollTo(0, 2000);

            this.wait(function() {
                Y.Assert.isFalse(triggered);

                this.checkpoint.enable();

                window.scrollTo(0, 0);
                window.scrollTo(0, 2000);

                this.wait(function() {
                    Y.Assert.isTrue(triggered);

                    this.checkpoint.disable();

                    triggered = false;

                    window.scrollTo(0, 0);
                    window.scrollTo(0, 2000);

                    Y.Assert.isFalse(triggered);
                }, 100);
            }, 100);
        },

        'Checkpoints can be set on NodeList': function() {
            var triggers = Y.all('#triggerList .checkpoint'),
                checkpoints = [];

            triggers.checkpoint(function() {});

            triggers.each(
                function(node) {
                    Y.Assert.isNotUndefined(node.nodeCheckpoint);

                    checkpoints.push(node.nodeCheckpoint);
                }
            );

            this.checkpoint = checkpoints;
        },

        'Refresh method updates trigger position': function() {
            var checkpointNode = Y.one('#refreshTrigger'),
                checkpointPosition;

            checkpointNode.checkpoint(function() {},
            {
                triggerAtTheEnd: true
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            this.checkpoint.refresh();

            checkpointPosition = this.checkpoint._getTriggerPosition();

            checkpointNode.setStyle('top', '500px');

            Y.Assert.areEqual(checkpointPosition, this.checkpoint._getTriggerPosition());

            this.checkpoint.refresh();

            Y.Assert.areNotEqual(checkpointPosition, this.checkpoint._getTriggerPosition());
        },

        'destroying context disables checkpoint': function() {
            var checkpointNode = Y.one('body'),
                docHeight = checkpointNode.height(),
                triggered = false;

            checkpointNode.checkpoint(
                function() {
                    triggered = true;
                },
                {
                    triggerAtTheEnd: true
                }
            );

            this.checkpoint = checkpointNode.nodeCheckpoint;

            var context = this.checkpoint.getContext();

            window.scrollTo(0, docHeight);

            this.wait(function() {
                Y.Assert.isTrue(triggered);

                triggered = false;

                window.scrollTo(0, 0);

                context.destroy();

                window.scrollTo(0, docHeight);

                this.wait(function() {
                    Y.Assert.isFalse(triggered);
                }, 100);
            }, 100);
        },

        'Checkpoint works with existing context': function() {
            var checkpointNodeA = Y.one('#triggerAtNode'),
                checkpointNodeB = Y.one('#triggerAtNode #checkpoint'),
                context;

            this.checkpoint = [];

            checkpointNodeA.checkpoint(function() {},
                {
                    context: '#container'
                }
            );

            this.checkpoint.push(checkpointNodeA.nodeCheckpoint);

            context = checkpointNodeA.nodeCheckpoint.getContext();

            checkpointNodeB.checkpoint(function() { },
            {
                _context: context
            });

            this.checkpoint.push(checkpointNodeB.nodeCheckpoint);

            Y.Assert.areEqual(context, checkpointNodeB.nodeCheckpoint.getContext());
        },

        'An invalid context will throw an error': function () {
            var checkpointNode = Y.one('#triggerAtNode #checkpoint'),
                errorCaught = false;

            try {
                checkpointNode.checkpoint(function() {},
                {
                    context: '#invalidContext'
                });

                this.checkpoint = checkpointNode.nodeCheckpoint;
            }
            catch (error) {
                errorCaught = true;
            }

            Y.Assert.isTrue(errorCaught);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['array-invoke', 'test', 'aui-node-checkpoints']
});