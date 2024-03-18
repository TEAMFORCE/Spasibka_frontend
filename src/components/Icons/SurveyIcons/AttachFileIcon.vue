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
        d="M7.09961 7.319V14.6C7.09961 16.0322 7.66854 17.4057 8.68123 18.4184C9.69393 19.4311 11.0674 20 12.4996 20C13.9318 20 15.3053 19.4311 16.318 18.4184C17.3307 17.4057 17.8996 16.0322 17.8996 14.6V5.6C17.8996 4.64522 17.5203 3.72955 16.8452 3.05442C16.1701 2.37928 15.2544 2 14.2996 2C13.3448 2 12.4292 2.37928 11.754 3.05442C11.0789 3.72955 10.6996 4.64522 10.6996 5.6V13.8638C10.6996 14.1002 10.7462 14.3342 10.8366 14.5526C10.9271 14.771 11.0597 14.9694 11.2268 15.1366C11.394 15.3037 11.5924 15.4363 11.8108 15.5268C12.0292 15.6172 12.2632 15.6638 12.4996 15.6638C12.977 15.6638 13.4348 15.4742 13.7724 15.1366C14.11 14.799 14.2996 14.3412 14.2996 13.8638V7.4"
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
  name: "AttachFileIcon",
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
