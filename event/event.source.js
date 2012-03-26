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
            return ts.call(o) === '[object Object]';
        },
        isF:function(o){
            return ts.call(o) === '[object Function]';
        },
        isA:function(o){
            return ts.call(o) === '[object Array]';
        },
        each:function(o,fn,scope){
            if(!U.isO(o) || !U.isA(o) || !U.isF(fn)) return;

            for(var k in o){
                fn.call(scrop || null,o[k],k);
            }
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
            'blur'
        ],
        on:function(el,type,handle){
            if(!U.isS(type) || !U.isF(handle)) return this;
            if(el.addEListener){
                el.addEListener(type,function(){handle.call(el)},false);
            }else if(el.attachE){
                el.attachE('on'+type,function(){handle.call(el)});
            }else{
                var _handle = el['on'+type];
                el['on'+type] = function(){
                    if(_handle) _handle.call(el);
                    handle.call(el);
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
        }
    },
    //guid must be private
    guid = 0,
    Event = {
        evtId:'evt_' + new Date().getTime(),
        __stdEvts__:{},
        __cstEvts__:{},
        on:function(el,type,handle){
            if(!U.isS(type) || !U.isF(handle)) return false;
            if(E.std.indexOf(type)>-1){
                E.on(el,type,handle);
            }else{
                var evtId = el[this.evtId] = el[this.evtId] || ++guid;
                this.__cstEvts__[evtId] = this.__cstEvts__[evtId] || {};
                this.__cstEvts__[evtId][type] = this.__cstEvts__[evtId][type] || [];
                this.__cstEvts__[evtId][type].push(handle);
            }
        },
        fire:function(type){
        }
    };

    win.Alone = {'Event':Event};
})(document,document.documentElement,window)
