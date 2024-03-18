<template>
  <div>
    <svg
      width="18"
      height="9"
      viewBox="0 0 18 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2" cy="1.5" r="1.5" :fill="color" />
      <circle cx="9" cy="1.5" r="1.5" :fill="color" />
      <circle cx="16" cy="1.5" r="1.5" :fill="color" />
      <circle cx="2" cy="7.5" r="1.5" :fill="color" />
      <circle cx="9" cy="7.5" r="1.5" :fill="color" />
      <circle cx="16" cy="7.5" r="1.5" :fill="color" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "FilterIcon",
  props: {
    defaultColor: {
      default: null,
    },
  },
  computed: {
    color() {
      if (this.defaultColor) {
        return this.defaultColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorGrey"
        );
      }
    },
  },
};
</script>
