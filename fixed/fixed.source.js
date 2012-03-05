/*
 * @name:fixed.source.js
 * @description:position:fixed
 * @author:wondger@gmail.com
 * @date:2012-03-05
 * @param:
 * @todo:
 * @changewinlog:
 */
!function(doc,rt,win,undefined){
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
            return o === win || o === doc || o === rt || U.isE();
        },
        isStrict:doc.compatMode === 'CSS1Compat',
        each:function(arr,fn){
            if(!U.isA(arr) || !U.isF(fn)) return;
            
            var i = 0,l = arr.length;
            while(i<l,fn.call(null,arr[i++]));
        },
        trim:function(s){
            return s.replace(/^\s+/,'').replace(/\s+$/,'');
        },
        //substitute
        ss:function(s,o){
            return s.replace(/{{([^}{2}]+)}}/g,function(a,b){
                return b && o[b] || '';
            });
        },
        ua:{
            ie:/msie/.test(ua) && !/opera/i.test(ua),
            ie6:/msie 6/.test(ua)
        }
    },

    //DOM
    D = {
        //viewportSize
        vs:function(){
            return U.ua.ie
                ? (U.isStrict
                        ? {width:rt.clientWidth,height:rt.clientHeight}
                        : {width:doc.body.clientWidth,height:doc.body.clientHeight})
                : {width:rt.clientWidth,height:rt.clientHeight};
        },
        //windowSize
        ws:function(){
            return {
                width:Math.max(rt.scrollWidth,doc.body.scrollWidth),
                height:Math.max(rt.scrollHeight,doc.body.scrollHeight)
            }
        },
        //scrollTop
        sp:function(){
            return {
                left:win.pageXOffset || rt.scrollLeft || doc.body.scrollLeft,
                top:win.pageYOffset || rt.scrollTop || doc.body.scrollTop
            }
        }
    },

    //Event
    E = {
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
    },

    Fixed = function(el,cfg){
        this.el = U.isE(el) ? el : null;
        this.cfg = cfg = U.isO(cfg) ? cfg : {};
        this.height = Number(cfg.height) || (this.el && this.el.scrollHeight);
        this.left = U.isU(cfg.left) ? undefined : (Number(cfg.left) || 0);
        this.right = U.isU(cfg.right) ? undefined : (Number(cfg.right) || 0);
        this.top = U.isU(cfg.top) ? undefined : (Number(cfg.top) || 0);
        this.bottom = U.isU(cfg.bottom) ? undefined : (Number(cfg.bottom) || 0);
    },
    _Fixed = function(el,cfg){
        return new Fixed(el,cfg);
    };

    Fixed.prototype = {
        init:function(){
            if(!this.el) return this;

            this._setWidth();
            //fixed invoke before width set because the scrollbar will effect
            //some calculate in ie6
            var self = this;
            //bugfix by using setTimeout
            setTimeout(function(){
                self.fixed();
            },1)
            this.el.style.height = this.height + 'px';

            this.el.style.position = U.ua.ie6 ? 'absolute' : 'fixed';

            E.on(win,'resize',function(){
                self._setWidth();
                self.fixed();
            });
            U.ua.ie6 && E.on(win,'scroll',function(){
                self.fixed(true);
            });
        },
        fixed:function(scroll){
            var vs = D.vs(),sp = D.sp();

            this.el.style.top = (U.ua.ie6 ? sp.top : 0) + (!U.isU(this.top) ? this.top
                                    : (!U.isU(this.bottom)
                                            ? vs.height - this.bottom - this.height
                                            : 0)) + 'px';

            if(!!scroll) return;

            this.el.style.left = sp.left + (!U.isU(this.left) ? this.left
                                    : (!U.isU(this.right)
                                            ? vs.width - this.right - this.width
                                            : 0)) + 'px';
        },
        //convert width percent size
        _cw:function(s){
            if(!/^\d+%$/.test(s)) return 0;

            var m = parseFloat(s.replace(/^(\d+)%$/,'$1'));

            return (D.ws().width * m)/100;
        },
        //reset width when resize
        _setWidth:function(){
            this.width = U.isS(this.cfg.width) && this._cw(this.cfg.width)
                || Number(this.cfg.width)
                || (this.el && this.el.scrollWidth);

            this.el.style.width = this.width + 'px';
        }
    };

    win.Fixed = _Fixed;
}(document,document.documentElement,window)
