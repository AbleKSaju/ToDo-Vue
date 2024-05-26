<template>
    <div>
      <div>
        <div v-for="index in shimmerRows" :key="index">
          <div class="shimmer-row py-2"  >
            <div class="shimmer" style="height: 50px;"></div>
          </div>
          <v-divider></v-divider>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TodoShimmer",
    data() {
      return {
        loading: true,
        shimmerRows: 5 // Number of shimmer rows to show
      };
    },
    mounted() {
      // Simulate API loading delay
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    methods: {
      // Your existing methods here
    }
  };
  </script>
  
  <style scoped>
  /* Shimmer effect styles */
  .shimmer-row {
    display: flex;
    align-items: center;
  }
  
  .shimmer {
    width: 100%;
    height: 20px; /* Adjust height as needed */
    background-color: #f6f7f8; /* Shimmer color */
    animation: shimmer-animation 1s infinite linear;
  }
  
  @keyframes shimmer-animation {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  </style>
  