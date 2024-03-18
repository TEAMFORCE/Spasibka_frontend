<template>
  <div class="category_selection">
    <button
      class="open_tree_button transparent-bg general-contrast-color"
      :class="{ no_border_bottom: treeOpened }"
      @click="toggleTree"
    >
      {{ $t("challenges.challenge_templates.categories") }}
      <SectionsCategoryOpenerIcon
        class="subtree_opener_icon"
        :class="{ opened: !treeOpened }"
      />
    </button>
    <div 
      v-if="treeOpened"
      class="category_selectors"
    >
      <CategorySelectorNode
        v-for="category in categoriesTree"
        :categoriesTree="category"
        :autofilledCategories="autofilledCategories"
      />  
    </div>
  </div>
</template>

<script>
import CategorySelectorNode from './CategorySelectorNode.vue';
import SectionsCategoryOpenerIcon from '@/components/Icons/ChallengesIcons/SectionsCategoryOpenerIcon.vue';

export default {
  name: "CategorySelection",
  props: {
    categoriesTree: {
      required: true
    },
    autofilledCategories: {
      required: true
    }
  },
  components: { 
    CategorySelectorNode,
    SectionsCategoryOpenerIcon
  },
  data() {
    return {
      treeOpened: false,
      selectedCategories: "Open",
    }
  },
  methods: {
    toggleTree() {
      this.treeOpened ^= true;
    }
  }
}
</script>

<style scoped>
.category_selection {
  display: flex;
  flex-direction: column;
}
.open_tree_button {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  align-items: center;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}
.open_tree_button.no_border_bottom {
  border-bottom: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.subtree_opener_icon {
  height: 24px;
}
.subtree_opener_icon.opened {
  transform: rotate(180deg);
}
.category_selectors {
  padding: 0px 16px 16px 16px;
  border: 1px solid var(--generalColorGrey);
  border-top: none;
  border-radius: 0px 0px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>