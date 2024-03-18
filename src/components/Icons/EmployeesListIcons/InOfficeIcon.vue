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
        d="M2.20312 14.0001H14.2031M2.86979 14.0001V4.00008C2.86979 3.64646 3.01027 3.30732 3.26032 3.05727C3.51036 2.80722 3.8495 2.66675 4.20313 2.66675H12.2031C12.5567 2.66675 12.8959 2.80722 13.1459 3.05727C13.396 3.30732 13.5365 3.64646 13.5365 4.00008V14.0001"
        :stroke="generalBrand"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.20312 14.0001V8.66675C6.20312 8.13632 6.41384 7.62761 6.78891 7.25253C7.16398 6.87746 7.67269 6.66675 8.20313 6.66675C8.73356 6.66675 9.24227 6.87746 9.61734 7.25253C9.99241 7.62761 10.2031 8.13632 10.2031 8.66675V14.0001"
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
  name: "InOfficeIcon",
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
