/*
 * @name:fixed.source.js
 * @description:position:fixed
 * @author:wondger@gmail.com
 * @date:2012-03-05
 * @param:
 * @todo:
 * @changenlog:
 */
(function(doc,rt,win,undefined){
    var ua = navigator.userAgent.toLowerCase(),ts = Object.prototype.toString;

    //util
    var U = {
        isU:function(o){
            return o === void 0;
        },
        isS:function(o){
            return ts.call(o) === '[object String]';
        },
        isN:function(o){
            return ts.call(o) === '[object Number]';
        },
        isO:function(o){
            return ts.call(o) === '[object Object]';
        },
        isF:function(o){
            return ts.call(o) === '[object Function]';
        },
        isA:function(o){
            return ts.call(o) === '[object Array]';
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
        each:function(o,fn,scope){
            if(!U.isO(o) || !U.isA(o) || !U.isF(fn)) return;

            for(var k in o){
                fn.call(scrop || null,o[k],k);
            }
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
            if(!U.isS(type) || !U.isF(handle)) return this;
            if(ele.addEListener){
                ele.addEListener(type,function(){handle.call(ele)},false);
            }else if(ele.attachEvent){
                ele.attachEvent('on'+type,function(){handle.call(ele)});
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
        var _ = this;
        if(!(_ instanceof Fixed)) return new Fixed(el,cfg);

        _.el = U.isE(el) ? el : null;
        _.cfg = cfg = U.isO(cfg) ? cfg : {};
        _.height = Number(cfg.height) || (_.el && _.el.scrollHeight);
        _.left = U.isU(cfg.left) ? undefined : (Number(cfg.left) || 0);
        _.right = U.isU(cfg.right) ? undefined : (Number(cfg.right) || 0);
        _.top = U.isU(cfg.top) ? undefined : (Number(cfg.top) || 0);
        _.bottom = U.isU(cfg.bottom) ? undefined : (Number(cfg.bottom) || 0);
    };

    Fixed.prototype = {
        init:function(){
            var _ = this;
            if(!_.el) return _;

            _._setWidth();
            //fixed invoke before width set because the scrollbar will effect
            //some calculate in ie6
            var self = _;
            //bugfix by using setTimeout
            setTimeout(function(){
                self.fixed();
            },1)
            _.el.style.height = _.height + 'px';

            _.el.style.position = U.ua.ie6 ? 'absolute' : 'fixed';

            E.on(win,'resize',function(){
                self._setWidth();
                self.fixed();
            });
            U.ua.ie6 && E.on(win,'scroll',function(){
                self.fixed(true);
            });
        },
        fixed:function(scroll){
            var _ = this;
            var vs = D.vs(),sp = D.sp();

            _.el.style.top = (U.ua.ie6 ? sp.top : 0) + (!U.isU(_.top) ? _.top
                                    : (!U.isU(_.bottom)
                                            ? vs.height - _.bottom - _.height
                                            : 0)) + 'px';

            if(!!scroll) return;

            _.el.style.left = sp.left + (!U.isU(_.left) ? _.left
                                    : (!U.isU(_.right)
                                            ? vs.width - _.right - _.width
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
            var _ = this;
            _.width = U.isS(_.cfg.width) && _._cw(_.cfg.width)
                || Number(_.cfg.width)
                || (_.el && _.el.scrollWidth);

            _.el.style.width = _.width + 'px';
        }
    };

    win.Alone = {'Fixed':Fixed};
})(document,document.documentElement,window)
