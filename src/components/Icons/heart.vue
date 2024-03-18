<template>
  <div class="heart_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 30 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.5">
        <path
          d="M8.99935 0.75C4.36459 0.75 0.416016 4.2155 0.416016 8.71633C0.416016 11.8213 1.86993 14.4353 3.79683 16.6007C5.71712 18.7587 8.19459 20.57 10.4343 22.0861L14.2987 24.7018C14.7219 24.9883 15.2768 24.9883 15.7 24.7018L19.5644 22.0861C21.8041 20.57 24.2816 18.7587 26.2019 16.6007C28.1288 14.4353 29.5827 11.8213 29.5827 8.71633C29.5827 4.2155 25.6341 0.75 20.9993 0.75C18.6102 0.75 16.5079 1.87023 14.9993 3.31972C13.4907 1.87023 11.3885 0.75 8.99935 0.75Z"
          :fill="color"
        />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "HeartIcon",
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