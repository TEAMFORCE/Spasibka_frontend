<template>
  <div class="challenge_teamplates_top_categories">
    <div v-for="category in sections" class="top_category">
      <div class="top_category_header">
        <h1 class="top_category_header_text general-contrast-color">
          {{ category.name }}
        </h1>
        <SectionsCategoryOpenerIcon
          @click="category.selected ^= 1"
          class="sections_category_opener"
          :class="{ category_closed: !category.selected }"
        />
      </div>
      <div
        class="sub_categories"
        v-if="
          category.selected && category.children && category.children.length > 0
        "
      >
        <ChallengeTemplatesSubCategories
          v-for="child in category.children"
          :key="child.id"
          :category="child"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SectionsCategoryOpenerIcon from "@/components/Icons/ChallengesIcons/SectionsCategoryOpenerIcon.vue";
import ChallengeTemplatesSubCategories from "./ChallengeTemplatesSubCategories.vue";

export default {
  name: "ChallengeTemplatesTopCategories",
  props: {
    sections: {
      required: true,
    },
  },
  components: {
    SectionsCategoryOpenerIcon,
    ChallengeTemplatesSubCategories,
  },
};
</script>

<style scoped>
.challenge_templates_top_categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.top_category {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.top_category_header {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}
.top_category_header_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.sections_category_opener {
  height: 24px;
  width: 24px;
}
.sections_category_opener.category_closed {
  transform: rotate(180deg);
}
.sections_category_opener:hover {
  cursor: pointer;
}
.sub_categories {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>