<template>
  <div class="balance_icon">
    <svg
      width="102"
      height="102"
      viewBox="0 0 102 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_13858_58435)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M51.0001 0C22.8368 0 0 22.8404 0 51.0006C0 79.1601 22.8368 102 51.0001 102C79.1589 102 101.999 79.1601 101.999 51.0006C101.999 22.8404 79.1589 0 51.0001 0"
          :fill="brandSecondary"
        />
        <path
          d="M47.29 43.296C47.3829 43.2022 47.4935 43.1278 47.6154 43.077C47.7373 43.0262 47.868 43 48 43H54C54.2652 43 54.5196 43.1054 54.7071 43.2929C54.8946 43.4804 55 43.7348 55 44C55 44.5304 55.2107 45.0391 55.5858 45.4142C55.9609 45.7893 56.4696 46 57 46H58C58.5304 46 59.0391 46.2107 59.4142 46.5858C59.7893 46.9609 60 47.4696 60 48V56M58.821 58.824C58.571 58.937 58.293 59 58 59H44C43.4696 59 42.9609 58.7893 42.5858 58.4142C42.2107 58.0391 42 57.5304 42 57V48C42 47.4696 42.2107 46.9609 42.5858 46.5858C42.9609 46.2107 43.4696 46 44 46H45C45.292 46 45.568 45.938 45.818 45.825"
          :stroke="generalBrand"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M49.436 49.44C49.0488 49.6768 48.7203 49.9984 48.4754 50.3805C48.2304 50.7626 48.0754 51.1954 48.022 51.6461C47.9685 52.0968 48.018 52.5538 48.1668 52.9826C48.3156 53.4115 48.5597 53.8009 48.8808 54.1217C49.2019 54.4425 49.5916 54.6863 50.0206 54.8346C50.4496 54.983 50.9066 55.0321 51.3573 54.9782C51.808 54.9243 52.2405 54.7688 52.6224 54.5235C53.0043 54.2782 53.3256 53.9495 53.562 53.562M42 42L60 60"
          :stroke="generalBrand"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <!-- <defs>
        <clipPath id="clip0_13858_58435">
          <rect width="102" height="102" fill="white" />
        </clipPath>
      </defs> -->
    </svg>
  </div>
</template>

<script>
export default {
  name: "EmptyAvatarIcon",
  props: {
    generalWhiteColor: {
      default: null,
    },
    generalBrandColor: {
      default: null,
    },
    brandSecondaryColor: {
      default: null,
    },
  },
  computed: {
    generalWhite() {
      if (this.generalWhiteColor) {
        return this.generalWhiteColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorWhite"
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
    brandSecondary() {
      if (this.brandSecondaryColor) {
        return this.brandSecondaryColor;
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
