<template>
  <div class="analytics_icon">
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
        d="M15.9994 2.66687C23.3727 2.66687 29.3327 8.62687 29.3327 16.0002C29.3327 23.3735 23.3727 29.3335 15.9994 29.3335C8.62602 29.3335 2.66602 23.3735 2.66602 16.0002C2.66602 8.62687 8.62602 2.66687 15.9994 2.66687ZM20.786 9.33354L15.9993 14.1202L11.2127 9.33354L9.33268 11.2135L14.1193 16.0002L9.33268 20.7869L11.2127 22.6669L15.9993 17.8802L20.786 22.6669L22.666 20.7869L17.8793 16.0002L22.666 11.2135L20.786 9.33354Z"
        :fill="color"
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
          "--generalColorSecondary"
        );
      }
    },
  },
};
</script>
