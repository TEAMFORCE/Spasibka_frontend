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
        d="M11.3333 3.54174L13.4583 5.66674M8.5 10.6251L14.4394 4.66445C14.7183 4.38548 14.8751 4.00711 14.8751 3.61258C14.8751 3.21805 14.7183 2.83968 14.4394 2.5607C14.1604 2.28173 13.782 2.125 13.3875 2.125C12.993 2.125 12.6146 2.28173 12.3356 2.5607L6.375 8.50008V10.6251H8.5Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.37348 5.00781C5.13464 5.18934 4.01029 5.83271 3.2261 6.80879C2.4419 7.78487 2.0559 9.02143 2.14555 10.2703C2.2352 11.5192 2.79388 12.6879 3.70946 13.542C4.62503 14.396 5.82975 14.8722 7.08182 14.8749C8.27404 14.8748 9.42631 14.4452 10.3277 13.6648C11.229 12.8845 11.8191 11.8055 11.9899 10.6256"
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
  name: "EditTelegramGroupIcon",
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
