/*
 * @name:ready.source.js
 * @description:DOMReady
 * @author:wondger@gmail.com
 * @date:2012-02-29
 * @param:
 * @todo:
 * @changelog:
 */
!function(doc,rt,win,undefined){
    var r = function(f){
        /*
         * a smallest way
         * @see:http://dustindiaz.com/smallest-domready-ever
         */
        /in/.test(document.readyState)?setTimeout('ready('+f+')',9):f();
    };

    win.ready = r;
}(document,document.documentElement,window);
