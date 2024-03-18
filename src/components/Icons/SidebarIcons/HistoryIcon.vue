<template>
  <div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8V12L14 14"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.05078 20V15H8.05078M3.05078 11C3.27487 8.80006 4.30105 6.75962 5.93351 5.26797C7.56598 3.77633 9.69048 2.93789 11.9017 2.91264C14.1128 2.88738 16.2559 3.67707 17.922 5.13104C19.5882 6.58501 20.6607 8.60149 20.935 10.7957C21.2092 12.99 20.6661 15.2084 19.4091 17.0278C18.1522 18.8471 16.2694 20.14 14.1201 20.6599C11.9707 21.1797 9.70519 20.89 7.75578 19.8461C5.80636 18.8022 4.3095 17.0771 3.55078 15L3.05078 11Z"
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
  name: "HistoryIcon",
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
          "--generalContrast"
        );
      }
    },
  },
};
</script>
