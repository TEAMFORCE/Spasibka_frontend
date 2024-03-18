<template>
  <div>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="8" :fill="generalWhiteColor" />
      <rect width="16" height="16" rx="8" :fill="generalBrandColor" />
      <path
        d="M7.10497 12.6041L7.08735 12.6217L2.6875 8.22185L4.12018 6.78917L7.10502 9.77402L11.879 5L13.3117 6.43268L7.12264 12.6218L7.10497 12.6041Z"
        :fill="generalWhiteColor"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "OptionSelectedInVotingCreationIcon",
  props: {
    defaultWhiteColor: {
      default: null,
    },
    defaultBrandColor: {
      default: null,
    },
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
    generalBrandColor() {
      if (this.defaultBrandColor) {
        return this.defaultBrandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
  },
};
</script>
