//© Blubbll
var //libs
    interact = window.interact, //dragging
    Isomer = window.Isomer, //blocks
    moment = window.moment, //time
    tinycolor = window.tinycolor; //color module
var //modules
    tools = window.tools, //tools module
    app = window.app; //app module

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
            var o = new Object();
            var l = tools.ismobile ? "DEBUG" : "ᴅᴇʙᴜɢ";
            tools.defineProperty(o, scriptname, str);
            var line = '(' + l + ')\t<' + tools.getTimoji() + moment().format('HH:mm:ss') + '>';
            typeof str === 'string' ? [
                !tools.isIE && !tools.isEdge ? [console.log('%c' + line + '\n', 'background: whitesmoke; color: #333;', o)] : [console.log(line + "," + "'" + scriptname + "'" + ":" + '"' + str + '"')]
            ] : [!tools.isIE ? [console.log(line, str)] : [console.log(line), console.log(str)]];
        },

        hexToRGB: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        //zufälliger hex
        get randomHex() {
            return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        }

    }
    window.tools = _self;
}()];
[function() {
    var _self = {
        sn: "app",
        can: $("#canvas")[0],
        defaults: {
            height: 1200,
            width: 1200,
            scale: 20
        },
        zoomlv: 100,
        pos: {
            x: 0,
            y: 0
        },
        resetCanvas: function() {
          var that = _self;
          if(that.resizing !== true){
   
             tools.debug("canvas", "resizing...");
            var that = _self;
            //var w = window.innerWidth;
            //var h = Math.floor(w * (3 / 4));
            var w = that.canwidth;
            var h = that.canwidth;
            if(window.innerHeight > window.innerWidth){ //höher als breit
            that.can.setAttribute('style',
                                 'height: ' + window.innerWidth+ 'px;' +
                                 'width:' + window.innerWidth+ 'px;'
                                 );
              $("#status").addClass("w-100");
              $("#status").removeClass("w-25");
            }
            else if(window.innerWidth > window.innerHeight){//breiter als hoch
              that.can.setAttribute('style',
                                       'height:' + (window.innerHeight)+ 'px;' +
                                       'width:' + (window.innerHeight)+ 'px;'
                                 );
               $("#status").addClass("w-25");
              $("#status").removeClass("w-100");
            }
            setTimeout(function(){
            that.resizing = true;
          },999);
          } else setTimeout(function(){
            that.resizing = false;
          }, 9);
         
        },
        moving: {
            x: 0,
            y: 0,
            tick: 0,
            drag: function(pos, jumped) {
                var that = _self.moving;

                const offx = 150; //299;
                const offy = 75; //150
                var tick = Date.now().toString().slice(-5, -1);
                if (tick !== that.tick) {

                  
                  
                    //sync pos
                    if (jumped) {
                        //sync pos
                        that.x = Math.floor(pos.x*10 + _self.can.width / 2);
                        that.y = Math.floor(pos.y*10 + _self.can.height / 2);

                    } else {
                        that.x += pos.x;
                        that.y += pos.y;
                    }

                  
                    //sync virtual pos on map
                    _self.pos.x = (that.x + (_self.can.width / 2) - offx);
                    _self.pos.y = (that.y + (_self.can.height / 2) - offy);


                    _self.iso.redraw();

                    var realpos = {
                        x: ((-(_self.pos.x - ((_self.can.width) - offx)))/10),
                        y: (_self.pos.y - ((_self.can.height) - offy))/10
                    };
                  
                    if (jumped) tools.debug("moving", "jumped to x:" + realpos.x + ", y: " + realpos.y);
                    else tools.debug("moving", "moved to x:" + (realpos.x) + ", y: " + (realpos.y));

                    //if(realpos.x < 0) that.jump({x:0, y:realpos.y});
                    //if(realpos.y < 0) that.jump({x:realpos.x, y:0});

                    $("#pos").text("x:" + realpos.x + ",y: " + realpos.y);

                    that.tick = tick;
                }

                _self.refreshMap();

            },
            spawn: function() {
                var that = _self.moving;
                that.jump(_self.center);
            },
            jump: function(pos) {
                var that = _self.moving;
                that.drag({
                    y: pos.y,
                    x: -pos.x
                }, true);
            }
        },
        refreshMap: function() {
            //console.log(_self.center);
            _self.iso.addblock(_self.center.x, _self.center.y, new Isomer.Color(255, 255, 255));
        },
        /*iso: {
            field: {},
            Shape: Isomer.Shape,
            Point: Isomer.Point,
            Path: Isomer.Path,
            Color: Isomer.Color,
            colors: {
                red: new Isomer.Color(255, 0, 0),
                blue: new Isomer.Color(0, 0, 255),
                green: new Isomer.Color(0, 255, 0),
                white: new Isomer.Color(255, 255, 255)
            },

            redraw: function() {
                var that = _self.iso;

                var x, y;
                //Isomerfeld
                that.field = new Isomer(_self.can, {
                    scale: _self.defaults.scale,
                    originX: Math.floor(_self.pos.x),
                    originY: Math.floor(_self.pos.y)
                });

                var ctx = _self.can.getContext('2d');
                ctx.clearRect(0, 0, _self.can.width, _self.can.height);

                //zufällige Farbe
                var color = that.colors[Math.floor(Math.random() * that.colors.length)];

                var makeGrid = function(xSize, ySize, zHeight, gridColor) {
                    for (x = 0; x < xSize + 1; x++) {
                        that.field.add(new that.Path([
                            new that.Point(x, 0, zHeight),
                            new that.Point(x, xSize, zHeight),
                            new that.Point(x, 0, zHeight)
                        ]), gridColor);
                    }
                    for (y = 0; y < ySize + 1; y++) {
                        that.field.add(new that.Path([
                            new that.Point(0, y, zHeight),
                            new that.Point(ySize, y, zHeight),
                            new that.Point(0, y, zHeight)
                        ]), gridColor);
                    }
                }

                makeGrid(_self.defaults.height, _self.defaults.width, 0, that.colors.blue);
            },
            addblock: function(x, y, color) {
                var that = _self.iso;
                if (!color) color = that.colors[Math.floor(Math.random() * that.colors.length)];
                that.field.add(that.Shape.Prism(new that.Point(y, x)), color);
                tools.debug("iso", "added block at x:" + x + ", y: " + y);
            },
            addplayer: function(x, y, color) {
                var that = _self.iso;
                if (!color) color = that.colors[Math.floor(Math.random() * that.colors.length)];
                that.field.add(that.Shape.Pyramid(new that.Point(y, x)), color);
                //tools.debug("iso", "added block at x:" + x + ", y: " + y);
            }
        }*/

    }

    _self.center = {
        x: (_self.defaults.width / 2)/10,
        y: _self.defaults.height / 2
    };

    tools.delay(_self.resetCanvas(), 99);

    //default pos (center)
    _self.pos = _self.center;

    //move to default pos
    _self.moving.jump(_self.pos);

    //export module
    window.app = _self;

}()];


//redraw on resize
if ('ResizeObserver' in window) {
    //regele resizing über den...
    new ResizeObserver(app.resetCanvas).observe(document.documentElement);
} else { //sonst über jQ
    $(window).on('resize', function(e) {
        tools.delay(app.resetCanvas(), 199);
    });
}

app.iso.redraw();

//moving
//if (!tools.isMobile)
interact(app.can)
    .draggable({
        autoScroll: false,
        inertia: !tools.isMobile,
        modifiers: [
            interact.modifiers.snap({
                targets: [
                    interact.createSnapGrid({
                        x: 3 / 4,
                        y: 3 / 4
                    })
                ],
                range: Infinity,
                relativePoints: [{
                    x: 0,
                    y: 0
                }]
            })
        ],
    })
    .on('dragmove', function(event) {

        app.moving.drag({
            x: event.dx,
            y: event.dy
        })

    })

///
// __________          __           
// \______   \  ____ _/  |_ _____   
//  |    |  _/_/ __ \\   __\\__  \  
//  |    |   \\  ___/ |  |   / __ \_
// |______  / \___  >|__|  (____  /
//        \/      \/            \/ 

var demo = function() {
    app.moving.jump({
        x: 0,
        y: 0
    });

    var c = tinycolor(tools.randomHex);
    window.democolor = c;

    clearInterval(window.demoval);

    var x = 0,
        y = 0;
    window.demoval = setInterval(function() {

        $("#godemo")[0].style.color = c.isLight() ? "black" : "white";
        $("#godemo")[0].style.background = c.toRgbString();
        $("#godemo")[0].style.boxShadow = "inset 100vw 0 " + c.toString();
        $("#godemo")[0].style.setProperty(
            'border-color', tinycolor(c._originalInput).darken(100).toString(), 'important');

        //app.iso.redraw(); //disabled due to movement
       
        x = Math.floor(Math.random() * 10);
        y= Math.floor(Math.random() * 10);
      
        app.moving.jump({x,y});
        app.iso.addplayer(x,y, new Isomer.Color(c._r, c._g, c._b));
        
   
     
             

        /*x++;
        if (x === 3) x = 0;

        y++;
        if (y === 2) y = 0;*/

    }, 4999);

};
var demo2 = function(){
  var x = 1;
  var y=2;
  var c = tinycolor(tools.randomHex);
 app.iso.addplayer(x, y, new Isomer.Color(c._r, c._g, c._b));
   app.moving.jump({x,y});
}

//[setTimeout(demo, 999)];
