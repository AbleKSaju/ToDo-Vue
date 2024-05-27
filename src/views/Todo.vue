<template>
  <div class="todo custom-scrollbar">
    <v-list flat>
      <div class="d-flex align-center pb-3 pr-2">
        <v-text-field v-model="taskTitle" @keyup.enter="handleTaskAction" @input="updateTaskTitle" class="px-3" label="Add Task" variant="outlined" hide-details ref="taskInput" clearable maxlength="30"/>
        <v-btn @click="handleTaskAction" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
        <div v-if="isMobile && $store.state.todos.length">
          <v-select :items="itemsStatus" item-title="title" label="Filter by">
            <template v-slot:item="{ props, item }">
              <v-list-item
                @click="handleFilterChange(item.raw.title)"
                v-bind="props"
              ></v-list-item>
            </template>
          </v-select>
        </div>
        <div v-else-if="$store.state.todos.length" class="filter py-5">
          <v-btn @click.stop="setFilterStatus('all')">All Tasks</v-btn>
          <div v-if="$store.state.pendingTodo != 0">
            <v-btn @click.stop="setFilterStatus('pending')">Pending</v-btn>
          </div>
          <div v-if="$store.state.completedTodo != 0">
            <v-btn @click.stop="setFilterStatus('completed')">Completed</v-btn>
          </div>
        </div>
      <div v-if="!$store.state.isLoaded"> <Shimmer /> </div>
      <div v-else-if="$store.state.todos.length > 0">
        <div v-for="task in filteredTodos" :key="task.id">
          <v-list-item class="py-2" @click="changeStatus(task.id, !task.status)" :style="{ backgroundColor: task.status ? '#ebf9fc' : '' }">
            <template v-slot:default>
              <div class="d-flex align-center">
                <v-list-item-action>
                  <v-checkbox-btn v-model="task.status" :disabled="editMode" />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="taskTitle" :class="{ 'text-decoration-line-through': task.status }">
                    <div v-if="isMobile">
                      {{ task.title.length > 25  ? task.title.slice(0, 25) + "..."  : task.title }}
                    </div>
                    <div v-else> {{ task.title }} </div>
                  </v-list-item-title>
                </v-list-item-content>
                <div class="ml-auto">
                  <!-- Check if it's a mobile device -->
                    <v-menu v-if="isMobile" class="custom-menu" cssClass="e-cret-hide">
                      <template v-slot:activator="{ props }">
                        <v-icon icon="mdi-dots-vertical" v-bind="props"></v-icon>
                      </template>
                      <v-list style="width: 35vw">
                        <v-list-item v-for="(item, index) in items" :key="index" :value="index" @click="handleMobileAction(item.title, task, index)">
                          <v-list-item-title> {{ item.title }} </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  <!-- If not mobile, render actions -->
                    <v-list-action v-else class="mx-2" v-for="(item, index) in items" :key="index">
                      <v-icon v-if="item.title === 'Info'" @click.stop="(infoDialog = true),handleMobileAction(item.title, task)" color="#45494a"
                        >mdi-information</v-icon>
                      <v-icon v-else @click.stop="handleMobileAction(item.title, task)" color="#45494a" >{{ getIcon(item.title) }}</v-icon>
                    </v-list-action>
                </div>
              </div>
            </template>
          </v-list-item>
          <v-divider />
        </div>
      </div>
      <div v-else>
          <v-empty-state class="mt-10" headline="Add Tasks"
            text="Create a task to stay on top of your schedule."
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLxpJO8mE0K-40tyZ2EpwZGTEGGUu18DV2Jf_OupWBFg&s"
          />
      </div>
      <div v-if="filteredTodos.length == 0 && $store.state.todos.length > 0">
          <v-empty-state headline="Whoops" title="No Tasks Found"
            text="No result related to the Filter"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnHz-CBCuiuWXsjvUG_XenxmfuZ8HdjMpCqE25WCge6A&s"
          />
      </div>
    </v-list>
  </div>
  <Warnings :show="showWarning" :message="warningMessage" @update:show="updateWarning"/>
  <Confirmations :show="showConfirmation" @update:show="updateConfirmation" @confirm="confirmAction" :type="confirmationType" :message="confirmationMessage"/>
  <TaskInfo v-model:infoDialog="infoDialog" :task="selectedTask" />
</template>

<script setup>
import Shimmer from "../components/Shimmer/TodoShimmer.vue";
import Warnings from "../components/Warnings.vue";
import Confirmations from "../components/Confirmation.vue";
import TaskInfo from "../components/TaskInfo.vue";
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
      showWarning: false,
      warningMessage: "",
      showConfirmation: false,
      confirmationMessage: "",
      confirmationType: "delete", // Default to delete action
      taskToEdit: null,
      taskToDelete: null,
      infoDialog: false,
      selectedTask: null,
      items: [{ title: "Delete" }, { title: "Edit" }, { title: "Info" }],
      selectedFilter: "all", // Initial selected value
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
    handleFilterChange(value) {
      if (value === "All Tasks") {
        this.setFilterStatus("all");
      } else if (value === "Completed") {
        this.setFilterStatus("completed");
      } else if (value === "Pending") {
        this.setFilterStatus("pending");
      }
    },
    getIcon(action) {
      // Return appropriate icon based on action
      if (action === "Delete") return "mdi-delete";
       else if (action === "Edit")return "mdi-square-edit-outline";
    },
    handleTaskSelection(task) {
      this.selectedTask = task;
    },
    closeDialog() {
      this.selectedTask = null;
      this.infoDialog = false;
    },
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
      }, 2000);
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
    handleMobileAction(action, task) {
      if (action === "Delete") {
        this.deleteTask(task.id, task.title);
      } else if (action === "Edit") {
        this.editTask(task.id, task.title);
      } else if (action === "Info") {
        this.handleTaskSelection(task); // Call handleTaskSelection with the selected task
        this.infoDialog = true;
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
      if (this.editMode) {
        if (duplicatesCount == 1) {        // If in edit mode, update the existing task
          store.dispatch("updateTodo", {
            id: this.editedTaskId,
            title: this.taskTitle,
          });
          this.taskTitle = ""; // Clear input after updating task
          this.editMode = false; // Exit edit mode
          this.triggerWarning("Task edited success");
        } else {
          this.triggerWarning("Task already exists");
        }
      } else {
        if (!duplicatesCount) {
          store.dispatch("addTodo", this.taskTitle);
          this.taskTitle = ""; // Clear input after adding todo
          this.triggerWarning("Task added success");
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
        this.triggerWarning("Task deleted success");
      } else if (this.confirmationType === "edit") {
        const { id, title } = this.taskToEdit;
        this.enterEditMode(id, title);   // Proceed with editing the task
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
.filter {
  display: flex;
  justify-content: space-around;
}
</style>