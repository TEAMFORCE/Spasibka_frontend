<template>
  <div>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6667 3.3334L12.6667 5.3334M8 10.0001L13.59 4.39007C13.8526 4.12751 14.0001 3.77139 14.0001 3.40007C14.0001 3.02875 13.8526 2.67264 13.59 2.41007C13.3274 2.14751 12.9713 2 12.6 2C12.2287 2 11.8726 2.14751 11.61 2.41007L6 8.00007V10.0001H8Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.99903 4.71338C4.83306 4.88423 3.77485 5.48975 3.03679 6.40842C2.29872 7.32708 1.93542 8.4909 2.0198 9.6663C2.10418 10.8417 2.62999 11.9417 3.49171 12.7455C4.35343 13.5493 5.48728 13.9975 6.6657 14C7.78779 13.9999 8.87228 13.5956 9.7206 12.8611C10.5689 12.1267 11.1243 11.1112 11.285 10.0007"
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
  name: "EditScalefactorIcon",
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
