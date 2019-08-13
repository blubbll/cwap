[function() {
    var _self = {
        defineProperty: function(obj, key, value) {
            var config = {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true
            };
            Object.defineProperty(obj, key, config);
        },
        get isIE() {
            return window.navigator.userAgent.indexOf("MSIE") > 0 || window.navigator.userAgent.indexOf("Trident/") > 0
        },
        get isMobile() {
            return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
        },
        get isRetina() {
            return window.devicePixelRatio > 1
        },
        S4: function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },

        get guid() {
            var that = _self;
            var S4 = that.S4;
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase()
        },
        getTimoji: function() {
            switch ((new Date).getHours()) {
                case 0:
                case 12:
                    return "🕛";
                case 1:
                case 13:
                    return "🕐";
                case 2:
                case 14:
                    return "🕑";
                case 3:
                case 15:
                    return "🕒";
                case 4:
                case 16:
                    return "🕓";
                case 5:
                case 17:
                    return "🕔";
                case 6:
                case 18:
                    return "🕕";
                case 7:
                case 19:
                    return "🕖";
                case 8:
                case 20:
                    return "🕗";
                case 9:
                case 21:
                    return "🕘";
                case 10:
                case 22:
                    return "🕙";
                case 11:
                case 23:
                    return "🕚";
            }
        },
        delay: (function() {
            return function(callback, ms) {
                clearTimeout(window["timer_" + callback]);
                window["timer_" + callback] = setTimeout(callback, ms);
            };
        })(),
        //debugging
        debug: function(scriptname, str) {
            var that = _self;
            var o = new Object();
            var l = that.ismobile ? "DEBUG" : "ᴅᴇʙᴜɢ";
            that.defineProperty(o, scriptname, str);
            var line = '(' + l + ')\t<' + that.getTimoji() + window.moment().format('HH:mm:ss') + '>';
            typeof str === 'string' ? [
                !that.isIE && !that.isEdge ? [console.log('%c' + line + '\n', 'background: whitesmoke; color: #333;', o)] : [console.log(line + "," + "'" + scriptname + "'" + ":" + '"' + str + '"')]
            ] : [!that.isIE ? [console.log(line + ' ' + scriptname, str)] : [console.log(line), console.log(str)]];
        },

        hexToRGB: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        getJson: function(url, options = {}) {
            try {
                const req = fetch(url)
                    .then(async (response) => {
                        return JSON.parse(await response.text());
                    })
                    .catch((err) => {
                        console.warn(err)
                    });
                return req;
            } catch (e) {}
        },

        //zufälliger hex
        get randomHex() {
            return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        }

    }
    window.tools = _self;
}()];