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
        d="M12.666 7.99995V20.9999M19.666 11.9999V18.9999C19.666 19.5304 19.4553 20.0391 19.0802 20.4142C18.7052 20.7892 18.1964 20.9999 17.666 20.9999H7.66602C7.13558 20.9999 6.62687 20.7892 6.2518 20.4142C5.87673 20.0391 5.66602 19.5304 5.66602 18.9999V11.9999M8.16602 7.99995C7.50297 7.99995 6.86709 7.73656 6.39825 7.26772C5.92941 6.79887 5.66602 6.16299 5.66602 5.49995C5.66602 4.83691 5.92941 4.20102 6.39825 3.73218C6.86709 3.26334 7.50297 2.99995 8.16602 2.99995C9.1307 2.98314 10.076 3.45121 10.8788 4.34311C11.6815 5.23501 12.3043 6.50935 12.666 7.99995C13.0277 6.50935 13.6506 5.23501 14.4533 4.34311C15.256 3.45121 16.2013 2.98314 17.166 2.99995C17.8291 2.99995 18.4649 3.26334 18.9338 3.73218C19.4026 4.20102 19.666 4.83691 19.666 5.49995C19.666 6.16299 19.4026 6.79887 18.9338 7.26772C18.4649 7.73656 17.8291 7.99995 17.166 7.99995"
        :stroke="generalContrastColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20.666 8H4.66602C4.11373 8 3.66602 8.44772 3.66602 9V11C3.66602 11.5523 4.11373 12 4.66602 12H20.666C21.2183 12 21.666 11.5523 21.666 11V9C21.666 8.44772 21.2183 8 20.666 8Z"
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
  name: "DetailGiftIcon",
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
