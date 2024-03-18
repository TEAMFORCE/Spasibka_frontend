<template>
  <div>
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.6001 7.819V15.1C6.6001 16.5322 7.16902 17.9057 8.18172 18.9184C9.19442 19.9311 10.5679 20.5 12.0001 20.5C13.4323 20.5 14.8058 19.9311 15.8185 18.9184C16.8312 17.9057 17.4001 16.5322 17.4001 15.1V6.1C17.4001 5.14522 17.0208 4.22955 16.3457 3.55442C15.6706 2.87928 14.7549 2.5 13.8001 2.5C12.8453 2.5 11.9296 2.87928 11.2545 3.55442C10.5794 4.22955 10.2001 5.14522 10.2001 6.1V14.3638C10.2001 14.6002 10.2467 14.8342 10.3371 15.0526C10.4276 15.271 10.5602 15.4694 10.7273 15.6366C10.8945 15.8037 11.0929 15.9363 11.3113 16.0268C11.5297 16.1172 11.7637 16.1638 12.0001 16.1638C12.4775 16.1638 12.9353 15.9742 13.2729 15.6366C13.6105 15.299 13.8001 14.8412 13.8001 14.3638V7.9"
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
  name: "AttachCoverIcon",
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
          "--generalColorSecondary"
        );
      }
    },
  },
};
</script>
