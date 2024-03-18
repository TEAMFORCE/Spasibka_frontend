<template>
  <div class="back_to_challenges_icon">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="path-1-outside-1_15350_8831"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
        fill="black"
      >
        <rect fill="white" width="24" height="24" />
        <path
          d="M2 12.96V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9"
        />
      </mask>
      <path
        d="M2 12.96V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9"
        :fill="fillColor"
      />
      <!-- <path
        d="M4 12.96C4 11.8554 3.10457 10.96 2 10.96C0.89543 10.96 0 11.8554 0 12.96H4ZM0 9C0 10.1046 0.89543 11 2 11C3.10457 11 4 10.1046 4 9H0ZM0 12.96V15H4V12.96H0ZM0 15C0 17.6973 0.527203 20.1056 2.21079 21.7892C3.89437 23.4728 6.30274 24 9 24V20C6.69726 20 5.60563 19.5272 5.03921 18.9608C4.4728 18.3944 4 17.3027 4 15H0ZM9 24H15V20H9V24ZM15 24C17.6973 24 20.1056 23.4728 21.7892 21.7892C23.4728 20.1056 24 17.6973 24 15H20C20 17.3027 19.5272 18.3944 18.9608 18.9608C18.3944 19.5272 17.3027 20 15 20V24ZM24 15V9H20V15H24ZM24 9C24 6.30274 23.4728 3.89437 21.7892 2.21079C20.1056 0.527203 17.6973 0 15 0V4C17.3027 4 18.3944 4.4728 18.9608 5.03921C19.5272 5.60563 20 6.69726 20 9H24ZM15 0H9V4H15V0ZM9 0C6.30274 0 3.89437 0.527203 2.21079 2.21079C0.527203 3.89437 0 6.30274 0 9H4C4 6.69726 4.4728 5.60563 5.03921 5.03921C5.60563 4.4728 6.69726 4 9 4V0Z"
        fill="white"
        mask="url(#path-1-outside-1_15350_8831)"
      /> -->
      <path
        d="M15 10.38L16.12 9.25"
        :stroke="tickColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.87988 12L10.6199 14.75L13.1699 12.21"
        :stroke="tickColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SectionSelectedIcon",
  props: {
    currentTickColor: {
      default: null,
    },
    currentFillColor: {
      default: null,
    },
  },
  computed: {
    tickColor() {
      if (this.currentTickColor) {
        return this.currentTickColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorWhite"
        );
      }
    },
    fillColor(){
      if (this.currentFillColor) {
        return this.currentFillColor;
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    }
  },
};
</script>
