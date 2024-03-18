<template>
  <div class="icon">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="6" width="4" height="3.33333" :fill="generalContrast" />
      <path
        d="M2.66797 3.33333L13.3346 2M8.0013 2.66667V5.33333M8.0013 9.33333V5.33333M3.33464 9.33333H12.668M8.0013 5.33333H4.5973C2.9013 7.33333 2.9013 11.3333 4.5973 13.3333H11.3346C13.1013 11.3333 13.1013 7.33333 11.468 5.33333H8.0013Z"
        :stroke="generalBrand"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "VacationIcon",
  props: {
    generalBrandColor: {
      default: null,
    },
    generalContrastColor: {
      default: null
    }
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
