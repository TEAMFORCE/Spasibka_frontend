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
        d="M8.66536 12.6668C8.66536 12.2986 8.36689 12.0002 7.9987 12.0002C7.63051 12.0002 7.33203 12.2986 7.33203 12.6668C7.33203 13.035 7.63051 13.3335 7.9987 13.3335C8.36689 13.3335 8.66536 13.035 8.66536 12.6668Z"
        :fill="color"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.66536 8.00033C8.66536 7.63214 8.36689 7.33366 7.9987 7.33366C7.63051 7.33366 7.33203 7.63214 7.33203 8.00033C7.33203 8.36852 7.63051 8.66699 7.9987 8.66699C8.36689 8.66699 8.66536 8.36852 8.66536 8.00033Z"
        :fill="color"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.66536 3.33333C8.66536 2.96514 8.36689 2.66667 7.9987 2.66667C7.63051 2.66667 7.33203 2.96514 7.33203 3.33333C7.33203 3.70152 7.63051 4 7.9987 4C8.36689 4 8.66536 3.70152 8.66536 3.33333Z"
        :fill="color"
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
  name: "TelegramGroupOptionsIcon",
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
