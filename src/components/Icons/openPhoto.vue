<template>
  <div class="open_photo_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.54167 5.4585H4.25C4.62572 5.4585 4.98606 5.30924 5.25173 5.04356C5.51741 4.77789 5.66667 4.41755 5.66667 4.04183C5.66667 3.85397 5.74129 3.6738 5.87413 3.54096C6.00697 3.40812 6.18714 3.3335 6.375 3.3335H10.625C10.8129 3.3335 10.993 3.40812 11.1259 3.54096C11.2587 3.6738 11.3333 3.85397 11.3333 4.04183C11.3333 4.41755 11.4826 4.77789 11.7483 5.04356C12.0139 5.30924 12.3743 5.4585 12.75 5.4585H13.4583C13.8341 5.4585 14.1944 5.60775 14.4601 5.87343C14.7257 6.1391 14.875 6.49944 14.875 6.87516V13.2502C14.875 13.6259 14.7257 13.9862 14.4601 14.2519C14.1944 14.5176 13.8341 14.6668 13.4583 14.6668H3.54167C3.16594 14.6668 2.80561 14.5176 2.53993 14.2519C2.27426 13.9862 2.125 13.6259 2.125 13.2502V6.87516C2.125 6.49944 2.27426 6.1391 2.53993 5.87343C2.80561 5.60775 3.16594 5.4585 3.54167 5.4585"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.5 11.8335C9.6736 11.8335 10.625 10.8821 10.625 9.7085C10.625 8.53489 9.6736 7.5835 8.5 7.5835C7.32639 7.5835 6.375 8.53489 6.375 9.7085C6.375 10.8821 7.32639 11.8335 8.5 11.8335Z"
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
  name: "OpenPhotoIcon",
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