<template>
  <div class="copy_icon">
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 20C1.95 20 1.479 19.804 1.087 19.412C0.695002 19.02 0.499335 18.5493 0.500002 18V5C0.500002 4.71667 0.596002 4.479 0.788002 4.287C0.980002 4.095 1.21733 3.99934 1.5 4C1.78333 4 2.021 4.096 2.213 4.288C2.405 4.48 2.50067 4.71734 2.5 5V18H12.5C12.7833 18 13.021 18.096 13.213 18.288C13.405 18.48 13.5007 18.7173 13.5 19C13.5 19.2833 13.404 19.521 13.212 19.713C13.02 19.905 12.7827 20.0007 12.5 20H2.5ZM6.5 16C5.95 16 5.479 15.804 5.087 15.412C4.695 15.02 4.49934 14.5493 4.5 14V2C4.5 1.45 4.696 0.979002 5.088 0.587002C5.48 0.195002 5.95067 -0.000664969 6.5 1.69779e-06H15.5C16.05 1.69779e-06 16.521 0.196002 16.913 0.588002C17.305 0.980002 17.5007 1.45067 17.5 2V14C17.5 14.55 17.304 15.021 16.912 15.413C16.52 15.805 16.0493 16.0007 15.5 16H6.5ZM6.5 14H15.5V2H6.5V14Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "CopyLinkIcon",
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

<style scoped>
.copy_icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
