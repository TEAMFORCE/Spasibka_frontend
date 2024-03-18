<template>
  <div>
    <svg
      width="31"
      height="31"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 27.125C21.9203 27.125 27.125 21.9203 27.125 15.5C27.125 9.07969 21.9203 3.875 15.5 3.875C9.07969 3.875 3.875 9.07969 3.875 15.5C3.875 21.9203 9.07969 27.125 15.5 27.125Z"
        :stroke="minorSuccess"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.5 27.125C21.9203 27.125 27.125 21.9203 27.125 15.5C27.125 9.07969 21.9203 3.875 15.5 3.875C9.07969 3.875 3.875 9.07969 3.875 15.5C3.875 21.9203 9.07969 27.125 15.5 27.125Z"
        :stroke="generalContrast"
        stroke-opacity="0.2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.5 27.125C21.9203 27.125 27.125 21.9203 27.125 15.5C27.125 9.07969 21.9203 3.875 15.5 3.875C9.07969 3.875 3.875 9.07969 3.875 15.5C3.875 21.9203 9.07969 27.125 15.5 27.125Z"
        :stroke="generalContrast"
        stroke-opacity="0.2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.625 15.5L14.2083 18.0833L19.375 12.9167"
        :stroke="minorSuccess"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.625 15.5L14.2083 18.0833L19.375 12.9167"
        :stroke="generalContrast"
        stroke-opacity="0.2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.625 15.5L14.2083 18.0833L19.375 12.9167"
        :stroke="generalContrast"
        stroke-opacity="0.2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "AwardReceivedIcon",
  props: {
    generalContrastColor: {
      default: null,
    },
    minorSuccessColor: {
      default: null,
    },
  },
  computed: {
    generalContrast() {
      if (this.generalContrastColor) {
        return this.generalContrastColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalContrast"
        );
      }
    },
    minorSuccess() {
      if (this.minorSuccessColor) {
        return this.minorSuccessColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--minorSuccess"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
