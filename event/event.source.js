/*
 * @name:event.source.js
 * @description:event
 * @author:wondger@gmail.com
 * @date:2012-03-10
 * @param:
 * @todo:
 * @changelog:
 */
!function(doc,rt,win,undefined){
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
        inA:function(i,a){
            if(!U.isA(a)) return -1;

            //search array item
        }
    },
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
    std = [
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
    Event = function(receiver){
        this.stdEvts = {};
        this.cstEvnts = {};
    };
    Event.prototype = {
        on:function(type,handle){
        },
        fire:function(type){
        }
    }
}(document,document.documentElement,window)
