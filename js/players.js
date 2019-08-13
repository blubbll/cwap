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
        list: [],
        add: function(id, name, pos) {
          var that = _self;///proxyfying
          
            //color
           const color= 'black';
          
            //pos
            const x = pos[0];
            const y = pos[1];
            const z = pos[2];
         
            //geometry
           var playerGeo = new THREE.CylinderGeometry(.75, 0, 1.5, 4);
           var playerOutlineGeo = playerGeo;
          
            //paint upside black
           for (var i = 4; i < 8; i++) { 
             playerOutlineGeo.faces[i].color.set( 'black' )
            }
           
            //mesh
            const mesh = new THREE.Mesh(playerGeo, new THREE.MeshToonMaterial({
              vertexColors: THREE.FaceColors
            }));
          
            //outline
            var meshOutline = new THREE.Mesh(playerOutlineGeo ,
                 new THREE.MeshBasicMaterial({
                 color: 'red',
               side: THREE.BackSide
            }));
            meshOutline.position = mesh.position;
            meshOutline.scale.multiplyScalar(1.05);
            scene.add(meshOutline);
            meshOutline.name = 'playerOutline_' + id;
                      //position
            meshOutline.position.x=x+.5;
            meshOutline.position.y = y+.75;
            meshOutline.position.z=z+.5;
         
            //position
            mesh.position.x=x+.5;
            mesh.position.y = y+.75;
            mesh.position.z=z+.5;
          
            //setup figure
            mesh.name = 'player_' + id;
          
            //add to scene
            window.scene.add(mesh);
          
            //add name
            world.addText(id, name, [x, y, z], 32, .02);
          
            //add profile pic
            /*world.addPic(
              id,
              "https://cdn.glitch.com/2f006643-dd33-4646-b8dd-98c7be2ab18f%2F64.png?v=1565347446426",
              {x, y, z}
            );*/
           
            //add to list
            that.list.push({id, pos, name });
        },
        move: function(id, newpos){
          var that = _self;///proxyfying
          
          //new position
          const newX = newpos[0];
          const newY = newpos[1];
          const newZ = newpos[2];
            
          //////////////figure
          //get player mesh
          const mesh = scene.getObjectByName( 'player_' + id);
          
          //update mesh pos
          mesh.position.x=newX+.5;
          mesh.position.y=newY+.75;
          mesh.position.z=newZ+.5;
          
          //////////////Outline
          const outline = scene.getObjectByName( 'playerOutline_' + id);
          
          //update txt pos
          outline.position.x=newX+.5;
          outline.position.y=newY+.75;
          outline.position.z=newZ+.5;
          
          //////////////TEXT
          const txt = scene.getObjectByName( 'text_' + id);
          
          //update txt pos
          txt.position.x=newX+.5;
          txt.position.y=newY+2;
          txt.position.z=newZ+.5;
          
          //update world (not necessary due to sunloop updateing the owrld already)
          //world.render();
          
        },
      
        get: function(id){
          var that = _self;///proxyfying
          return that.list.filter(function(value, index, arr){
            return value.id===id;
          })[0];
        },
        
        update: function(id, name, pos){
          var that = _self;///proxyfying
          
          //get player
          const player = that.get(id);
          
          //name
          if(player.name !== name)player.name=name;
          
          //move
          if(player.pos !== pos)
            that.move(player.id, pos)
                    
          //text
            world.updateText(player.id, player.name, pos);
        },
          
        rename: function(id, name){
          var that = _self;///proxyfying
          const player = that.get(id);
        },
        remove: function(id){
          var that = _self;///proxyfying
          
          //remove player figure
          scene.remove(scene.getObjectByName( 'player_' + id));
          
          //remove player outline
          scene.remove(scene.getObjectByName( 'playerOutline_' + id));
          
          //remove player text
          scene.remove(scene.getObjectByName( 'text_' + id));
          
          //remove from list
          that.list = that.list.filter(function(value, index, arr){
            return value.id!==id;
          });
          
          //update world (not necessary due to sunloop updateing the owrld already)
          //world.render();
          
        }
    }

    window.players = _self;
    
}()];


//DEMO

//players.add("432432-432432-33", "test", [0,0,0]);

//setTimeout(function(){
//  
//  players.move("432432-432432-33", [1,0,1]);
//  
//}, 999);



//player logged off
//players.remove("432432-432432-33")
