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
    scene = window.scene,//scene module
    markers = window.markers,//markers module
    players = window.players; //players module
'use strict';
/* global THREE */
class VoxelWorld {
    constructor(options) {
        this.cellSize = options.cellSize;
        this.tileSize = options.tileSize;
        const {
            cellSize
        } = this;
        this.cellSliceSize = cellSize * cellSize;
        this.texts = [];
        this.labels = [];
        this.voxelMaterials = [];
    }
    addText(id, msg, pos, size, scale) {
        var SpriteText2D = window.THREE_Text2D.SpriteText2D;
        var textAlign = window.THREE_Text2D.textAlign;
        var texts = [];
        var sprite = new SpriteText2D(msg, {
            align: textAlign.center,
            font: (size !== void 0 ? size : 64) + 'px Arial',
            fillStyle: '#ffffff',
            antialias: true
        });
        sprite.position.set(pos.x + .5, pos.y + 2, pos.z + .5);
        var scale = scale !== void 0 ? scale : .1;
        sprite.name = 'text_' + id;
        sprite.scale.set(scale, scale, scale)
        window.scene.add(sprite)
        //window.scene.remove(sprite)
        texts.push(sprite);
        return sprite;
    }
    addPic(id, url, pos) {
        var texture = new THREE.TextureLoader().load(url);
        //var material = new THREE.MeshBasicMaterial( { map: texture } );
        var material = new THREE.SpriteMaterial({
            map: texture
        });
        var sprite = new THREE.Sprite(material);
        sprite.name = 'pic_' + id;
        sprite.position.set(pos.x + .5, pos.y + 1.5, pos.z + .5);
        window.scene.add(sprite);
    }
    clearTexts() {
        if (this.texts)
            for (let o of this.texts) {
                var scene = window.scene;
                scene.remove(o);
            }
    }
}
const cellSize = 4;

function spawn(first) {
    var camera = window.camera;
    var controls = window.controls;
    window.camera.position.set((-cellSize * .3) - 1, cellSize * .8, (-cellSize * .3) - 1);
    controls.target.set((cellSize / 2) - 1, cellSize / 3, (cellSize / 2) - 1);
    if (!first) controls.update();
}

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    const size = 1200;
    window.size = size;
    const fov = 50;
    const aspect = 2; // the canvas default
    const near = 1;
    const far = 12000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    window.camera = camera;
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableKeys = 1;
    window.controls = controls;
    spawn(true);
    controls.update();
    var _createTextLabel = function() {
        var div = document.createElement('div');
        div.className = 'text-label';
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.height = 100;
        div.innerHTML = "???";
        div.style.top = -1000;
        div.style.left = -1000;
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
                var coords2d = this.get2DCoords(this.position, _this.camera);
                this.element.style.left = coords2d.x + 'px';
                this.element.style.top = coords2d.y + 'px';
            },
            get2DCoords: function(position, camera) {
                var vector = position.project(camera);
                vector.x = (vector.x + 1) / 2 * window.innerWidth;
                vector.y = 5;
                return vector;
            }
        };
    }
    const scene = new THREE.Scene();
    window.scene = scene;
    scene.background = new THREE.Color('black');

    function initHelpers() {
        var axes = new THREE.AxesHelper(2);
        scene.add(axes);
        scene.add(new THREE.GridHelper(size, size, 'black', 'limegreen'));
    }
    var addBottom = function() {
        var geometry = new THREE.BoxGeometry(size, 1, size);
        var material = new THREE.MeshPhysicalMaterial({
            color: 'lime'
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.y = -.5;
        scene.add(cube);
    }
    var initDayNight = function() {
        var onRenderFcts = [];
        //winkel
        var sunAngle = -1 / 6 * Math.PI * 2;
        let times;
        let _lat;
        let _long;
        let allowed = false;
        let usereal = false;
        let usefake=false;
        var dt = new Date();
        let noon;
        let nadir;
        var setStartAngle = function(lat, long) {
            _lat = lat;
            _long = long;
            var dt = new Date();
            noon = SunCalc.getTimes(dt, _lat, _long).solarNoon;
            nadir = SunCalc.getTimes(dt, _lat, _long).nadir;
        }
        //Winkel berechnen
        var getAngle = function() {
            var dt = new Date();
            var alt = ((SunCalc.getPosition(dt, _lat, _long)).altitude);
            if (dt > noon) {
                var nadirAlt = 3.6 - ((SunCalc.getPosition(nadir, _lat, _long)).altitude) * -1;
                var newAlt = (nadirAlt - alt);
                alt = newAlt;
            }
            return alt;
        };
      
      var getFakeAngle = function(){
          var dt = new Date();
          var currS = dt.getSeconds()+(60*(dt.getMinutes()+(60*dt.getHours())))
          var total = 86400;
          var perc = (currS*100/total)
          var deg = ((perc/100) * 360/Math.PI)/100
          return deg;
        }
        window.getFakeAngle = getFakeAngle;
      
        //Reale pos nutzen falls verfügbar
        if (navigator.permissions) {
            navigator.permissions.query({
                name: 'geolocation'
            }).then(function(PermissionStatus) {
                if (PermissionStatus.state == 'granted') {
                    allowed = true;
                } else if (PermissionStatus.state !== 'denied') {
                    alert("Allow location services for a real time clock." +
                        "Your location will be processed locally. Otherwise your IP will be used.");
                    allowed = true;
                }
                if (allowed) {
                    try {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            usereal = true;
                            setStartAngle(position.coords.latitude, position.coords.longitude);
                        });
                    } catch (e) {}
                } else getLocationByIp();
            })
        } else getLocationByIp();
        var getLocationByIp = function() {
            fetch(
                    'https://freegeoip.app/json/', {
                        origin: location.href
                    }
                )
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    var lat = json.latitude;
                    var long = json.longitude;
                    setStartAngle(lat, long);
                }).catch(function(error) {
                    console.log(error);
                    usefake = true;
                    sunAngle = getFakeAngle();
                });
        }
        onRenderFcts.push(function(now) {
            sunAngle = usefake ? getFakeAngle() : getAngle();
        })
        //sterne
        var starsGeometry = new THREE.Geometry();
        for (var i = 0; i < size; i++) {
            var star = new THREE.Vector3();
            star.x = THREE.Math.randFloatSpread(size + 250);
            star.y = THREE.Math.randFloatSpread(size) + 50 + size / 4;
            star.z = THREE.Math.randFloatSpread(size + 250);
            starsGeometry.vertices.push(star);
        }
        var starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff
        });
        var starField = new THREE.Points(starsGeometry, starsMaterial);
        world.starField = starField;
        scene.add(starField);
        //sonne
        var sunSphere = new THREEx.DayNight.SunSphere()
        scene.add(sunSphere.object3d)
        onRenderFcts.push(function() {
            sunSphere.update(sunAngle)
        })
        //licht
        var sunLight = new THREEx.DayNight.SunLight();
        var helper = new THREE.DirectionalLightHelper(sunLight.object3d, 50000);
        scene.add(helper);
        scene.add(sunLight.object3d)
        onRenderFcts.push(function() {
            sunLight.update(sunAngle)
        })
        //himmel
        var skydom = new THREEx.DayNight.Skydom()
        scene.add(skydom.object3d)
        onRenderFcts.push(function() {
            skydom.update(sunAngle)
        })
        //loop
        requestAnimationFrame(function animate(nowMsec) {
            world.render();
            // keep looping
            requestAnimationFrame(animate);
            // call each update function
            onRenderFcts.forEach(function(onRenderFct) {
                onRenderFct()
            })
        })
    }
    var initWorld = function() {
        addBottom();
        initDayNight();
        initHelpers();
    }
    const tileSize = 1;
    const world = new VoxelWorld({
        cellSize,
        tileSize
    });
    window.world = world;
    initWorld();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    let renderRequested = false;

    function render() {
        renderRequested = undefined;
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        //Textlabels updaten
        for (var i = 0; i < world.labels.length; i++) {
            world.labels[i].updatePosition();
        }
        controls.update();
        renderer.render(scene, camera);
    }
    render();
    world.render = render;

    function requestRenderIfNotRequested() {
        if (!renderRequested) {
            renderRequested = true;
            requestAnimationFrame(render);
        }
    }
    var mat = new THREE.MeshPhongMaterial({
        color: 'lime'
    });
    const mouse = {
        x: 0,
        y: 0,
    };

    function recordStartPosition(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.moveX = 0;
        mouse.moveY = 0;
    }

    function recordMovement(event) {
        mouse.moveX += Math.abs(mouse.x - event.clientX);
        mouse.moveY += Math.abs(mouse.y - event.clientY);
        var x = Math.floor(camera.position.x);
        var z = Math.floor(camera.position.z);
        $("#pos")[0].innerText = "x: " + x + ", z: " + z
    }
    canvas.addEventListener('mousedown', (event) => {
        event.preventDefault();
        recordStartPosition(event);
        window.addEventListener('mousemove', recordMovement);
    }, {
        passive: false
    });
    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        recordStartPosition(event.touches[0]);
    }, {
        passive: false
    });
    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        recordMovement(event.touches[0]);
    }, {
        passive: false
    });
    controls.addEventListener('change', requestRenderIfNotRequested);
    window.addEventListener('resize', requestRenderIfNotRequested);
}
main();