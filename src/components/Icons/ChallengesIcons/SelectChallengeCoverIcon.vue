<template>
  <div class="clip_icon">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.6001 7.319V14.6C6.6001 16.0322 7.16902 17.4057 8.18172 18.4184C9.19442 19.4311 10.5679 20 12.0001 20C13.4323 20 14.8058 19.4311 15.8185 18.4184C16.8312 17.4057 17.4001 16.0322 17.4001 14.6V5.6C17.4001 4.64522 17.0208 3.72955 16.3457 3.05442C15.6706 2.37928 14.7549 2 13.8001 2C12.8453 2 11.9296 2.37928 11.2545 3.05442C10.5794 3.72955 10.2001 4.64522 10.2001 5.6V13.8638C10.2001 14.1002 10.2467 14.3342 10.3371 14.5526C10.4276 14.771 10.5602 14.9694 10.7273 15.1366C10.8945 15.3037 11.0929 15.4363 11.3113 15.5268C11.5297 15.6172 11.7637 15.6638 12.0001 15.6638C12.4775 15.6638 12.9353 15.4742 13.2729 15.1366C13.6105 14.799 13.8001 14.3412 13.8001 13.8638V7.4"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SelectChallengeCoverIcon",
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
