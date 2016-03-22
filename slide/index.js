var Layer = require("../index");

var TPL =
    '<div class="header">\
        <h1></h1>\
        <a class="back">返回</a>\
    </div>\
    <div class="body"></div>';

function Slide(config) {
    this.config = $.extend({
        headerContent: '标题',
        bodyContent: '',
        setWebViewTitle: false
    }, config);

    //Layer.apply(this, this.config);

    this.setContent(TPL);

    if (this.config.hideHeader) {
        this.$el.find('.header').addClass('hide');
    }

    this.setHeaderContent(config.headerContent)
    this.setBodyContent(config.bodyContent)
    this.bindBack()
    this.bindScroll();

}

Slide.prototype = new Layer();
Slide.prototype.constructor = Slide;


Slide.prototype.bindScroll = function() {
        var self = this;
        //滚动
        var $body = this.$el.find('.body');

        var PREVENT_SCROLL = this.config.touchstart || function(e) {
            if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A'].indexOf(e.target.nodeName) === -1) {
                e.preventDefault();
            }
        };

        //页头的滚动始终阻止
        this.$el.find('.header').on('touchstart', function(e) {
            PREVENT_SCROLL(e);
        });

        var prevY;
        $body.on('touchstart', function(e) {
            prevY = e.touches[0].pageY;
        }).on('touchmove', function(e) {
            if (!self.showed) {
                return;
            }
            var y = e.touches[0].pageY;
            var el = $body[0];
            if (y - prevY > 0 && el.scrollTop === 0) {
                PREVENT_SCROLL(e);
            } else if (y - prevY < 0 && el.scrollTop + $body.height() === el.scrollHeight) {
                PREVENT_SCROLL(e);
            }
        });
        return this;
    }
    /**
     * 绑定返回按钮
     * @method bindBack
     * @private
     * @chainable
     */
Slide.prototype.bindBack = function() {
        var self = this;
        if (!this.config.hideHeader) {
            this.$el.find('.header .back').on('click', function(e) {
                e.preventDefault();
                self.hide();
            });
        }
        return this;
    }
    /**
     * 设置页头内容
     *
     *      slidingMenu.setHeaderContent('<em>xxx</em>')
     *      slidingMenu.setHeaderContent(S.find('em'))
     *      slidingMenu.setHeaderContent(document.querySelector('em'))
     *
     * @method setHeaderContent
     * @param content {String|HTMLElement|Node} 页头内容
     * @chainable
     */
Slide.prototype.setHeaderContent = function(content) {
        this.config.headerContent = content;
        this.$el.find('.header h1').empty().append(content);
        return this;
    }
    /**
     * 设置主体内容
     *
     *      slidingMenu.setBodyContent('<div>xxx</div>')
     *      slidingMenu.setBodyContent(S.find('div'))
     *      slidingMenu.setBodyContent(document.querySelector('div'))
     *
     * @method setBodyContent
     * @param content {String|HTMLElement|Node} 主体内容
     * @chainable
     */
Slide.prototype.setBodyContent = function(content) {
    this.$el.find('.body').empty().append(content);
    return this;
}

module.exports = Slide;
window.Slide = Slide;
