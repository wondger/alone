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
