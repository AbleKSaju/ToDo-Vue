<template>
    <v-sheet class="position-fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <v-fade-transition hide-on-leave>
        <v-card v-if="show" append-icon="$close" class="mx-auto" elevation="16" max-width="500">
          <template v-slot:append>
            <v-btn icon="$close" variant="text" @click="closeConfirmation"></v-btn>
          </template>
  
          <v-divider></v-divider>
  
          <div class="py-12 text-center">
            <v-icon class="mb-6" icon="mdi-trash-can-outline" color="red" size="128"></v-icon>
  
            <div class="text-h4 font-weight-bold">Are You Sure?</div>
            <div class="font-weight-medium">{{ message }}</div>
          </div>
  
          <v-divider></v-divider>
  
          <div class="pa-4 text-end">
            <v-btn class="text-none" color="medium-emphasis" min-width="92" variant="outlined" rounded @click="closeConfirmation">
              Cancel
            </v-btn>
            <v-btn class="text-none ml-5" color="medium-emphasis" min-width="92" variant="outlined" rounded @click="confirmAction">
              Delete
            </v-btn>
          </div>
        </v-card>
      </v-fade-transition>
    </v-sheet>
  </template>
  
  <script>
  export default {
    name: "todoConfirmation",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: "Are you sure?",
      },
    },
    methods: {
      closeConfirmation() {
        this.$emit("update:show", false);
      },
      confirmAction() {
        // Emit an event to the parent component indicating confirmation
        this.$emit("confirm");
        // Close the confirmation dialog
        this.closeConfirmation();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add scoped styles here */
  </style>
  