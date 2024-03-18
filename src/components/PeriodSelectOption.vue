<template>
  <div class="period_select_option_wrapper">
    <button class="period_select_option" @click="applyPeriod">
      <h4 class="period_select_option_text">
        {{ info.name }}
      </h4>
      <h4 class="period_select_option_text">{{ startDate }}-{{ endDate }}</h4>
    </button>
  </div>
</template>

<script>
export default {
  name: "PeriodSelectOption",
  props: ["info"],
  data() {
    return {
      startDate: null,
      endDate: null,
    };
  },
  mounted() {
    this.startDate = this.refactorDate(this.info.start_date);
    this.endDate = this.refactorDate(this.info.end_date);
  },
  methods: {
    refactorDate(date) {
      return date.replaceAll("-", ".");
    },
    applyPeriod() {
      this.$emit("applyPeriod", this.info);
    },
  },
};
</script>

<style scoped>
.period_select_option_wrapper {
  width: 100%;
}
.period_select_option_text {
  margin-top: 0px;
  margin-bottom: 0px;
}
.period_select_option {
  background-color: var(--generalColorWhite);
  padding: 10px;
  display: flex;
  gap: 20px;
}
button:focus {
  outline: none;
}
button {
  width: 100%;
  height: 50px;
  color: black;
  border-radius: 12px;
  border: 1px solid black;
}
</style>
