<template>
    <div v-if="snackbar" class="overlay">
      <v-snackbar v-model="snackbar" @hidden="closeSnackbar" max-width="100%">
        {{ text }}
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script>
  export default {
    name: "todoWarnings",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: "Hello, I'm a snackbar",
      },
    },
    data() {
      return {
        snackbar: false,
        text: '',
      };
    },
    watch: {
      show(newVal) {
        this.snackbar = newVal;
      },
      message(newVal) {
        this.text = newVal;
      },
    },
    methods: {
      closeSnackbar() {
        this.$emit('update:show', false);
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    bottom: 0; /* Adjusted to show snackbar at the bottom */
    left: 0;
    width: 10%; /* Full width */
    display: flex;
    justify-content: center;
    align-items: flex-end; /* Adjusted to show snackbar at the bottom */
    z-index: 1050; /* Ensure it is above other content */
  }
  .v-snackbar {
    max-width: 100%; /* Adjusted to fit on mobile screens */
    pointer-events: all; /* Ensure the snackbar can still receive clicks */
  }
  </style>
  