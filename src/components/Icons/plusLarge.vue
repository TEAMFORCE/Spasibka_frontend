<template>
  <div class="plus_large_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 95 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66602 46.9998H88.3327M47.4994 6.1665V87.8332V6.1665Z"
        :stroke="color"
        stroke-width="11.6667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "PlusLargeIcon",
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