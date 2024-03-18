<template>
  <div class="cart_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 19C4.10457 19 5 18.1046 5 17C5 15.8954 4.10457 15 3 15C1.89543 15 1 15.8954 1 17C1 18.1046 1.89543 19 3 19Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 19C15.1046 19 16 18.1046 16 17C16 15.8954 15.1046 15 14 15C12.8954 15 12 15.8954 12 17C12 18.1046 12.8954 19 14 19Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 15H3V1H1"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 3L17 4L16 11H3"
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
  name: "CartIcon",
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