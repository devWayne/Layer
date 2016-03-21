var EventEmitter2 = require('eventemitter2').EventEmitter2;
var eventEmitter = new EventEmitter2();
var SUPPORT_FIXED = function() {
    let el = document.createElement('div');
    el.style.position = 'fixed';
    return el.style.position === 'fixed';
}();

var TRANSITION_END = 'onTransitionEnd' in window ? 'transitionEnd' : 'webkitTransitionEnd';
var ROUTE = 'mui-cover';
var ROUTE_INDEX = 0;


function Layer(config) {
    this.config = config || {};
    this.renderUI()
    this.bindUI()
    this.bindRoute();
}


Layer.prototype.renderUI = function() {
    this.$el = $('<div class="mui-cover"></div>');
    if (!SUPPORT_FIXED) {
        this.$el.css({
            position: 'absolute'
        });
    }
    if (this.config.className) {
        this.$el.addClass(this.config.className);
    }
    $('body').append(this.$el);
    return this;
}

Layer.prototype.bindUI = function() {
    var self = this;
    var RESIZE = function() {
        self.$el.css('height', window.innerHeight);
    }
    
    var $body = $('body');
    eventEmitter.on('show', function(){
        if (!SUPPORT_FIXED) {
            window.addEventListener('resize', RESIZE);
        }
        $body.css('-webkit-tap-highlight-color', 'transparent');
    });
    eventEmitter.on('hide', function(){
        if (!SUPPORT_FIXED) {
            window.removeEventListener('resize', RESIZE);
        }

        $body.css('-webkit-tap-highlight-color', '');
    });
    return this;

}


Layer.prototype.bindRoute = function() {
    var self = this;
    if (this.config.disableRoute) {
        return this;
    }

    let route = '#' + (this.config.route || (ROUTE + '-' + ROUTE_INDEX));
    ROUTE_INDEX++;

    if (route === location.hash) {
        this.show();
    }

    eventEmitter.on('show', function() {
        if (location.hash !== route) {
            location.hash = route;
        }
    });
    eventEmitter.on('hide', function() {
        if (location.hash === route) {
            if (history.length && history.length > 1) {
                history.back();
            } else {
                history.replaceState && history.replaceState(null, document.title, location.href.replace(route, ''));
            }
        }
    });

    window.addEventListener('hashchange', function(){
        if (location.hash === route) {
            self.show();
        } else {
            self.hide();
        }
    });

    return this;
}

Layer.prototype.setContent = function(content) {
        this.$el.empty().append(content);
        return this;
    }
    /**
     * 显示cover
     *
     *      cover.show()
     *
     * @method show
     * @chainable
     */
Layer.prototype.show = function() {
    var self = this;
    this.showed = true;
    if (!SUPPORT_FIXED) {
        this.$el.css({
            top: window.pageYOffset,
            height: window.innerHeight
        });
    }
    this.$el.show();
    setTimeout(function(){
        self.$el.addClass('show');
        eventEmitter.emit('show');
    }, 50);

    return this;
}

Layer.prototype.hide = function() {
    var self = this;
    if (this.showed) {
        this.showed = false;
    } else {
        return this;
    }
    let listener;
    this.$el.on(TRANSITION_END, listener = function(){
        self.$el.hide();
        self.$el.off(TRANSITION_END, listener);
    });
    this.$el.removeClass('show');
    eventEmitter.emit('hide');

    return this;
}

Layer.prototype.destroy = function() {
    this.hide();
    this.$el.remove();
}

module.exports = Layer;


