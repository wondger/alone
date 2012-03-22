/*
 * @name:cookie.js
 * @description:cookie
 * @author:wondger@gmail.com
 * @date:2012-03-20
 * @param:
 * @todo:
 * @changelog:
 */
!function(doc,win){
    var ua = win.navigator.userAgent;
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
        isEmpty:function(o){
            if(!U.isA(o) && !U.isO(o))  throw 'type error';

            if(U.isA(o)) return !o.length;

            for(var k in o){
                return false;
            }
        },
        ua:{
            ie:/msie/.test(ua) && !/opera/i.test(ua),
            ie6:/msie 6/.test(ua)
        },
        join:function(o,filter,sep){
            var ret = [];
            if(!U.isO(o) && !U.isA(o)) return '';

            for(var k in o){
                if(U.isF(filter)){
                    filter(o[k],k) && ret.push(k+'='+o[k]);
                }else{
                    ret.push(k+'='+o[k]);
                }
            }

            return ret.join(U.isS(sep) && sep || ',');
        },
        //include
        //object,target
        inc:function(o,t){
            var ret,t = U.isU(t) ? t : (U.isA(t) ? t : [t]);
            if((!U.isA(o) && !U.isO(o)) || U.isU(t)) throw 'type error';

            if(U.isA(o)){
                ret = [];
                for(var i = 0,l = t.length; i < l; i++){
                    if(o.indexOf(t[i]) !== -1){
                        ret.push(t[i]);
                        t.splice(i,1);
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
        },
        //receiver,supplier,overwrite
        mix:function(r,s,o){
            if((!U.isO(r) && !U.isF(r)) || !U.isO(s)) return r;

            for(var k in s){
                !!o ? r[k] = s[k] : (U.isU(r[k]) && (r[k] = s[k]));
            }

            return r;
        },
        //ex/exclude
        ex:function(r,s){
            var ret = {},r = U.mix({},r);
            if(!U.isO(r) || (!U.isA(s) && !U.isO(s))) return r;

            for(var k in r){
                if(!U.inc(s,k)){
                    ret[k] = r[k];
                    delete r[k];
                }
            }

            return ret;
        }
    },
    Cookie = {
        _serializeCookie:function(cfg){
            //document.cookie会将serialize字符串中的第一个key=value作为cookie存储
            var cfg = cfg || {},ret = [];

            var kv = U.ex(cfg,['expires','path','domain','secure']),
                _cfg = U.inc(cfg,['expires','path','domain','secure']),
                temp;

            if(U.isEmpty(kv)) return ret;

            for(var k in kv){
                temp = {};
                temp[k] = kv[k];
                ret.push(U.join(U.mix(temp,_cfg),function(v,k){return !!v},'; '));
            }

            return ret;
        },
        get:function(name){
            var ret = null,
                c = doc.cookie,
                re = new RegExp('(?:^|\\s)'+name+'(?:(?:=([^;]*))|;|$)');
            if(U.isU(name)) return c;
            if(ret = c.match(re)) ret = ret[1];
            return ret;
        },
        set:function(cfg){
            var cfg = cfg || {},cookie;
            if(U.isS(cfg.main)) return this.setSub(name,value,expires,main);

            cookie = this._serializeCookie(cfg);

            //document.cookie只能逐一赋值
            for(var i = 0,l = cookie.length; i < l; i++){
                document.cookie = cookie[i];
            }

            return true;
        },
        /*
         * sub cookie
         */
        getSub:function(name,main){
            var ret = null,
                c = this.get(U.isS(main) && main || ''),
                re = new RegExp('(?:^|&)'+name+'(?:(?:=([^&]*))|&|$)');
            if(!main) return null;
            if(ret = c.match(re)) ret = ret[1];
            return ret;
        },
        setSub:function(name,value,expires,main){
        }
    }

    win.Cookie = Cookie;
}(document,window);
