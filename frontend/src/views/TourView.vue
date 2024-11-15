<!-- src/views/TourView.vue -->
<template>
  <div>
    <Tour />
  </div>
</template>

<script>
import Tour from '../components/Tour.vue';

export default {
  name: 'TourView',
  components: {
    Tour,
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
