<template>
  <div class="send_comment_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="svg"
    >
      <rect
        width="32"
        height="32"
        rx="16"
        :fill="secondColor"
        class="background"
      />
      <path
        d="M21.3816 12.9345L17.1633 22.3084C16.5222 23.7331 14.4775 23.6675 13.9289 22.2047L13.0814 19.9448C12.904 19.4716 12.5306 19.0982 12.0573 18.9207L9.79739 18.0732C8.33459 17.5247 8.26906 15.4799 9.69372 14.8388L19.0676 10.6205C20.5362 9.95965 22.0425 11.4659 21.3816 12.9345Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SendCommentIcon",
  props: {
    currentColor: {
      default: null,
    },
    secondCurrentColor: {
      default: null,
    },
  },
  computed: {
    color() {
      if (this.currentColor) {
        return this.currentColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorGrey"
        );
      }
    },
    secondColor() {
      if (this.secondCurrentColor) {
        return this.secondCurrentColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorSecondary"
        );
      }
    },
  },
};
</script>

<style scoped>
.background {
  transition: 0.3s;
}
.icon {
  transition: 0.3s;
}
.svg:hover .background {
  fill: var(--generalBrand);
}
.svg:hover .icon {
  stroke: var(--secondaryColorBrand);
}
</style>