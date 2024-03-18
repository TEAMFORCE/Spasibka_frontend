<template>
  <div class="currency_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.5 0H1.5V2V4H0L0.5 6H1.5V8V10H3.5H5.25C7.87335 10 10 7.87335 10 5.25V4.75C10 2.12665 7.87335 0 5.25 0H3.5ZM3.5 6V8H5.25C5.33427 8 5.41766 7.99621 5.5 7.98879C6.90162 7.86248 8 6.68451 8 5.25V4.75C8 3.31549 6.90162 2.13752 5.5 2.01121C5.41766 2.00379 5.33427 2 5.25 2H3.5V4H4.5L5 6H3.5Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "CurrencyIcon",
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