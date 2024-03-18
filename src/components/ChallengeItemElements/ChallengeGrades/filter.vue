<template>
  <div class="challenge_grades_filter_wrapper">
    <button
      class="filter_button"
      v-for="(button, index) in gradeFilterTypes"
      @click="changeFilterType(button.id)"
      :class="{
        active: currentGradeFilterType == button.id,
      }"
    >
      <span v-if="button.title !== null" class="filter_button_text">{{
        button.title
      }}</span>
      <div v-if="button.icon !== null" class="filter_button_icon_wrapper">
        <LikeIcon
          v-if="button.icon == 'LikeIcon'"
          :currentColor="getIconColor(button)"
        />
        <DislikeIcon
          v-if="button.icon == 'DislikeIcon'"
          :currentColor="getIconColor(button)"
        />
      </div>
    </button>
  </div>
</template>

<script>
import { GRADE_FILTER_TYPE } from "@/infrastructure/constants/grade-filter-type";
import { GRADE_FILTER_TYPES } from "@/infrastructure/data-sources/grades-sort-types";

import LikeIcon from "@/components/Icons/like.vue";
import DislikeIcon from "@/components/Icons/dislike.vue";

export default {
  name: "ChallengeGradesFilter",
  components: {
    LikeIcon,
    DislikeIcon,
  },
  data() {
    return {
      currentGradeFilterType: GRADE_FILTER_TYPE.all,
    };
  },
  computed: {
    gradeFilterTypes() {
      return GRADE_FILTER_TYPES(this);
    },
  },
  methods: {
    getIconColor(button) {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");

      if (this.currentGradeFilterType === button.id) {
        return generalColorWhite;
      } else {
        return generalContrast;
      }
    },
    changeFilterType(type) {
      this.currentGradeFilterType = type;
      this.$emit("filterTypeChanged", type);
    },
  },
};
</script>

<style scoped>
.challenge_grades_filter_wrapper {
  max-width: 662px;
  display: flex;
  gap: 8px;
}
.filter_button {
  width: 32px;
  height: 32px;
  background-color: var(--minorInfoSecondaryColor);
  border-radius: 8px;
  padding: 0;
}
.filter_button.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.filter_button_text {
  font-family: "Roboto";
  font-weight: 500;
  font-size: 10px;
}
.filter_button_icon_wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.like_icon {
  height: 16px;
  width: 16px;
}
.dislike_icon {
  height: 16px;
  width: 16px;
}
</style>