<template>
  <div>
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4493 7.05078L7.5498 16.9503M7.5498 7.05078L17.4493 16.9503"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "DeleteSurveyIcon",
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
          "--generalContrast"
        );
      }
    },
  },
};
</script>
