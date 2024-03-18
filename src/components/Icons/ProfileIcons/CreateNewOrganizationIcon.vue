<template>
  <div class="plus_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_12071_60880)">
        <path
          d="M12.8332 7H4.1665C3.61422 7 3.1665 7.44772 3.1665 8C3.1665 8.55228 3.61422 9 4.1665 9H12.8332C13.3855 9 13.8332 8.55228 13.8332 8C13.8332 7.44772 13.3855 7 12.8332 7Z"
          :fill="color"
        />
        <path
          d="M7.50146 3.66668L7.50146 12.3333C7.50146 12.8856 7.94918 13.3333 8.50146 13.3333C9.05375 13.3333 9.50146 12.8856 9.50146 12.3333L9.50146 3.66668C9.50146 3.11439 9.05375 2.66668 8.50146 2.66668C7.94918 2.66668 7.50146 3.11439 7.50146 3.66668Z"
          :fill="color"
        />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "CreateNewOrganizationIcon",
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

<style lang="scss" scoped>
</style>