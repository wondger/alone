/*
 * @name:cache.source.js
 * @description:
 * @author:wondger@gmail.com
 * @date:2012-05-02
 * @param:
 * @todo:
 * @changenlog:
 */
(function (doc, rt, win, undef) {
    'use strict';
    var ts = Object.prototype.toString,
        //util
        U = {
            isU: function (o) {
                return o === void 0;
            },
            isS: function (o) {
                return ts.call(o) === '[object String]';
            },
            isN: function (o) {
                return ts.call(o) === '[object Number]';
            },
            isO: function (o) {
                return !!o && ts.call(o) === '[object Object]';
            },
            isF: function (o) {
                return ts.call(o) === '[object Function]';
            },
            isA: function (o) {
                return ts.call(o) === '[object Array]';
            },
            each: function (o, fn, scope) {
                if ((!U.isO(o) && !U.isA(o)) || !U.isF(fn)) {
                    return;
                }

                var k;
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        fn.call(scope || null, o[k], k);
                    }
                }
            }
        },

        Cache = function () {
            if (!(this instanceof Cache)) {
                return new Cache();
            }

            /*
             * whether need a global CACHE?
             */
            this.CACHE = [];
        };

    Cache.prototype = {
        set: function (data, uniqKey) {
            var idx = !!uniqKey ? this.getIndex(uniqKey, data[uniqKey]) : -1;
            if (idx !== -1) {
                this.CACHE[idx] = data;
            } else {
                this.CACHE.push(data);
            }
        },
        get: function (key, value) {
            var idx = this.getIndex(key, value);
            return idx !== -1 ? this.CACHE[idx] : null;
        },
        getIndex: function (key, value) {
            if (!this.CACHE.length) {
                return -1;
            }
            var i = 0;

            if (U.isS(key)) {
                while (this.CACHE[i][key] && this.CACHE[i][key] !== value) {
                    i += 1;
                }
            } else {
                while (!this.inc(this.CACHE[i], key)) {
                    i += 1;
                }
            }
            return i;
        },
        inc: function (s, o) {
            if (!U.isO(s) || !U.isO(o)) {
                return;
            }

            var ret = true,
                k;

            for (k in o) {
                if (o.hasOwnProperty(k) && s[k] !== o[k]) {
                    return false;
                }
            }

            return true;
        }
    };

    if (U.isO(win.Alone)) {
        win.Alone.Cache = Cache;
    } else {
        win.Alone = {'Cache': Cache};
    }
}(document, document.documentElement, window));
