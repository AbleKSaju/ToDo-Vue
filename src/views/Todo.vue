<template>
  <div class="todo custom-scrollbar">
    <v-list flat  >
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
      <div>
        <div v-if="isMobile && $store.state.todos.length">
          <v-select
            class="px-3"
            :items="itemsStatus"
            density="comfortable"
            label="Filter by"
          ></v-select>
        </div>
        <div v-else-if="$store.state.todos.length" class="filter pb-5">
          <v-btn @click.stop="setFilterStatus('all')">All Tasks</v-btn>
          <div v-if="$store.state.pendingTodo != 0">
            <v-btn @click.stop="setFilterStatus('pending')">Pending</v-btn>
          </div>
          <div v-if="$store.state.completedTodo != 0">
            <v-btn @click.stop="setFilterStatus('completed')">Completed</v-btn>
          </div>
        </div>
      </div>
      <div v-if="!$store.state.isLoaded">
        <Shimmer />
      </div>
      <div v-else-if="$store.state.todos.length > 0">
        <div v-for="task in filteredTodos" :key="task.id">
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
                  <div>
                    <!-- Check if it's a mobile device -->
                    <v-menu v-if="isMobile" class="custom-menu">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          icon="mdi-dots-vertical"
                          v-bind="props"
                        ></v-icon>
                      </template>
                      <v-list class="" style="width: 35vw">
                        <v-list-item
                          v-for="(item, index) in items"
                          :key="index"
                          :value="index"
                          @click="
                            handleMobileAction(item.title, task.id, task.title)
                          "
                        >
                          <v-list-item-title>{{
                            item.title
                          }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <!-- If not mobile, render actions -->
                    <div v-else>
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
                </div>
              </div>
            </template>
          </v-list-item>
          <v-divider />
        </div>
      </div>
      <div v-else>
        <p>
          <v-empty-state
            headline="Add Tasks"
            text="Create a task to stay on top of your schedule."
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLxpJO8mE0K-40tyZ2EpwZGTEGGUu18DV2Jf_OupWBFg&s"
          />
  </p>
      </div>
      <div v-if="filteredTodos.length==0 && $store.state.todos.length > 0">
        <p>
          <v-empty-state
            headline="Whoops"
            title="No Tasks Found"
            text="No result related to the Filter"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnHz-CBCuiuWXsjvUG_XenxmfuZ8HdjMpCqE25WCge6A&s"
          />
</p>
      </div>
    </v-list>
  </div>
  <Warnings
    :show="showWarning"
    :message="warningMessage"
    @update:show="updateWarning"
  />
  <Confirmations
    :show="showConfirmation"
    @update:show="updateConfirmation"
    @confirm="confirmAction"
    :type="confirmationType"
    :message="confirmationMessage"
  />
</template>

<script setup>
import Shimmer from "../components/Shimmer/TodoShimmer.vue";
import Warnings from "../components/Warnings.vue";
import Confirmations from "../components/Confirmation.vue";
</script>
<script>
import store from "@/store";
import { mapGetters } from "vuex";
export default {
  name: "TodoPage",
  data() {
    return {
      isMobile: false, // Assume not mobile initially
      taskTitle: "",
      editMode: false,
      editedTaskId: null,
      loading: true,
      showWarning: false,
      warningMessage: "",
      showConfirmation: false,
      confirmationMessage: "",
      confirmationType: "delete", // Default to delete action
      taskToEdit: null,
      taskToDelete: null,
      items: [{ title: "Delete" }, { title: "Edit" }, { title: "Info" }],
    };
  },
  mounted() {
    // Check if it's a mobile device initially
    this.checkIfMobile();
    // Listen for resize event to adjust isMobile property
    window.addEventListener("resize", this.checkIfMobile);
  },
  beforeUnmount() {
    // Remove the event listener to prevent memory leaks
    window.removeEventListener("resize", this.checkIfMobile);
  },
  computed: {
    itemsStatus() {
      let status = [{ title: "All Tasks" }];
      if (this.$store.state.completedTodo) {
        status.push({ title: "Completed" });
      }
      if (this.$store.state.pendingTodo) {
        status.push({ title: "Pending" });
      }
      return status;
    },
    ...mapGetters(["filteredTodos"]),
  },
  methods: {
    isMobileDevice() {
      // Check viewport width to determine if it's a mobile device
      return window.innerWidth <= 768; // Adjust this value as per your design
    },
    checkIfMobile() {
      // Check viewport width to determine if it's a mobile device
      this.isMobile = window.innerWidth <= 768; // Adjust this value as per your design
    },
    setFilterStatus(status) {
      this.$store.commit("SET_FILTER_STATUS", status);
    },
    triggerWarning(msg) {
      this.warningMessage = msg;
      this.showWarning = true;
      setTimeout(() => {
        this.showWarning = false;
      }, 2500);
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
    handleMobileAction(action, id, title) {
      if (action === "Delete") {
        this.deleteTask(id, title);
      } else if (action === "Edit") {
        this.editTask(id, title);
      } else if (action === "Info") {
        // Handle info action
      }
    },
    handleTaskAction() {
      if (!this.taskTitle.trim()) {
        this.triggerWarning("Task title cannot be empty");
        return;
      } else if (this.taskTitle.trim().length > 30) {
        console.log("Task title cannot exceed 30 characters. POP");
        return;
      }
      let duplicatesCount = store.state.todos.filter(
        (todo) => todo.title === this.taskTitle
      ).length;
      console.log(duplicatesCount, "count");

      if (this.editMode) {
        // If in edit mode, update the existing task
        if (duplicatesCount == 1) {
          store.dispatch("updateTodo", {
            id: this.editedTaskId,
            title: this.taskTitle,
          });
          this.taskTitle = ""; // Clear input after updating task
          this.editMode = false; // Exit edit mode
        } else {
          this.triggerWarning("Task already exists");
        }
      } else {
        // Check if the task already exists
        if (!duplicatesCount) {
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

      this.taskToDelete = { id, title };
      this.confirmationType = "delete";
      this.confirmationMessage = "Do you really want to delete this task?";
      this.showConfirmation = true;
    },
    editTask(id, title) {
      console.log(id, title, "id, title");
      if (this.editMode) {
        this.triggerWarning("Please complete one action at a time.");
        return;
      }
      this.taskToEdit = { id, title };
      this.confirmationType = "edit";
      this.confirmationMessage = "Do you really want to edit this task?";
      this.showConfirmation = true;
    },

    changeStatus(id, status) {
      if (this.editMode) {
        this.triggerWarning("Please complete one action at a time.");
        return;
      }
      store.dispatch("changeStatus", { id, status });
    },
    confirmAction() {
      console.log("confirmActionconfirmAction");
      if (this.confirmationType === "delete") {
        const { id, title } = this.taskToDelete;
        // Dispatch the action to delete the task
        store.dispatch("deleteTodo", { id, title });
      } else if (this.confirmationType === "edit") {
        const { id, title } = this.taskToEdit;
        // Proceed with editing the task
        this.enterEditMode(id, title);
      }
    },
    enterEditMode(id, title) {
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
  // mounted() {
  //   // Simulate data loading for demonstration
  //   setTimeout(() => {
  //     this.loading = false; // Set loading to false after 3 seconds (data loaded)
  //   }, 2500);
  // },
};
</script>

<style scoped>
.custom-app-bar {
  height: 150px;
}
.custom-scrollbar {
  overflow: auto; /* This allows scrolling */
  scrollbar-width: none; /* For Firefox */
}

.custom-scrollbar::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}
@media screen and (min-width: 768px) {
  .todo {
    padding: 40px !important;
  }
  .taskTitle {
    padding-left: 40px !important;
  }
}
.filter {
  display: flex;
  justify-content: space-around;
}
</style>
