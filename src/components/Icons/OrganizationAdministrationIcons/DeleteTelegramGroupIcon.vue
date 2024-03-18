<template>
  <div>
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.83203 4.95833H14.1654M7.08203 7.79167V12.0417M9.91536 7.79167V12.0417M3.54036 4.95833L4.2487 13.4583C4.2487 13.8341 4.39795 14.1944 4.66363 14.4601C4.92931 14.7257 5.28964 14.875 5.66536 14.875H11.332C11.7078 14.875 12.0681 14.7257 12.3338 14.4601C12.5994 14.1944 12.7487 13.8341 12.7487 13.4583L13.457 4.95833M6.3737 4.95833V2.83333C6.3737 2.64547 6.44833 2.4653 6.58116 2.33247C6.714 2.19963 6.89417 2.125 7.08203 2.125H9.91536C10.1032 2.125 10.2834 2.19963 10.4162 2.33247C10.5491 2.4653 10.6237 2.64547 10.6237 2.83333V4.95833"
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
  name: "DeleteTelegramGroupIcon",
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
