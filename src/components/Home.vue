<template>
  <div class="wrapper">
    <waterfall :col='col' :data="Object.keys(main)"  >
      <template >
        <div class="add-note" @click="showWindow()">
          <img src="../assets/icon/add.png" alt="">
        </div>
        <home-note
          v-for="item in Object.keys(main)"
          :key=item
          :uuid=item
          :note=main[item]
          class="note-item"
          @reload="reload"
        />
      </template>
    </waterfall>
  </div>
</template>

<script>
import HomeNote from '@/components/HomeNote'
import { newWindow } from '@/utils/tools'
const { BrowserWindow } = require('electron').remote

const Store = require('electron-store');
const store = new Store();

export default {
  name: 'App',
  data() {
    return {
      note: '',
      main: {},
      window: null,
      data: [],
      col: 3,
    }
  },
  components: {
    HomeNote,
  },
  methods: {
    showWindow() {
      newWindow()
    },
    reload() {
      this.main = store.get('main')
    }
  },
  mounted() {
    this.main = store.get('main') || []
    const local = BrowserWindow.getFocusedWindow()
    local.on('focus', () => {
      this.main = store.get('main')
    })
    local.on('resize', () => {
      this.col = parseInt(local.getBounds().width / 300)
    })
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background: #F8F8F8;
  padding: 10px;
  min-height: calc(100vh - 20px);
  .add-btn {
    width: 40px;
    height: 40px;
    background: url('../assets/icon/add.png') no-repeat;
    background-size: 100%;
    position: fixed;
    right: 20px;
    top: 20px;
  }
  .add-note {
    height: 150px;
    background: rgb(234, 234, 234);
    padding: 15px;
    box-sizing: border-box;
    margin: 10px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>