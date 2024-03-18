<template>
  <div>
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="tabler:rocket">
        <g id="Group">
          <path
            id="Vector"
            d="M5.55207 10.3788C4.83457 10.7839 4.25439 11.394 3.88591 12.1309C3.51743 12.8679 3.37744 13.6981 3.48389 14.5151C4.30093 14.6216 5.13114 14.4816 5.8681 14.1131C6.60506 13.7446 7.21518 13.1645 7.62025 12.447"
            :stroke="generalBrandColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_2"
            d="M11.0663 7.62122C11.4471 7.62122 11.7557 7.31257 11.7557 6.93183C11.7557 6.55108 11.4471 6.24243 11.0663 6.24243C10.6856 6.24243 10.377 6.55108 10.377 6.93183C10.377 7.31257 10.6856 7.62122 11.0663 7.62122Z"
            :stroke="generalContrastColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_3"
            d="M3.48438 9.68941C4.71363 9.8355 5.85799 10.3909 6.73332 11.2662C7.60865 12.1415 8.16404 13.2859 8.31013 14.5152C8.9195 14.1639 9.42922 13.663 9.79111 13.0598C10.153 12.4567 10.3551 11.7712 10.3783 11.0682C11.5359 10.661 12.5467 9.91966 13.283 8.93798C14.0192 7.95629 14.4479 6.77833 14.5147 5.55304C14.5147 5.00453 14.2968 4.47848 13.9089 4.09062C13.5211 3.70276 12.995 3.48486 12.4465 3.48486C11.2212 3.55167 10.0432 3.98031 9.06156 4.71657C8.07988 5.45283 7.33856 6.46366 6.93134 7.62123C6.22834 7.64444 5.54288 7.84655 4.93973 8.20843C4.33658 8.57032 3.83568 9.08004 3.48438 9.68941"
            :stroke="generalContrastColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "ProgressBarRockerIcon",
  props: {
    givenBrandColor: {
      default: null,
    },
    givenContrastColor: {
      default: null,
    },
  },
  computed: {
    generalBrandColor() {
      if (this.givenBrandColor) {
        return this.givenBrandColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
    generalContrastColor() {
      if (this.givenContrastColor) {
        return this.givenContrastColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalContrast"
        );
      }
    }
  },
};
</script>
