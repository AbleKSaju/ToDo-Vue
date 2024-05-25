import { createApp } from 'vue';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore'; 
import router from './router';
import store from "./store";

const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(store);
app.mount('#app');
