//© Blubbll
var //libs
    interact = window.interact, //dragging
    Isomer = window.Isomer, //blocks
    moment = window.moment, //time
    tinycolor = window.tinycolor, //color module
    THREE = window.THREE; //threejs
var //modules
    tools = window.tools, //tools module
    app = window.app, //app module
    world = window.world,
    players = window.players,
    camera = window.camera;

//==========================================================

//spawn
void{
}

var demo = function(){
    var c = tinycolor(tools.randomHex);
    window.democolor = c;

    clearInterval(window.demoval);

    const did = "432432-432432-33";
  
    var x = 0,
        z = 0;
  
    var p = players.add(did, "Demoplayer", [0,0,0]);
  
    window.demoval = setInterval(function() {

        $("#godemo")[0].style.color = c.isLight() ? "black" : "white";
        $("#godemo")[0].style.background = c.toRgbString();
        $("#godemo")[0].style.boxShadow = "inset 100vw 0 " + c.toString();
        $("#godemo")[0].style.setProperty(
            'border-color', tinycolor(c._originalInput).darken(100).toString(), 'important');

        x = Math.floor(Math.random() * 10);
        z= Math.floor(Math.random() * 10);
      
       //app.moving.jump({x,y});
      
       camera.position.set(x, 2, z);
       camera.lookAt(new THREE.Vector3(x, 2, z));
      
        players.move(did, [x,0,z]);
    }, 4999);
}
var stopdemo = function(){
  clearInterval(window.demoval);
  players.remove("432432-432432-33");
}

fetch('./data/players.json')
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                   
                }).catch(function(error) {
                   
                });

fetch('./data/markers.json')
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                   for (let lbl of json) {
                     world.addLabel(...lbl.pos, lbl.str );
                    }
                }).catch(function(error) {
                   
                });