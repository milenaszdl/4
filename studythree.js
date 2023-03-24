const div = document.querySelector('.threejs');
let mesh;

document.forms[0].addEventListener('change', (e) => {
    mesh.material.color.set(e.target.value);
})

window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = div.clientWidth / div.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(div.clientWidth, div.clientHeight);
}

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, div.clientWidth / div.clientHeight, 0.1, 1000);
camera.position.set(-10, 3, -10);
cameraTarget = new THREE.Vector3(-1, 0.4, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(div.clientWidth, div.clientHeight);

div.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

scene.background = new THREE.Color('#E1BBDD');
// scene.fog = new THREE.fog('#CC577C',1,5);

//горизонтальная плоскость
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(4000, 4000),
  new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })
);
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

//вертикальная плоскость
const plane2Geometry = new THREE.BufferGeometry();
const plane2Width = 50;
const plane2Height = 30;
const plane2Vertices = new Float32Array([
    -plane2Width/2,0,0,
    plane2Width/2,0,0,
    -plane2Width/2, plane2Height, 0,
    plane2Width/2, plane2Height, 0
])

//свет над сценой
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

document.getElementById('hemi').addEventListener('change', function(){
    if(this.checked){
        hemiLight.intensity = 1;
    }
    else{
        hemiLight.intensity = 0;
    }
});


//пирамида
const geometryPyramid = new THREE.BufferGeometry();
const verticesPyramid = new Float32Array([
    //основание пирамиды
    -0.8, 0, 0.8,
    0.8, 0, 0.8,
    0.8, 0, -0.8,
    -0.8, 0, -0.8,
    //вершина пирамиды
    0, 2, 0
]);
const indicesPyramid = new Uint32Array([
  //треугольники основания
    0, 1, 4,
    1, 2, 4, 
    2, 3, 4,
    3, 0, 4 
]);
geometryPyramid.setAttribute('position', new THREE.BufferAttribute(verticesPyramid, 3));
geometryPyramid.setIndex(new THREE.BufferAttribute(indicesPyramid, 1));
geometryPyramid.computeVertexNormals();

const materialPyramid = new THREE.MeshPhongMaterial({ color: '#9562F8' });

const pyramid = new THREE.Mesh(geometryPyramid, materialPyramid);
pyramid.position.set(-1, 0, 1);
scene.add(pyramid);
pyramid.receiveShadow = true;
pyramid.castShadow = true;
document.forms[0].addEventListener('change', (e) => {
    materialPyramid.color.set(e.target.value);
});

//параллелный свет
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-20, 10, -5);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2000; // default
directionalLight.shadow.mapSize.height = 2000; // default
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = - 10;
directionalLight.shadow.camera.left = - 10;
directionalLight.shadow.camera.right = 10;
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);
document.getElementById('direct').addEventListener('change', function(){
    if(this.checked){
        directionalLight.intensity = 1;
    }
    else{
        directionalLight.intensity = 0;
    }
});

//софит
const pointerLight = new THREE.PointLight(0xffffff, 1, 100)
pointerLight.position.set(0, 7, -8);
pointerLight.castShadow = true;

pointerLight.shadow.mapSize.width = 2000; // default
pointerLight.shadow.mapSize.height = 2000; // default
pointerLight.shadow.camera.top = 10;
pointerLight.shadow.camera.bottom = - 10;
pointerLight.shadow.camera.left = - 10;
pointerLight.shadow.camera.right = 10;
scene.add(pointerLight);
const pointerLightHelper = new THREE.PointLightHelper(pointerLight);
scene.add(pointerLightHelper);
document.getElementById('point').addEventListener('change', function(){
    if(this.checked){
        pointerLight.intensity = 1;
    }
    else{
        pointerLight.intensity = 0;
    }
});

//куб
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: '#9562F8' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-3, 0.5, 3);
scene.add(cube);
cube.castShadow = true;
document.forms[0].addEventListener('change', (e) => {
    cubeMaterial.color.set(e.target.value);
});

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    render();

}

//нормали верт плоскости
// plane2Geometry.computeVertexNormals();
plane2Geometry.setAttribute('position', new THREE.BufferAttribute(plane2Vertices, 3));
plane2Geometry.computeVertexNormals();
const plane2Material = new THREE.MeshPhongMaterial({color: '#69779C'});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
plane2.receiveShadow = true;
//plane2.castShadow = true;
plane2.rotation.y = - Math.PI / 0.15;
plane2.position.z = 15;
//plane2Geometry.computeVertexNormals();
scene.add(plane2);

function render() {

    const elapsedTime = clock.getElapsedTime()

    camera.position.x = Math.cos(elapsedTime * 0.5) * 4;
    camera.position.z = Math.sin(elapsedTime * 0.5) * 4;

    camera.lookAt(cameraTarget);

    renderer.render(scene, camera);

}

animate();