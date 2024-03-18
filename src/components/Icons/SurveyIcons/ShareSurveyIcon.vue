<template>
  <div>
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 22C4.95 22 4.479 21.804 4.087 21.412C3.695 21.02 3.49934 20.5493 3.5 20V7C3.5 6.71667 3.596 6.479 3.788 6.287C3.98 6.095 4.21733 5.99934 4.5 6C4.78333 6 5.021 6.096 5.213 6.288C5.405 6.48 5.50067 6.71734 5.5 7V20H15.5C15.7833 20 16.021 20.096 16.213 20.288C16.405 20.48 16.5007 20.7173 16.5 21C16.5 21.2833 16.404 21.521 16.212 21.713C16.02 21.905 15.7827 22.0007 15.5 22H5.5ZM9.5 18C8.95 18 8.479 17.804 8.087 17.412C7.695 17.02 7.49934 16.5493 7.5 16V4C7.5 3.45 7.696 2.979 8.088 2.587C8.48 2.195 8.95067 1.99934 9.5 2H18.5C19.05 2 19.521 2.196 19.913 2.588C20.305 2.98 20.5007 3.45067 20.5 4V16C20.5 16.55 20.304 17.021 19.912 17.413C19.52 17.805 19.0493 18.0007 18.5 18H9.5ZM9.5 16H18.5V4H9.5V16Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "ShareSurveyIcon",
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
          "--generalContrast"
        );
      }
    },
  },
};
</script>
