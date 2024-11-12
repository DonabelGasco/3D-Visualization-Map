# tour

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


Folder Structure
tour/
│
├── backend/
│   ├── index.js                 # Main entry point for the backend server
│   ├── package.json              # Backend dependencies and scripts
│   └── other-backend-files...    # Any other backend-related files
│
├── frontend/
│   ├── dist/                    # Built files for the frontend (after `npm run build`)
│   │   ├── index.html           # Main HTML file for the frontend
│   │   └── other-built-files...  # Other built files
│   │
│   ├── public/                  # Public assets
│   │   └── models/              # 3D models and other assets
│   │
│   ├── src/                     # Source files for the Vue.js frontend
│   │   ├── App.vue              # Main Vue component
│   │   ├── main.js              # Entry point for Vue app
│   │   ├── router/
│   │   │   └── index.js         # Vue Router configuration
│   │   ├── store/               # Vuex store (if used)
│   │   ├── components/          # Vue components
│   │   │   ├── Home.vue         # Home component
│   │   │   └── Tour.vue         # Tour component
│   │   ├── views/               # Vue views
│   │   │   ├── HomeView.vue     # Home view
│   │   │   └── AboutView.vue    # About view
│   │   ├── i18n.js              # Internationalization setup
│   │   └── other-src-files...   # Other source files
│   │
│   ├── .gitignore                # Git ignore file
│   ├── package.json              # Frontend dependencies and scripts
│   └── README.md                 # Project documentation
│
└── README.md                     # Project documentation for the root