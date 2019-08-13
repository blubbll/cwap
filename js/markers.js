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
    world = window.world,//world module
    camera = window.camera,//camera module
    scene = window.scene,//scene module
    markers = window.markers,//markers module
    players = window.players; //players module
'use strict';
//==========================================================
[function() {
    var _self = {
        list: world.labels,
        container: document.getElementById('container'),
        _createTextLabel(id) {
            var div = document.createElement('div');
            div.className = 'text-label';
            div.style.position = 'absolute';
            div.style.width = 100;
            div.style.height = 100;
            div.innerHTML = "lbl";
            div.style.top = -1000;
            div.style.left = -1000;
            div.id = "markerText_" + id;
            var _this = this;
            return {
                element: div,
                parent: false,
                position: new THREE.Vector3(0, 0, 0),
                setHTML: function(html) {
                    this.element.innerHTML = html;
                },
                setParent: function(threejsobj) {
                    this.parent = threejsobj;
                },
                updatePosition: function() {
                    if (parent) {
                        this.position.copy(this.parent.position);
                    }
                    this.position.y = this.position.y + 1;
                    var coords2d = this.get2DCoords(this.position, window.camera);
                    this.element.style.left = coords2d.x + 'px';
                    this.element.style.top = coords2d.y + 'px';
                },
                get2DCoords: function(position, camera) {
                    var vector = position.project(camera);
                    vector.x = (vector.x + 1) / 2 * window.innerWidth;
                    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
                    return vector;
                }
            };
        },

        add(id, name, pos) {
            var that = _self; ///proxyfying
            var text = this._createTextLabel(id);
            text.setHTML(name);
            /*var material = new THREE.MeshBasicMaterial({		
                color: 0xffffff		
            });*/
            var material = new THREE.MeshNormalMaterial();
            var geometry = new THREE.CylinderGeometry(0, .75, 1, 4, 1);
            var mesh = new THREE.Mesh(geometry, material);

            const x = pos[0];
            const y = pos[1];
            const z = pos[2];

            mesh.position.x = x + .5;
            mesh.position.y = y + .5;
            mesh.position.z = z + .5;
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = true;
            window.scene.add(mesh);
            text.setParent(mesh);
            text.name = 'markerText_' + id;
            mesh.name = 'marker_' + id;

            //add to list
            that.list.push(text);
            that.container.appendChild(text.element);
            world.render();

            return id;
        },
        move(id, ...newpos) {
            var that = _self; ///proxyfying

            //new position
            const newX = newpos[0];
            const newY = newpos[1];
            const newZ = newpos[2];

            //////////////marker
            const mesh = scene.getObjectByName('marker_' + id);

            //update mesh pos
            mesh.position.x = newX + .5;
            mesh.position.y = newY + .75;
            mesh.position.z = newZ + .5;

            //update world (not necessary due to sunloop updateing the owrld already)
            //world.render();

        },
      
        update: function(id, name, pos){
          var that = _self;///proxyfying
          
          const marker = that.get(id);
          
          //name
          if(marker.name !== name)marker.name=name;
          
          //move
          if(marker.pos !== pos)
            that.move(marker.id, pos)
        },
      
        remove: function(id) {
            var that = _self; ///proxyfying

            //remove marker
            scene.remove(scene.getObjectByName('marker_' + id));

            //remove text
            scene.remove(scene.getObjectByName('markerText_' + id));

            //remove from list
            that.list = that.list.filter(function(value, index, arr) {
                return value.id !== id;
            });

            //remove html text
            $("#markerText_" + id).remove();

            //update world (not necessary due to sunloop updateing the owrld already)
            //world.render();
        }
    }

    window.markers = _self;
}()];