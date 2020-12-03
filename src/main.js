import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import less from 'less'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueQuillEditor from 'vue-quill-editor'

Vue.config.productionTip = false

import Note from './components/Note.vue';
import Home from './components/Home.vue'

Vue.use(VueRouter);
Vue.use(less);
Vue.use(VueQuillEditor);

let router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/note', name: 'note', component: Note }
  ]
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')