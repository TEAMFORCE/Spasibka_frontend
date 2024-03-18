<template>
  <div class="minus_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 11 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.83317 0H1.1665C0.614219 0 0.166504 0.447715 0.166504 1C0.166504 1.55228 0.614219 2 1.1665 2H9.83317C10.3855 2 10.8332 1.55228 10.8332 1C10.8332 0.447715 10.3855 0 9.83317 0Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "MinusIcon",
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
          "--generalBrand"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>