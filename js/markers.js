//© Blubbll
var //libs
    interact = window.interact, //dragging
    Isomer = window.Isomer, //blocks
    moment = window.moment, //time
    tinycolor = window.tinycolor, //color module
    THREE = window.THREE, //threejs
    THREEx = window.THREEx,
    SunCalc = window.SunCalc;
var //modules
    tools = window.tools, //tools module
    app = window.app, //app module
    world = window.world,
    scene = window.scene;


for (let lbl of [{pos: [0,0,0], str: "spawn"}]) {
 world.addLabel(...lbl.pos, lbl.str );
}

