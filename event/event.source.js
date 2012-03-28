/*
 * @name:event.source.js
 * @description:event
 * @author:wondger@gmail.com
 * @date:2012-03-10
 * @param:
 * @todo:
 * @changelog:
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
            //toString return '[object Object]' for null and undefined in fuck ie
            return !!o && ts.call(o) === '[object Object]';
        },
        isF:function(o){
            return ts.call(o) === '[object Function]';
        },
        isA:function(o){
            return ts.call(o) === '[object Array]';
        },
        isE:function(o){
            return !!(o && o.nodeType && o.nodeType == 1);
        },
        isEmpty:function(o){
            if(!U.isA(o) && !U.isO(o))  throw 'type error';

            if(U.isA(o)) return !o.length;

            for(var k in o){
                return false;
            }
        },
        each:function(o,fn,scope){
            if((!U.isO(o) && !U.isA(o)) || !U.isF(fn)) return;

            for(var k in o){
                fn.call(scope||null,o[k],k);
            }
        },
        ua:{
            ie:/msie/.test(ua) && !/opera/i.test(ua),
            ie6:/msie 6/.test(ua)
        },
        inc:function(o,t){
            var ret,t = U.isU(t) ? t : (U.isA(t) ? t : [t]);
            if((!U.isA(o) && !U.isO(o)) || U.isU(t)) throw 'type error';

            if(U.isA(o) && !U.isEmpty(o)){
                ret = [];
                for(var i = 0,l = t.length; i < l; i++){
                    if(o.indexOf && o.indexOf(t[i]) !== -1){
                        ret.push(t[i]);
                        t.splice(i,1);
                    }else{
                        var j = o.length;
                        while(j--){
                            if(o[j] === t[i]){
                                ret.push(t[i]);
                                t.splice(i,1);
                            }
                        }
                    }
                }
            }

            if(U.isO(o)){
                ret = {};
                for(var k in o){
                    for(var i = 0,l = t.length; i < l; i++){
                        if(k===t[i]){
                            ret[k] = o[k];
                            t.splice(i,1);
                        }
                    }
                }
            }

            return U.isEmpty(ret) ? false : ret;
        }
    },
    //standard Event
    E = {
        std:[
            'click',
            'mouseenter',
            'mouseover',
            'mousedown',
            'mouseleave',
            'keyup',
            'keydown',
            'focus',
            'blur',
            'submit'
        ],
        create:function(type,cfg){
            var type = U.isS(type) && type || 'Event',
                evt = U.ua.ie ? doc.createEventObject() : doc.createEvent(type);

            !U.ua.ie && evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

            return evt;
        },
        on:function(el,type,handle){
            if(!U.isS(type) || !U.isF(handle)) return this;
            if(el.addEListener){
                el.addEListener(type,function(){handle.call(el)},false);
            }else if(el.attachEvent){
                el.attachEvent('on'+type,function(){handle.call(el,win.event)});
            }else{
                var _handle = el['on'+type];
                el['on'+type] = function(){
                    if(_handle) _handle.call(el,win.event);
                    handle.call(el,win.event);
                }
            }

            return this;
        },
        off:function(el,type,handle){
            return this;
        },
        delegate:function(to,el,type,handle){
        },
        undelegate:function(to,el,type,handle){
        },
        fire:function(el,type){
            if(!U.isE(el) || !U.isS(type)) return;

            var evt = this.create('MouseEvents');

            if(U.ua.ie){
                evt.returnValue = true;
                evt.button = 1;
                evt.cancelBubble = true;
                el.fireEvent('on'+type,evt);

                //won't invoke event function automatically in fuck ie
                //!!el[type].call && el[type]();
            }else{
                el.dispatchEvent(evt);
            }
        }
    },
    //guid must be private
    guid = 0,
    Event = {
        evtId:'evt_' + new Date().getTime(),
        __stdEvts__:{},
        __cstEvts__:{},
        on:function(el,type,handle){
            if(!U.isS(type) || !U.isF(handle)) return this;
            if(U.inc(E.std,type)){
                E.on(el,type,handle);
            }else{
                var evtId = el[this.evtId] = el[this.evtId] || ++guid;
                this.__cstEvts__[evtId] = this.__cstEvts__[evtId] || {};
                this.__cstEvts__[evtId][type] = this.__cstEvts__[evtId][type] || [];
                this.__cstEvts__[evtId][type].push(handle);
            }

            return this;
        },
        fire:function(el,type){
            if(!U.isE(el) || !U.isS(type)) return this;

            if(U.inc(E.std,type)){
                E.fire(el,type);
            }else{
                var handles = el[this.evtId] ? this.__cstEvts__[el[this.evtId]][type] || null : null;

                if(!handles) return this;

                U.each(handles,function(handle){
                    handle.call(null,{'target':el,'type':type});
                });
            }

            return this;
        }
    };

    U.isO(win.Alone) ? win.Alone.Event = Event : win.Alone = {'Event':Event};
})(document,document.documentElement,window)
