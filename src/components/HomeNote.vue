<template>
  <div class="home-note" v-html="note.content" :style="{background: note.color}" @click="showWindow(uuid, note.color)"></div>
</template>

<script>
import { newWindow } from '@/utils/tools';

const { Menu, MenuItem } = require('electron').remote;
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
      newWindow(uuid, color);
    },
  },
  mounted() {
    this.initMenu();
  },
}
</script>

<style lang="less" scoped>
.home-note {
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
}
</style>
