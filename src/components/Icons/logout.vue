<template>
  <div class="logout_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V3C12 2.46957 11.7893 1.96086 11.4142 1.58579C11.0391 1.21071 10.5304 1 10 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H10C10.5304 17 11.0391 16.7893 11.4142 16.4142C11.7893 16.0391 12 15.5304 12 15V13"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 9H19L16 6M16 12L19 9"
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
  name: "LogoutIcon",
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