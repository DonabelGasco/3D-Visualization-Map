<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-left">
        <div class="hamburger" @click="toggleSidebar">
          &#9776;
        </div>
        <div class="bookmark" @click="toggleBookmark">
          <i :class="{'fas fa-bookmark': isBookmarked, 'far fa-bookmark': !isBookmarked}" :style="{color: isBookmarked ? 'green' : 'black'}"></i>
        </div>
      </div>
      <ul>
        <li>
          <i class="fas fa-search" style="color: black;"></i>
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            :placeholder="$t('searchPlaceholder')"
          />
        </li>
      </ul>
    </nav>
    <div class="container">
      <aside class="sidebar" :class="{ open: isSidebarOpen }">
        <ul>
          <li><a href="#"><i class="fas fa-building"></i> {{ $t('facilities') }}</a></li>
          <li><a href="#"><i class="fas fa-history"></i> {{ $t('history') }}</a></li>
          <li><a href="#"><i class="fas fa-cogs"></i> {{ $t('settings') }}</a></li>
          <li>
            <a href="#" @click="toggleLanguageDropdown">
              <i class="fas fa-language"></i> {{ $t('language') }}
            </a>
            <div v-if="isLanguageDropdownOpen" class="language-dropdown">
              <label>
                <input type="radio" v-model="selectedLanguage" value="en" @change="changeLanguage"> English
              </label>
              <label>
                <input type="radio" v-model="selectedLanguage" value="fil" @change="changeLanguage"> Filipino
              </label>
            </div>
          </li>
        </ul>
      </aside>
      <main class="content" :class="{ shifted: isSidebarOpen }" ref="content">
        <h1>{{ $t('welcome') }}</h1>
        <!-- Your content goes here -->
      </main>
      <div class="zoom-controls">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isSidebarOpen: false,
      isBookmarked: false,
      isLanguageDropdownOpen: false,
      selectedLanguage: 'en',
      searchQuery: '',
      zoomLevel: 1,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleBookmark() {
      this.isBookmarked = !this.isBookmarked;
      // Add your bookmark logic here
    },
    toggleLanguageDropdown() {
      this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    },
    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage;
    },
    performSearch() {
      alert(`Searching for: ${this.searchQuery}`);
      // Add your search logic here
    },
    zoomIn() {
      this.zoomLevel += 0.1;
      this.applyZoom();
    },
    zoomOut() {
      this.zoomLevel = Math.max(0.1, this.zoomLevel - 0.1);
      this.applyZoom();
    },
    applyZoom() {
      this.$refs.content.style.transform = `scale(${this.zoomLevel})`;
      this.$refs.content.style.transformOrigin = 'top left';
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  background-color: #F0F0F0;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.hamburger {
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
}

.bookmark {
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 20px; /* Adjusted margin */
}

.navbar ul {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  margin: 2px;
}

.navbar ul li {
  position: relative;
  display: flex;
  align-items: center;
}

.navbar ul li i {
  margin-right: 10px;
}

.navbar ul li input {
  display: inline-block;
  padding: 5px;
  font-size: 1rem;
  border-radius: 15px;
  border: 1px solid #ccc;
}

.navbar a {
  color: black;
  text-decoration: none;
  justify-content: space-between;
  margin-right: 50px;
}

.container {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.sidebar {
  width: 200px;
  background-color: #F0F0F0;
  padding: 1rem;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  height: 100%;
  position: absolute;
  z-index: 1;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar ul {
  list-style-type: none;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 1in 0;
}

.language-dropdown {
  margin-top: 10px;
  padding-left: 20px;
}

.language-dropdown label {
  display: block;
  margin-bottom: 5px;
}

.content {
  flex-grow: 1;
  padding: 1rem;
  transition: margin-left 0.3s ease;
  margin-left: 0;
  overflow: hidden; /* Prevents content from overflowing */
}

.content.shifted {
  margin-left: 250px;
}

.zoom-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
}

.zoom-controls button {
  margin: 5px 0;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .navbar ul {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .navbar ul li a {
    font-size: 1.2rem;
  }

  .sidebar {
    width: 100%;
  }

  .content.shifted {
    margin-left: 100%;
  }
}

@media (max-width: 576px) {
  .navbar ul {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .navbar ul li a {
    font-size: 1rem;
  }

  .sidebar {
    width: 100%;
  }

  .content.shifted {
    margin-left: 100%;
  }
}
</style>
