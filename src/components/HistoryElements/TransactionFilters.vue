<template>
  <div class="transaction_filters">
    <div class="filters_by_type">
      <button
        class="transaction_type_filter minor-info-secondary-bg general-contrast-color"
        v-for="filter in filtersByType"
        @click="applyTypeFilter(filter)"
        :class="{ selected_type_filter: filter == selectedTypeFilter }"
      >
        {{ filter }}
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: "TransactionFilters",
  data(){
    return {
      filtersByType: [
        this.$t("history.all_history"),
        this.$t("history.received"),
        this.$t("history.sent")
      ],
      selectedTypeFilter: this.$t("history.all_history")
    }
  },
  methods: {
    applyTypeFilter(filter){
      this.selectedTypeFilter = filter;
    }
  }
}
</script>

<style scoped>
.transaction_filters {
  display: flex;
}
.filters_by_type {
  display: flex;
  gap: 8px;
}
.transaction_type_filter {
  border-radius: 12px;
  padding: 8px 14px;
  font-family: 'Golos';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.transaction_type_filter.selected_type_filter {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
</style>