<template>
  <div class="battery_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        opacity="0.35"
        x="0.5"
        y="0.833984"
        width="21"
        height="10.3333"
        rx="2.16667"
        :stroke="color"
      />
      <path
        opacity="0.4"
        d="M23 4.00098V8.00098C23.8047 7.6622 24.328 6.87411 24.328 6.00098C24.328 5.12784 23.8047 4.33975 23 4.00098Z"
        :fill="color"
      />
      <rect
        x="2"
        y="2.33398"
        width="18"
        height="7.33333"
        rx="1.33333"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "BatteryIcon",
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