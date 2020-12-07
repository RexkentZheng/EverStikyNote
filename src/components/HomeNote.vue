<template>
  <div
    class="home-note-wrapper"
    :style="{background: note.color === 'transparent' ? '#F0F0F0' : note.color }"
    @click="showWindow(uuid, note.color)"
  >
    <p>{{ note.title }}</p>
    <div v-html="note.content"></div>
  </div>
</template>

<script>
import { newWindow } from '@/utils/tools';

const { Menu, MenuItem, BrowserWindow } = require('electron').remote;
const Store = require('electron-store');
const store = new Store();

export default {
  props: {
    note: {
      type: Object,
      default: () => {}
    },
    uuid: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      menu: null,
      tmpUUID: '',
      windowId: 0
    }
  },
  methods: {
    initMenu(){
      this.menu = new Menu();
      this.menu.append(new MenuItem({ label: '删除', click: () => {
        this.deleteNote()
      }}));
      window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (e.target.__vue__) {
          this.tmpUUID = e.target.__vue__.uuid
          this.menu.popup();
        }
      }, false);
    },
    deleteNote() {
      let oldData = store.get('main') || {}
      console.log(this.tmpUUID)
      delete oldData[this.tmpUUID]
      store.set('main', oldData)
      this.$emit('reload')
    },
    showWindow(uuid, color) {
      const existWindow = BrowserWindow.fromId(this.windowId)
      if (existWindow) return existWindow.show()
      this.windowId = newWindow(uuid, color);
    },
  },
  mounted() {
    this.initMenu();
  },
}
</script>

<style lang="less" scoped>
.home-note-wrapper {
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
  p {
    padding: 0 0 10px 0;
    margin: 0;
    border-bottom: 1px solid #bfbfbf;
    font-weight: 800;
  }
}
</style>
