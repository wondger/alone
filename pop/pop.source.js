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
    var ua = navigator.userAgent.toLowerCase();

    //util
    var U = {
        isU:function(o){
            return o === void 0;
        },
        isS:function(o){
            return !U.isU(o) && o.constructor == String;
        },
        isN:function(o){
            return !U.isU(o) && o.constructor == Number;
        },
        isO:function(o){
            return !U.isU(o) && o.constructor == Object;
        },
        isF:function(o){
            return !U.isU(o) && o.constructor == Function;
        },
        isA:function(o){
            return !U.isU(o) && o.constructor == Array;
        },
        isE:function(o){
            return !U.isU(o) && !!(o && o.nodeType && o.nodeType == 1);
        },
        /*
         * window,document,document.documentElement,element
         */
        isDOM:function(o){
            return o === win || o === doc || o === docE || U.isE();
        },
        isStrict:doc.compatMode === 'CSS1Compat',
        each:function(arr,fn){
            if(!U.isA(arr) || !U.isF(fn)) return;
            
            var i = 0,l = arr.length;
            while(i<l,fn.call(null,arr[i++]));
        },
        ua:{
            ie:/msie/.test(ua) && !/opera/i.test(ua),
            ie6:/msie 6/.test(ua)
        }
    };

    //DOM
    var D = {
        //create
        c:function(tag,attr){
            if(!U.isS(tag)) return;

            var el = doc.createElement(tag);

            if(U.isO(attr)){
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
        //addCSS
        ac:function(css){
            var ele = D.c('style',{'type':'text/css'});

            (doc.head || doc.getElementsByTagName('head')[0]).appendChild(ele);

            if(ele.styleSheet){
                ele.styleSheet.cssText = css;
            }else{
                ele.appendChild(doc.createTextNode(css));
            }

            return ele;
        },
        //viewportSize
        vs:function(){
            return U.ua.ie
                ? (U.isStrict
                        ? {width:docE.clientWidth,height:docE.clientHeight}
                        : {width:doc.body.clientWidth,height:doc.body.clientHeight})
                : {width:win.innerWidth,height:win.innerHeight};
        },
        //windowSize
        ws:function(){
            return {
                width:Math.max(doc.body.clientWidth,doc.body.scrollWidth),
                height:Math.max(doc.body.clientHeight,doc.body.scrollHeight)
            }
        },
        //scrollTop
        st:function(){
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
        },
        fire:function(evt,_){
            U.each(evt,function(fn){
                fn.call(_);
            });
        }
    };

    var _Pop = function(cfg){
        var _ = this;

        _._cfg(cfg);
        //private property
        _._pop,_._close,_._iframe,_._mask,_._style;

        _.evt = {close:[],show:[]};
    };

    var Pop = function(cfg){
        return new _Pop(cfg);
    };
    _Pop.prototype = {
        render:function(cfg){
            var _ = this;

            _._cfg(cfg);

            //invoke destroy when every render
            _.destroy();

            _._style = D.ac([
                '.'+_.prefixCls+'alone_pop{',
                'display:none;',
                'position:'+(U.ua.ie6 ? 'absolute' : 'fixed')+';',
                'width:'+_.width+'px;height:'+_.height+'px;',
                'z-index:100000',
                '}',
                '.'+_.prefixCls+'alone_pop_x{',
                'position:absolute;top:5px;right:5px;',
                'display:block;',
                'width:20px;height:20px;',
                '}',
                '.'+_.prefixCls+'alone_mask{',
                'display:none;',
                'position:absolute;left:0;top:0;',
                'width:100%;height:100%;background:#000;',
                'opacity:0.5;filter:alpha(opacity=50);',
                'z-index:99999',
                '}'
            ].join(''));

            var f = doc.createDocumentFragment();

            _._pop = D.c('div',{'class':_.prefixCls+'alone_pop'});
            _.url && (_._iframe = D.c('iframe',{
                'src':_.url,
                'width':'100%',
                'height':'100%',
                'scrolling':_.scroll,
                'frameBorder':'0',
                'allowtransparency':false
            }));
            _.closable && (_._close = D.c('a',{
                'href':'javascript:void(0)',
                'class':_.prefixCls+'alone_pop_x'
            }));
            _._mask = _.maskable
                ? D.c('div',{'class':_.prefixCls+'alone_mask'})
                : null;

            //ie6 select window module bugfix
            //can not display mask's backgroundColor
            var maskIframe = null;
            if(U.ua.ie6) maskIframe = D.c('iframe',{
                src:'about:blank',
                width:'100%',
                height:'100%',
                frameBorder:'0',
                scrolling:'no'
            });

            maskIframe && _._mask && _._mask.appendChild(maskIframe);
            _._mask && f.appendChild(_._mask);
            _._iframe && _._pop && _._pop.appendChild(_._iframe);
            _._close && _._pop && _._pop.appendChild(_._close);
            _._pop && f.appendChild(_._pop);

            doc.body.appendChild(f);

            _._bind();

            return _;
        },
        _cfg:function(cfg){
            var _ = this;
            _.cfg = cfg = !!cfg && cfg || {};

            //pop type:dialog,overlay(default)
            _.type = cfg.type && U.isS(cfg.type) && cfg.type || _.type || '';

            _.srcNode = cfg.srcNode && U.isE(cfg.srcNode) && cfg.srcNode || _.srcNode || null;

            //iframe url
            _.url = !_.srcNode && cfg.url && U.isS(cfg.url) && cfg.url || _.url || '';
            _.width = Number(cfg.width) || _.width || 0;
            _.height = Number(cfg.height) || _.height || 0;
            _.scroll = !!cfg.scroll && 'yes' || _.scroll || 'no';

            _.trigger = U.isE(cfg.trigger) && cfg.trigger || _.trigger || null;

            _.maskable = U.isU(cfg.maskable) ? (U.isU(_.maskable) ? true : _.maskable) : !!cfg.maskable;
            _.closable = U.isU(cfg.closable) ? (U.isU(_.closable) ? true : _.closable) : !!cfg.closable;
            _.prefixCls = !!cfg.prefixCls && U.isS(cfg.prefixCls)
                && cfg.prefixCls || _.prefixCls || '';
        },
        _bind:function(){
            var _ = this;
            E.on(win,'resize',function(){
                _.fixed(true);
            });

            E.on(win,'scroll',function(){
                _.fixed(true);
            });

            _.closable && _._close && (E.on(_._close,'click',function(){
                _.hide();

                E.fire(_.evt.close,_);
            }));

            return _;
        },
        fixed:function(refixed){
            var _ = this;
            var vs = D.vs(),
                ws = D.ws();

            if(_._pop){
                var offsetTop = (vs.height - _.height)/2;
                _._pop.style.left = (vs.width - _.width)/2 + 'px';
                _._pop.style.top = offsetTop + 'px';

                U.ua.ie6 && (_._pop.style.top = D.st() + offsetTop + 'px');
            }

            if(!!refixed) return;

            if(_._mask){
                _._mask.style.width = ws.width + 'px';
                _._mask.style.height = ws.height + 'px';
            }

            return _;
        },
        show:function(url){
            var _ = this;

            if(U.isS(url)){
                _._iframe && (_._iframe.src = url) || (_._iframe = D.c('iframe',{
                    'src':url,
                    'width':'100%',
                    'height':'100%',
                    'scrolling':_.scroll,
                    'frameBorder':'0',
                    'allowtransparency':false
                })) && _._pop && _._pop.appendChild(_._iframe);
            }

            _.fixed();
            _._pop && (_._pop.style.display = 'block');
            _._mask && (_._mask.style.display = 'block');

            E.fire(_.evt.show,_);

            return _;
        },
        hide:function(){
            var _ = this;
            _._pop && (_._pop.style.display = 'none');
            _._mask && (_._mask.style.display = 'none');

            return _;
        },
        destroy:function(){
            var _ = this;
            _._pop && _._pop.parentNode.removeChild(_._pop);
            _._mask && _._mask.parentNode.removeChild(_._mask);
            _._style && _._style.parentNode.removeChild(_._style);

            return _;
        },
        on:function(evt,fn){
            if(!U.isS(evt) || !U.isF(fn)) return this;

            var _ = this,
                evt = evt.toLowerCase();
            _.evt[evt] && _.evt[evt].push(fn);

            return _;
        }
    };

    win.Pop = Pop;
})(document,document.documentElement,window);
