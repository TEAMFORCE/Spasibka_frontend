<template>
  <div class="challenge_templates_sub_categories">
    <div class="sub_category_header">
      <SectionSelectedIcon 
        @click="deselectCategory()"
        v-if="isSelected" 
        class="selector_icon" 
      />
      <SectionUnselectedIcon
        @click="selectCategory()"
        v-else
        class="selector_icon"
      />
      <h1 class="category_name general-contrast-color">{{ category.name }}</h1>
    </div>
    <div
      class="category_children"
      v-if="category.children && category.children.length > 0"
    >
      <CategoryAdditionTreeNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
      />
    </div>
  </div>
</template>

<script>
import SectionSelectedIcon from "@/components/Icons/ChallengesIcons/SectionSelectedIcon.vue";
import SectionUnselectedIcon from "@/components/Icons/ChallengesIcons/SectionUnselectedIcon.vue";
import CategoryAdditionTreeNode from "./CategoryAdditionTreeNode.vue";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";

export default {
  name: "CategoryAdditionTreeNode",
  components: {
    SectionSelectedIcon,
    SectionUnselectedIcon,
    CategoryAdditionTreeNode,
  },
  props: {
    category: {
      required: true,
    },
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    isSelected() {
      return (
        this.category.id ===
        this.challengeTemplatesStore.selectedSectionForAddition
      );
    },
  },
  methods: {
    selectCategory() {
      this.challengeTemplatesStore.selectedSectionForAddition =
        this.category.id;
      // category.selected = true;
    },
    deselectCategory() {
      this.challengeTemplatesStore.selectedSectionForAddition = null;
      // category.selected = false;
    },
  },
};
</script>

<style scoped>
.challenge_templates_sub_categories {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sub_category_header {
  display: flex;
  gap: 10px;
}
.selector_icon {
  height: 20px;
  width: 20px;
}
.selector_icon:hover {
  cursor: pointer;
}
.category_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.category_children {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
