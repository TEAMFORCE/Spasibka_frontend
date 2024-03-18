<template>
  <div>
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.7 0H3.3V4.4V8.8H0L1.1 13.2H3.3V17.6V22H7.7H11.55C17.3214 22 22 17.3214 22 11.55V10.45C22 4.67863 17.3214 0 11.55 0H7.7ZM7.7 13.2V17.6H11.55C11.7354 17.6 11.9189 17.5917 12.1 17.5753C15.1836 17.2975 17.6 14.7059 17.6 11.55V10.45C17.6 7.29408 15.1836 4.70254 12.1 4.42466C11.9189 4.40834 11.7354 4.4 11.55 4.4H7.7V8.8H9.9L11 13.2H7.7Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "ThanksPriceIcon",
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

<style lang="scss" scoped></style>
