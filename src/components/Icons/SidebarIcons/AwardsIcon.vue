<template>
  <div>
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 15V18"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M14.5 21H7.5L7.84 19.304C7.88529 19.0774 8.00768 18.8735 8.18634 18.7269C8.365 18.5803 8.58891 18.5001 8.82 18.5H13.18C13.4111 18.5001 13.635 18.5803 13.8137 18.7269C13.9923 18.8735 14.1147 19.0774 14.16 19.304L14.5 21Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18 4L18.949 4.316C19.939 4.646 20.434 4.811 20.717 5.204C21 5.597 21 6.119 21 7.162V7.235C21 8.095 21 8.526 20.793 8.878C20.586 9.23 20.209 9.439 19.457 9.858L16.5 11.5M4 4L3.051 4.316C2.061 4.646 1.566 4.811 1.283 5.204C1 5.597 1 6.12 1 7.162V7.235C1 8.095 1 8.526 1.207 8.878C1.414 9.23 1.791 9.439 2.543 9.858L5.5 11.5"
        :stroke="color"
        stroke-width="2"
      />
      <path
        d="M17 21H5.00003M16 1.456C16.741 1.597 17.181 1.753 17.56 2.221C18.037 2.807 18.012 3.44 17.961 4.706C17.781 9.259 16.761 15 11.001 15C5.24103 15 4.22003 9.25999 4.03803 4.706C3.98803 3.44 3.96303 2.806 4.43803 2.221C4.91403 1.635 5.48303 1.539 6.62203 1.347C8.06918 1.10982 9.53359 0.993747 11 0.999995C11.718 0.999995 12.386 1.025 13 1.068"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "AwardsIcon",
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
