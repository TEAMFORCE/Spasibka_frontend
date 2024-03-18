<template>
  <div>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8332 15.8327C10.8332 15.3724 10.4601 14.9993 9.99984 14.9993C9.5396 14.9993 9.1665 15.3724 9.1665 15.8327C9.1665 16.2929 9.5396 16.666 9.99984 16.666C10.4601 16.666 10.8332 16.2929 10.8332 15.8327Z"
        :fill="color"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.8332 9.9987C10.8332 9.53846 10.4601 9.16537 9.99984 9.16537C9.5396 9.16537 9.1665 9.53846 9.1665 9.9987C9.1665 10.4589 9.5396 10.832 9.99984 10.832C10.4601 10.832 10.8332 10.4589 10.8332 9.9987Z"
        :fill="color"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.8332 4.16667C10.8332 3.70643 10.4601 3.33333 9.99984 3.33333C9.5396 3.33333 9.1665 3.70643 9.1665 4.16667C9.1665 4.6269 9.5396 5 9.99984 5C10.4601 5 10.8332 4.6269 10.8332 4.16667Z"
        :fill="color"
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
  name: "QuestionAnswerOptionsIcon",
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
          "--generalContrast"
        );
      }
    },
  },
};
</script>
