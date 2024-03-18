<template>
  <div class="branding_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 3.00011L17 6.00011M10 13.0001L18.385 4.58511C18.7788 4.19126 19.0001 3.65709 19.0001 3.10011C19.0001 2.54312 18.7788 2.00895 18.385 1.61511C17.9912 1.22126 17.457 1 16.9 1C16.343 1 15.8088 1.22126 15.415 1.61511L7 10.0001V13.0001H10Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.0005 5.07031C5.25154 5.32659 3.66423 6.23487 2.55713 7.61287C1.45004 8.99087 0.905088 10.7366 1.03166 12.4997C1.15822 14.2628 1.94694 15.9128 3.23952 17.1185C4.5321 18.3242 6.23287 18.9965 8.0005 19.0003C9.68363 19.0001 11.3104 18.3937 12.5829 17.292C13.8553 16.1903 14.6884 14.6671 14.9295 13.0013"
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
  name: "EditProfileIcon",
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