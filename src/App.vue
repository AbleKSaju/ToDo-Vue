<template>
  <v-app id="inspire">
    <v-navigation-drawer :width="200" v-model="drawer" app>
      <div class="d-flex align-center">
        <v-list-item-title
          class="text-h5 font-weight-medium"
          style="padding: 14px"
        >
          ToDo
        </v-list-item-title>
        <div class="pl-7">
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list>
        <v-list-item to="/">
          <v-list-item-content class="d-flex align-center">
              <v-icon color="black">mdi-list-box</v-icon>
            <v-list-item-title class="ml-2">Todo</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/about">
          <v-list-item-content class="d-flex align-center">
              <v-icon color="black">mdi-help-box</v-icon>
            <v-list-item-title class="ml-2">About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div class="header flex-container">
      <v-main>
        <Header :drawer="drawer" @update:drawer="drawer = $event" />
      </v-main>
    </div>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import Header from "./components/Header.vue";
import { ref, onMounted } from "vue";
import store from "./store";

onMounted(() => {
  store.dispatch("fetchTodos");
});
const drawer = ref(null);
</script>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
};
</script>
<style>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  margin: 2vh;
}
</style>
