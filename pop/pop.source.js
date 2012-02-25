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
        isStrict:doc.compatMode === 'CSS1Compat',
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
                    switch(k.toLowerCase()){
                        case 'class':
                            el.setAttribute(U.ua.ie6?'className':'class',attr[k]);
                            break;
                        default:
                            el.setAttribute(k,attr[k]);
                            break;
                    }
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
        },
        viewSize:function(){
            return U.ua.ie
                ? (U.isStrict
                        ? {width:docE.clientWidth,height:docE.clientHeight}
                        : {width:doc.body.clientWidth,height:doc.body.clientHeight})
                : {width:win.innerWidth,height:win.innerHeight};
        },
        winSize:function(){
            return {
                width:Math.max(doc.body.clientWidth,doc.body.scrollWidth),
                height:Math.max(doc.body.clientHeight,doc.body.scrollHeight)
            }
        },
        scrollTop:function(){
            return win.pageYOffset || docE.scrollTop || doc.body.scrollTop;
        }
    };
    var E = Event = {
        on:function(ele,type,handle){
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
        this.scroll = !!cfg.scroll && 'yes' || 'no';

        this.trigger = U.isElement(cfg.trigger) && cfg.trigger || null;

        this.maskable = U.isUndefined(cfg.maskable) && true || !!cfg.maskable;
        this.closable = U.isUndefined(cfg.closable) && true || !!cfg.closable;
        this.prefixCls = cfg.prefixCls && U.isString(cfg.prefixCls)
            && cfg.prefixCls + '_'
            || '';

        this._pop = null;
        this._iframe = null;
        this._mask = null;

        this._rendered = false;
    };

    var Pop = function(cfg){
        return new _Pop(cfg);
    };
    _Pop.prototype = {
        render:function(cfg){
            if(this._rendered) return this;

            D.addCSS([
                '.'+this.prefixCls+'alone_pop{',
                'display:none;',
                'position:'+(U.ua.ie6 ? 'absolute' : 'fixed')+';',
                'width:'+this.width+'px;height:'+this.height+'px;',
                'z-index:100000',
                '}',
                '.'+this.prefixCls+'alone_mask{',
                'display:none;',
                'position:absolute;left:0;top:0;',
                'width:100%;height:100%;background:#000;',
                'opacity:0.5;filter:alpha(opacity=50);',
                'z-index:99999',
                '}'
            ].join(''));

            var f = document.createDocumentFragment();

            this._pop = D.create('div',{'class':this.prefixCls+'alone_pop'});
            this.url && (this._iframe = D.create('iframe',{
                'src':this.url,
                'width':'100%',
                'height':'100%',
                'scrolling':this.scroll,
                'frameBorder':'0',
                'allowtransparency':false
            }));
            this._mask = this.maskable
                ? D.create('div',{'class':this.prefixCls+'alone_mask'})
                : null;

            //ie6 select window module bugfix
            //can not display mask's backgroundColor
            var maskIframe = null;
            if(U.ua.ie6) maskIframe = D.create('iframe',{
                src:'about:blank',
                width:'100%',
                height:'100%',
                frameBorder:'0',
                scrolling:'no'
            });

            maskIframe && this._mask && this._mask.appendChild(maskIframe);
            this._mask && f.appendChild(this._mask);
            this._iframe && this._pop && this._pop.appendChild(this._iframe);
            this._pop && f.appendChild(this._pop);

            document.body.appendChild(f);

            this._bind();

            this._rendered = true;
            return this;
        },
        _bind:function(){
            var self = this;
            E.on(win,'resize',function(){
                self.fixed(true);
            });


            E.on(win,'scroll',function(){
                self.fixed(true);
            });
        },
        fixed:function(refixed){
            var vs = D.viewSize(),
                ws = D.winSize();

            if(this._pop){
                var offsetTop = (vs.height - this.height)/2;
                this._pop.style.left = (vs.width - this.width)/2 + 'px';
                this._pop.style.top = offsetTop + 'px';

                U.ua.ie6 && (this._pop.style.top = D.scrollTop() + offsetTop + 'px');
            }

            if(!!refixed) return;

            if(this._mask){
                this._mask.style.width = ws.width + 'px';
                this._mask.style.height = ws.height + 'px';
            }
        },
        show:function(url){
            this.fixed();
            this._pop && (this._pop.style.display = 'block');
            this._mask && (this._mask.style.display = 'block');
        },
        hide:function(){
            this._pop && (this._pop.style.display = 'none');
            this._mask && (this._mask.style.display = 'none');
        },
        destroy:function(){
        }
    };

    window.Pop = Pop;
})(document,document.documentElement,window);
