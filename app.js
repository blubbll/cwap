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
    world = window.world, //world module
    camera = window.camera, //camera module
    scene = window.scene, //scene module
    markers = window.markers, //markers module
    players = window.players, //players module
    getJson = window.tools.getJson //fetchjson module
'use strict';
//==========================================================

//spawn
void {}

var demo = function() {
    var c = tinycolor(tools.randomHex);
    window.democolor = c;

    clearInterval(window.demoval);

    const did = "432432-432432-33";

    var x = 0,
        z = 0;

    var p = players.add(did, "Demoplayer", [0, 0, 0]);

    window.demoval = setInterval(function() {

        $("#godemo")[0].style.color = c.isLight() ? "black" : "white";
        $("#godemo")[0].style.background = c.toRgbString();
        $("#godemo")[0].style.boxShadow = "inset 100vw 0 " + c.toString();
        $("#godemo")[0].style.setProperty(
            'border-color', tinycolor(c._originalInput).darken(100).toString(), 'important');

        x = Math.floor(Math.random() * 10);
        z = Math.floor(Math.random() * 10);

        camera.position.set(x, 2, z);
        camera.lookAt(new THREE.Vector3(x, 2, z));

        players.move(did, [x, 0, z]);
    }, 4999);
}
var stopdemo = function() {
    clearInterval(window.demoval);
    players.remove("432432-432432-33");
}

[function() {
    var _self = {

        data: {
            markers: './data/markers.json',
            players: './data/players.json'
        },

        ///Markers
        updateMarkers: async function(loop) {
            const that = _self; ///proxyfying
            let me = that.updateMarkers;//me
            //get markers
            let _markers = await getJson(that.data.markers);
            //render markers
            for (let _marker in _markers) {
                //id
                const id = _marker;
                //local
                const localMarker = markers.get(id);
              
                const marker = _markers[_marker];
                markers.add(_marker, marker.name, marker.pos);
            }
          
          
          
            //loopo
            if (loop) setTimeout(() => me(true), 3999);
        },

        ///Players
        updatePlayers: async function(loop) {
            const that = _self; ///proxyfying
            let me = that.updatePlayers;//me
            //get players
            const _players = await getJson(that.data.players);

            //clear up players who went offline
            for (let _localplayer of players.list)
                if (!Object.keys(_players).some(function(id) {
                        return id === _localplayer.id;
                    })) players.remove(_localplayer.id)

            //render players
            for (let _player in _players) {
                //id
                const id = _player;
              
                //local
                const localPlayer = players.get(id);

                //local create/update
                if (localPlayer === void 0) {
                    const data = _players[id];
                    players.add(id, data.name, data.pos)
                } else {
                    const data = _players[id];
                    players.update(id, data.name, data.pos)
                }
            }
            //loopo
            if (loop) setTimeout(() => me(true), 3999);

        }
    }
    window.app = _self;
}()];

[async function() {

    app.updatePlayers(true);
    app.updateMarkers();

}()];