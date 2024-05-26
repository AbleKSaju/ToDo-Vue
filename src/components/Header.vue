<template>
  <div class="pl-2 mt-8 d-flex align-center">
    <!-- <v-list-item-icon> -->
    <v-icon color="black" v-if="!drawer" @click="toggleDrawer"
      >mdi-reorder-horizontal</v-icon
    >
    <!-- </v-list-item-icon> -->
    <div class="flex-grow-1 pa-1 d-flex pr-5 flex-column justify-center">
      <h2 class="text-center">
        Tick Tick - {{ store.state.completedTodo }} / {{ store.state.todos.length }}
      </h2>
    </div>
  </div>
  <h4 class="text-center mb-5">
    {{ currentTime }}
  </h4>

</template>

<script setup>
import { ref, onMounted } from "vue";
import store from "@/store";

const currentTime = ref(getCurrentTime());

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = formatTime(hours % 12 || 12); // Convert to 12-hour format, with 12 being the maximum
  const formattedMinutes = formatTime(minutes);
  const formattedSeconds = formatTime(seconds);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
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
