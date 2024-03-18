<template>
  <div class="analytics_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.895 7H9.105C8.49472 7 8 7.49472 8 8.105V17.895C8 18.5053 8.49472 19 9.105 19H10.895C11.5053 19 12 18.5053 12 17.895V8.105C12 7.49472 11.5053 7 10.895 7Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.895 1H16.105C15.4947 1 15 1.49473 15 2.105V17.895C15 18.5053 15.4947 19 16.105 19H17.895C18.5053 19 19 18.5053 19 17.895V2.105C19 1.49473 18.5053 1 17.895 1Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 19C4.10457 19 5 18.1046 5 17C5 15.8954 4.10457 15 3 15C1.89543 15 1 15.8954 1 17C1 18.1046 1.89543 19 3 19Z"
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
  name: "AnalyticsIcon",
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