<template>
  <div>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.66634 12.6673C8.66634 12.2991 8.36786 12.0007 7.99967 12.0007C7.63148 12.0007 7.33301 12.2991 7.33301 12.6673C7.33301 13.0355 7.63148 13.334 7.99967 13.334C8.36786 13.334 8.66634 13.0355 8.66634 12.6673Z"
        :fill="color"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.66634 8.0013C8.66634 7.63311 8.36786 7.33464 7.99967 7.33464C7.63148 7.33464 7.33301 7.63311 7.33301 8.0013C7.33301 8.36949 7.63148 8.66797 7.99967 8.66797C8.36786 8.66797 8.66634 8.36949 8.66634 8.0013Z"
        :fill="color"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.66634 3.33333C8.66634 2.96514 8.36786 2.66667 7.99967 2.66667C7.63148 2.66667 7.33301 2.96514 7.33301 3.33333C7.33301 3.70152 7.63148 4 7.99967 4C8.36786 4 8.66634 3.70152 8.66634 3.33333Z"
        :fill="color"
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
  name: "SurveyOptionsIcon",
  props: {
    defaultColor: {
      default: null,
    },
  },
  computed: {
    color() {
      if (this.defaultColor) {
        return this.defaultColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
  },
};
</script>
