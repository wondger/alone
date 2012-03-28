/*
 * @name:cookie.js
 * @description:cookie
 * @author:wondger@gmail.com
 * @date:2012-03-20
 * @param:
 * @todo:
 * @changelog:
 */
(function(doc,win){
    var ua = win.navigator.userAgent,ts = Object.prototype.toString;
    var U = {
        isU:function(o){
            return o === void 0;
        },
        isNull:function(o){
            return o === null;
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
        serialize:function(o){
            return U.join(o,null,'&');
        },
        unserialize:function(o){
            var ret = {};

            if(!U.isS(o)) return;

            var o = o.split('&'),i = 0,t;

            while(o[i]){
                t = o[i].split('=');
                ret[t[0]] = t[1];
                i++;
            }

            return ret;
        },
        //include
        //object,target
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
            if(!r && !s && !U.isO(r) || (!U.isA(s) && !U.isO(s))) return r;

            for(var k in r){
                if(!U.inc(s,k)){
                    ret[k] = r[k];
                    delete r[k];
                }
            }

            return ret;
        },
        os:new Date().getTimezoneOffset() * 60000,
        now:function(){
            //时区偏移,ms
            return new Date(new Date().getTime() - this.os);
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
                ret.push(U.join(U.mix(temp,_cfg),function(v,k){return !!v},';'));
            }

            return ret;
        },
        get:function(name,main){
            var ret,
                c = doc.cookie,
                re = new RegExp('(?:^|\\s)'+name+'(?:(?:=([^;]*))|;|$)');
            if(U.isU(name)) return c;
            if(ret = c.match(re)) ret = ret[1];
            return ret;
        },
        set:function(cfg,main){
            var cfg = cfg || {},cookie;
            if(U.isS(main)) return this.setSub(cfg,main);

            //expires support integer
            if(U.isN(cfg.expires)){
                var d = U.now();
                d.setSeconds(cfg.expires);
                cfg.expires = d.toGMTString();
            }

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
            var ret,
                c = this.get(U.isS(main) && main || undefined),
                re = new RegExp('(?:^|&)'+name+'(?:(?:=([^&]*))|&|$)');
            if(!main || U.isNull(c)) return null;
            if(ret = c.match(re)) ret = ret[1];
            return ret;
        },
        setSub:function(cfg,main){
            var cfg = cfg || {},main = main;
            if(!U.isS(main)) return false;

            var c = this.get(main),cookie = {};
            /*
             * 如果原cookie不是main cookie会将其转换成同名subcookie
             * 如：name=5 -> name=name=5
             * subcookie会自动过滤掉附加参数，需要附加参数通过set或attr设置
             */
            c = !!c ? U.unserialize(c.indexOf('=')>=0 && c || (main+'='+c)) : {};
            cookie[main] = U.join(U.mix(c,(U.ex(cfg,['expires','path','domain','secure']))),null,'&');

            return this.set(cookie);
        },
        // 更新附加参数，如expires,path,domain,secure
        attr:function(cfg,name){
            var cfg = U.inc((cfg || {}),['expires','path','domain','secure']),c,cookie = {};
            if(!U.isS(name) || U.isEmpty(cfg)) return false;

            c = this.get(name);

            if(U.isNull(c)) return true;

            cookie[name] = c;

            U.mix(cookie,cfg);

            return this.set(cookie);
        },
        del:function(name,main){
            if(U.isA(name)){
                for(var i = 0,l = name.length; i < l; i++){
                    if(!U.isS(name[i]) || !this.del(name[i],main)){
                        return false;
                    }
                }
                return !!name.length;
            }

            if(U.isS(main)){
                return this.delSub(name,main);
            }else{
                return this.attr({expires:new Date(0).toGMTString()},name);
            }
        },
        delSub:function(name,main){
            if((!U.isS(name) && !U.isA(name)) || !U.isS(main)) return false;

            if(U.isS(name) && U.isNull(this.getSub(name,main))) return true;

            if(U.isA(name)){
                return this.del(name,main);
            }

            var c = this.get(main),cookie;
            cookie = U.unserialize(c.replace(new RegExp('(?:^|&)'+name+'=(?:[^&]*|$)','g'),''));

            //当所有subcookie都被删除时，main cookie也将被删除
            return this.del(main) && this.set(cookie,main);
        }
    };

    U.isO(win.Alone) ? win.Alone.Cookie = Cookie : win.Alone = {'Cookie':Cookie};
})(document,window);
