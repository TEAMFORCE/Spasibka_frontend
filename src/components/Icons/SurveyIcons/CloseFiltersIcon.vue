<template>
  <div>
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.9994 2.66797C23.3727 2.66797 29.3327 8.62797 29.3327 16.0013C29.3327 23.3746 23.3727 29.3346 15.9994 29.3346C8.62602 29.3346 2.66602 23.3746 2.66602 16.0013C2.66602 8.62797 8.62602 2.66797 15.9994 2.66797ZM20.786 9.33464L15.9993 14.1213L11.2127 9.33464L9.33268 11.2146L14.1193 16.0013L9.33268 20.788L11.2127 22.668L15.9993 17.8813L20.786 22.668L22.666 20.788L17.8793 16.0013L22.666 11.2146L20.786 9.33464Z"
        fill="#A6A6A6"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "CloseFiltersIcon",
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
          "--secondaryColorBrand"
        );
      }
    },
  },
};
</script>
