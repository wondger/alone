/*
 * @name:pop.js
 * @description:pop
 * @author:wondger@gmail.com
 * @date:2012-02-23
 * @param:
 * @todo:
 * @changelog:
 */
(function(doc,docE,win,undefined){
    var ua = window.navigator.userAgent.toLowerCase();

    var U = util = {
        isUndefined:function(o){
            return o === void 0;
        },
        isString:function(o){
            return o.constructor == String;
        },
        isNumber:function(o){
            return o.constructor == Number;
        },
        isObject:function(o){
            return o.constructor == Object;
        },
        isFunction:function(o){
            return o.constructor == Function;
        },
        isElement:function(o){
            return !!(o && o.nodeType && o.nodeType == 1);
        },
        /*
         * window,document,document.documentElement,element
         */
        isDOM:function(o){
            return o === win || o === doc || o === docE || U.isElement();
        },
        ua:{
            ie:/msie/.test(ua) && !/opera/i.test(ua),
            ie6:/msie 6/.test(ua)
        }
    };
    var D = DOM = {
        create:function(tag,attr){
            if(!U.isString(tag)) return;

            var el = doc.createElement(tag);

            if(U.isObject(attr)){
                for(var k in attr){
                    el.setAttribute(k,attr[k]);
                }
            }

            return el;
        },
        addCSS:function(css){
            var ele = D.create('style',{'type':'text/css'});

            (doc.head || doc.getElementsByTagName('head')[0]).appendChild(ele);

            if(ele.styleSheet){
                ele.styleSheet.cssText = css;
            }else{
                ele.appendChild(doc.createTextNode(css));
            }
        }
    };
    var E = Event = {
        bind:function(ele,type,handle){
            var type = /^(on)/.test(type) ? type.substr(2) : type;
            if(ele.addEListener){
                ele.addEListener(type,function(){handle.call(ele)},false);
            }else if(ele.attachE){
                ele.attachE('on'+type,function(){handle.call(ele)});
            }else{
                var _handle = ele['on'+type];
                ele['on'+type] = function(){
                    if(_handle) _handle.call(ele);
                    handle.call(ele);
                }
            }
        }
    };

    var _Pop = function(cfg){
        this.cfg = cfg = cfg || {};

        //pop type:dialog,overlay(default)
        this.type = cfg.type && U.isString(cfg.type) && cfg.type || '';


        this.srcNode = cfg.srcNode && U.isElement(cfg.srcNode) && cfg.srcNode || null;

        //iframe url
        this.url = cfg.url && U.isString(cfg.url) && cfg.url || '';
        this.width = Number(cfg.width) || 0;
        this.height = Number(cfg.height) || 0;

        this.trigger = U.isElement(cfg.trigger) && cfg.trigger || null;

        this.maskable = U.isUndefined(cfg.maskable) && true || !!cfg.maskable;
        this.closable = U.isUndefined(cfg.closable) && true || !!cfg.closable;
        this.prefixCls = cfg.prefixCls && U.isString(cfg.prefixCls)
            && cfg.prefixCls + '_'
            || '';

        this._pop = null;
        this._iframe = null;
        this._mask = null;
    };

    var Pop = function(cfg){
        return new _Pop(cfg);
    };
    _Pop.prototype = {
        render:function(cfg){
            D.addCSS([
                '.'+this.prefixCls+'alone_pop{',
                'position:'+(U.ua.ie6 ? 'absolute' : 'fixed')+';',
                'width:'+this.width+'px;height:'+this.height+'px',
                '}',
                '.'+this.prefixCls+'alone_mask{',
                'position:absolute;width:100%;height:100%;background:#000;',
                'opacity:0.5;filter:alpha(opacity=50)',
                '}'
            ].join(''));

            var f = document.createDocumentFragment();

            this._pop = D.create('div',{'class':this.prefixCls+'alone_pop'});
            this._mask = this.maskable
                ? D.create('div',{'class':this.prefixCls+'alone_mask'})
                : null;

            this._pop && f.appendChild(this._pop);
            this._mask && f.appendChild(this._mask);

            document.body.appendChild(f);

            return this;
        },
        show:function(url){
        },
        hide:function(){
        },
        destroy:function(){
        }
    };

    window.Pop = Pop;
})(document,document.documentElement,window);
