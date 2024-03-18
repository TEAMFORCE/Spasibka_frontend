<template>
  <div>
    <svg
      width="11"
      height="9"
      viewBox="0 0 11 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.41747 8.59235L4.39985 8.60997L0 4.21013L1.43268 2.77745L4.41752 5.7623L9.19154 0.988281L10.6242 2.42096L4.43514 8.61003L4.41747 8.59235Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "UserVotedIcon",
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
