<template>
  <div
    class="filter_by_questionnaire_type_wrapper"
    ref="myQuestionnaireTypesFilter"
  >
    <div
      class="filter_by_questionnaire_type_input"
      :class="{ _black: currentTypes.length }"
      @click.stop="showList"
      ref="filter_input"
    >
      {{ getInputTitle() }}
      <SelectArrowIcon />
    </div>
    <Transition name="slide-fade">
      <div
        class="filter_by_questionnaire_type_list"
        v-if="listVisible"
        v-click-outside="showList"
      >
        <FilterByQuestionnaireTypeListItem
          v-for="item in questionnaireTypes"
          :item="item"
          :items="currentTypes"
          @itemChecked="itemChecked"
          @itemUnchecked="itemUnchecked"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import { QUESTIONNAIRE_TYPE } from "@/infrastructure/constants/questionnaire-type";
import { QUESTIONNAIRE_TYPES } from "@/infrastructure/data-sources/questionnaire-types";

import vSelect from "vue-select";
import SelectArrowIcon from "@/components/Icons/select_arrow.vue";
import FilterByQuestionnaireTypeListItem from "./FilterItem.vue";

export default {
  name: "FilterByQuestionnaireType",
  components: {
    vSelect,
    SelectArrowIcon,
    FilterByQuestionnaireTypeListItem,
  },
  props: {
    width: {
      default: "300px",
    },
  },
  data() {
    return {
      currentTypes: [],
      currentTypesForRequest: [],
      listVisible: false,
      checked: false,
    };
  },
  computed: {
    questionnaireTypes() {
      return QUESTIONNAIRE_TYPES(this);
    },
  },
  methods: {
    setWidth() {
      if (this.width) {
        this.$refs.myQuestionnaireTypesFilter.style.width = this.width;
      }
    },
    getInputTitle() {
      if (this.currentTypes.length) {
        let titles = this.currentTypes.map((item) => item.title);
        let titlesString = titles.join(", ");
        return titlesString;
      } else {
        return this.$t("types.questionaireTypes.title");
      }
    },
    showList() {
      this.listVisible ^= true;
    },
    itemChecked(item) {
      this.currentTypes.push(item);
      this.currentTypesForRequest.push(item.type);
      this.$emit("typeListChanged", this.currentTypesForRequest);
    },
    itemUnchecked(item) {
      this.currentTypes = this.currentTypes.filter(
        (el) => el.type !== item.type
      );
      this.currentTypesForRequest = this.currentTypesForRequest.filter(
        (el) => el !== item.type
      );
      this.$emit("typeListChanged", this.currentTypesForRequest);
    },
  },
  mounted() {
    this.setWidth();
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.filter_by_questionnaire_type_wrapper {
  width: 300px;
  position: relative;
}
.filter_by_questionnaire_type_input {
  width: 100%;
  height: 52px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalColorSecondary);
  cursor: pointer;
}
._black {
  color: var(--generalContrast);
}
.select_arrow_icon {
  margin: 2px 0 0 0;
}
.filter_by_questionnaire_type_list {
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 4px 15px rgba(176, 173, 173, 0.25);
  border-radius: 12px;
  position: absolute;
  z-index: 1000;
  top: 110%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}
</style>