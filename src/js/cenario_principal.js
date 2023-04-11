import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import './eventlisteners.js';

import { Carro } from './classes/Car2';
import { Tree } from './classes/Tree';
import { Building } from './classes/Building';
import { Track } from './classes/Track';
import { ThirdPersonCamera } from './classes/ThirdPersonCamera';
import { Sun } from './classes/Sun';
import { Lamp } from './classes/Lamp';
// import { Tunnel} from './classes/Tunnel';

// import Race from './race';
const Race = {
    startPosition : [ 3.71,0,61.19 ],

    photoPosition : [ -55, 0, -80 ],

    observerPosition : [ -9, 20, -79 ],

    bbox : [ -100, 0, -100, 100, 10, 100 ],

  track : {
    leftCurb : [
      -50.284, 0, -78.9876, 
      -40.9304, 0, -79.2334, 
      -32.877, 0, -79.371, 
      -24.1291, 0, -79.3615, 
      -16.7479, 0, -78.2474, 
      -8.94786, 0, -76.815, 
      -3.49239, 0, -71.9619, 
      0.415407, 0, -66.8712, 
      2.37373, 0, -59.0562, 
      2.87409, 0, -52.0687, 
      4.18815, 0, -44.7678, 
      5.55076, 0, -38.4713, 
      8.04488, 0, -33.8078, 
      10.7306, 0, -31.8214, 
      12.9675, 0, -30.9883, 
      14.9251, 0, -32.6479, 
      17.1015, 0, -35.5349, 
      18.2828, 0, -41.2337, 
      18.5831, 0, -48.0315, 
      18.9547, 0, -54.8631, 
      20.0926, 0, -62.4273, 
      24.3126, 0, -67.0731, 
      30.4704, 0, -70.4278, 
      38.0042, 0, -68.6718, 
      44.7447, 0, -66.0933, 
      51.4634, 0, -61.0315, 
      57.3496, 0, -55.5547, 
      62.6482, 0, -49.1662, 
      67.3563, 0, -42.6373, 
      71.7685, 0, -35.7319, 
      75.6674, 0, -28.6245, 
      79.2396, 0, -21.1673, 
      81.8018, 0, -13.4335, 
      83.6946, 0, -5.3869, 
      84.1094, 0, 2.82795, 
      83.7292, 0, 10.8953, 
      82.4559, 0, 19.0347, 
      80.5857, 0, 26.9021, 
      78.2936, 0, 34.7517, 
      75.2135, 0, 42.3013, 
      71.2054, 0, 49.4297, 
      66.009, 0, 55.6869, 
      59.7098, 0, 60.8629, 
      52.4745, 0, 64.754, 
      44.728, 0, 67.2653, 
      36.5941, 0, 68.6322, 
      28.4566, 0, 68.7419, 
      20.3389, 0, 67.8954, 
      12.4145, 0, 66.187, 
      4.73151, 0, 63.7079, 
      -2.75714, 0, 60.769, 
      -10.0307, 0, 57.4133, 
      -17.1743, 0, 53.838, 
      -24.2611, 0, 50.168, 
      -31.2777, 0, 46.2965, 
      -38.2602, 0, 42.2692, 
      -45.065, 0, 37.7626, 
      -51.4895, 0, 32.7805, 
      -57.5522, 0, 27.1896, 
      -62.8794, 0, 20.9679, 
      -67.8135, 0, 14.4737, 
      -72.2355, 0, 7.53829, 
      -76.2457, 0, 0.537989, 
      -80.1318, 0, -6.66322, 
      -83.4822, 0, -14.0895, 
      -86.5055, 0, -21.7857, 
      -88.5418, 0, -29.6181, 
      -89.8364, 0, -37.9414, 
      -89.5275, 0, -46.0178, 
      -88.2392, 0, -54.0997, 
      -85.3213, 0, -61.54, 
      -80.6309, 0, -68.1851, 
      -74.4658, 0, -72.8336, 
      -67.0716, 0, -76.4241, 
      -50.284, 0, -78.9876
    ],
    rightCurb : [
      -49.6535, 0, -71.0124, 
      -40.7571, 0, -71.2353, 
      -32.8105, 0, -71.3712, 
      -24.6834, 0, -71.3807, 
      -18.0021, 0, -70.3463, 
      -12.3021, 0, -69.5522, 
      -9.35136, 0, -66.5147, 
      -6.88416, 0, -63.5976, 
      -5.52998, 0, -57.8188, 
      -5.0616, 0, -51.0563, 
      -3.6569, 0, -43.2009, 
      -1.95701, 0, -35.7084, 
      1.83012, 0, -28.7703, 
      7.23813, 0, -24.624, 
      14.3763, 0, -23.1133, 
      20.5124, 0, -26.9224, 
      24.4923, 0, -32.4729, 
      26.2172, 0, -40.2116, 
      26.5731, 0, -47.6326, 
      26.9203, 0, -54.1213, 
      27.5012, 0, -59.4086, 
      29.2499, 0, -60.7785, 
      31.2171, 0, -62.4628, 
      35.5583, 0, -61.0548, 
      40.7865, 0, -59.1411, 
      46.3178, 0, -54.906, 
      51.5254, 0, -50.0703, 
      56.3205, 0, -44.2713, 
      60.7374, 0, -38.144, 
      64.8877, 0, -31.6509, 
      68.5513, 0, -24.9693, 
      71.8229, 0, -18.1686, 
      74.1044, 0, -11.254, 
      75.7741, 0, -4.26153, 
      76.1094, 0, 2.83612, 
      75.7708, 0, 10.0813, 
      74.6066, 0, 17.4888, 
      72.8518, 0, 24.8557, 
      70.7377, 0, 32.1233, 
      68.0052, 0, 38.8315, 
      64.6071, 0, 44.9063, 
      60.366, 0, 50.0162, 
      55.259, 0, 54.2153, 
      49.338, 0, 57.3944, 
      42.8345, 0, 59.4926, 
      35.8746, 0, 60.6646, 
      28.8247, 0, 60.7503, 
      21.5987, 0, 59.9952, 
      14.4918, 0, 58.4614, 
      7.42475, 0, 56.1749, 
      0.382142, 0, 53.4107, 
      -6.56308, 0, 50.2039, 
      -13.5445, 0, 46.7089, 
      -20.4889, 0, 43.1132, 
      -27.3473, 0, 39.3285, 
      -34.0523, 0, 35.4652, 
      -40.4038, 0, 31.2608, 
      -46.323, 0, 26.6726, 
      -51.7915, 0, 21.6385, 
      -56.6519, 0, 15.9461, 
      -61.249, 0, 9.90128, 
      -65.3895, 0, 3.39921, 
      -69.2543, 0, -3.35049, 
      -72.9619, 0, -10.2118, 
      -76.1115, 0, -17.1996, 
      -78.9007, 0, -24.269, 
      -80.7082, 0, -31.2413, 
      -81.8511, 0, -38.4258, 
      -81.5662, 0, -45.2322, 
      -80.5108, 0, -52.0331, 
      -78.2724, 0, -57.7568, 
      -74.8691, 0, -62.6352, 
      -70.3154, 0, -65.9945, 
      -64.7409, 0, -68.7712, 
      -49.6535, 0, -71.0124
    ],
  },

  tunnels : [
    {
      height : 5, 
      leftCurb : [
        -36.25, 0, -83.4688, 
        -34.125, 0, -83.4688, 
        -32, 0, -83.4688, 
        -29.875, 0, -83.4688, 
        -27.75, 0, -83.4688, 
        -25.625, 0, -83.4688, 
        -23.5, 0, -83.4688, 
      ],
      rightCurb : [
        -36.25, 0, -67.4688, 
        -34.125, 0, -67.4688, 
        -32, 0, -67.4688, 
        -29.875, 0, -67.4688, 
        -27.75, 0, -67.4688, 
        -25.625, 0, -67.4688, 
        -23.5, 0, -67.4688, 
      ]
    },
    {
      height : 5, 
      leftCurb : [
        -75.1849, 0, -59.804, 
        -75.5304, 0, -57.1811, 
        -76.0201, 0, -54.8137, 
        -77.0005, 0, -51.6169, 
        -78.2102, 0, -49.1019, 
        -79.2102, 0, -47.3831, 
        -79.5355, 0, -47.1577, 
        -79.8829, 0, -46.3601, 
        -80.2579, 0, -44.3289, 
      ],
      rightCurb : [
        -91.0651, 0, -61.7585, 
        -91.2196, 0, -60.3189, 
        -91.4799, 0, -58.9363, 
        -91.4995, 0, -58.3831, 
        -92.0398, 0, -57.1481, 
        -93.0398, 0, -55.4294, 
        -94.7145, 0, -52.2173, 
        -95.6171, 0, -49.2649, 
        -95.9921, 0, -47.2336, 
      ]
    },
    {
      height : 5, 
      leftCurb : [
        90.625, 0, 1.25001, 
        90.6099, 0, 3.77263, 
        90.2299, 0, 7.3738, 
        89.7299, 0, 9.24879, 
        89.0895, 0, 11.5923, 
        88.4645, 0, 13.4673, 
        87.5823, 0, 16.012, 
        86.9278, 0, 17.5024, 
        86.4799, 0, 18.4676, 
        86.1798, 0, 19.3385, 
        85.8671, 0, 21.6086, 
        85.4697, 0, 23.7564, 
        85.0946, 0, 25.6314, 
        84.8151, 0, 26.9147, 
        84.5651, 0, 28.946, 
        84.2196, 0, 31.5689, 
        83.5895, 0, 34.4048, 
        83.1049, 0, 35.8113, 
        82.6049, 0, 37.6863, 
        81.9645, 0, 40.0298, 
        81.3395, 0, 41.9048, 
        80.8549, 0, 43.3113, 
        80.0528, 0, 46.0961, 
        79.2073, 0, 48.1996, 
        77.8186, 0, 51.1, 
        76.9148, 0, 52.4606, 
        75.9148, 0, 54.1794, 
        74.2469, 0, 56.8726, 
        71.8715, 0, 59.5833, 
        70.9701, 0, 60.2804, 
        68.9965, 0, 62.2395, 
        65.8414, 0, 64.5538, 
        64.7478, 0, 65.0545, 
        63.1228, 0, 65.992, 
        61.4978, 0, 66.9295, 
      ],
      rightCurb : [
        74.625, 0, 1.25001, 
        74.6401, 0, 2.78987, 
        74.7701, 0, 3.2512, 
        74.2701, 0, 5.12621, 
        73.9105, 0, 6.53268, 
        73.2855, 0, 8.40767, 
        72.9177, 0, 9.61296, 
        72.0722, 0, 11.5601, 
        71.0201, 0, 14.3449, 
        70.3202, 0, 17.2239, 
        70.1329, 0, 18.7039, 
        69.7803, 0, 20.6186, 
        69.4054, 0, 22.4936, 
        68.9349, 0, 24.9603, 
        68.6849, 0, 26.9915, 
        68.5304, 0, 28.4311, 
        68.4105, 0, 29.3452, 
        67.6451, 0, 31.6887, 
        67.1451, 0, 33.5637, 
        66.7855, 0, 34.9702, 
        66.1605, 0, 36.8452, 
        65.3951, 0, 39.1887, 
        65.1972, 0, 40.1539, 
        64.5427, 0, 41.8004, 
        64.4314, 0, 42.3375, 
        63.0852, 0, 44.4144, 
        62.0852, 0, 46.1331, 
        61.753, 0, 46.8774, 
        61.6285, 0, 47.2917, 
        59.5299, 0, 49.0946, 
        58.7535, 0, 49.948, 
        58.9086, 0, 50.1337, 
        56.7522, 0, 51.1955, 
        55.1272, 0, 52.133, 
        53.5022, 0, 53.0705, 
      ]
    }
  ],

  arealigths : [
    {
      frame : [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, -27.75, 4, -75.4688, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
    {
      frame : [-0.864348, 0, -0.502894, 0, 0, 1, 0, 0, -0.502894, 0, 0.864348, 0, -86.125, 4, -51.4062, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
    {
      frame : [-0.948683, 0, -0.316229, 0, 0, 1, 0, 0, -0.316229, 0, 0.948683, 0, 80.875, 4, 10.9375, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
    {
      frame : [-0.980581, 0, -0.196115, 0, 0, 1, 0, 0, -0.196115, 0, 0.980581, 0, 77.625, 4, 22.1875, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
    {
      frame : [-0.966235, 0, -0.257663, 0, 0, 1, 0, 0, -0.257663, 0, 0.966235, 0, 75.375, 4, 33.75, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
    {
      frame : [-0.916539, 0, -0.399944, 0, 0, 1, 0, 0, -0.399944, 0, 0.916539, 0, 71.875, 4, 45, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
    {
      frame : [-0.715007, 0, -0.699118, 0, 0, 1, 0, 0, -0.699118, 0, 0.715007, 0, 65.25, 4, 54.6875, 1, ],
      size : [1,1],
      color : [0.8,0.8,0.8]
   },
  ],

  lamps : [
    {
      position : [ -44.75, 0, 24.6875],
      height   : 4
    },

    {
      position : [ -34.25, 0, 32.9688],
      height   : 4
    },

    {
      position : [ -51.5, 0, 39.2188],
      height   : 4
    },

    {
      position : [ -23.375, 0, 39.375],
      height   : 4
    },

    {
      position : [ -11.625, 0, 44.5312],
      height   : 4
    },

    {
      position : [ -37.875, 0, 47.3438],
      height   : 4
    },

    {
      position : [ -0.5, 0, 50.9375],
      height   : 4
    },

    {
      position : [ -25.875, 0, 53.5938],
      height   : 4
    },

    {
      position : [ 10.25, 0, 55.7812],
      height   : 4
    },

    {
      position : [ -14.375, 0, 59.6875],
      height   : 4
    },

    {
      position : [ -5.375, 0, 64.0625],
      height   : 4
    },

    {
      position : [ 7.125, 0, 69.0625],
      height   : 4
    }
  ],

  trees : [
    {
      position : [ -40.75, 0, -23.2812],
      height   : 3
    },
    {
      position : [ 25.875, 0, -22.1875],
      height   : 3
    },
    {
      position : [ -28, 0, -22.0312],
      height   : 3
    },
    {
      position : [ 30.75, 0, -22.0312],
      height   : 3
    },
    {
      position : [ 18.5, 0, -21.4062],
      height   : 3
    },
    {
      position : [ 36.375, 0, -21.25],
      height   : 3
    },
    {
      position : [ 12, 0, -20.3125],
      height   : 3
    },
    {
      position : [ -37.375, 0, -20.1562],
      height   : 3
    },
    {
      position : [ 58.75, 0, -19.2188],
      height   : 3
    },
    {
      position : [ 4.37501, 0, -18.4375],
      height   : 3
    },
    {
      position : [ 51.875, 0, -16.0938],
      height   : 3
    },
    {
      position : [ 26.375, 0, -15.1562],
      height   : 3
    },
    {
      position : [ 32.5, 0, -13.5938],
      height   : 3
    },
    {
      position : [ 96, 0, -13.5938],
      height   : 3
    },
    {
      position : [ 20.5, 0, -12.0312],
      height   : 3
    },
    {
      position : [ 11.25, 0, -11.7188],
      height   : 3
    },
    {
      position : [ 26.5, 0, -7.34375],
      height   : 3
    },
    {
      position : [ 17.875, 0, -4.21875],
      height   : 3
    },
    {
      position : [ 54.375, 0, -3.4375],
      height   : 3
    },
    {
      position : [ 27.75, 0, -1.09375],
      height   : 3
    },
    {
      position : [ 53.25, 0, 11.4063],
      height   : 3
    },
    {
      position : [ -27.25, 0, 13.9062],
      height   : 3
    },
    {
      position : [ 53.25, 0, 16.25],
      height   : 3
    },
    {
      position : [ -28.875, 0, 18.9062],
      height   : 3
    }
  ],

  buildings : [
    {
      outline : [
      15.75, 0, -49.5312,   10,
      16.125, 0, -39.0625,   10,
      7.25, 0, -37.9688,   10,
      7.25, 0, -48.5937,   10,
      ]
    },
    {
      outline : [
      -48.125, 0, 3.125,   10,
      -30.25, 0, 11.875,   10,
      -33.5, 0, 21.0938,   10,
      -52.25, 0, 12.5,   10,
      ]
    },
    {
      outline : [
      -28.5, 0, 23.5938,   10,
      -10.625, 0, 32.3438,   10,
      -13.875, 0, 41.5625,   10,
      -32.625, 0, 32.9688,   10,
      ]
    },
    {
      outline : [
      -0.75, 0, 38.4375,   10,
      12.875, 0, 45.4688,   10,
      9.375, 0, 53.75,   10,
      -4.625, 0, 46.7188,   10,
      ]
    },
    {
      outline : [
      -58.875, 0, 41.875,   10,
      -45.25, 0, 48.9062,   10,
      -48.75, 0, 57.1875,   10,
      -62.75, 0, 50.1562,   10,
      ]
    },
    {
      outline : [
      -37.125, 0, 53.125,   10,
      -23.5, 0, 60.1562,   10,
      -27, 0, 68.4375,   10,
      -41, 0, 61.4062,   10,
      ]
    },
    {
      outline : [
      -11.875, 0, 64.5312,   10,
      1.75001, 0, 71.5625,   10,
      -1.75, 0, 79.8438,   10,
      -15.75, 0, 72.8125,   10,
      ]
    }
  ],
  weather : {
    sunLightDirection : [ 0.4, 1, 0.6 ],
    cloudDensity      : 0,
    rainStrength      : 0
  }
};

import posx from '../assets/posx.jpg'
import negx from '../assets/negx.jpg'
import posy from '../assets/posy.jpg'
import negy from '../assets/negy.jpg'
import posz from '../assets/posz.jpg'
import negz from '../assets/negz.jpg'

import grass from '../assets/grass.jpg';
import space from '../assets/space.jpeg';
import highway from '../assets/highway.jpg';
import sides from '../assets/sides.jpg';
import front from '../assets/front.jpg';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { handleClick } from './eventlisteners.js';

console.log(Race);

//Shaders
const VS = `
varying vec4 pos;
varying vec3 v_normal;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    pos = vec4(position,1.0);
    v_normal = normal;
}
`;
const FS = `
varying vec4 pos;
varying vec3 v_normal;
void main() {
    gl_FragColor = (vec4(v_normal*v_normal, 1.0)+ pos )* (vec4(v_normal*v_normal, 1.0) - pos)*((vec4(v_normal*v_normal, 1.0)+ pos )* (vec4(v_normal*v_normal, 1.0) - pos)) + vec4(0.0,0.0,0.0,1.0) ;
}
`;

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);

orbit.update();

const options = {
    boxMass: 0.3,
    sphereMass: 1,
    wheelForce: 10,
    wheelSteer: Math.PI / 8,
    debug: false,
    tamanhoCarro: 1
};

const gui = new dat.GUI();

function retornarAtivarGrama(){
    var grama = false;
    return () => {
        (grama)? scene.remove(instancedMesh) : scene.add( instancedMesh );
        grama = !grama;
    }
}

gui.add(options, 'boxMass', 0.1, 2);
gui.add(options, 'sphereMass', 0.1, 2);
gui.add(options, 'wheelForce', 5, 100);
gui.add(options, 'wheelSteer', Math.PI / 16, Math.PI / 2);
gui.add(options, 'tamanhoCarro', 0.1, 1.5);
gui.add({"Mudar Câmera": () => camera.lockOn = !camera.lockOn}, 'Mudar Câmera')
gui.add({"Modo debug": () => options.debug = !options.debug}, 'Modo debug')
gui.add({"Ativar grama": retornarAtivarGrama()}, "Ativar grama");

//Luzes ambiente e direcional + Sol + background
const luzAmbiente = new THREE.AmbientLight(0xfffff0,0.3);
luzAmbiente.intensity = 0.5;
scene.add(luzAmbiente);

const sun = new Sun(scene, -200, 200, -200);

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
    posx,
    negx,
    posy,
    negy,
    negz,
    posz
]);

//Malhas do Threejs

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.ShaderMaterial({
	uniforms:{},
    vertexShader:VS,
    fragmentShader:FS
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.ShaderMaterial({
	uniforms:{},
    vertexShader:VS,
    fragmentShader:FS
});
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphereMesh);

//Gramado da cena
const groundGeo = new THREE.PlaneGeometry(300, 300);
const texture = new THREE.TextureLoader().load(grass);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(5,5);
const groundMat = new THREE.MeshStandardMaterial({ 
	map: texture
 });

const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.receiveShadow = true;
groundMesh.castShadow = true;
scene.add(groundMesh);

const pista = new THREE.Mesh(
    new Track(Race.track), 
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(highway)
    })
);
pista.position.y = 0.1

scene.add(pista);
pista.receiveShadow = true;

//Adciona as arvores
Race.trees.map(arvore => {
    const tree = new Tree(0.55, 4, 4); 
    tree.position.set(...arvore.position); 
    scene.add(tree)
});

//Adciona as construções => gambiarra mais horrorosa já escrita, refazer depois
Race.buildings.map(construcao =>{

    const building = new Building(construcao);

    const objeto = new THREE.Mesh(
        building.geometry,
        [new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sides)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sides)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)})]
    );

    objeto.castShadow = true;
    objeto.receiveShadow = false;
    objeto.renderOrder = 0;

    console.log(objeto.position);

    objeto.position.x = building.position.x + building.width/2;
    objeto.position.y = 5;
    objeto.position.z = building.position.z+building.length/2;

    objeto.rotation.set(0,Math.PI/3,0)

    scene.add(objeto)

    console.log(new THREE.BoxGeometry(1,2,1))
});

Race.lamps.map(lampada => {
    const lamp = new Lamp(0.3, lampada.height*2);
    lamp.renderOrder = 10;
    lamp.setPosition(...lampada.position);
    lamp.addToScene(scene);

    // debug
    // const lightHelper = new THREE.SpotLightHelper(lamp.light);
    // scene.add(lightHelper);
});

const pontosDaLinhaAbaixo = [new THREE.Vector3(-70.56, 0.6, -5.73), new THREE.Vector3(-77.34, 0.6, -1.47)];

const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pontosDaLinhaAbaixo), 
    new THREE.LineBasicMaterial({ color: 0xff0000 }) 
);
scene.add(line);

const midpoint = new THREE.Vector3();
midpoint.addVectors(pontosDaLinhaAbaixo[0], pontosDaLinhaAbaixo[1]).multiplyScalar(0.5)

console.log("line pos")
console.log(line);

const raycasterLine = new THREE.Raycaster(midpoint, new THREE.Vector3(0, 1, 0));
scene.add(getRayCastLine(raycasterLine));

const carro = new Carro();

let carroflag = false;

// parte assincrona do codigo, aqui faco operacoes com a malha do carro
// retirei o loadPLYModel do construtor do Carro e coloquei na funcao assincrona, fica melhor
(async function() {
    await carro.loadPLYModel();
    carroflag = true;

    scene.children.forEach((obj) => {
        obj.receiveShadow = true;
    });
})();
// jeito para checar se algo foi carregado: usando flag

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const cannonDebugger = new CannonDebugger(scene, world, {
    color: 0xffffff,
});

//Cannonjs, definição dos corpos
const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(150, 150, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(1, 20, 0),
    material: boxPhysMat
});

world.addBody(boxBody);

boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;

//Corpo fisico das construções
Race.buildings.map( building => {
    const b = new Building(building);

    let body = b.getPhysicsBody(boxPhysMat);

    var axis = new CANNON.Vec3(0,1,0);
    var angle = Math.PI / 3;
    body.quaternion.setFromAxisAngle(axis, angle);

    world.addBody(body);
});

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.04}
);

world.addContactMaterial(groundBoxContactMat);

const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 4,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat
});
world.addBody(sphereBody);

sphereBody.linearDamping = 0.21

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.9}
);

world.addContactMaterial(groundSphereContactMat);

var maxForce = 40;
var maxSteerVal = Math.PI / 8;

const vehicle = carro.vehicle;

// TODO: ver o que tem de errado aqui
carro.addToScene(scene);
carro.addToWorld(world);
// gambiarra para o carro ficar antes da largada
carro.carBody.quaternion.setFromEuler(0, -Math.PI/2 + 0.36, 0);


// adicionando corpos das arvores pelo CANNON
Race.trees.map(arvore => {

    const tree = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(...arvore.position).vadd(new CANNON.Vec3(0,2,0)), // somando vetor
        material: boxPhysMat
    });

    tree.addShape(
        new CANNON.Cylinder(0.55,0.55,4,20),
        new CANNON.Vec3(0,0,0),
        new CANNON.Quaternion()
    );

    tree.addShape(
        new CANNON.Cylinder(0.01,5,16,20),
        new CANNON.Vec3(0,10,0),
        new CANNON.Quaternion()
    );

    world.addBody(tree);
});

Race.lamps.map((lampada) => {

    lampada.position.y = 8;
    const lamp = new CANNON.Body({
        mass:0,
        shape:new CANNON.Cylinder(0.3,0.3,8,8),
        position: new CANNON.Vec3(...lampada.position).vadd(new CANNON.Vec3(0,4,0)),
        material: boxPhysMat
    });

    world.addBody(lamp);
});

//Instância da camera em terceira pessoa
//Target é o alvo observado
//Position é a posição em relação ao alvo, nesse caso atrás e em cima
//LookAt é onde a camera aponta em relação ao alvo
const thirdPerson = new ThirdPersonCamera({
    camera: camera,
    target: carro.vehicle.chassisBody,
    position: [20, 5, 0],
    lookAt: [-25,0,0]
});

//Listeners

// Add an event listener for the 'click' event
document.addEventListener('click', handleClick.bind(null, camera, scene));

document.addEventListener('keydown', (e) => {
    switch (e.key) {

        case 'W':
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(maxForce, 0);
            vehicle.setWheelForce(maxForce, 1);
            break;

        case 'S':
        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(-maxForce / 2, 0);
            vehicle.setWheelForce(-maxForce / 2, 1);
            break;
    
        case 'A':
        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0);
            vehicle.setSteeringValue(maxSteerVal, 1);
            break;

        case 'D':
        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0);
            vehicle.setSteeringValue(-maxSteerVal, 1);
            break;
        }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'W':
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
            
        case 'S':
        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
            
        case 'A':
            case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'D':
        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'Enter':
            camera.lockOn = !camera.lockOn;
            break;
    }
});

const timeStep = 1 / 60;


function attOptions() {
    boxBody.mass = options.boxMass;
    sphereBody.mass = options.sphereMass;
    maxForce = options.wheelForce;
    maxSteerVal = options.wheelSteer;
    carro.setTamanho(options.tamanhoCarro);
}

/////////////////////////////////////////
//////////// COMEÇO DA GRAMA/////////////
/////////////////////////////////////////

const clock = new THREE.Clock();

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
    
    float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.3607, 0.662, 0.0156 );
    float clarity = ( vUv.y * 0.5 ) + 0.6;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`;

const uniforms = {
	time: {
  	value: 0
  }
}

const leavesMaterial = new THREE.ShaderMaterial({
	vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.DoubleSide
});

const instanceNumber = 500000;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );

// Position and scale the grass blade instances randomly.

for ( let i=0 ; i<instanceNumber ; i++ ) {

    const track = Race.track.leftCurb;

    const index = Math.round(Math.random()*74);

    const x =  ( Math.random() - 0.5 ) * 100;

    const z = ( Math.random() - 0.5 ) * 100;

    if(Math.abs(x)-30 > Math.abs(track[index*3])){
        i--;
        continue;
    }

    if(Math.abs(z)-30 > Math.abs(track[index*3+2])){
        i--;
        continue;
    }

	dummy.position.set(
        x + track[index*3],
        0,
        z + track[index*3+2]
    );
  
  dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
  
  dummy.rotation.y = Math.random() * Math.PI;
  
  dummy.updateMatrix();
  instancedMesh.setMatrixAt( i, dummy.matrix );

  dummy.position.y =0.7;

}

/////////////////////////////////////////
//////////// FIM DA GRAMA////////////////
/////////////////////////////////////////

// linha para testar raycast
function getRayCastLine (raycaster) {
    const lineGeometry = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints( [
            raycaster.ray.origin,
            raycaster.ray.at(1000, new THREE.Vector3(0, 0, 0))
        ] ),
        new THREE.LineBasicMaterial({ color: 0xff0000 })    
    );
    
    return lineGeometry;
}

function checkColisions() {
    if (carroflag) {
        const intersectsLine = raycasterLine.intersectObjects(scene.children);
        if (intersectsLine.length >= 3) {
            console.log("INTERSECTOU A LINHA!");   
        }
    }
}

function animate() {
    world.step(timeStep);
    
    if(options.debug) cannonDebugger.update()

    leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    leavesMaterial.uniformsNeedUpdate = true;

    carro.attPositions();

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);

    //Ao pressionar enter, muda para terceira pessoa
    if(camera.lockOn) thirdPerson.Update();

    attOptions();

    // mesma coisa do que ta explicado em baixo (programacao paralela mal feita rs)
    if (carro.hasOwnProperty('carroMesh')){

        // if checando se o objeto carroMesh tem a propriedade position
        // (buga no começo da renderização pois em certo tempo 'position' eh undefined)
        if (carro.carroMesh.hasOwnProperty('position')){
            // vec3 com posicao da malha do carro
            var pos = carro.carroMesh.position;
            
            // console.log(pos);
            
            // verificação da partida/chegada
            // if (line.) {
            //         console.log("passou pela linha");
            // }

        }
    }

    checkColisions();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
