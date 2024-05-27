<template>
  <v-app id="inspire">
    <v-navigation-drawer :width="200" v-model="drawer" app>
      <div class="d-flex align-center">
        <v-list-item-title
          class="text-h5 font-weight-medium"
          style="padding: 14px"
        >
          To - Do
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
// Import necessary components and functions
import Header from "./components/Header.vue"; 
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex"; 

const store = useStore(); // Initialize Vuex store
const drawer = ref(true); // Create a reactive reference for drawer state

// Fetch todos when the component is mounted
onMounted(() => {
  store.dispatch("fetchTodos"); // Dispatch fetchTodos action from the Vuex store
});

// Function to update the favicon based on the number of pending todos
const updateFavicon = (pendingCount) => {
  const link = document.querySelector("link[rel~='icon']");
  if (!link) {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    document.head.appendChild(newLink);
    return newLink;
  }
  // Update the favicon based on the number of pending todos
  link.href =
    pendingCount > 0
      ? "https://cdn-icons-png.freepik.com/256/11207/11207691.png?semt=ais_hybrid" 
      : "https://user-images.githubusercontent.com/69080584/119517399-c6f10280-bda1-11eb-9af9-4bdc197dcd65.png";
};

// Watch the todos state in the Vuex store for changes
watch(
  () => store.state.todos,
  (newTodos) => {
    const pendingCount = newTodos.filter((todo) => !todo.status).length; // Calculate the number of pending todos
    document.title =
      pendingCount > 0 ? `Pending: ${pendingCount}` : "mr.perfect";
    updateFavicon(pendingCount); // Update the favicon based on the number of pending todos
  },
  { immediate: true } // Run the watcher immediately on component mount
);
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

