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
        d="M12 8V12L14 14"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.0498 19.9981V14.9981H8.0498M3.0498 10.9981C3.2739 8.79817 4.30007 6.75773 5.93254 5.26608C7.56501 3.77443 9.6895 2.936 11.9007 2.91074C14.1119 2.88549 16.255 3.67518 17.9211 5.12915C19.5872 6.58312 20.6597 8.59959 20.934 10.7938C21.2083 12.9881 20.6651 15.2065 19.4082 17.0259C18.1512 18.8452 16.2684 20.1382 14.1191 20.658C11.9697 21.1778 9.70421 20.8881 7.7548 19.8442C5.80539 18.8003 4.30853 17.0752 3.5498 14.9981L3.0498 10.9981Z"
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
  name: "CountdownIcon",
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
