// Home.
<template>
  <div class="pl-2">
    <v-list flat>
      <div class="d-flex align-center pr-2">
        <v-text-field
        v-model="taskTitle"
        @keyup.enter="addTask"
          class="pa-3"
          label="Add Task"
          variant="outlined"
          hide-details
          clearable
        >
        </v-text-field>
        <v-btn
        @click="addTask"
        icon>
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </div>
      <div v-for="task in tasks" :key="task.id">
        <v-list-item
          @click="changeStatus(task.id)"
          :style="{ backgroundColor: task.status ? '#ebf9fc' : '' }"
        >
          <template v-slot:default>
            <div class="d-flex align-center">
              <v-list-item-action>
                <v-checkbox-btn v-model="task.status"></v-checkbox-btn>
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
                  <v-icon @click.stop="deleteTask(task.id)" color="#45494a"
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
export default {
  name: "TodoPage",
  data() {
    return {
      taskTitle:'',
      tasks: [
        {
          id: 1,
          title: "Wake Up",
          status: false,
        },
        {
          id: 2,
          title: "Food",
          status: false,
        },
        {
          id: 3,
          title: "Coding",
          status: true,
        },
        {
          id: 4,
          title: "Sleep",
          status: true,
        },
      ],
    };
  },
  methods: {
    addTask(){
      let newTask={
        id:Date.now(),
        title:this.taskTitle,
        status:false
      }
      this.tasks.push(newTask)
    },
    changeStatus(id) {
      let task = this.tasks.filter((task) => task.id === id)[0];
      task.status = !task.status;
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    },
  },
};
</script>
<style scoped>
.custom-app-bar {
  height: 150px; /* Adjust the height as needed */
}
</style>
