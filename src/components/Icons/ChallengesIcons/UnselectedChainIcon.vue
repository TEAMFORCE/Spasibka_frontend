<template>
  <div>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" rx="10" :fill="greyColorComputed" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "UnselectedChainIcon",
  props: {
    greyColor: {
      default: null,
    },
  },
  computed: {
    greyColorComputed() {
      if (this.greyColor) {
        return this.greyColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorGrey"
        );
      }
    },
  },
};
</script>
