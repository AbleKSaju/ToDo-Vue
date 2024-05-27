<template>
    <v-dialog max-width="500" v-model="dialogVisible">
      <template v-slot:default>
        <v-card title="Information">
          <v-card-text>
            <div v-if="task">
              <h4 class="pt-3"> Task: {{ task.title }}</h4>
              <h4 class="pt-3"> Status: {{ task.status ? 'Completed' : 'Pending' }}</h4>
              <div v-if="task.completedAt">
              <h4 class="pt-3"> Completed at: {{ formattedTime(task.completedAt) }}</h4>
            </div>
            <div v-if="task.updatedAt">
              <h4 class="pt-3"> Updated at: {{ formattedTime(task.updatedAt) }}</h4>
            </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "TaskInfo",
    props: {
      infoDialog: Boolean,
      task: Object // Accept task data as a prop
    },
    data() {
      return {
        dialogVisible: false
      };
    },
    watch: {
      infoDialog(newVal) {
        this.dialogVisible = newVal;
      }
    },
    methods: {
      closeDialog() {
        this.$emit("update:infoDialog", false);
      },
      formattedTime(time) {
        if (time) {
          // Convert timestamp to Date object
          const date = new Date(time);
          // Format the date and time in 12-hour format
          return date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
          });
        } else {
          return "N/A";
        }
      }
    }
  };
  </script>
  