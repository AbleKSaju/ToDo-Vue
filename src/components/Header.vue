<template>
  <div class="pl-2 mt-10 d-flex align-center">
    <!-- <v-list-item-icon> -->
    <v-icon color="black" v-if="!drawer" @click="toggleDrawer"
      >mdi-reorder-horizontal</v-icon
    >
    <!-- </v-list-item-icon> -->
    <div class="flex-grow-1 pa-1 d-flex pr-5 flex-column justify-center">
      <h2 class="text-center">
        Tick Tick - {{ completedTodoCount }} / {{ store.state.todos.length }}
      </h2>
    </div>
  </div>
  <h4 class="text-center">
    {{ currentTime }}
  </h4>

</template>

<script setup>
import { ref, onUpdated, onMounted } from "vue";
import store from "@/store";

const completedTodoCount = ref(0);
const currentTime = ref(getCurrentTime());

onUpdated(() => {
  completedTodoCount.value = store.state.todos.filter(
    (todo) => todo.status === true
  ).length;
});

function getCurrentTime() {
  const now = new Date();
  return (
    formatTime(now.getHours()) +
    ":" +
    formatTime(now.getMinutes()) +
    ":" +
    formatTime(now.getSeconds())
  );
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}
onMounted(() => {
  setInterval(() => {
    currentTime.value = getCurrentTime();
  }, 1000);
});
</script>

<script>
export default {
  name: "HeaderComponent",
  props: {
    drawer: {
      type: Boolean || null,
      required: true,
    },
  },
  methods: {
    toggleDrawer() {
      this.$emit("update:drawer", !this.drawer);
    },
  },
};
</script>
