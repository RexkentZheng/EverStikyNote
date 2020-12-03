<template>
  <router-view></router-view>
</template>

<script>
// import { BrowserWindow } from 'electron'

export default {
  name: 'App',
  components: {
  },
  methods: {
    showWindow() {
      const electron = require('electron');
      const BrowserWindow = electron.remote.BrowserWindow;

      const childWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
          nodeIntegration: true
        },
        frame: false
      });

      const modalPath = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8081/#/note'
      : `file://${__dirname}/index.html#note`

      childWindow.loadURL(modalPath)
      childWindow.show()
      setTimeout(() => {
        childWindow.close()
      }, 10000)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
