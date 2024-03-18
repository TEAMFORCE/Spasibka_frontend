<template>
  <div class="icon">
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.90234 8.66659V8.67325M4.90234 10.6666V10.6733M2.90234 3.33325H6.90234V12.6666H2.90234V3.33325Z"
        :stroke="generalBrand"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.2357 12.6667H14.2357M12.2357 10.6667V12.6667M8.90234 6H15.569V10.6667H8.90234V6Z"
        :stroke="generalContrast"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "RemoteIcon",
  props: {
    generalBrandColor: {
      default: null,
    },
    generalContrastColor: {
      default: null,
    },
  },
  computed: {
    generalBrand() {
      if (this.generalBrandColor) {
        return this.generalBrandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
    generalContrast() {
      if (this.generalContrastColor) {
        return this.generalContrastColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalContrast"
        );
      }
    },
  },
};
</script>

<style scoped>
.icon {
  height: 16px;
}
</style>
