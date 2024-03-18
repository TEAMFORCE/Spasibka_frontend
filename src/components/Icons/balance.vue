<template>
  <div class="balance_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 21 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 1H4.5C2.84315 1 1.5 2.34315 1.5 4V12C1.5 13.6569 2.84315 15 4.5 15H16.5C18.1569 15 19.5 13.6569 19.5 12V4C19.5 2.34315 18.1569 1 16.5 1Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.5 11H11.5M1.5 6H19.5H1.5ZM5.5 11H5.51H5.5Z"
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
  name: "BalanceIcon",
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