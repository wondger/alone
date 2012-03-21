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
    var doc = {cookie:"cna=n1GDByY+aWUCAfIdAHlPbtf/; nt=VFC%2FuZ9ain%2FyFnT6L3fF9qh%2FwyJGUvb32PWoxvQ%3D; ssllogin=; uc2=wuf=http%3A%2F%2Fconfluence.taobao.ali.com%2Fpages%2Fviewpage.action%3FpageId%3D195510278; lzstat_uv=20928843802688476746|2618224@2714902@2269948@2738597@2735853@2618227@2656714@2728989@2581747@2285988@2737197@2618858@2769016@2514018@2043323@1216880@2706017@1544272@2581762@2613026@1296239@2225939@2535704@1005968@2618859@2619216@2199358@2757251@2208862@2775310@2185014@2637738@2706021@2775257; CNZZDATA3851648=cnzz_eid=52551193-1332147443-http%253A%252F%252Fwww.html-js.com%252F%253Fpage_id%253D1337&cnzz_a=0&retime=1332147443292&sin=http%253A%252F%252Fwww.html-js.com%252F%253Fpage_id%253D1337&ltime=1332147443292&rtime=0; publishItemObj=NQ%3D%3D; v=0; l=::1332294585791::11; mt=ci=0_1; __utma=6906807.338117582.1331086797.1332126054.1332295443.7; __utmc=6906807; __utmz=6906807.1332295443.7.6.utmcsr=tms.taobao.com|utmccn=(referral)|utmcmd=referral|utmcct=/ued/site_list.htm; ck1=; lastgetwwmsg=MTMzMjI5NjEzNQ%3D%3D; _sv_=0; tg=0; _cc_=U%2BGCWk%2F7og%3D%3D; t=631760b9fa97ec80f6bd5df2b6dc3709; _nk_=%5Cu68EA%5Cu6728; _l_g_=Ug%3D%3D; tracknick=%5Cu68EA%5Cu6728; x=e%3D1%26p%3D*%26s%3D0%26c%3D1%26f%3D0%26g%3D0%26t%3D0; tlut=UoLfckrUBJ6WIA%3D%3D; _lang=zh_CN:GBK; uc1=lltime=1332295544&cookie14=UoLfckrUBJvMow%3D%3D&existShop=false&cookie16=W5iHLLyFPlMGbLDwA%2BdvAGZqLg%3D%3D&sg=%E6%9C%A898&cookie21=V32FPkk%2Fhw%3D%3D&tag=0&cookie15=V32FPkk%2Fw0dUvg%3D%3D&test=; mpp=t%3D1%26m%3D%26h%3D1332298266538%26l%3D1332295581360"};
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
        mix:function(r,s,f){
            if((!U.isO(r) && !U.isF(r)) || !U.isO(s)) return r;

            for(var k in s){
                !!f ? r[k] = s[k] : (U.isU(r[k]) && (r[k] = s[k]));
            }

            return r;
        }
    },
    Cookie = {
        _serialize:function(cfg){
            var cfg = U.mix({
                expires:new Date().toGMTString(),
                path:'',
                domain:'',
                secure:false
            },cfg,true);

            return U.join(cfg,function(v,k){return !!v},'; ');
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
            var cfg = cfg || {};
            if(U.isS(cfg.main)) return this.setSub(name,value,expires,main);

            alert(this._serialize(cfg))
            document.cookie = this._serialize(cfg);

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
