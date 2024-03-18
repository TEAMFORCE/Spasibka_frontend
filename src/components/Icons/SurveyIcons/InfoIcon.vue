<template>
  <div>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99984 6.66602H10.0082M9.1665 9.99935H9.99984V13.3327H10.8332"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "InfoIcon",
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
          "--generalColorGrey"
        );
      }
    },
  },
};
</script>
