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
        d="M6.60156 7.319V14.6C6.60156 16.0322 7.17049 17.4057 8.18319 18.4184C9.19588 19.4311 10.5694 20 12.0016 20C13.4337 20 14.8072 19.4311 15.8199 18.4184C16.8326 17.4057 17.4016 16.0322 17.4016 14.6V5.6C17.4016 4.64522 17.0223 3.72955 16.3471 3.05442C15.672 2.37928 14.7563 2 13.8016 2C12.8468 2 11.9311 2.37928 11.256 3.05442C10.5808 3.72955 10.2016 4.64522 10.2016 5.6V13.8638C10.2016 14.1002 10.2481 14.3342 10.3386 14.5526C10.429 14.771 10.5616 14.9694 10.7288 15.1366C10.8959 15.3037 11.0943 15.4363 11.3127 15.5268C11.5311 15.6172 11.7652 15.6638 12.0016 15.6638C12.479 15.6638 12.9368 15.4742 13.2744 15.1366C13.6119 14.799 13.8016 14.3412 13.8016 13.8638V7.4"
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
  name: "AddAwardPhotoIcon",
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
