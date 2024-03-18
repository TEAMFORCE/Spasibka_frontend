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
        d="M13.7041 9.04798L8.70408 14L6.77342 12.088M2.69542 6.68531C2.68985 5.98222 2.90674 5.29536 3.3151 4.72298C3.72345 4.1506 4.30234 3.722 4.96898 3.49848C5.63562 3.27496 6.35587 3.26796 7.02673 3.4785C7.69759 3.68903 8.28469 4.1063 8.70408 4.67064C8.97977 4.30399 9.32818 3.99819 9.72748 3.77238C10.1268 3.54657 10.5684 3.40561 11.0247 3.35832C11.481 3.31104 11.9421 3.35844 12.3793 3.49757C12.8164 3.6367 13.2201 3.86456 13.5651 4.16689C13.9101 4.46921 14.189 4.8395 14.3844 5.25457C14.5797 5.66964 14.6872 6.12057 14.7003 6.57912C14.7133 7.03767 14.6316 7.49397 14.4602 7.91948C14.2888 8.34498 14.0314 8.73053 13.7041 9.05198"
        :stroke="generalBrand"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.70312 8.66663H4.03646L5.36979 10.6666L6.70313 6.66663L7.36979 8.66663H9.36979"
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
  name: "IllnessIcon",
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