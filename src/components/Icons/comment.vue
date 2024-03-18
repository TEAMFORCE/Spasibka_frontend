<template>
  <div class="comment_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 12.3331L1.86667 9.73306C1.11763 8.62525 0.846662 7.31334 1.10415 6.04126C1.36163 4.76919 2.13004 3.62351 3.26651 2.81724C4.40298 2.01098 5.83017 1.59899 7.28273 1.65789C8.73528 1.71678 10.1143 2.24255 11.1635 3.13743C12.2127 4.03232 12.8606 5.23542 12.9867 6.52305C13.1128 7.81068 12.7086 9.09521 11.8492 10.1378C10.9899 11.1804 9.73377 11.9101 8.31453 12.1913C6.89529 12.4725 5.40947 12.2859 4.13333 11.6664L1 12.3331Z"
        :stroke="color"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "CommentIcon",
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