<template>
  <div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.88555 13.25C6.56698 14.2643 5.61941 15 4.5 15C3.11929 15 2 13.8807 2 12.5C2 11.1193 3.11929 10 4.5 10C5.69175 10 6.68873 10.8339 6.9393 11.95H9.5607C9.81127 10.8339 10.8083 10 12 10C13.1917 10 14.1887 10.8339 14.4393 11.95H17.0607C17.3113 10.8339 18.3083 10 19.5 10C20.8807 10 22 11.1193 22 12.5C22 13.8807 20.8807 15 19.5 15C18.3806 15 17.433 14.2643 17.1145 13.25H14.3855C14.067 14.2643 13.1194 15 12 15C10.8806 15 9.93302 14.2643 9.61445 13.25H6.88555Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "LinearScaleIcon",
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
