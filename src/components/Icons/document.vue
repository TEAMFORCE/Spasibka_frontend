<template>
  <div class="document_icon">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.5">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M23.7507 4.16667C23.7507 3.93655 23.5641 3.75 23.334 3.75H11.6673C9.13601 3.75 7.08398 5.80203 7.08398 8.33333V31.6667C7.08398 34.198 9.13601 36.25 11.6673 36.25H28.334C30.8653 36.25 32.9173 34.198 32.9173 31.6667V15.2451C32.9173 15.015 32.7308 14.8284 32.5007 14.8284H25.0007C24.3103 14.8284 23.7507 14.2688 23.7507 13.5784V4.16667ZM25.0007 20.4167C25.691 20.4167 26.2507 20.9763 26.2507 21.6667C26.2507 22.357 25.691 22.9167 25.0007 22.9167H15.0007C14.3103 22.9167 13.7507 22.357 13.7507 21.6667C13.7507 20.9763 14.3103 20.4167 15.0007 20.4167H25.0007ZM25.0007 27.0833C25.691 27.0833 26.2507 27.643 26.2507 28.3333C26.2507 29.0237 25.691 29.5833 25.0007 29.5833H15.0007C14.3103 29.5833 13.7507 29.0237 13.7507 28.3333C13.7507 27.643 14.3103 27.0833 15.0007 27.0833H25.0007Z"
          :fill="color"
        />
        <path
          d="M26.2507 4.70689C26.2507 4.3994 26.5717 4.20416 26.811 4.39731C27.0125 4.56 27.1936 4.7506 27.3482 4.96592L32.3701 11.9624C32.4845 12.1217 32.3606 12.3284 32.1646 12.3284H26.6673C26.4372 12.3284 26.2507 12.1419 26.2507 11.9118V4.70689Z"
          :fill="color"
        />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "DocumentIcon",
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