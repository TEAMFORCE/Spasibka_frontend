<template>
  <div>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.66536 12.6666C8.66536 12.2985 8.36689 12 7.9987 12C7.63051 12 7.33203 12.2985 7.33203 12.6666C7.33203 13.0348 7.63051 13.3333 7.9987 13.3333C8.36689 13.3333 8.66536 13.0348 8.66536 12.6666Z"
        fill="#F15929"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.66536 7.99996C8.66536 7.63177 8.36689 7.33329 7.9987 7.33329C7.63051 7.33329 7.33203 7.63177 7.33203 7.99996C7.33203 8.36815 7.63051 8.66663 7.9987 8.66663C8.36689 8.66663 8.66536 8.36815 8.66536 7.99996Z"
        fill="#F15929"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.66536 3.33333C8.66536 2.96514 8.36689 2.66667 7.9987 2.66667C7.63051 2.66667 7.33203 2.96514 7.33203 3.33333C7.33203 3.70152 7.63051 4 7.9987 4C8.36689 4 8.66536 3.70152 8.66536 3.33333Z"
        fill="#F15929"
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
  name: "ScaleParamtersIcon",
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
