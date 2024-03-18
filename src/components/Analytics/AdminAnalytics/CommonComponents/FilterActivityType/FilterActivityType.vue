<template>
  <div class="filter_activity_type">
    <vSelect
      class="style-chooser"
      :options="activityTypes"
      :placeholder="
        $t('analyticsPage.adminAnalytics.userActivity.activityTypesPlaceholder')
      "
      label="title"
      v-model="selectedActivityType"
      @option:selected="typeChanged()"
    />
  </div>
</template>

<script>
import { ACTIVITY_TYPE } from "@/infrastructure/constants/activity-type";
import { ACTIVITY_TYPES } from "@/infrastructure/data-sources/activity-types";

import vSelect from "vue-select";

export default {
  name: "FilterActivityType",
  components: {
    vSelect,
  },
  data() {
    return {
      selectedActivityType: null,
    };
  },
  computed: {
    activityType() {
      return ACTIVITY_TYPE;
    },
    activityTypes() {
      return ACTIVITY_TYPES(this);
    },
  },
  watch: {
    selectedActivityType() {
      if (!this.selectedActivityType) {
        this.$emit("typeCleared");
      }
    },
  },
  methods: {
    typeChanged() {
      this.$emit("activityTypeChanged", this.selectedActivityType);
    },
  },
};
</script>

<style scoped>
.filter_activity_type {
  width: 360px;
}
::v-deep(.vs__dropdown-toggle) {
  height: 52px !important;
}
</style>