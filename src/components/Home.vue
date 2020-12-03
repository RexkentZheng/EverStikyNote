<template>
  <div class="wrapper">
    <!-- <button @click="showWindow(null)">Come on111</button>
    <button @click="showNote">Show Note</button> -->
    <div class="add-btn" @click="showWindow(null)"></div>
    <div v-html="note"></div>
    <div class="note-list" >
      <div
        v-for="item in Object.keys(main)"
        :key=item
        class="note-item"
        :style="{background: main[item].color}"
        v-html="main[item].content"
        @click="showWindow(item, main[item].color)"
      ></div>
    </div>
  </div>
</template>

<script>
// import { BrowserWindow } from 'electron'
const { BrowserWindow, screen } = require('electron').remote
const Store = require('electron-store');
const store = new Store();
import { v4 as uuidv4 } from 'uuid';
import colors from '../utils/colors'

export default {
  name: 'App',
  data() {
    return {
      note: '',
      main: {},
      window: null
    }
  },
  components: {
  },
  methods: {
    getRandomColor() {
      return colors[parseInt(Math.random()*(colors.length+1),10)];
    },
    showWindow(uuid, color) {
      const realUuid = uuid || uuidv4()
      const newPosition =screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds;
      const itemColor = color || this.getRandomColor()

      console.log(newPosition)
      console.log(itemColor)
      let childWindow = new BrowserWindow({
        width: 400,
        height: 300,
        x: newPosition.x + newPosition.width / 2 - 200,
        y: newPosition.y + newPosition.height / 2 - 150,
        webPreferences: {
          nodeIntegration: true
        },
        frame: false,
        vibrancy: 'popover',
      });

      const modalPath = process.env.NODE_ENV === 'development'
      ? `http://localhost:8081/#/note?id=${childWindow.id}&uuid=${realUuid}&color=${encodeURIComponent(itemColor)}`
      : `file://${__dirname}/index.html#note`

      console.log(modalPath)

      childWindow.loadURL(modalPath)
      
      childWindow.show()

      childWindow.on('closed', () => {
        childWindow = null;
      });
      // setTimeout(() => {
      //   childWindow.close()
      // }, 10000)
    },
    showNote() {
      this.note = store.get('aloha')
      this.main = store.get('main')
      console.log(store.get('main'))
      console.log(this.note)
    }
  },
  mounted() {
    this.main = store.get('main')
    const local = BrowserWindow.getFocusedWindow()
    local.on('focus', () => {
      this.main = store.get('main')
    })
    console.log(local.id)
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background: ivory;
  min-height: calc(100vh - 20px);
  max-height: 600px;
  padding: 10px;
  .add-btn {
    width: 40px;
    height: 40px;
    background: url('../assets/icon/add.png') no-repeat;
    background-size: 100%;
    position: fixed;
    right: 20px;
    top: 20px;
  }
  .note-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .note-item {
      width: 28%;
      background: khaki;
      border-radius: 10px;
      padding: 15px;
      height: auto;
      margin-bottom: 10px;
    } 
  }
}
</style>