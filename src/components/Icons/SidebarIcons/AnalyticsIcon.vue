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
        d="M12.895 9H11.105C10.4947 9 10 9.49472 10 10.105V19.895C10 20.5053 10.4947 21 11.105 21H12.895C13.5053 21 14 20.5053 14 19.895V10.105C14 9.49472 13.5053 9 12.895 9Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19.895 3H18.105C17.4947 3 17 3.49473 17 4.105V19.895C17 20.5053 17.4947 21 18.105 21H19.895C20.5053 21 21 20.5053 21 19.895V4.105C21 3.49473 20.5053 3 19.895 3Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 21C6.10457 21 7 20.1046 7 19C7 17.8954 6.10457 17 5 17C3.89543 17 3 17.8954 3 19C3 20.1046 3.89543 21 5 21Z"
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
          "--generalContrast"
        );
      }
    },
  },
};
</script>
