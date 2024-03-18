<template>
  <div class="like_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.3197 7.96697C14.653 7.03364 14.053 6.23364 13.053 6.23364H10.3863C9.98633 6.23364 9.65299 5.9003 9.71966 5.43364L10.053 3.3003C10.1863 2.7003 9.78633 2.03364 9.18633 1.83364C8.65299 1.63364 7.98633 1.9003 7.71966 2.3003L4.98633 6.36697"
        :stroke="color"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.98633 12.2336L7.05299 13.8336C7.31966 14.1003 7.91966 14.2336 8.31966 14.2336H10.853C11.653 14.2336 12.5197 13.6336 12.7197 12.8336L13.5463 10.3203"
        :stroke="color"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.58691 12.2336V5.70026C1.58691 4.76693 1.98691 4.43359 2.92025 4.43359H3.58691C4.52025 4.43359 4.92025 4.76693 4.92025 5.70026V12.2336C4.92025 13.1669 4.52025 13.5003 3.58691 13.5003H2.92025C1.98691 13.5003 1.58691 13.1669 1.58691 12.2336Z"
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
  name: "LikeIcon",
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

<style lang="scss" scoped>
</style>