<template>
  <div class="taking_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="6.5" :stroke="color" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "TakingIcon",
  props: {
    currentColor: {
      default: null,
    },
  },
  computed: {
    color() {
      if (this.currentColor) {
        return this.currentColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--minorWarning"
        );
      }
    },
  },
};
</script>

<style scoped>
</style>