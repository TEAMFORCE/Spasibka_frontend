<template>
  <div>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" rx="6" :fill="brandColorComputed" />
      <rect
        x="5.41406"
        y="8.65625"
        width="6"
        height="2"
        transform="rotate(45 5.41406 8.65625)"
        :fill="whiteColorComputed"
      />
      <rect
        x="6.82812"
        y="12.9004"
        width="10"
        height="2"
        transform="rotate(-45 6.82812 12.9004)"
        :fill="whiteColorComputed"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SelectedChallengeIcon",
  props: {
    brandColor: {
      default: null,
    },
    whiteColor: {
      default: null,
    },
  },
  computed: {
    brandColorComputed() {
      if (this.brandColor) {
        return this.brandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
    whiteColorComputed() {
      if (this.whiteColor) {
        return this.whiteColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorWhite"
        );
      }
    },
  },
};
</script>
