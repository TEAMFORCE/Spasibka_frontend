<template>
  <div class="detail_tf_logo_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 53 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.2828 14.5248L18.4686 10.4511C19.8001 7.96797 19.0841 5.00073 16.5278 3.62398C13.0356 1.7506 9.56233 4.69269 9.56233 4.69269C5.57399 8.29487 3.06165 13.5064 3.06165 19.3089C3.06165 30.172 11.8674 38.4953 22.7082 38.9731C37.9581 39.6458 47.9384 27.4751 47.9384 27.4751"
        :stroke="color"
        stroke-width="6"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M28.1537 16.9328L30.3395 12.8591C31.671 10.376 30.955 7.40872 28.3987 6.03197C24.9065 4.15859 21.4332 7.10068 21.4332 7.10068C19.1847 9.12494 17.7526 11.8659 16.2892 14.5314"
        :stroke="color"
        stroke-width="6"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M40.0247 19.3339L42.2104 15.2602C43.542 12.777 42.826 9.80978 40.2696 8.43303C36.7775 6.55965 33.3042 9.50174 33.3042 9.50174C31.0556 11.526 29.5168 14.1412 28.1602 16.9324"
        :stroke="color"
        stroke-width="6"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "DetailTFLogoIcon",
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
