<template>
  <div class="filter_by_date" ref="myDatepicker">
    <Datepicker
      :placeholder="placeholder"
      v-model="currentDate"
      text-input
      auto-apply
      format="dd.MM.yyyy"
      :locale="locale"
      :clearable="true"
      :enable-time-picker="enableTimePicker"
      @update:model-value="updateCurrentDate"
      :id="id"
    >
      <!-- format="dd.MM.yyyy" -->
      <template #clear-icon="{ clear }">
        <CloseIcon @click="clear" class="_clear_date" />
      </template>
    </Datepicker>
    <CalendarIcon class="calendar_icon" />
  </div>
</template>

<script>
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

import Datepicker from "@vuepic/vue-datepicker";
import CalendarIcon from "@/components/Icons/SurveyIcons/CalendarIcon.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "FilterByDate",
  components: {
    Datepicker,
    CalendarIcon,
    CloseIcon,
  },
  props: {
    placeholder: {
      default: "01.01.2024",
    },
    width: {
      default: "300px",
    },
    enableTimePicker: {
      default: false,
    },
    id: {
      default: "",
    },
    format: {
      default: "yyyy-mm-dd",
    },
  },

  data() {
    return {
      currentDate: null,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    locale() {
      if (this.profileInfo.profile.language == "ru") {
        return "ru";
      } else {
        return "en";
      }
    },
  },
  methods: {
    setWidth() {
      if (this.width) {
        this.$refs.myDatepicker.style.width = this.width;
      }
    },
    updateCurrentDate(date) {
      if (this.format == "yyyy-mm-dd" && date) {
        let choisedDate = new Date(date);
        let year = choisedDate.getFullYear();
        let month = ("0" + (choisedDate.getMonth() + 1)).slice(-2);
        let day = ("0" + choisedDate.getDate()).slice(-2);

        let formattedDate = year + "-" + month + "-" + day;
        this.$emit("dateChanged", formattedDate);
      } else {
        this.$emit("dateChanged", date);
      }
    },
  },
  mounted() {
    this.setWidth();
  },
};
</script>

<style scoped>
.filter_by_date {
  width: 300px;
  position: relative;
}
::v-deep(.dp__input) {
  z-index: 12;
  padding: 14px 16px !important;
  border-radius: 12px !important;
  height: 52px !important;
  border: 1px solid var(--generalColorGrey) !important;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalColorSecondary);
}
.calendar_icon {
  z-index: 1;
  height: 24px;
  width: 24px;
  position: absolute;
  right: 15px;
  top: 12px;
}
::v-deep(.dp__clear_icon) {
  margin: 2px 40px 0 0;
}
</style>