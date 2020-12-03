<template>
  <div class="wrapper" :style="{background: color}">
    <div :class="[{'show':onFocus}, 'header']">
      <div class="close-btn" @click="close"></div>
    </div>

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
    <!-- <div class="main ql-editor"></div> -->
  </div>
</template>

<script>
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
import { quillEditor } from 'vue-quill-editor';
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
      editorOption: {
        placeholder: '编辑文章内容',
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
    close() {
      this.localWindow.destroy()
    },
    onEditorChange({html }) {
      this.content = html;
      let oldData = store.get('main') || {}
      oldData[this.uuid] = {
        content: this.content,
        color: this.color
      }
      store.set('main', oldData)
      console.log(store.get('aloha'))
    },
  },
  mounted() {
    console.log(this.$route)
    this.id = +this.$route.query.id
    this.uuid = this.$route.query.uuid
    this.color = decodeURIComponent(this.$route.query.color)
    this.content = store.get('main')[this.uuid] || ''
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
  .header {
    height: 35px;
    background: inherit;
    -webkit-app-region: drag;
    position: relative;
    visibility: hidden;
    &.show {
      visibility: visible;
    }
    .close-btn {
      width: 20px;
      height: 20px;
      background: url('../assets/icon/close.png') no-repeat;
      background-size: 100%;
      position: absolute;
      top: 5px;
      left: 5px;
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