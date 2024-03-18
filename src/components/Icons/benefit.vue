<template>
  <div class="benefit_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 5.99995V18.9999M17 9.99995V16.9999C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7892 15.5304 18.9999 15 18.9999H5C4.46957 18.9999 3.96086 18.7892 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 16.9999V9.99995M5.5 5.99995C4.83696 5.99995 4.20107 5.73656 3.73223 5.26772C3.26339 4.79887 3 4.16299 3 3.49995C3 2.83691 3.26339 2.20102 3.73223 1.73218C4.20107 1.26334 4.83696 0.999949 5.5 0.999949C6.46469 0.983141 7.41003 1.45121 8.21274 2.34311C9.01545 3.23501 9.63828 4.50935 10 5.99995C10.3617 4.50935 10.9846 3.23501 11.7873 2.34311C12.59 1.45121 13.5353 0.983141 14.5 0.999949C15.163 0.999949 15.7989 1.26334 16.2678 1.73218C16.7366 2.20102 17 2.83691 17 3.49995C17 4.16299 16.7366 4.79887 16.2678 5.26772C15.7989 5.73656 15.163 5.99995 14.5 5.99995"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18 6H2C1.44772 6 1 6.44772 1 7V9C1 9.55228 1.44772 10 2 10H18C18.5523 10 19 9.55228 19 9V7C19 6.44772 18.5523 6 18 6Z"
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
  name: "BenefitIcon",
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