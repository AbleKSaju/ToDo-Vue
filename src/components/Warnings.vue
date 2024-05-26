<template>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" @hidden="closeSnackbar">
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
  