// store/index.js
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/../config/firebase.js";
import { createStore } from 'vuex';

export default createStore({
  state: {
    completedTodo:0,
    pendingTodo:0,
    todos: [],
    isLoaded: false, // Flag to track whether todos have been loaded
    filterStatus: 'all'
  },
  getters: {
    allTodos: state => state.todos,
    filteredTodos: state => {
        if (state.filterStatus === 'completed') {
          return state.todos.filter(todo => todo.status === true);
        } else if (state.filterStatus === 'pending') {
          return state.todos.filter(todo => todo.status === false);
        }
        return state.todos; // For 'all' and any other case, return all todos
      }
  },
  actions: {
    fetchTodos({ commit , state }) {
        // Listen for changes to todos only once
        console.log(state.isLoaded,"state.isLoaded");
      if (!state.isLoaded) {
        console.log("ENTT");
        onSnapshot(collection(db, "Todos"), (querySnapshot) => {
          let fbTodos = [];
          querySnapshot.forEach(doc => {
            const todo = {
              id: doc.id,
              title: doc.data().title,
              status: doc.data().status,
              createAt: doc.data().createAt,
            };
            console.log(todo,"todotodo");
            fbTodos.push(todo);
          });
          fbTodos = fbTodos.sort((a,b)=>b.createAt-a.createAt)
          console.log(fbTodos,"fbTodos");
          commit('SET_TODOS', fbTodos);
          commit('SET_LOADED', true); // Set the loaded flag to true after fetching todos
        }, error => {
          console.error("Error fetching todos:", error);
        });
      }
    },
    async addTodo(_, title) {
      try {
        const createAt = Date.now()
        await addDoc(collection(db, 'Todos'), {
          title,
          status: false,
          createAt
        });
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    },
    async updateTodo({ state }, { id, title }) {
        try {
            const index = state.todos.findIndex(todo => todo.id === id && todo.status !== status);
            if (index !== -1) {
              const updateData = {
                title: title,
                updatedAt:Date.now()
              };
              await updateDoc(doc(db, 'Todos', id), updateData);
            }
        } catch (error) {
          console.error("Error updating todo: ", error);
        }
      },
    editingTodoTitle({ commit }, { id, title }) {
      commit('EDIT_TODO_TITLE', { id, title });
    },
    async deleteTodo({ state }, { id, title }) {
        try {
          // Find the index of the todo in the state array based on ID and title
          const index = state.todos.findIndex(todo => todo.id === id && todo.title === title);
          if (index !== -1) {
            // Delete the todo from Firebase
            await deleteDoc(doc(db, 'Todos', id));
          }
        } catch (error) {
          console.error("Error deleting todo: ", error);
        }
      },
      async changeStatus({ state }, { id, status }) {
        try {
          const index = state.todos.findIndex(todo => todo.id === id && todo.status !== status);
          if (index !== -1) {
            const updateData = {
              status: status,
            };
            if (status) {
              updateData.completedAt = Date.now();
            } else {
              updateData.completedAt = null; // Remove completedAt if status is false
            }
            await updateDoc(doc(db, 'Todos', id), updateData);
          }
        } catch (error) {
          console.error("Error updating status:", error);
        }
      },
  },
  mutations: {
    SET_TODOS(state, todos) {
      state.todos = todos;
      state.completedTodo = state.todos.filter((todo) => todo.status === true).length;
      state.pendingTodo = state.completedTodo - state.todos.length
    },
    SET_LOADED(state, value) {
      state.isLoaded = value;
    },
    EDIT_TODO_TITLE(state, { id, title }) {
        const todoIndex = state.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
          state.todos[todoIndex].title = title;
        }
      },
      SET_FILTER_STATUS(state, status) {
        state.filterStatus = status;
      }
  },
  
  modules: {},
});
