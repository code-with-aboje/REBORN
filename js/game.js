// SET UP
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";


// DOM ELEMENT
const game = document.getElementById("game");

let scene, camera, renderer, loader, lobby, ambient, light
function createWorld(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        game.clientWidth / game.clientHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize(game.clientWidth, game.clientHeight);
    game.appendChild(renderer.domElement);
    // env light
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.3;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2 - 0.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.5;
    controls.rotateSpeed = 0.5;
    // lights
    light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.position.set(5, 10, 5);
    scene.add(light);
    ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // load model
    loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load("models/buildings/lobby/lobby-final.glb", (gltf)=>{
    lobby = gltf.scene;
    lobby.scale.setScalar(0.1);   // shrink the building to 10%
    scene.add(lobby);

    // temporary: view the whole building from outside so we can see what it looks like
    const box = new THREE.Box3().setFromObject(lobby);
    const center = box.getCenter(new THREE.Vector3());
    console.log("min", box.min, "max", box.max);
    const floorY = 3.30;
    const eyeY = floorY + 1.6;   // 4.9

    camera.position.set(center.x, eyeY, center.z);
    controls.target.set(center.x, eyeY, center.z - 1);
    controls.update();
});

    function animate(){
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

function startGame() {
  showScreen("game");
  console.log("game started");
  // TODO: create your three.js scene here

  createWorld()
}
window.startGame = startGame;