<template>
    <v-sheet v-if="show" class="overlay">
      <v-fade-transition hide-on-leave>
        <v-card class="card" elevation="16" max-width="600">
          <template v-slot:append>
            <v-btn icon="$close" variant="text" @click="closeConfirmation"></v-btn>
          </template>
  
          <v-divider></v-divider>
  
          <div class="text-h5 font-weight-bold text-center pt-3">{{ confirmationTitle }}</div>
          <div class="py-12 text-center">
            <v-icon :class="iconClass" :icon="iconName" :color="iconColor" size="128"></v-icon>
  
            <div class="font-weight-medium">{{ message }}</div>
          </div>
  
          <v-divider></v-divider>
  
          <div class="pa-4 text-end">
            <v-btn class="text-none" color="medium-emphasis" min-width="92" variant="outlined" rounded @click="closeConfirmation">
              Cancel
            </v-btn>
            <v-btn class="text-none ml-5" :color="buttonColor" min-width="92" variant="outlined" rounded @click="confirmAction">
              {{ actionText }}
            </v-btn>
          </div>
        </v-card>
      </v-fade-transition>
    </v-sheet>
  </template>
  
  <script>
  export default {
    name: "ConfirmationDialog",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: "delete", // Default to delete action
      },
      message: {
        type: String,
        default: "Are you sure?",
      },
    },
    computed: {
      confirmationTitle() {
        return this.type === "delete" ? "Delete Confirmation" : "Edit Confirmation";
      },
      actionText() {
        return this.type === "delete" ? "Delete" : "Edit";
      },
      iconName() {
        return this.type === "delete" ? "mdi-trash-can-outline" : "mdi-square-edit-outline";
      },
      iconColor() {
        return this.type === "delete" ? "red" : "blue";
      },
      iconClass() {
        return this.type === "delete" ? "mb-6" : "";
      },
      buttonColor() {
        return this.confirmationTitle === 'Delete Confirmation' ? 'red' : 'green';
      },
    },
    methods: {
      closeConfirmation() {
        this.$emit("update:show", false);
      },
      confirmAction() {
        this.$emit("confirm");
        this.closeConfirmation();
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050; /* Ensure it is above other content */
  }
  .card {
    width: 500px;
  }
  </style>
  