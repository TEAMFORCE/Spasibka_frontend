<template>
  <div class="back_to_challenges_icon">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4.99998L19 7.99998M12 15L20.385 6.58499C20.7788 6.19114 21.0001 5.65697 21.0001 5.09998C21.0001 4.543 20.7788 4.00883 20.385 3.61498C19.9912 3.22114 19.457 2.99988 18.9 2.99988C18.343 2.99988 17.8088 3.22114 17.415 3.61498L9 12V15H12Z"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.99953 7.06995C7.25057 7.32623 5.66325 8.23451 4.55616 9.6125C3.44906 10.9905 2.90411 12.7362 3.03068 14.4993C3.15725 16.2624 3.94597 17.9124 5.23854 19.1181C6.53112 20.3239 8.23189 20.9961 9.99953 20.9999C11.6827 20.9998 13.3094 20.3933 14.5819 19.2916C15.8544 18.1899 16.6874 16.6667 16.9285 15.0009"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "EditTemplateIcon",
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
