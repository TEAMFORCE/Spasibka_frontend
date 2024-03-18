<template>
  <div>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="2" fill="white" />
      <rect
        x="0.5"
        y="0.5"
        width="15"
        height="15"
        rx="7.5"
        :fill="generalWhiteColor"
        :stroke="generalGreyColor"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "OptionDeselectedInVotingCreationIcon",
  props: {
    defaultWhiteColor: {
      default: null,
    },
    defaultGreyColor: {
      default: null
    }
  },
  computed: {
    generalWhiteColor() {
      if (this.defaultWhiteColor) {
        return this.defaultWhiteColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorWhite"
        );
      }
    },
    generalGreyColor() {
      if (this.defaultGreyColor) {
        return this.defaultGreyColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorGrey"
        );
      }
    },
  },
};
</script>
