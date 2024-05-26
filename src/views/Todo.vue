<template>
  <div class="todo">
    <v-list flat>
      <div class="d-flex align-center pb-3 pr-2">
        <v-text-field
          v-model="taskTitle"
          @keyup.enter="handleTaskAction"
          @input="updateTaskTitle"
          class="px-3"
          label="Add Task"
          variant="outlined"
          hide-details
          ref="taskInput"
          clearable
          maxlength="30"
        />
        <v-btn @click="handleTaskAction" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <div v-if="loading">
        <Shimmer />
      </div>
      <div v-else-if="$store.state.todos.length > 0">
        <div v-for="task in $store.state.todos" :key="task.id">
          <v-list-item
            class="py-2"
            @click="changeStatus(task.id, !task.status)"
            :style="{ backgroundColor: task.status ? '#ebf9fc' : '' }"
          >
            <template v-slot:default>
              <div class="d-flex align-center">
                <v-list-item-action>
                  <v-checkbox-btn v-model="task.status" :disabled="editMode" />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title
                    class="taskTitle"
                    :class="{ 'text-decoration-line-through': task.status }"
                  >
                    {{ task.title }}
                  </v-list-item-title>
                </v-list-item-content>
                <div class="ml-auto">
                  <v-list-action class="mx-2">
                    <v-icon
                      @click.stop="editTask(task.id, task.title)"
                      color="#45494a"
                      >mdi-square-edit-outline</v-icon
                    >
                  </v-list-action>
                  <v-list-action class="mx-2">
                    <v-icon
                      @click.stop="deleteTask(task.id, task.title)"
                      color="#45494a"
                      >mdi-delete</v-icon
                    >
                  </v-list-action>
                  <v-list-action class="mx-2">
                    <v-icon color="#45494a">mdi-information</v-icon>
                  </v-list-action>
                </div>
              </div>
            </template>
          </v-list-item>
          <v-divider />
        </div>
      </div>
      <div v-else>
        <v-empty-state
          headline="Whoops, 404"
          title="Page not found"
          text="The page you were looking for does not exist"
          image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
        />
      </div>
    </v-list>
  </div>
  <Warnings
    :show="showWarning"
    :message="warningMessage"
    @update:show="updateWarning"
  />
  <Confirmations :show="showConfirmation" @update:show="updateConfirmation" @confirm="deleteTask" :message="confirmationMessage" />

</template>
<script setup>
import Shimmer from "../components/Shimmer/TodoShimmer.vue";
import Warnings from "../components/Warnings.vue";
import Confirmations from "../components/Confirmation.vue"
</script>
<script>
import store from "@/store";

export default {
  name: "TodoPage",
  data() {
    return {
      taskTitle: "",
      editMode: false,
      editedTaskId: null,
      loading: true,
      showWarning: false,
      warningMessage: "",
      showConfirmation: false,
      confirmationMessage: "",
    };
  },
  methods: {
    triggerWarning(msg) {
      this.warningMessage = msg;
      this.showWarning = true;
      setTimeout(() => {
        this.showWarning = false;
      }, 3500);
    },
    updateWarning(val) {
      this.showWarning = val;
    },
    triggerConfirmation(msg) {
        this.confirmationMessage = msg;
        this.showConfirmation = true;
      },
      updateConfirmation(val) {
        this.showConfirmation = val;
      },
    handleTaskAction() {
      if (!this.taskTitle.trim()) {
        this.triggerConfirmation("Task title cannot be empty")
        this.triggerWarning("Task title cannot be empty");
        return;
      } else if (this.taskTitle.trim().length > 30) {
        console.log("Task title cannot exceed 30 characters. POP");
        return;
      }

      if (this.editMode) {
        // If in edit mode, update the existing task
        store.dispatch("updateTodo", {
          id: this.editedTaskId,
          title: this.taskTitle,
        });
        this.taskTitle = ""; // Clear input after updating task
        this.editMode = false; // Exit edit mode
      } else {
        // Check if the task already exists
        if (!store.state.todos.some((todo) => todo.title === this.taskTitle)) {
          store.dispatch("addTodo", this.taskTitle);
          this.taskTitle = ""; // Clear input after adding todo
        } else {
          this.triggerWarning("Task already exists");
        }
      }
    },
    deleteTask(id, title) {
      if (this.editMode) {
        this.triggerWarning("Please complete one action at a time.");
        return;
      }
      store.dispatch("deleteTodo", { id, title });
    },
    changeStatus(id, status) {
      if (this.editMode) {
        this.triggerWarning("Please complete one action at a time.");
        return;
      }
      store.dispatch("changeStatus", { id, status });
    },
    editTask(id, title) {
      if (this.editMode) {
        this.triggerWarning("Please complete one action at a time.");
        return;
      }
      // Set the task title to the input field
      this.taskTitle = title;
      this.editedTaskId = id;
      this.editMode = true;

      // Optionally, you can focus on the input field after setting the title
      this.$nextTick(() => {
        this.$refs.taskInput.focus();
      });
    },
    updateTaskTitle(event) {
      if (this.taskTitle.trim().length > 29) {
        this.triggerWarning("Task title cannot exceed 30 characters.");
        return;
      }
      this.taskTitle = event.target.value;
      // Dispatch updateTodo action to update the task in the Vuex store
      if (this.editMode) {
        store.dispatch("editingTodoTitle", {
          id: this.editedTaskId,
          title: this.taskTitle,
        });
      }
    },
  },
  mounted() {
    // Simulate data loading for demonstration
    setTimeout(() => {
      this.loading = false; // Set loading to false after 3 seconds (data loaded)
    }, 2500);
  },
};
</script>

<style scoped>
.custom-app-bar {
  height: 150px;
}
@media screen and (min-width: 768px) {
  .todo {
    padding: 40px !important;
  }
  .taskTitle {
    padding-left: 40px !important;
  }
}
</style>
