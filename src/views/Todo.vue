// Home.
<template>
  <div class="pl-2">
    <v-list flat>
      <div class="d-flex align-center pr-2">
        <v-text-field
          v-model="taskTitle"
          @keyup.enter="handleTaskAction"
          @input="updateTaskTitle"
          class="pa-3"
          label="Add Task"
          variant="outlined"
          hide-details
          ref="taskInput"
          clearable
          maxlength="30"
        >
        </v-text-field>
        <v-btn @click="handleTaskAction" icon>
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </div>
      <div v-for="task in $store.state.todos" :key="task.id">
        <v-list-item
          @click="changeStatus(task.id, !task.status)"
          :style="{ backgroundColor: task.status ? '#ebf9fc' : '' }"
        >
          <template v-slot:default>
            <div class="d-flex align-center">
              <v-list-item-action>
                <v-checkbox-btn
                  v-model="task.status"
                  :disabled=" editMode"
                ></v-checkbox-btn>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
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
        <v-divider></v-divider>
      </div>
    </v-list>
  </div>
</template>
<script>
import store from "@/store";

export default {
  name: "TodoPage",
  data() {
    return {
      taskTitle: "",
      editMode: false,
      editedTaskId: null,
    };
  },
  methods: {
    handleTaskAction() {
      if (!this.taskTitle.trim()) {
        console.log("Task title cannot be empty. POP");
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
          console.log("Task already exists.");
        }
      }
    },
    deleteTask(id, title) {
      if (this.editMode) {
        console.log("POP");
        return;
      }
      store.dispatch("deleteTodo", { id, title });
    },
    changeStatus(id, status) {
      if (this.editMode) {
        console.log("POP");
        return;
      }
      store.dispatch("changeStatus", { id, status });
    },
    editTask(id, title) {
      if (this.editMode) {
        console.log("POP");
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
        console.log("Task title cannot exceed 30 characters. POP");
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
};
</script>

<style scoped>
.custom-app-bar {
  height: 150px;
}
</style>
