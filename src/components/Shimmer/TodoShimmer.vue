<template>
    <div>
        <div class="filter-shimmer pb-5">
    <div class="shimmer-button"></div>
    <div class="shimmer-button" v-if="hasPending"></div>
    <div class="shimmer-button" v-if="hasCompleted"></div>
  </div>
      <div v-for="index in shimmerRows" :key="index">
        <div class="shimmer-row py-2">
          <div class="shimmer"></div>
        </div>
        <v-divider></v-divider>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TodoShimmer",
    data() {
      return {
        loading: true,
        shimmerRows: 5, // Number of shimmer rows to show
        hasPending: true,  // Simulate presence of pending tasks
        hasCompleted: true // Simulate presence of completed tasks
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
    flex-direction: column;
  }
  .filter-shimmer {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  
}

.shimmer-button {
  width: 100px; /* Adjust width as needed */
  height: 36px;  /* Adjust height to match your button size */
  background: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 200% 100%;
  animation: shimmer-animation 1.5s infinite linear;
  border-radius: 4px; /* Rounded corners for better look */
}

@keyframes shimmer-animation {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
  .shimmer {
    width: 100%;
    height: 50px; /* Default height */
    background: linear-gradient(
      to right,
      #f6f7f8 0%,
      #edeef1 20%,
      #f6f7f8 40%,
      #f6f7f8 100%
    );
    background-size: 200% 100%;
    animation: shimmer-animation 1.5s infinite linear;
    border-radius: 4px; /* Rounded corners for better look */
  }
  
  @keyframes shimmer-animation {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  /* Responsive styles */
  @media (max-width: 600px) {
    .shimmer {
      height: 40px; /* Adjust height for smaller screens */
    }
  }
  
  @media (min-width: 600px) and (max-width: 960px) {
    .shimmer {
      height: 45px; /* Adjust height for medium screens */
    }
  }
  
  @media (min-width: 960px) {
    .shimmer {
      height: 50px; /* Default height for larger screens */
    }
  }
  </style>
  