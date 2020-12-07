<template>
  <div class="wrapper" :style="{background: color}">
    <div :class="[{'show':onFocus}, 'header']">
      <div class="header-btn close-btn" @click="close()"></div>
      <div class="header-btn skin-btn" @click="skinMenuShow = !skinMenuShow">
        <div class="submenu-wrapper" v-show="skinMenuShow">
          <div class="random-color" @click="changeColor()"></div>
          <div class="transparent-color" @click="changeColor('tp')"></div>
        </div>
      </div>
      <div class="header-btn delete-btn" @click="remove()"></div>
    </div>
    <input :class="[{'with-header':onFocus}, 'title-input']" @input="updateData" v-model="title" type="text">
    <quill-editor class="editor" ref="myTextEditor" v-model="content" :options="editorOption" @change="onEditorChange" ></quill-editor>
    <div class="toolbar-block" :class="[{'show': !onFocus}]"></div>
    <div id="toolbar">
        <!-- 常用按钮 -->
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-strike" />
        <button class="ql-blockquote" />
        <button class="ql-code-block" />
        <button class="ql-list" value="ordered" />
        <button class="ql-list" value="bullet" />
        <button class="ql-indent" value="-1" />
        <button class="ql-indent" value="+1" />
        <button class="ql-direction" value="rtl" />

        <!-- 常用选项 -->
        <select class="ql-color">
          <option value="red"></option>
          <option value="green"></option>
          <!-- Todo 自定义色值 -->
        </select>
        <select class="ql-align">
        </select>
        
        <button class="ql-link" />
        <button class="ql-image" />
        <button class="ql-video" />

        <button class="ql-clean" />

        <select class="ql-header">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
          <option value="false"></option>
        </select>
        <select class="ql-size">
          <option value="small"></option>
          <option value="huge"></option>
          <option selected value="large"></option>
        </select>
        <select class="ql-font">
          <option selected="selected"></option>
          <option value="serif"></option>
          <option value="monospace"></option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <button class="ql-script" value="sub" />
        <button class="ql-script" value="super" />


        <!-- You can also add your own -->
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import { getRandomColor } from '@/utils/tools'

const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const Store = require('electron-store');
const store = new Store();

export default {
  data() {
    return{
      id: null,
      localWindow: null,
      content: '',
      onFocus: true,
      uuid: '',
      color: '#FFFFFF',
      skinMenuShow: false,
      title: '',
      editorOption: {
        placeholder: '编辑内容',
        modules: {
          toolbar: '#toolbar'
        }
      },
    }
  },
   components: {
      quillEditor
    },
  methods: {
    changeColor(type) {
      this.color = type ? "transparent" : getRandomColor()
      console.log(this.color)
      this.$nextTick(() => {
        this.updateData()
      })
    },
    close() {
      this.localWindow.destroy()
    },
    remove() {
      let oldData = store.get('main') || {}
      delete oldData[this.uuid]
      store.set('main', oldData)
      this.localWindow.destroy()
    },
    onEditorChange({html }) {
      this.content = html;
      this.$nextTick(() => {
        this.updateData()
      })
    },
    updateData() {
      let oldData = store.get('main') || {}
      oldData[this.uuid] = {
        title: this.title,
        content: this.content,
        color: this.color
      }
      console.log(oldData)
      store.set('main', oldData)
    }
  },
  mounted() {
    console.log(this.$route)
    this.id = +this.$route.query.id
    this.uuid = this.$route.query.uuid
    this.color = decodeURIComponent(this.$route.query.color)
    const storeData = store.get('main')[this.uuid]
    this.content = storeData ? storeData.content : '';
    this.title = storeData ? storeData.title : '默认标题';
    this.localWindow = BrowserWindow.fromId(this.id);
    this.localWindow.on('focus', () => {
      this.onFocus = true;
    })
    this.localWindow.on('blur', () => {
      this.onFocus = false;
    })
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  margin: 0;
  padding: 0;
  background: oldlace;
  min-height: 100vh;
  .title-input {
    border:none;
    border-bottom:1px solid #bfbfbf;
    outline: none;
    background: transparent;
    margin-left: 15px;
    font-size: 18px;
    padding-bottom: 10px;
    margin-top: 15px;
    &.with-header {
      margin-top: 0px;
    }
  }
  .header {
    height: 35px;
    background: inherit;
    -webkit-app-region: drag;
    position: relative;
    display: none;
    z-index: 6;
    &.show {
      display: block;
    }
    .header-btn {
      width: 15px;
      height: 15px;
      -webkit-app-region: no-drag;
      z-index: 777;
    }
    .header-title {
      position: absolute;
      left: 30px;
      top: 0;
      margin: 0;
      padding: 0;
    }
    .close-btn {
      background: url('../assets/icon/close.png') no-repeat;
      background-size: 100%;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .skin-btn {
      background: url('../assets/icon/skin.png') no-repeat;
      background-size: 100%;
      position: absolute;
      top: 8px;
      right: 30px;
      width: 20px;
      height: 20px;
      .submenu-wrapper {
        width: 60px;
        position: absolute;
        top: 25px;
        left: -25px;
        > div {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-left: 10px;
        }
        .random-color {
          background: url('../assets/icon/random.png') no-repeat;
          background-size: 100%;
        }
        .transparent-color {
          background: url('../assets/icon/transparent.png') no-repeat;
          background-size: 100%;
        }
      }
    }
    .delete-btn {
      background: url('../assets/icon/delete.png') no-repeat;
      background-size: 100%;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .editor {
    height: calc(100vh - 71px);
    /deep/ .ql-container.ql-snow {
      border: 0 !important;    
    }
    /deep/ .ql-container {
      font-size: 16px !important;
    }
  }
  #toolbar {
    position: fixed;
    bottom: 0;
    z-index: 1;
    width: 100%;
    border: 0;
    overflow-y: hidden;
    height: 36px;
    display: block;
  }
  .toolbar-block {
    position: fixed;
    bottom: 0;
    z-index: 2;
    width: 100%;
    height: 36px;
    display: none;
    background: inherit;
    &.show {
      display: block;
    }
  }
}
</style>