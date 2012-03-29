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
    var ua = navigator.userAgent.toLowerCase(),
        ts = Object.prototype.toString,
        ie = (function(){
                var ret = !/opera/i.test(ua) && ua.match(/msie\s(\d+)\.\d+;/i) || null;
                return ret && parseInt(ret[1]) || 0;
        })();

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
            ie:ie,
            ie6:ie === 6
        }
    },
    //standard Event
    E = {
        std:{
            events:[
                'MouseEvent:click,dbclick,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup',
                'UIEvents:DOMActivate,load,unload,abort,error,select,resize,scroll',
                'FocusEvent:blur,DOMFocusIn,DOMFocusOut,focus,focusin,focusout',
                'WheelEvent:wheel',
                'KeyboardEvent:keydown,keypress,keyup,',
                'CompositionEvent:compositionstart,compositionupdate,compositionend',
                'MutationEvent:DOMAttrModified,DOMCharacterDataModified,DOMNodeInserted,DOMNodeInsertedIntoDocument,DOMNodeRemoved,DOMNodeRemovedFromDocument,DOMSubtreeModified',
                'MutationNameEvent:DOMElementNameChanged,DOMAttributeNameChanged'
            ],
            inc:function(evt){
                if(!U.isS(evt)) return;

                var regexp = new RegExp('(?:^|;)(?:(\\w+):)(?:\\w+,)*'+evt+'(?=;|(?:,\\w+)|$)'),
                    ret = E.std.events.join(';').match(regexp);

                return ret ? ret[1] : null;
            }
        },
        init:function(type,cfg){
            if(!U.isS(type)) return;

            var evt = E.std.inc(type) || 'CustomEvent',
                _evt;
            if(doc.createEvent){
                _evt = doc.createEvent(evt);
                /*
                 * initCustomEvent(in DOMString type,in boolean canBubble,in boolean cancelable,in any detail);
                 * @see:http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-Event
                 * @see:https://developer.mozilla.org/en/DOM/CustomEvent
                 */
                //the detail param is request in ie9+
                //use initEvent will
                //_evt['init'+evt](type,true,true,null);
                _evt.initEvent(type,true,true,null);
                //_evt.initMouseEvent(type,true,true,window,0,0,0,0,0,false,false,false,false,0,null);
            }else{
                _evt = doc.createEventObject(cfg);
            }

            return _evt;
        },
        on:function(el,type,handle,useCapture){
            if(!U.isE(el) || !U.isS(type) || !U.isF(handle)) return this;
            if(el.addEventListener){
                //window.event is null in ie
                el.addEventListener(type,handle,!!useCapture);
            }else if(el.attachEvent){
                el.attachEvent('on'+type,handle);
            }else{
                var _handle = el['on'+type];
                el['on'+type] = function(){
                    if(_handle) _handle.call(el,win.event);
                    handle.call(el,win.event);
                }
            }

            return this;
        },
        off:function(el,type,handle,useCapture){
            if(!U.isE(el) || !U.isS(type) || !U.isF(handle)) return this;

            if(el.removeEventListener){
                el.removeEventListener(type,handle,!!useCapture);
            }else{
                el.detach(type,handle);
            }

            //todo:remove handle added by el['on'+type]

            return this;
        },
        delegate:function(to,el,type,handle){
        },
        undelegate:function(to,el,type,handle){
        },
        fire:function(el,type){
            if(!U.isE(el) || !U.isS(type)) return;

            var evt = this.init(type);

            if(U.ua.ie && U.ua.ie < 9){
                el.fireEvent('on'+type,evt);
                
                //won't invoke event function automatically in fuck ie
                //!!el[type].call && el[type]();
            }else{
                el.dispatchEvent(evt);
            }
        }
    },
    //CustomEvent for DOM2 Event
    //todo:CustomEvent prototype
    CustomEvent = function(cfg){
        if(!(this instanceof CustomEvent)) return new CustomEvent(cfg);

        var cfg = U.isO(cfg) && cfg || {};

        this.bubbles = !!cfg.bubbles;
        this.cancelable = U.isU(cfg.cancelable) ? true : !!cfg.cancelable;
        this.currentTarget = U.isE(cfg.currentTarget) ? cfg.currentTarget : null;
        this.defaultPrevented = U.isU(cfg.defaultPrevented) ? false : !!cfg.defaultPrevented;
        this.isTrusted = U.isU(cfg.isTrusted) ? false : !!cfg.isTrusted;
        this.eventPhase = U.isN(cfg.eventPhase) ? cfg.eventPhase : 0;
        this.target = U.isE(cfg.target) ? cfg.target : null;
        this.timeStamp = U.isN(cfg.timeStamp) ? cfg.timeStamp : 0;
        this.type = U.isS(cfg.type) ? cfg.type : '';
        this.initEvent = function(){};
        this.preventDefault = function(){};
        this.stopImmediatePropagation = function(){};
        this.stopPropagation = function(){};
    },
    //guid must be private
    guid = 0,
    Event = {
        evtId:'evt_' + new Date().getTime(),
        __stdEvts__:{},
        __cstEvts__:{},
        on:function(el,type,handle,useCapture){
            if(!U.isE(el) || !U.isS(type) || !U.isF(handle)) return this;
            if(!U.ua.ie || U.ua.ie >= 9 || E.std.inc(type)){
                E.on(el,type,handle,useCapture);
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

            if(!U.ua.ie || U.ua.ie >= 9 || E.std.inc(type)){
                E.fire(el,type);
            }else{
                var handles = el[this.evtId] ? this.__cstEvts__[el[this.evtId]][type] || null : null;

                if(!handles) return this;

                //@see:http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-Event
                U.each(handles,function(handle){
                    handle.call(null,CustomEvent({
                        type:type,
                        target:el,
                        currentTarget:el,
                        timeStamp:new Date().getTime()
                    }));
                });
            }

            return this;
        },
        off:function(el,type,handle,useCapture){
            if(!U.ua.ie || U.ua.ie >= 9 || E.std.inc(type)){
                E.off(el,type,handle,useCapture);
            }
            
            return this;
        }
    };

    U.isO(win.Alone) ? win.Alone.Event = Event : win.Alone = {'Event':Event};
})(document,document.documentElement,window)
