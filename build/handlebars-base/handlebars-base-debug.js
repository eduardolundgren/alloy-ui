/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add('handlebars-base', function(Y) {

/*!
Handlebars.js - Copyright (C) 2011 Yehuda Katz
https://raw.github.com/wycats/handlebars.js/master/LICENSE
*/
/* THIS FILE IS GENERATED BY A BUILD SCRIPT - DO NOT EDIT! */

// BEGIN(BROWSER)

/*jshint eqnull:true*/
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.5";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});

// END(BROWSER)
// This file provides a YUI-specific implementation of Handlebars' lib/utils.js
// file. Handlebars unfortunately creates enclosed references to its utils, so
// we have to maintain a complete fork of this file rather than just overriding
// specific parts.

var Lang = Y.Lang;

Handlebars.Exception = function (message) {
    var error = Error.prototype.constructor.apply(this, arguments),
        key;

    for (key in error) {
        if (error.hasOwnProperty(key)) {
            this[key] = error[key];
        }
    }

    this.message = error.message;
};

Handlebars.Exception.prototype = new Error();

Handlebars.SafeString = function (string) {
    this.string = string;
};

Handlebars.SafeString.prototype.toString = function () {
    return this.string.toString();
};

Handlebars.Utils = {
    escapeExpression: function (string) {
        // Skip escaping for empty strings.
        if (string === '') {
            return string;
        }

        // Don't escape SafeStrings, since they're already (presumed to be)
        // safe.
        if (string instanceof Handlebars.SafeString) {
            return string.toString();
        } else if (string === false || !Lang.isValue(string)) {
            return '';
        }

        // Unlike Handlebars' escaping implementation, Y.Escape.html() will
        // double-escape existing &amp; entities. This seems much less
        // surprising than avoiding double-escaping, especially since
        // a lack of double-escaping would make it impossible to use Handlebars
        // for things like displaying escaped code snippets.
        return Y.Escape.html(string);
    },

    isEmpty: function (value) {
        if (value === false
                || !Lang.isValue(value)
                || (Lang.isArray(value) && !value.length)) {

            return true;
        }

        return false;
    }
};
/* THIS FILE IS GENERATED BY A BUILD SCRIPT - DO NOT EDIT! */

// BEGIN(BROWSER)
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;

// END(BROWSER)
// This file contains YUI-specific wrapper code and overrides for the
// handlebars-base module.

/**
Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.

@module handlebars
@main handlebars
*/

/**
Provides basic Handlebars template rendering functionality. Use this module when
you only need to render pre-compiled templates.

@module handlebars
@submodule handlebars-base
*/

/**
Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.

@class Handlebars
*/
Y.Handlebars = Handlebars;

Handlebars.VERSION += '-yui';

// The rest of this file is just API docs for methods defined in Handlebars
// itself.

/**
Registers a helper function that will be made available to all templates.

Helper functions receive the current template context as the `this` object, and
can also receive arguments passed by the template.

@example

    Y.Handlebars.registerHelper('linkify', function () {
        return '<a href="' + Y.Escape.html(this.url) + '">' +
            Y.Escape.html(this.text) + '</a>';
    });

    var source = '<ul>{{#each links}}<li>{{linkify}}</li>{{/each}}</ul>';

    Y.Handlebars.render(source, {
        links: [
            {url: '/foo', text: 'Foo'},
            {url: '/bar', text: 'Bar'},
            {url: '/baz', text: 'Baz'}
        ]
    });

@method registerHelper
@param {String} name Name of this helper.
@param {Function} fn Helper function.
@param {Boolean} [inverse=false] If `true`, this helper will be considered an
    "inverse" helper, like "unless". This means it will only be called if the
    expression given in the template evaluates to a false or empty value.
*/

/**
Registers a partial that will be made available to all templates.

A partial is another template that can be used to render part of a larger
template. For example, a website with a common header and footer across all its
pages might use a template for each page, which would call shared partials to
render the headers and footers.

Partials may be specified as uncompiled template strings or as compiled template
functions.

@example

    Y.Handlebars.registerPartial('header', '<h1>{{title}}</h1>');
    Y.Handlebars.registerPartial('footer', 'Copyright (c) 2011 by Me.');

    var source = '{{> header}} <p>Mustaches are awesome!</p> {{> footer}}';

    Y.Handlebars.render(source, {title: 'My Page About Mustaches'});

@method registerPartial
@param {String} name Name of this partial.
@param {Function|String} partial Template string or compiled template function.
*/

/**
Converts a precompiled template into a renderable template function.

@example

    <script src="precompiled-template.js"></script>
    <script>
    YUI().use('handlebars-base', function (Y) {
        // Convert the precompiled template function into a renderable template
        // function.
        var template = Y.Handlebars.template(precompiledTemplate);

        // Render it.
        template({pie: 'Pumpkin'});
    });
    </script>

@method template
@param {Function} template Precompiled Handlebars template function.
@return {Function} Compiled template function.
*/


}, '3.5.0' ,{requires:['escape']});
