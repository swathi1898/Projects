import './style.css'

import * as THREE from 'three';
import { PointLightHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//---------------------------creating scene---------------------------
const scene = new THREE.Scene(); 

const size = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#wbg'),
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(size.width, size.height);

camera.position.setZ(30);

renderer.render(scene, camera);

//---------------------------resizing---------------------------
window.addEventListener('resize', () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
  camera.aspect = size.width/size.height
  camera.updateProjectionMatrix()

  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})
//creating object
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({color:0xFF6347});

const torus = new THREE.Mesh(geometry, material);

// scene.add(torus)

//creating moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ 
    map: moonTexture, 
    normalMap: normalTexture })
)
moon.position.z = 50;
moon.position.setX(-10);

scene.add(moon);

//Creating Earth
const earthTexture = new THREE.TextureLoader().load('earth.jpeg');
// const geometry = new THREE.SphereGeometry(5,50,50);
// const material = new THREE.MeshStandardMaterial({map: earthTexture});
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5,50,50),
  new THREE.MeshStandardMaterial({map: earthTexture})
)
scene.add(earth)


const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20,20,20)

const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight)

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)



//creating more objects
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)

}
Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//----




//Animation
function animate(){
  requestAnimationFrame( animate );

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  earth.rotation.y += 0.01;
  moon.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate()