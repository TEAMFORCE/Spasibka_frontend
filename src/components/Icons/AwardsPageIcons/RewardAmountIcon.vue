<template>
  <div>
    <svg
      width="17"
      height="14"
      viewBox="0 0 17 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.50206 5.03996L6.16369 3.80686C6.56674 3.0552 6.35001 2.15701 5.57621 1.74027C4.51913 1.1732 3.46776 2.06377 3.46776 2.06377C2.26049 3.15415 1.5 4.73168 1.5 6.48809C1.5 9.77636 4.16551 12.2958 7.44701 12.4405C12.0632 12.6441 15.0842 8.96 15.0842 8.96"
        :stroke="color"
        stroke-width="1.7"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M9.09531 5.76847L9.75693 4.53537C10.16 3.78371 9.94325 2.88553 9.16945 2.46879C8.11238 1.90171 7.061 2.79229 7.061 2.79229C6.38037 3.40503 5.94689 4.23471 5.50391 5.04155"
        :stroke="color"
        stroke-width="1.7"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M12.6891 6.49504L13.3507 5.26193C13.7537 4.51028 13.537 3.61209 12.7632 3.19535C11.7061 2.62828 10.6548 3.51885 10.6548 3.51885C9.97412 4.13159 9.50832 4.92321 9.09766 5.76811"
        :stroke="color"
        stroke-width="1.7"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "RewardAmountIcon",
  props: {
    generalBrand: {
      default: null
    }
  },
  computed: {
    color() {
      if (this.generalBrand) {
        return this.generalBrand;
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
