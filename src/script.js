import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { CSG } from "three-csg-ts/lib/cjs/CSG.js";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
/*****************************************************************BASE***********************************************************
 * Base
 */
//loading manager
//loadingmanager
const loadingManager = new THREE.LoadingManager(() => {});
//path url
let url = "";
if (document.querySelector(".wpbf-logo a") !== null) {
  document.querySelector(".wpbf-page-header").display = "";
  const logoAttri = document.querySelector(".wpbf-logo a").getAttribute("href");
  url = logoAttri + "/wp-content/themes/flux-child/configurator/";
} else {
  url = "";
}
// Debug
const gui = new dat.GUI();
gui.hide();
// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
// gltfLoader.load("/models/dorpel.gltf", (gltf) => {
//   gltf.scene.scale.set(0.025, 0.025, 0.025);
//   scene.add(gltf.scene);
// });
/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.ShadowMaterial({ color: 0xcccccc })
);
floor.receiveShadow = true;
floor.position.y = -0.1;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const hemiSphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
scene.add(hemiSphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.far = 1500;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(0, 5, 1.5);
scene.add(directionalLight);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const iface = document.querySelectorAll(".interface-container");
// scherm halveren bij ui hide
const uiHide = () => {
  if (iface[0].classList.contains("hidden")) {
    sizes.width = window.innerWidth;
  } else {
    sizes.width = window.innerWidth * (2 / 3);
  }
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
};
window.addEventListener("resize", () => {
  // Update sizes
  uiHide();
  // sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.001,
  100
);
camera.position.set(0.5, 0.5, 0.5);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

controls.maxDistance = 6;
controls.maxPolarAngle = Math.PI / 1.65;
controls.enablePan = false;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff);
/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
/**************************************************************MATERIALS********************************************************************************
 * Materials
 */
const textureLoader = new THREE.TextureLoader(loadingManager);
const arduinArray = [];
arduinArray.name = "arduin";
const granietArray = [];
granietArray.name = "graniet";
const marmerArray = [];
marmerArray.name = "marmer";
//texture repeat function*****************
const wrapRepeat = (color, normal) => {
  color.matrixAutoUpdate = normal.matrixAutoUpdate = false;
  color.needsUpdate = normal.needsUpdate = true;
  color.wrapS =
    color.wrapT =
    normal.wrapS =
    normal.wrapT =
      THREE.RepeatWrapping;     
};
//arduin***************************************
//G360 donker gezoet
const G360_colorTexture = textureLoader.load(
  url + "textures/arduin/G360_donker_gezoet/G360_donker_gezoet.jpg"
);
const G360_normalTexture = textureLoader.load(
  url + "textures/arduin/G360_donker_gezoet/G360_donker_gezoet_normal.jpg"
);
wrapRepeat(G360_colorTexture, G360_normalTexture);
const G360 = new THREE.MeshStandardMaterial({
  map: G360_colorTexture,
  normalMap: G360_normalTexture,
});
G360.name = "G360_donker_gezoet";
//oriental basalt
const Orientalbasalt_colorTexture = textureLoader.load(
  url + "textures/arduin/Oriental_basalt/Oriental_basalt.jpg"
);
const Orientalbasalt_normalTexture = textureLoader.load(
  url + "textures/arduin/Oriental_basalt/Oriental_basalt_normal.jpg"
);
wrapRepeat(Orientalbasalt_colorTexture, Orientalbasalt_normalTexture);
const Orientalbasalt = new THREE.MeshStandardMaterial({
  map: Orientalbasalt_colorTexture,
  normalMap: Orientalbasalt_normalTexture,
});
Orientalbasalt.name = "Oriental_basalt";
//array push
arduinArray.push(G360, Orientalbasalt); //default mat
//graniet*********************************************
//Zimbabwe_black_verzoet
const ZimbabweBlackVerzoet_colorTexture = textureLoader.load(
  url + "textures/graniet/Zimbabwe_black_verzoet/Zimbabwe_black_verzoet.jpg"
);
const ZimbabweBlackVerzoet_normalTexture = textureLoader.load(
  url +
    "textures/graniet/Zimbabwe_black_verzoet/Zimbabwe_black_verzoet_normal.jpg"
);
wrapRepeat(
  ZimbabweBlackVerzoet_colorTexture,
  ZimbabweBlackVerzoet_normalTexture
);
const ZimbabweBlackVerzoet = new THREE.MeshStandardMaterial({
  map: ZimbabweBlackVerzoet_colorTexture,
  normalMap: ZimbabweBlackVerzoet_normalTexture,
});
ZimbabweBlackVerzoet.name = "Zimbabwe_black_verzoet";
//array push
granietArray.push(ZimbabweBlackVerzoet);
//marmer*********************************************
//Bianco_carrara
const BiancoCarrara_colorTexture = textureLoader.load(
  url + "textures/marmer/Bianco_carrara/Bianco_carrara.jpg"
);
const BiancoCarrara_normalTexture = textureLoader.load(
  url +
    "textures/marmer/Bianco_carrara/Bianco_carrara_normal.jpg"
);
wrapRepeat(
  BiancoCarrara_colorTexture,
  BiancoCarrara_normalTexture
);
const BiancoCarrara = new THREE.MeshStandardMaterial({
  map: BiancoCarrara_colorTexture,
  normalMap: BiancoCarrara_normalTexture,
  roughness: 0.3,
});
BiancoCarrara.name = "Bianco_carrara";
//Nero_marquina
const NeroMarquina_colorTexture = textureLoader.load(
  url + "textures/marmer/Nero_marquina/Nero_marquina.jpg"
);
const NeroMarquina_normalTexture = textureLoader.load(
  url +
    "textures/marmer/Nero_marquina/Nero_marquina_normal.jpg"
);
wrapRepeat(
  NeroMarquina_colorTexture,
  NeroMarquina_normalTexture
);
const NeroMarquina = new THREE.MeshStandardMaterial({
  map: NeroMarquina_colorTexture,
  normalMap: NeroMarquina_normalTexture,
});
NeroMarquina.name = "Nero_marquina";
//arraypush
marmerArray.push(BiancoCarrara,NeroMarquina);
/*************************************************************general functions*************************************************************************************
 * functions
 */
const miscParams = {
  //edge bevel
  bevelDistance: 0.005,
};
const params = {
  typeObject: "",
  huidigMateriaal: G360,
};
function _applyBoxUV(geom, transformMatrix, bbox, bbox_max_size) {

  let coords = [];
  coords.length = 2 * geom.attributes.position.array.length / 3;

  // geom.removeAttribute('uv');
  if (geom.attributes.uv === undefined) {
      geom.addAttribute('uv', new THREE.Float32BufferAttribute(coords, 2));
  }

  //maps 3 verts of 1 face on the better side of the cube
  //side of the cube can be XY, XZ or YZ
  let makeUVs = function(v0, v1, v2) {

      //pre-rotate the model so that cube sides match world axis
      v0.applyMatrix4(transformMatrix);
      v1.applyMatrix4(transformMatrix);
      v2.applyMatrix4(transformMatrix);

      //get normal of the face, to know into which cube side it maps better
      let n = new THREE.Vector3();
      n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();

      n.x = Math.abs(n.x);
      n.y = Math.abs(n.y);
      n.z = Math.abs(n.z);

      let uv0 = new THREE.Vector2();
      let uv1 = new THREE.Vector2();
      let uv2 = new THREE.Vector2();
      // xz mapping
      if (n.y > n.x && n.y > n.z) {
          uv0.x = (v0.x - bbox.min.x) / bbox_max_size;
          uv0.y = (bbox.max.z - v0.z) / bbox_max_size;

          uv1.x = (v1.x - bbox.min.x) / bbox_max_size;
          uv1.y = (bbox.max.z - v1.z) / bbox_max_size;

          uv2.x = (v2.x - bbox.min.x) / bbox_max_size;
          uv2.y = (bbox.max.z - v2.z) / bbox_max_size;
      } else
      if (n.x > n.y && n.x > n.z) {
          uv0.x = (v0.z - bbox.min.z) / bbox_max_size;
          uv0.y = (v0.y - bbox.min.y) / bbox_max_size;

          uv1.x = (v1.z - bbox.min.z) / bbox_max_size;
          uv1.y = (v1.y - bbox.min.y) / bbox_max_size;

          uv2.x = (v2.z - bbox.min.z) / bbox_max_size;
          uv2.y = (v2.y - bbox.min.y) / bbox_max_size;
      } else
      if (n.z > n.y && n.z > n.x) {
          uv0.x = (v0.x - bbox.min.x) / bbox_max_size;
          uv0.y = (v0.y - bbox.min.y) / bbox_max_size;

          uv1.x = (v1.x - bbox.min.x) / bbox_max_size;
          uv1.y = (v1.y - bbox.min.y) / bbox_max_size;

          uv2.x = (v2.x - bbox.min.x) / bbox_max_size;
          uv2.y = (v2.y - bbox.min.y) / bbox_max_size;
      }

      return {
          uv0: uv0,
          uv1: uv1,
          uv2: uv2
      };
  };

  if (geom.index) { // is it indexed buffer geometry?
      for (let vi = 0; vi < geom.index.array.length; vi += 3) {
          let idx0 = geom.index.array[vi];
          let idx1 = geom.index.array[vi + 1];
          let idx2 = geom.index.array[vi + 2];

          let vx0 = geom.attributes.position.array[3 * idx0];
          let vy0 = geom.attributes.position.array[3 * idx0 + 1];
          let vz0 = geom.attributes.position.array[3 * idx0 + 2];

          let vx1 = geom.attributes.position.array[3 * idx1];
          let vy1 = geom.attributes.position.array[3 * idx1 + 1];
          let vz1 = geom.attributes.position.array[3 * idx1 + 2];

          let vx2 = geom.attributes.position.array[3 * idx2];
          let vy2 = geom.attributes.position.array[3 * idx2 + 1];
          let vz2 = geom.attributes.position.array[3 * idx2 + 2];

          let v0 = new THREE.Vector3(vx0, vy0, vz0);
          let v1 = new THREE.Vector3(vx1, vy1, vz1);
          let v2 = new THREE.Vector3(vx2, vy2, vz2);

          let uvs = makeUVs(v0, v1, v2, coords);

          coords[2 * idx0] = uvs.uv0.x;
          coords[2 * idx0 + 1] = uvs.uv0.y;

          coords[2 * idx1] = uvs.uv1.x;
          coords[2 * idx1 + 1] = uvs.uv1.y;

          coords[2 * idx2] = uvs.uv2.x;
          coords[2 * idx2 + 1] = uvs.uv2.y;
      }
  } else {
      for (let vi = 0; vi < geom.attributes.position.array.length; vi += 9) {
          let vx0 = geom.attributes.position.array[vi];
          let vy0 = geom.attributes.position.array[vi + 1];
          let vz0 = geom.attributes.position.array[vi + 2];

          let vx1 = geom.attributes.position.array[vi + 3];
          let vy1 = geom.attributes.position.array[vi + 4];
          let vz1 = geom.attributes.position.array[vi + 5];

          let vx2 = geom.attributes.position.array[vi + 6];
          let vy2 = geom.attributes.position.array[vi + 7];
          let vz2 = geom.attributes.position.array[vi + 8];

          let v0 = new THREE.Vector3(vx0, vy0, vz0);
          let v1 = new THREE.Vector3(vx1, vy1, vz1);
          let v2 = new THREE.Vector3(vx2, vy2, vz2);

          let uvs = makeUVs(v0, v1, v2, coords);

          let idx0 = vi / 3;
          let idx1 = idx0 + 1;
          let idx2 = idx0 + 2;

          coords[2 * idx0] = uvs.uv0.x;
          coords[2 * idx0 + 1] = uvs.uv0.y;

          coords[2 * idx1] = uvs.uv1.x;
          coords[2 * idx1 + 1] = uvs.uv1.y;

          coords[2 * idx2] = uvs.uv2.x;
          coords[2 * idx2 + 1] = uvs.uv2.y;
      }
  }

  geom.attributes.uv.array = new Float32Array(coords);
}

function applyBoxUV(bufferGeometry, transformMatrix, boxSize) {

  if (transformMatrix === undefined) {
      transformMatrix = new THREE.Matrix4();
  }

  if (boxSize === undefined) {
      let geom = bufferGeometry;
      geom.computeBoundingBox();
      let bbox = geom.boundingBox;

      let bbox_size_x = bbox.max.x - bbox.min.x;
      let bbox_size_z = bbox.max.z - bbox.min.z;
      let bbox_size_y = bbox.max.y - bbox.min.y;

      boxSize = Math.max(bbox_size_x, bbox_size_y, bbox_size_z);
  }

  let uvBbox = new THREE.Box3(new THREE.Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2), new THREE.Vector3(boxSize / 2, boxSize / 2, boxSize / 2));

  _applyBoxUV(bufferGeometry, transformMatrix, uvBbox, boxSize);

}
const updateAll = () => {
  scene.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;     
    }
  });
};
const setUV = (obj) =>{
  for (const child of obj.children) {
    child.geometry.computeBoundingBox()
    let bboxSize = child.geometry.boundingBox.getSize();
    let uvMapSize = Math.min(bboxSize.x,bboxSize.y,bboxSize.z);
    let boxGeometry = new THREE.BoxBufferGeometry(uvMapSize, uvMapSize, uvMapSize);
    let cube = new THREE.Mesh(boxGeometry, params.huidigMateriaal);
    // scene.add(cube);
    // child.material.map.offset.set(0, 0);
    applyBoxUV(child.geometry,new THREE.Matrix4().invert(cube.matrix),child.material.map.image.height / (uvMapSize*(100000)));
    child.geometry.attributes.uv.needsUpdate = true;
    // child.material.map.repeat.set(length,depth);
    // console.log(child.material.map.image.height)
    // console.log(child.material.map.image.width)
  }    
}
//boolean subtract ******
const SubtractObject = (mainObj, boolObj) => {
  //update matrix
  // mainObj.updateMatrix();
  boolObj.updateMatrix();
  //subtract
  mainObj = CSG.subtract(mainObj, boolObj);
  return mainObj;
};
//clean up mesh *******
const cleanup = (obj) => {
  for (var i = obj.children.length - 1; i >= 0; i--) {
    if (obj.children[i] instanceof THREE.Mesh) {
      obj.children[i].geometry.dispose();
      obj.children[i].material.dispose();
      if (obj.children[i].parent !== null) {
        obj.children[i].parent.remove(obj.children[i]);
      }      
    } else {
      cleanup(obj.children[i]);
    }
  }
  obj.parent.remove(obj);
};
//bevel obj *******
const bevelEdge = (
  obj,
  frontBot,
  frontTop,
  backBot,
  backTop,
  rightBot,
  rightTop,
  leftBot,
  leftTop,
  rightFrontVert,
  rightBackVert,
  leftFrontVert,
  leftBackVert
) => {
  const bevel = (lengte, diepte, hoogte, bbox) => {
    const array = [];

    //1 front bottom
    if (frontBot) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(lengte, 0.01, 0.01),
        params.huidigMateriaal
      );
      cube.position.set(0, bbox.min.y, bbox.max.z + miscParams.bevelDistance);
      cube.rotation.x = Math.PI / 4;
      array.push(cube);
    }
    //2 front top
    if (frontTop) {
      const cube2 = new THREE.Mesh(
        new THREE.BoxGeometry(lengte, 0.01, 0.01),
        params.huidigMateriaal
      );
      cube2.position.set(0, bbox.max.y, bbox.max.z + miscParams.bevelDistance);
      cube2.rotation.x = Math.PI / 4;
      array.push(cube2);
    }
    //3 back bottom
    if (backBot) {
      const cube3 = new THREE.Mesh(
        new THREE.BoxGeometry(lengte, 0.01, 0.01),
        params.huidigMateriaal
      );
      cube3.position.set(0, bbox.min.y, bbox.min.z - miscParams.bevelDistance);
      cube3.rotation.x = Math.PI / 4;
      array.push(cube3);
    }
    //4 back top
    if (backTop) {
      const cube4 = new THREE.Mesh(
        new THREE.BoxGeometry(lengte, 0.01, 0.01),
        params.huidigMateriaal
      );
      cube4.position.set(0, bbox.max.y, bbox.min.z - miscParams.bevelDistance);
      cube4.rotation.x = Math.PI / 4;
      array.push(cube4);
    }
    //5 right bottom
    if (rightBot) {
      const cube5 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.01, diepte),
        params.huidigMateriaal
      );
      cube5.position.set(bbox.max.x + miscParams.bevelDistance, bbox.min.y, 0);
      cube5.rotation.z = Math.PI / 4;
      array.push(cube5);
    }
    //6 right top
    if (rightTop) {
      const cube6 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.01, diepte),
        params.huidigMateriaal
      );
      cube6.position.set(bbox.max.x + miscParams.bevelDistance, bbox.max.y, 0);
      cube6.rotation.z = Math.PI / 4;
      array.push(cube6);
    }
    //7 left bottom
    if (leftBot) {
      const cube7 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.01, diepte),
        params.huidigMateriaal
      );
      cube7.position.set(bbox.min.x - miscParams.bevelDistance, bbox.min.y, 0);
      cube7.rotation.z = Math.PI / 4;
      array.push(cube7);
    }
    //8 left top
    if (leftTop) {
      const cube8 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.01, diepte),
        params.huidigMateriaal
      );
      cube8.position.set(bbox.min.x - miscParams.bevelDistance, bbox.max.y, 0);
      cube8.rotation.z = Math.PI / 4;
      array.push(cube8);
    }
    //9 front right vert
    if (rightFrontVert) {
      const cube9 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, hoogte, 0.01),
        params.huidigMateriaal
      );
      cube9.position.set(
        bbox.max.x + miscParams.bevelDistance / 2,
        0,
        bbox.max.z + miscParams.bevelDistance / 2
      );
      cube9.rotation.y = Math.PI / 4;
      array.push(cube9);
    }
    //10 back right vert
    if (rightBackVert) {
      const cube10 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, hoogte, 0.01),
        params.huidigMateriaal
      );
      cube10.position.set(
        bbox.max.x + miscParams.bevelDistance / 2,
        0,
        bbox.min.z - miscParams.bevelDistance / 2
      );
      cube10.rotation.y = Math.PI / 4;
      array.push(cube10);
    }
    //11 front left vert
    if (leftFrontVert) {
      const cube11 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, hoogte, 0.01),
        params.huidigMateriaal
      );
      cube11.position.set(
        bbox.min.x - miscParams.bevelDistance / 2,
        0,
        bbox.max.z + miscParams.bevelDistance / 2
      );
      cube11.rotation.y = Math.PI / 4;
      array.push(cube11);
    }
    //12 back left vert
    if (leftBackVert) {
      const cube12 = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, hoogte, 0.01),
        params.huidigMateriaal
      );
      cube12.position.set(
        bbox.min.x - miscParams.bevelDistance / 2,
        0,
        bbox.min.z - miscParams.bevelDistance / 2
      );
      cube12.rotation.y = Math.PI / 4;
      array.push(cube12);
    }

    for (const child of array) {
      obj = SubtractObject(obj, child);
    }

    return obj;
  };
  const bboxBasis = new THREE.Box3().setFromObject(obj);
  obj.geometry.computeBoundingBox();
  const lengte = bboxBasis.max.x - bboxBasis.min.x;
  const hoogte = bboxBasis.max.y - bboxBasis.min.y;
  const diepte = bboxBasis.max.z - bboxBasis.min.z;
  bevel(lengte, diepte, hoogte, bboxBasis);
  return obj;
};
const setAfmetingenToLayout = (breedte,hoogte,diepte) =>{
  inputBreedte.value = breedte*100;
  inputHoogte.value = hoogte*100;  
  inputDiepte.value = diepte*100;
}
/*********************************************************DORPEL*****************************************************************************************
 * dorpel params
 */
const dorpelParams = {
  //type
  binnenDorpel: false,
  type: "exterieur",
  subtype: "garage",
  //extra opties
  opkant: false,
  kussensMassief: false,
  kussensGelijmd: false,
  //afmetingen
  //min-max
  basisLengteMin: 0.2,
  basisDiepteMin: 0.1,
  basisDiepteMax: 0.6,
  basisDikteMin: 0.04,
  basisDikteMax: 0.12,
  //huidig
  basisLengteHuidig: 1,
  basisDiepteHuidig: 0.2,
  basisDikteHuidig: 0.05,
  //opkant
  opkantDikte: 0.01,
  opkantDiepte: 0.02,
  //kussens
  kussensDikte: 0.01,
  kussenslengte: 0.05,
  kussensDiepte: 0.15,
};
/*************************************************************
 *  building dorpel
 */
let dorpel, dorpelGroup;
let bboxDorpel, bboxOpkant, bboxKussen;
let opkant, kussen1, kussen2;
let garageBool;
const initDorpel = () => {
  if (dorpel !== undefined) {
    cleanup(dorpelGroup);
  }
  //stap 2 :binnendorpel of exterieur dorpel
  if (dorpelParams.type === "exterieur") {
    //stap 2.1: indien exterieur subtype(garage -, deur- , raamdorpel)
    const eDorpelGeometry = new THREE.BoxGeometry(
      dorpelParams.basisLengteHuidig,
      dorpelParams.basisDikteHuidig,
      dorpelParams.basisDiepteHuidig
    );
    dorpelGroup = new THREE.Object3D();
    dorpel = new THREE.Mesh(
      eDorpelGeometry,
      params.huidigMateriaal.clone()
    );
    //--boundingbox of dorpel --/
    bboxDorpel = new THREE.Box3().setFromObject(dorpel);
    dorpel.geometry.computeBoundingBox();
    switch (dorpelParams.subtype) {
      case "garage":
        garageBool = new THREE.Mesh(
          new THREE.BoxGeometry(dorpelParams.basisLengteHuidig, 0.05)
        ); //kubus van dorpel afgetrokken
        garageBool.rotation.x = Math.PI * 0.15;
        garageBool.position.set(
          dorpel.position.x,
          bboxDorpel.max.y + 0.01,
          bboxDorpel.max.z
        );
        dorpel = SubtractObject(dorpel, garageBool);
        break;
      case "deur":
        break;
      case "raam":
        const raamBool = new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.005,
            0.005,
            dorpelParams.basisLengteHuidig + 0.01,
            20
          ),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        ); // cylinder onder dorpel afgetrokken
        raamBool.rotation.x = -Math.PI * 0.5;
        raamBool.rotation.z = -Math.PI * 0.5;
        raamBool.position.set(
          dorpel.position.x,
          bboxDorpel.min.y,
          bboxDorpel.max.z - 0.02
        );
        dorpel = SubtractObject(dorpel, raamBool);
        break;
      default:
        break;
    }
    //randen bevelen
    if (dorpelParams.opkant) {
      if (dorpelParams.kussensMassief || dorpelParams.kussensGelijmd) {
        if (dorpelParams.subtype === "raam") {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          );
        } else {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            false
          );
        }
      } else {
        if (dorpelParams.subtype === "raam") {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          );
        } else {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            false
          );
        }
      }
    } else if (dorpelParams.kussensMassief || dorpelParams.kussensGelijmd) {
      if (dorpelParams.opkant) {
        if (dorpelParams.subtype === "raam") {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          );
        } else {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            false,
            true,
            false
          );
        }
      } else {
        if (dorpelParams.subtype === "raam") {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          );
        } else {
          dorpel = bevelEdge(
            dorpel,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          );
        }
      }
    } else {
      dorpel = bevelEdge(
        dorpel,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
      );
    }

    //stap 2.2: Extra opties (opkant,kussens(gelijmd, massief),afwatering zagen, schuin zagen(enkel binnendorpel), frezen op dikte))
    if (dorpelParams.opkant) {
      buildOpkant();
    }
    if (dorpelParams.kussensGelijmd || dorpelParams.kussensMassief) {
      if (dorpelParams.subtype !== "garage") {
        buildKussen();
      }
    }
  } else if (dorpelParams.type === "binnen") {
    //stap 2.2: Extra opties (opkant,kussens(gelijmd, massief),afwatering zagen, schuin zagen(enkel binnendorpel), frezen op dikte))
  }
  //retarget control camera
  //texture repeat
  // dorpel.material.map.repeat.set(
  //   dorpelParams.basisLengteHuidig * 5,
  //   dorpelParams.basisDiepteHuidig * 5
  // );
  loadMaterials(arduinArray, granietArray);
  //
  setAfmetingenToLayout(dorpelParams.basisLengteHuidig,dorpelParams.basisDikteHuidig,dorpelParams.basisDiepteHuidig);
  dorpelGroup.name = "dorpel";
  dorpel.name = "basis";
  scene.add(dorpelGroup);
  controls.target.set(dorpelGroup.position.x,dorpelGroup.position.y,dorpelGroup.position.z);
  dorpelGroup.add(dorpel);
  updateAll();
  setUV(dorpelGroup);
  uiHide();
  prijsBerekening(dorpelParams);
  console.log(dorpelGroup);
};
//stap 3: materiaal(exterieur: arduin,graniet / binnen: arduin,graniet , marmer en marmer composiet, )
//stap 4: afmetingen

/*************************************************************EXTRA OPTIES*********************************************
 * EXTRA OPTIES
 */
//functie opkant toevoegen ********
const buildOpkant = () => {
  if (dorpelParams.opkant) {
    if (dorpelParams.subtype === "garage" || dorpelParams.subtype === "deur") {
      const opkantGeometryGD = new THREE.BoxGeometry(
        dorpelParams.basisLengteHuidig,
        dorpelParams.basisDikteHuidig,
        dorpelParams.opkantDiepte
      ); // 2cm diepte
      opkant = new THREE.Mesh(
        opkantGeometryGD,
        params.huidigMateriaal.clone()
      );
      if (dorpelParams.kussensMassief || dorpelParams.kussensGelijmd) {
        opkant = bevelEdge(
          opkant,
          false,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          false,
          true
        );
      } else {
        opkant = bevelEdge(
          opkant,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          false,
          true
        );
      }
      dorpel.geometry.dispose();
      dorpel.geometry = new THREE.BoxGeometry(
        dorpelParams.basisLengteHuidig,
        dorpelParams.basisDikteHuidig,
        dorpelParams.basisDiepteHuidig - dorpelParams.opkantDiepte
      );
      if (dorpelParams.subtype === "garage") {
        dorpel = SubtractObject(dorpel, garageBool);
      }
      if (dorpelParams.kussensMassief || dorpelParams.kussensGelijmd) {
        dorpel = bevelEdge(
          dorpel,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          false
        );
      } else {
        dorpel = bevelEdge(
          dorpel,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          false
        );
      }
      opkant.position.set(
        dorpel.position.x,
        dorpel.position.y + 0.01,
        bboxDorpel.min.z
      ); // 1cm hoger dan dorpel
      opkant.name = "opkant";
      dorpelGroup.add(opkant);
    } else {
      const opkantGeometry = new THREE.BoxGeometry(
        dorpelParams.basisLengteHuidig,
        dorpelParams.opkantDikte + 0.0021,
        dorpelParams.opkantDiepte
      );
      opkant = new THREE.Mesh(
        opkantGeometry,
        params.huidigMateriaal.clone()
      );
      if (dorpelParams.kussensMassief || dorpelParams.kussensGelijmd) {
        opkant = bevelEdge(
          opkant,
          false,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          false,
          true,
          false,
          true
        );
      } else {
        opkant = bevelEdge(
          opkant,
          false,
          true,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          true,
          true,
          true
        );
      }
      opkant.position.set(
        dorpel.position.x,
        bboxDorpel.max.y + (dorpelParams.opkantDikte - 0.0021) / 2,
        bboxDorpel.min.z + dorpelParams.opkantDiepte / 2
      ); // 1cm hoger dan dorpel
      opkant.name = "opkant";
      dorpelGroup.add(opkant);
    }
  } else {
    if (opkant !== undefined) {
      opkant.geometry.dispose();
      opkant.material.dispose();
      dorpel.remove(opkant);
    }
  }
};
//functie kussens toevoegen *******
const buildKussen = () => {
  if (
    (dorpelParams.kussensGelijmd && !dorpelParams.kussensMassief) ||
    (!dorpelParams.kussensGelijmd && dorpelParams.kussensMassief)
  ) {
    const kussenGeometry = new THREE.BoxGeometry(
      dorpelParams.kussenslengte,
      dorpelParams.kussensDikte + 0.0021,
      dorpelParams.basisDiepteHuidig - dorpelParams.opkantDiepte
    ); // niet zeker of kussens vaste afmetingen hebben(waarschijnlijk niet)
    kussen1 = new THREE.Mesh(
      kussenGeometry,
      params.huidigMateriaal.clone()
    );
    kussen2 = new THREE.Mesh(
      kussenGeometry,
      params.huidigMateriaal.clone()
    );
    if (dorpelParams.opkant) {
      kussen1 = bevelEdge(
        kussen1,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        false
      );
      kussen2 = bevelEdge(
        kussen2,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        false
      );
    } else {
      kussen1 = bevelEdge(
        kussen1,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
        true
      );
      kussen2 = bevelEdge(
        kussen2,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
        true
      );
    }

    bboxKussen = new THREE.Box3().setFromObject(kussen1);
    kussen1.geometry.computeBoundingBox();
    const kussenDiepte = bboxKussen.max.z - bboxKussen.min.z;
    const kussenLengte = bboxKussen.max.x - bboxKussen.min.x;
    const kussenHoogte = bboxKussen.max.y - bboxKussen.min.y;
    kussen1.position.set(
      bboxDorpel.max.x - kussenLengte / 2,
      bboxDorpel.max.y + kussenHoogte / 2 - 0.0021,
      bboxDorpel.max.z - kussenDiepte / 2
    );
    kussen2.position.set(
      bboxDorpel.min.x + kussenLengte / 2,
      bboxDorpel.max.y + kussenHoogte / 2 - 0.0021,
      bboxDorpel.max.z - kussenDiepte / 2
    );
    if (dorpelParams.opkant && dorpelParams.subtype !== "raam") {
      kussen1.position.z -= dorpelParams.opkantDiepte / 2;
      kussen2.position.z -= dorpelParams.opkantDiepte / 2;
    }
    kussen1.name = "kussen1";
    kussen2.name = "kussen2";
    dorpelGroup.add(kussen1, kussen2);
  } else if (dorpel.children.length > 2) {
    kussen1.geometry.dispose();
    kussen2.geometry.dispose();
    kussen1.material.dispose();
    kussen2.material.dispose();
    dorpel.remove(kussen1, kussen2);
  }
};
/*****************************************************************************************************************************************************
 * listeners
 */
/********************************************************LAYOUT***************************************************************************************
 * step updates
 */
let typeObject;
let currentStep = 1;
// Elements
const inputBreedte = document.querySelector("#inputBreedte"); // afmetingen
const inputHoogte = document.querySelector("#inputHoogte");
const inputDiepte = document.querySelector("#inputDiepte");
const topinputBreedte = document.querySelector("#topinputBreedte"); // topafmetingen
const topinputHoogte = document.querySelector("#topinputHoogte");
const topinputDiepte = document.querySelector("#topinputDiepte");
const priceElement = document.querySelector(".price-value"); // prijs
const TypeContainer = document.querySelector(".type-selection-container");
const dorpelModule = document.querySelector("#dorpelmodule");
const keukenbladModule = document.querySelector("#keukenbladmodule");

// HIDE INTERFACE / VERBERGEN
const interfaceContainer = document.querySelector(".interface-container");
const btnHide = document.querySelector("#hideButton");
btnHide.addEventListener("click", (e) => {
  if (interfaceContainer.classList.contains("hidden")) {
    interfaceContainer.classList.remove("hidden");
    e.target.classList.remove("rotated");
  } else {
    interfaceContainer.classList.add("hidden");
    e.target.classList.add("rotated");
  }
  uiHide();
});
/***************************STAP 1*****************************
 * stap 1 (TYPE)
 */
// TYPE SELECTEREN
const Types = document.querySelectorAll(".type-btn-type");
const arduin = document.getElementById("arduin");
Types.forEach((typeElement) => {
  typeElement.addEventListener("click", (e) => {
    TypeContainer.style.display = "none";
    let type = e.target.dataset.type;
    typeObject = type;
    if (type === "Dorpel") {
      params.typeObject = "Dorpel";
      initDorpel();
    } else if (type === "Keukenblad") {
      params.typeObject = "Keukenblad";
      initKeukenBlad();
    }
    updateStep(currentStep);
  });
});
//start types images
const imgDorpel = document.querySelector("#Dorpelimg");
const imgKeukenblad = document.querySelector("#Keukenbladimg");
imgDorpel.src = url + "images/types/DorpelStart.png";
imgKeukenblad.src = url + "images/types/KeukenbladStart.png";
// STEP HANDLER
const imgStep = document.querySelector("#stepImage");
const btnNextStep = document.querySelector("#btnNextStep");
const btnPrevStep = document.querySelector("#btnPrevStep");
const btnMainMenu = document.querySelector("#btnMainMenu");
function updateStep(step) {
  // Update var
  currentStep = step;
  // Set progress image
  imgStep.src = url + `images/steps/step${currentStep}.jpg`;
  // Show right step
  let stepContainers = document.querySelectorAll(".step-container");
  stepContainers.forEach((stepContainer) => {
    stepContainer.style.opacity = 0;
    stepContainer.style.display = "none";
  });
  let currentStepContainer = document.querySelector(`#step${currentStep}`);
  if (currentStep == 1) {
    if (typeObject === "Dorpel") {
      hideDiv(dorpelModule, true);
      hideDiv(keukenbladModule, false);
    } else if (typeObject === "Keukenblad") {
      hideDiv(keukenbladModule, true);
      hideDiv(dorpelModule, false);
      currentStepContainer = document.querySelector(`#step${3}`);
    }
    // interfaceContainer.style.height = "530px";
  }
  // interfaceContainer.style.height = `${
  //   currentStepContainer.offsetHeight + 300
  // }px`;
  else if (currentStep === 2) {
    if (typeObject === "Dorpel") {
      currentStepContainer = document.querySelector(`#step${3}`);
    } else if (typeObject === "Keukenblad") {
      currentStepContainer = document.querySelector(`#step${currentStep}`);
    }
  } else if (currentStep === 3) {
    if (typeObject === "Dorpel") {
      currentStepContainer = document.querySelector(`#step${2}`);
    } else if (typeObject === "Keukenblad") {
      currentStepContainer = document.querySelector(`#step${1}`);
    }
  }
  currentStepContainer.style.display = "flex";
  setInterval(() => {
    showElement(currentStepContainer);
  }, 100);

  //Show/hide buttons
  if (currentStep == 1) {
    btnPrevStep.style.visibility = "hidden";
    btnMainMenu.style.visibility = "visible";
  } else {
    btnMainMenu.style.visibility = "hidden";
    btnPrevStep.style.visibility = "visible";
  }
  if (currentStep == 4) {
    btnNextStep.style.visibility = "hidden";
  } else {
    btnNextStep.style.visibility = "visible";
  }
}
const hideDiv = (div, bool) => {
  if (bool) {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
};
const showElement = (currentStepContainer) => {
  currentStepContainer.style.opacity = 1;
};
updateStep(currentStep);
// Step buttons
btnNextStep.addEventListener("click", () => {
  // hideAllHelp();
  if (currentStep < 5) updateStep(currentStep + 1);
});

btnPrevStep.addEventListener("click", () => {
  // hideAllHelp();
  if (currentStep > 1) updateStep(currentStep - 1);
});
btnMainMenu.addEventListener("click", () => {
  // hideAllHelp();
  location.reload();
});
const hideButton = document.getElementById("hideButton");
hideButton.addEventListener("click", () => {
  uiHide();
});
/******************STAP 1-2 (DORPEL)*******************************
 * stap 1_2 (DORPEL TYPES)
 */
//images
const imgGarageDorpel = document.querySelector("#GaragedorpelImg");
const imgDeurDorpel = document.querySelector("#DeurdorpelImg");
const imgRaamDorpel = document.querySelector("#RaamdorpelImg");
imgGarageDorpel.src = url + "images/types/imgGarageDorpel.jpg";
imgDeurDorpel.src = url + "images/types/imgDeurDorpel.jpg";
imgRaamDorpel.src = url + "images/types/imgRaamDorpel.jpg";
//elements
const subType = document.getElementById("subType");
//add sub sub type button
const subsubtype = document.querySelector(".subsubtype-list");
const subsubtitle = document.querySelector(".subsubtype-title");
const subTypes = document.querySelectorAll(".subtype-btn-type");
let type;
let target;
let H2;
subTypes.forEach((typeElement) => {
  typeElement.addEventListener("click", (e) => {
    for (const child of subTypes) {
      child.classList.remove("selected");
    }
    if (target !== undefined) {
      target.remove("selected");
    }
    type = e.target.dataset.type;
    target = e.target.classList;
    removeButtonElements(H2);
    H2 = document.createElement("h2");
    H2.innerHTML = "Extra Opties";
    subsubtitle.appendChild(H2);
    if (type === "Garagedorpel") {
      //opkant
      dorpelParams.kussensMassief = false;
      dorpelParams.kussensGelijmd = false;
      dorpelParams.subtype = "garage";
      createButton("Opkant");
    } else if (type === "Deurdorpel") {
      dorpelParams.subtype = "deur";
      //opkant
      createButton("Opkant");
      //deurkussens
      createButton("kussensGelijmd");
      createButton("kussensMassief");
    } else if (type === "Raamdorpel") {
      dorpelParams.subtype = "raam";
      //opkant
      createButton("Opkant");
      //kussens
      createButton("kussensGelijmd");
      createButton("kussensMassief");
    }
    target.add("selected");
    initDorpel();
  });
});
/**********button creation for extra opties***************/
const createButton = (str) => {
  const btn = document.createElement("button");
  btn.id = type + str;
  btn.className = "subsubtype";
  subsubtype.appendChild(btn);
  const img = document.createElement("img");
  img.src = url + "images/" + str.toLowerCase() + ".png";
  btn.innerHTML =
    '<img src="' + url + "images/" + str.toLowerCase() + '.png">' + str;
  // btn.appendChild(img)
  btn.addEventListener("click", function () {
    //toggle button opkant
    if (str === "Opkant") {
      if (dorpelParams.opkant) {
        dorpelParams.opkant = false;
      } else {
        dorpelParams.opkant = true;
      }
      initDorpel();
    }
    //toggle button kussensGelijmd en kussensMassief
    else if (str === "kussensGelijmd") {
      if (dorpelParams.kussensGelijmd) {
        dorpelParams.kussensGelijmd = false;
      } else {
        dorpelParams.kussensGelijmd = true;
        dorpelParams.kussensMassief = false;
      }
      initDorpel();
    } else if (str === "kussensMassief") {
      if (dorpelParams.kussensMassief) {
        dorpelParams.kussensMassief = false;
      } else {
        dorpelParams.kussensMassief = true;
        dorpelParams.kussensGelijmd = false;
      }
      initDorpel();
    }
  });
};
const removeButtonElements = (element) => {
  let arrHTML = subsubtype.querySelectorAll(".subsubtype");
  for (const child of arrHTML) {
    child.parentElement.removeChild(child);
  }
  if (element !== undefined) {
    element.parentElement.removeChild(element);
  }
};
/**********************************************************KEUKENBLAD**********************************************************************
 * keukeblad params
 */
const keukenBladParams = {
  //huidig
  basisLengteHuidig: 0.5,
  basisDiepteHuidig: 0.2,
  basisDikteHuidig: 0.02,
  //max
  basisDiepteMax: 1,
  basisDikteMax: 0.12,
  //min
  basisLengteMin: .1,
  basisDiepteMin: .1,
  basisDikteMin: 0.01,
  //bewerkingen
  //wasbak
  aantalBewerkingen: 0 ,
};
/*********************************
 * init Keukenblad
 */
let keukenBlad, keukenBladGroup;
const initKeukenBlad = () => {
  if (keukenBlad !== undefined) {
    cleanup(keukenBladGroup);
  }
  const keukenbladGeometry = new THREE.BoxGeometry(
    keukenBladParams.basisLengteHuidig,
    keukenBladParams.basisDikteHuidig,
    keukenBladParams.basisDiepteHuidig
  );
  keukenBlad = new THREE.Mesh(
    keukenbladGeometry,
    params.huidigMateriaal
  );
  keukenBladGroup = new THREE.Object3D();

  if (keukenBladParams.aantalBewerkingen > 0) {
    addBewerking();
  }

  loadMaterials(arduinArray, granietArray, marmerArray);

  setAfmetingenToLayout(keukenBladParams.basisLengteHuidig,keukenBladParams.basisDikteHuidig,keukenBladParams.basisDiepteHuidig);
  keukenBladGroup.name = "keukenblad";
  keukenBlad.name = "basis";
  scene.add(keukenBladGroup);
  controls.target.set(keukenBladGroup.position.x,keukenBladGroup.position.y,keukenBladGroup.position.z);
  keukenBladGroup.add(keukenBlad);
  uiHide();
  setUV(keukenBladGroup)
  updateAll();
  prijsBerekening(keukenBladParams);
  console.log(keukenBladGroup);
};
//*****************************************************KEUKENBLAD BEWERKINGEN**************************************
const keukenbladBewerkingenContainer = document.querySelector("#keukenbladBewerkingen")
const wasbakBtn = document.querySelector(".WB-btn-type");

const transformControl = new TransformControls( camera, renderer.domElement );
				transformControl.addEventListener( 'change', tick );
				transformControl.addEventListener( 'dragging-changed', function ( event ) {
					controls.enabled = ! event.value;
				} );

//wasbak toevoegen
wasbakBtn.addEventListener("click", function () {
  addBewerking("wasbak");
});
const addBewerking = (bewerking) =>{
  //divcontainer voor de bewerking in op te slagen
  const bewerkingContainer = document.createElement("div");
  keukenbladBewerkingenContainer.appendChild(bewerkingContainer);
  bewerkingContainer.className = "bewerkingContainer";
  //bewerking title
  const bewerkingTitel = document.createElement("label");
  bewerkingTitel.innerHTML = bewerking;
  bewerkingContainer.appendChild(bewerkingTitel);
  let boolObj
  if (bewerking === "wasbak") {    
    const geom = new THREE.BoxGeometry(0.05,0.05,0.05);
    //input elementen
    //lengte
    const lengte = document.createElement("label");
    lengte.innerHTML = "lengte"
    bewerkingContainer.appendChild(lengte);
    const lengteInput = document.createElement("input");
    bewerkingContainer.appendChild(lengteInput);
    //diepte
    const diepte = document.createElement("label");
    diepte.innerHTML = "diepte"
    bewerkingContainer.appendChild(diepte);
    const diepteInput = document.createElement("input");
    bewerkingContainer.appendChild(diepteInput);
    //wasbak
    boolObj = new THREE.Mesh(geom);
    keukenBladGroup.children[0] = SubtractObject(keukenBladGroup.children[0],boolObj)
  }
  //verwijderDiv knop
  const verwijderItem = document.createElement("button");
  verwijderItem.innerHTML = "X";
  verwijderItem.style.height = "25px";
  verwijderItem.style.width = "25px";
  verwijderItem.style.margin = "2px 2px 2px 2px";
  bewerkingContainer.appendChild(verwijderItem);
  verwijderItem.addEventListener("click", function () {
  verwijderItem.parentElement.remove();   
  //remove obj
  boolObj.geometry.dispose(); 
  boolObj.material.dispose();
  // initKeukenBlad();
  // boolObj.parent.remove(boolObj);
  });
}
/********************************************************MATERIAL LAYOUT********************************************
 * MATERIALs TO LAYOUT
 */
const matTypeList = document.querySelector("#step3 .type-list");
const loadMaterials = (arduin, graniet, marmer) => {
  const arduinTab = document.getElementById("arduin");
  const granietTab = document.getElementById("graniet");
  const marmerTab = document.getElementById("marmer");
  while (arduinTab.lastElementChild) {
    arduinTab.removeChild(arduinTab.lastElementChild);
  }
  while (granietTab.lastElementChild) {
    granietTab.removeChild(granietTab.lastElementChild);
  }
  while (marmerTab.lastElementChild) {
    marmerTab.removeChild(marmerTab.lastElementChild);
  }
  for (const child of arduin) {
    const btn = document.createElement("button");
    btn.className = "mat-btn-type";
    arduinTab.appendChild(btn);
    const img = document.createElement("img");
    img.src =
      url +
      "textures/" +
      arduin.name +
      "/" +
      child.name +
      "/" +
      child.name +
      ".jpg";
    btn.innerHTML = '<img src="' + img.src + '">' + child.name;
    btn.addEventListener("click", function () {
      params.huidigMateriaal = child;
      if (params.typeObject === "Dorpel") {
        initDorpel();
      } else if (params.typeObject === "Keukenblad") {
        initKeukenBlad();
      }
    });
  }
  if (graniet !== undefined) {
    for (const child of graniet) {
      const btn = document.createElement("button");
      btn.className = "mat-btn-type";
      granietTab.appendChild(btn);
      const img = document.createElement("img");
      img.src =
        url +
        "textures/" +
        graniet.name +
        "/" +
        child.name +
        "/" +
        child.name +
        ".jpg";
      btn.innerHTML = '<img src="' + img.src + '">' + child.name;
      btn.addEventListener("click", function () {
        params.huidigMateriaal = child;
        if (params.typeObject === "Dorpel") {
          initDorpel();
        } else if (params.typeObject === "Keukenblad") {
          initKeukenBlad();
        }
      });
    }
    if (marmer !== undefined) {
      for (const child of marmer) {
        const btn = document.createElement("button");
        btn.className = "mat-btn-type";
        marmerTab.appendChild(btn);
        const img = document.createElement("img");
        img.src =
          url +
          "textures/" +
          marmer.name +
          "/" +
          child.name +
          "/" +
          child.name +
          ".jpg";
        btn.innerHTML = '<img src="' + img.src + '">' + child.name;
        btn.addEventListener("click", function () {
          params.huidigMateriaal = child;
          if (params.typeObject === "Dorpel") {
            initDorpel();
          } else if (params.typeObject === "Keukenblad") {
            initKeukenBlad();
          }
        });
      }
    }
  }
};
/******************STAP AFMETINGEN*********************************
 * STAP AFMETINGEN
 */
// AFMETINGEN
inputBreedte.addEventListener("change", () => {
  if (typeObject === "Dorpel") {
    if (inputBreedte.value < dorpelParams.basisLengteMin * 100)
      inputBreedte.value = dorpelParams.basisLengteMin * 100;
  } else if (typeObject === "Keukenblad") {
    if (inputBreedte.value < keukenBladParams.basisLengteMin * 100)
      inputBreedte.value = keukenBladParams.basisLengteMin * 100;
  }
  updateAfmetingen();
});
inputHoogte.addEventListener("change", () => {
  if (typeObject === "Dorpel") {
    if (inputHoogte.value < dorpelParams.basisDikteMin * 100)
      inputHoogte.value = dorpelParams.basisDikteMin * 100;
    if (inputHoogte.value > dorpelParams.basisDikteMax * 100)
      inputHoogte.value = dorpelParams.basisDikteMax * 100;
  } else if (typeObject === "Keukenblad") {
    if (inputHoogte.value < keukenBladParams.basisDikteMin * 100)
      inputHoogte.value = keukenBladParams.basisDikteMin * 100;
    if (inputHoogte.value > keukenBladParams.basisDikteMax * 100)
      inputHoogte.value = keukenBladParams.basisDikteMax * 100;
  }
  updateAfmetingen();
});
inputDiepte.addEventListener("change", () => {
  if (typeObject === "Dorpel") {
    if (inputDiepte.value < dorpelParams.basisDiepteMin * 100)
      inputDiepte.value = dorpelParams.basisDiepteMin * 100;
    if (inputDiepte.value > dorpelParams.basisDiepteMax * 100)
      inputDiepte.value = dorpelParams.basisDiepteMax * 100;
  } else if (typeObject === "Keukenblad") {
    if (inputDiepte.value < keukenBladParams.basisDiepteMin * 100)
      inputDiepte.value = keukenBladParams.basisDiepteMin * 100;
    if (inputDiepte.value > keukenBladParams.basisDiepteMax * 100)
      inputDiepte.value = keukenBladParams.basisDiepteMax * 100;
  }
  updateAfmetingen();
});
const updateAfmetingen = () => {
  if (params.typeObject === "Dorpel") {
    dorpelParams.basisLengteHuidig = inputBreedte.value / 100;
    dorpelParams.basisDikteHuidig = inputHoogte.value / 100;
    dorpelParams.basisDiepteHuidig = inputDiepte.value / 100;
    initDorpel();
  } else if (params.typeObject === "Keukenblad") {
    keukenBladParams.basisLengteHuidig = inputBreedte.value / 100;
    keukenBladParams.basisDikteHuidig = inputHoogte.value / 100;
    keukenBladParams.basisDiepteHuidig = inputDiepte.value / 100;
    initKeukenBlad();
  }
};

/**********************************************************************PRIJSBEPALINGEN*****************************************************************************
 * PRIJSBEPALINGEN
 */
/****************************************************
 * DORPEL
 */
//fase 1 - type dorpel (klopt niet test opsomming)
const garageDorpelBasisPrijs = 79.50;
const deurDorpelBasisPrijs = 65.00;
const raamDorpelBasisPrijs = 65.00;

//materiaal kosten per M² 2cm dikte
//arduin***********************************
//agrippa
const ArduinAgrippaFijnP = 300; // 1m x 1m x 0.02m = 300euro
const ArduinAgrippaFijnA = 285;
//geborsteld
const ArduinGeborsteldP = 230;
const ArduinGeborsteldA = 209;
//marmer*********************************** */
//bianco america
const biancoAmericaP = 1500;
const biancoAmericaA = 1390;
//nero marquina
const neroMarquinaP = 316;
const neroMarquinaA = 287.5;
//afmetingen
// waarden
//extra elementen los van de afmetingen
const kussensMassiefPrijs = 15;
const kussensGelijmdPrijs = 10;
const opkantPrijs = 15;
//berekening
const prijsBerekening = (prms) =>{
  let subtypePrijs;
  let materiaalPrijs;
//subtype prijzen
if (params.typeObject === "Dorpel") {
switch(prms.subtype){
  case "garage":
    subtypePrijs = 5;
    break;
  case "deur":
    subtypePrijs = 0;
    break;
  case "raam":
    subtypePrijs = 3;
    break;
  default:
      break;
}
}
//matriaal prijzen
switch(params.huidigMateriaal){
  case G360:
    materiaalPrijs = 165;
    break;
  case Orientalbasalt:
    materiaalPrijs = 205;
    break;
  case ZimbabweBlackVerzoet:
    materiaalPrijs = 147;
    break;
  case BiancoCarrara:
    materiaalPrijs = 375;
    break;
  case NeroMarquina:
    materiaalPrijs = 316;
    break;
  default:
      break;
}
  let totaal
  if (params.typeObject === "Dorpel") {
    totaal = ((prms.basisDikteHuidig * prms.basisLengteHuidig * prms.basisDiepteHuidig) * materiaalPrijs)*50 + subtypePrijs;
    if (prms.kussensGelijmd) {
      totaal += kussensMassiefPrijs;
    }
    else if(prms.kussensMassief){      
      totaal += kussensGelijmdPrijs;
    }
    if (prms.opkant){
      totaal += opkantPrijs;
    }
  }else if(params.typeObject === "Keukenblad"){
    totaal = ((prms.basisDikteHuidig * prms.basisLengteHuidig * prms.basisDiepteHuidig) * materiaalPrijs)*50;
  }
  priceElement.innerHTML = parseFloat(totaal).toFixed(2);;
}
/**
 * startup functions
 */
tick();
/*****************************************************************************************************************************************************
 * debug
 */
gui.add(dorpelParams, "subtype").onFinishChange(initDorpel);
gui.add(dorpelParams, "opkant").onFinishChange(initDorpel);
gui.add(dorpelParams, "kussensMassief").onFinishChange(initDorpel);
gui.add(dorpelParams, "kussensGelijmd").onFinishChange(initDorpel);
gui.add(dorpelParams, "basisLengteHuidig").onChange(initDorpel);
gui.add(dorpelParams, "basisDiepteHuidig").onChange(initDorpel);
gui.add(dorpelParams, "basisDikteHuidig").onChange(initDorpel);
