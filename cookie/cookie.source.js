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
    var Cookie = {
        get:function(name){
            var ret,
                re = new RegExp('(?:^|\\s|=|&)'+key+'(?:(?:=([^;&]*))|&|;|$)');
            if(ret = document.cookie.match(re)) ret = ret[1];
            return ret;
        },
        set:function(name,value,expires){
        },
        /*
         * sub cookie
         */
        getSub(name,main){
        },
        setSub(name,value,expires,main){
        }
    }

    win.Cookie = Cookie;
}(document,window);
