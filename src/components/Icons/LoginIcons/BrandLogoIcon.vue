<template>
  <div>
    <svg
      width="355"
      height="355"
      viewBox="0 0 355 355"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.25">
        <path
          d="M106.401 283.747C165.164 322.928 244.565 307.054 283.747 248.291C322.928 189.527 307.054 110.127 248.291 70.9448C189.527 31.7631 110.127 47.6373 70.9448 106.401C31.7631 165.164 47.6373 244.565 106.401 283.747Z"
          :fill="brandSecondaryColor"
        />
        <path
          d="M163.079 146.307L177.253 138.75C185.89 134.141 189.537 124.184 184.795 115.274C178.303 103.123 162.585 104.927 162.585 104.927C144.106 107.645 126.795 117.862 115.613 134.633C94.6783 166.03 104.112 207.071 134.552 229.362C177.371 260.721 229.697 244.796 229.697 244.796"
          :fill="brandSecondaryColor"
        />
        <path
          d="M163.079 146.307L177.253 138.75C185.89 134.141 189.537 124.184 184.795 115.274C178.303 103.123 162.585 104.927 162.585 104.927C144.106 107.645 126.795 117.862 115.613 134.633C94.6783 166.03 104.112 207.071 134.552 229.362C177.371 260.721 229.697 244.796 229.697 244.796"
          :stroke="generalWhiteColor"
          stroke-width="18"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M192.779 176.163L206.952 168.605C215.59 163.997 219.236 154.04 214.495 145.13C208.003 132.979 192.285 134.783 192.285 134.783C181.879 136.297 172.455 141.456 163.084 146.337"
          :fill="brandSecondaryColor"
        />
        <path
          d="M192.779 176.163L206.952 168.605C215.59 163.997 219.236 154.04 214.495 145.13C208.003 132.979 192.285 134.783 192.285 134.783C181.879 136.297 172.455 141.456 163.084 146.337"
          :stroke="generalWhiteColor"
          stroke-width="18"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M222.493 206.001L236.666 198.443C245.303 193.835 248.95 183.878 244.209 174.968C237.716 162.817 221.999 164.621 221.999 164.621C211.593 166.134 202.102 170.725 192.798 176.175"
          :fill="brandSecondaryColor"
        />
        <path
          d="M222.493 206.001L236.666 198.443C245.303 193.835 248.95 183.878 244.209 174.968C237.716 162.817 221.999 164.621 221.999 164.621C211.593 166.134 202.102 170.725 192.798 176.175"
          :stroke="generalWhiteColor"
          stroke-width="18"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "BrandLogoIcon",
  props: {
    whiteColor: {
      default: null,
    },
    secondaryBrandColor: {
      default: null,
    }
  },
  computed: {
    generalWhiteColor() {
      if (this.whiteColor) {
        return this.whiteColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorWhite"
        );
      }
    },
    brandSecondaryColor() {
      if (this.secondaryBrandColor) {
        return this.secondaryBrandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--secondaryColorBrand"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
