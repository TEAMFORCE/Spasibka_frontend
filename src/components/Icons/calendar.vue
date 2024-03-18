<template>
  <div class="calendar_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3475 2.0874H2.6166C1.905 2.0874 1.32812 2.66427 1.32812 3.37588V11.1068C1.32812 11.8184 1.905 12.3952 2.6166 12.3952H10.3475C11.0591 12.3952 11.636 11.8184 11.636 11.1068V3.37588C11.636 2.66427 11.0591 2.0874 10.3475 2.0874Z"
        :stroke="color"
        stroke-width="1.28848"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.059 0.798828V3.37579M3.90508 0.798828V3.37579M1.32812 5.95275H11.636M5.8378 8.52971H6.48204M6.48204 8.52971V10.4624"
        :stroke="color"
        stroke-width="1.28848"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "CalendarIcon",
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