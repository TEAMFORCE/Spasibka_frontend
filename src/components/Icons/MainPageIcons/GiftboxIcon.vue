<template>
  <div class="balance_icon">
    <svg
      width="30"
      height="29"
      viewBox="0 0 30 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.0647 9.59819L15.0647 25.1957M23.4633 14.3974V22.7961C23.4633 23.4325 23.2105 24.0428 22.7605 24.4928C22.3105 24.9429 21.7001 25.1957 21.0637 25.1957H9.06563C8.42921 25.1957 7.81886 24.9429 7.36885 24.4928C6.91883 24.0428 6.66602 23.4325 6.66602 22.7961V14.3974M9.66553 9.59819C8.87001 9.59819 8.10707 9.28217 7.54455 8.71965C6.98204 8.15713 6.66602 7.3942 6.66602 6.59867C6.66602 5.80315 6.98204 5.04021 7.54455 4.4777C8.10707 3.91518 8.87001 3.59916 9.66553 3.59916C10.823 3.57899 11.9572 4.14058 12.9203 5.21069C13.8834 6.2808 14.6307 7.80976 15.0647 9.59819C15.4987 7.80976 16.2459 6.2808 17.209 5.21069C18.1721 4.14058 19.3064 3.57899 20.4638 3.59916C21.2593 3.59916 22.0223 3.91518 22.5848 4.4777C23.1473 5.04021 23.4633 5.80315 23.4633 6.59867C23.4633 7.3942 23.1473 8.15713 22.5848 8.71965C22.0223 9.28217 21.2593 9.59819 20.4638 9.59819"
        :stroke="generalContrast"
        stroke-width="2.15965"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M24.6643 9.59814L5.46738 9.59814C4.80475 9.59814 4.26758 10.1353 4.26758 10.798V13.1976C4.26758 13.8602 4.80475 14.3974 5.46738 14.3974H24.6643C25.3269 14.3974 25.8641 13.8602 25.8641 13.1976V10.798C25.8641 10.1353 25.3269 9.59814 24.6643 9.59814Z"
        :stroke="generalBrand"
        stroke-width="2.15965"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "GiftboxIcon",
  props: {
    generalContrastColor: {
      default: null,
    },
    generalBrandColor: {
      default: null,
    },
  },
  computed: {
    generalContrast() {
      if (this.generalContrastColor) {
        return this.generalContrastColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalContrast"
        );
      }
    },
    generalBrand() {
      if (this.generalBrandColor) {
        return this.generalBrandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
