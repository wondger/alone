/*
 * @name:cache.source.js
 * @description:
 * @author:wondger@gmail.com
 * @date:2012-05-02
 * @param:
 * @todo:
 * @changenlog:
 */
(function(doc,rt,win,undefined){
    var ts = Object.prototype.toString;
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
            return !!o && ts.call(o) === '[object Object]';
        },
        isF:function(o){
            return ts.call(o) === '[object Function]';
        },
        isA:function(o){
            return ts.call(o) === '[object Array]';
        },
        each:function(o,fn,scope){
            if((!U.isO(o) && !U.isA(o)) || !U.isF(fn)) return;

            for(var k in o){
                fn.call(scope||null,o[k],k);
            }
        }
    },

    Cache = function(){
        var _ = this;
        if(!(_ instanceof Cache)) return new Cache();

        this.__CACHE__ = [];
    };

    Cache.prototype = {
        set:function(data,uniqKey){
            var idx = !!uniqKey ? this.getIndex(uniqKey,data[uniqKey]) : -1;
            if(idx !== -1) this.__CACHE__[idx] = data;
            else this.__CACHE__.push(data);
        },
        get:function(key,value){
            var idx = this.getIndex(key,value);
            return idx !== -1 ? this.__CACHE__[idx] : null;
        },
        getIndex:function(key,value){
            if(!this.__CACHE__.length) return -1;
            var i = 0;

            if(U.isS(key)){
                while(this.__CACHE__[i][key] && this.__CACHE__[i][key]!==value) i++;
            }else{
                while(!this.inc(this.__CACHE__[i],key)) i++;
            }
            return i;
        },
        inc:function(s,o){
            if(!U.isO(s) || !U.isO(o)) return;

            var ret = true;

            for(var k in o){
                if(s[k] !== o[k]) return false;
            }

            return true;
        }
    };

    U.isO(win.Alone) ? win.Alone.Cache = Cache : win.Alone = {'Cache':Cache};
})(document,document.documentElement,window)
