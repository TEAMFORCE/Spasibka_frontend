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
        d="M12.334 21C17.3045 21 21.334 16.9706 21.334 12C21.334 7.02944 17.3045 3 12.334 3C7.36342 3 3.33398 7.02944 3.33398 12C3.33398 16.9706 7.36342 21 12.334 21Z"
        :stroke="generalContrastColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.334 7V12L15.334 15"
        :stroke="generalBrandColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "DetailClockIcon",
  props: {
    contrastColor: {
      default: null,
    },
    brandColor: {
      default: null
    }
  },
  computed: {
    generalContrastColor() {
      if (this.contrastColor) {
        return this.contrastColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalContrast"
        );
      }
    },
    generalBrandColor() {
      if (this.brandColor) {
        return this.brandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
  },
};
</script>
