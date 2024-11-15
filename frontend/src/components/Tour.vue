<template>
  <div ref="tourContainer" class="tour-container">
    <!-- Toggle Button for Switching Views -->
    <button @click="toggleView" class="toggle-button">
      {{ isDroneView ? "Switch to Walking View" : "Switch to Drone View" }}
    </button>

    <!-- Speed Adjustment Slider -->
    <div class="speed-control">
      <label for="speed-slider">Walking Speed:</label>
      <input type="range" id="speed-slider" min="0.1" max="3" step="0.1" v-model="cameraSpeed" />
      <span>{{ Number(cameraSpeed).toFixed(1) }}</span>
    </div>

    <!-- Search Bar with Suggestions for Buildings -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @input="performSearch"
        placeholder="Search for a building"
      />
      <ul v-if="buildings.length">
        <li v-for="building in buildings" :key="building.id">
          {{ building.name }}
          <button @click="navigateToBuilding(building)">Go</button>
        </li>
      </ul>
      <p v-if="!buildings.length && searchQuery">No results found.</p>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import gsap from 'gsap';
import axios from 'axios';

export default {
  name: 'Tour',
  data() {
    return {
      isDroneView: false,
      cameraSpeed: 0.5,
      rotationSpeed: 0.005,
      cameraDirection: new THREE.Vector3(),
      walkingPosition: { x: 0, y: 2, z: 10 },
      campusCenter: new THREE.Vector3(),
      campusSize: new THREE.Vector3(),
      collisionDistance: 1,
      raycaster: new THREE.Raycaster(),
      isMouseDown: false,
      previousMouseX: null,
      walkingAudio: null,
      searchQuery: '', // Search query for buildings
      buildings: [],   // List of search results
    };
  },
  mounted() {
    this.init3DScene();
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    // Function to perform search with each keystroke
    performSearch() {
      // Only perform search if there’s a query to avoid unnecessary calls
      if (this.searchQuery.trim()) {
       axios.get(`http://localhost:3000/api/search?q=${this.searchQuery}`)
          .then(response => {
            this.buildings = response.data;
            console.log("Search suggestions:", this.buildings); // Log search results
          })
          .catch(error => {
            console.error("Error fetching search suggestions:", error);
          });
      } else {
        this.buildings = []; // Clear suggestions if search query is empty
      }
    },

    // Function to navigate to the selected building
    navigateToBuilding(building) {
      console.log("Navigating to building:", building);
      gsap.to(this.camera.position, {
        x: building.x,
        y: building.y,
        z: building.z,
        duration: 2,
        onUpdate: () => {
          this.camera.lookAt(building.x, building.y, building.z);
        }
      });
    },

    init3DScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB);
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(this.walkingPosition.x, this.walkingPosition.y, this.walkingPosition.z);
      this.camera.lookAt(10, 2, 5);

      this.camera.zoom = 1;
      this.camera.updateProjectionMatrix();

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.tourContainer.appendChild(this.renderer.domElement);

      const objLoader = new OBJLoader();
      objLoader.load('/models/praktis layout.obj', (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.FrontSide;
          }
        });
        object.scale.set(0.1, 0.1, 0.1);
        this.scene.add(object);

        const box = new THREE.Box3().setFromObject(object);
        this.campusCenter = box.getCenter(new THREE.Vector3());
        this.campusSize = box.getSize(new THREE.Vector3());

        const groundWidth = this.campusSize.x * 1.1;
        const groundHeight = this.campusSize.z * 1.1;
        const groundGeometry = new THREE.PlaneGeometry(groundWidth, groundHeight);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(this.campusCenter.x, -1, this.campusCenter.z);
        this.scene.add(ground);
      });

      const ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);

      const audioListener = new THREE.AudioListener();
      this.camera.add(audioListener);
      this.walkingAudio = new THREE.Audio(audioListener);
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load('/sounds/footsteps.mp3', (buffer) => {
        this.walkingAudio.setBuffer(buffer);
        this.walkingAudio.setLoop(true);
        this.walkingAudio.setVolume(3);
      });

      this.animate();
    },

    animate() {
      requestAnimationFrame(this.animate.bind(this));
      this.renderer.render(this.scene, this.camera);
    },

    onMouseDown(event) {
      this.isMouseDown = true;
      this.previousMouseX = event.clientX;
    },
    onMouseUp() {
      this.isMouseDown = false;
    },
    onMouseMove(event) {
      if (this.isMouseDown) {
        const deltaX = event.clientX - this.previousMouseX;
        this.camera.rotation.y -= deltaX * this.rotationSpeed;
        this.previousMouseX = event.clientX;
      }
    },
    onKeyDown(event) {
      const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      const backwardDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
      const leftDirection = new THREE.Vector3(-1, 0, 0).applyQuaternion(this.camera.quaternion);
      const rightDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

      if (!this.walkingAudio.isPlaying) {
        this.walkingAudio.play();
      }

      const moveCamera = (direction) => {
        const newPosition = this.camera.position.clone().addScaledVector(direction, this.cameraSpeed);
        if (this.isWithinBoundaries(newPosition)) {
          this.camera.position.copy(newPosition);
        }
      };

      if (event.key === 'ArrowUp' || event.key === 'w') {
        if (!this.detectCollision(forwardDirection)) {
          moveCamera(forwardDirection);
        }
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        if (!this.detectCollision(backwardDirection)) {
          moveCamera(backwardDirection);
        }
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveCamera(leftDirection);
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        moveCamera(rightDirection);
      }
    },
    onKeyUp() {
      if (this.walkingAudio.isPlaying) {
        this.walkingAudio.stop();
      }
    },
    isWithinBoundaries(position) {
      const halfGroundWidth = (this.campusSize.x * 1.1) / 2;
      const halfGroundHeight = (this.campusSize.z * 1.1) / 2;
      const minX = this.campusCenter.x - halfGroundWidth;
      const maxX = this.campusCenter.x + halfGroundWidth;
      const minZ = this.campusCenter.z - halfGroundHeight;
      const maxZ = this.campusCenter.z + halfGroundHeight;
      return position.x >= minX && position.x <= maxX && position.z >= minZ && position.z <= maxZ;
    },
    detectCollision(direction) {
      this.raycaster.set(this.camera.position, direction);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      return intersects.length > 0 && intersects[0].distance < this.collisionDistance;
    },
    toggleView() {
      this.isDroneView = !this.isDroneView;

      if (this.isDroneView) {
        this.walkingPosition = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };
        const campusWidth = Math.max(this.campusSize.x, this.campusSize.z);
        const droneHeight = campusWidth * 1.0;

        gsap.to(this.camera.position, {
          x: this.campusCenter.x,
          y: this.campusCenter.y + droneHeight,
          z: this.campusCenter.z,
          duration: 2,
          onUpdate: () => {
             this.camera.lookAt(this.campusCenter.x + 10, this.campusCenter.y, this.campusCenter.z);
          },
        });
      } else {
        gsap.to(this.camera.position, {
          x: this.walkingPosition.x,
          y: this.walkingPosition.y,
          z: this.walkingPosition.z,
          duration: 2,
          onUpdate: () => {
            this.camera.lookAt(0, 5, 0);
          },
        });
      }
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tour-container {
  position: fixed; /* Ensures container is fixed to viewport */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  touch-action: none;
}

.toggle-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  z-index: 10;
}

.speed-control {
  position: absolute;
  top: 70px;
  left: 20px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
}

.speed-control label {
  margin-right: 10px;
}

.speed-control input[type="range"] {
  width: 100px;
  vertical-align: middle;
}

.speed-control span {
  margin-left: 10px;
  font-weight: bold;
}

.search-bar {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  width: 250px;
  z-index: 10;
}

.search-bar input[type="text"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar ul {
  margin-top: 10px;
  list-style: none;
  padding: 0;
}

.search-bar ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.search-bar ul li button {
  padding: 5px;
  font-size: 0.9em;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 3px;
}

</style>