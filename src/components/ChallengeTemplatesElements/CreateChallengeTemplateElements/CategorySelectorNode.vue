<template>
  <div class="category_selector_node">
    <div class="category_manipulations">
      <input 
        @input="updateSelectedCategories"
        v-model="categoriesTree.is_on" 
        type="checkbox" 
      />
      <button class="subtree_opener transparent-bg" @click="openSubtree">
        <h1 
          v-if="categoriesTree.children?.length > 0"
        >
          <SectionsCategoryOpenerIcon
            class="subtree_opener_icon"
            :class="{ opened: !subtreeOpened }"
          />
        </h1>
        <h1 class="category_name general-contrast-color">
          {{ categoriesTree.name }}
        </h1>
      </button>
    </div>
    <div
      v-if="subtreeOpened && categoriesTree.children?.length > 0"
      class="subtree"
    >
      <CategorySelectorNode
        v-for="category in categoriesTree.children"
        :categoriesTree="category"
        :autofilledCategories="autofilledCategories"
      />
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import SectionsCategoryOpenerIcon from "@/components/Icons/ChallengesIcons/SectionsCategoryOpenerIcon.vue";

export default {
  name: "CategorySelectorNode",
  props: {
    categoriesTree: {
      required: true,
    },
    autofilledCategories: {
      required: true,
    },
  },
  components: {
    SectionsCategoryOpenerIcon
  },
  data() {
    return {
      subtreeOpened: true,
    };
  },
  watch: {
    autofilledCategories: {
      handler() {
        this.autofillCategories();
      },
      deep: true,
      immediate: true,
    },
    categoriesTree: {
      handler() {
        this.autofillCategories();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    addToArr(num) {
      let arr = this.challengeTemplatesStore.selectedCategoriesList;
      if (!arr.includes(num)) {
        arr.push(num);
      }
    },
    updateSelectedCategories() {
      if (this.categoriesTree.is_on) {
        this.deleteFromArr(this.categoriesTree.id);
      } else {
        this.addToArr(this.categoriesTree.id);
      }
    },
    deleteFromArr(num) {
      let arr = this.challengeTemplatesStore.selectedCategoriesList;
      const index = arr.indexOf(num);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    },
    autofillCategories() {
      for (let i = 0; i < this.autofilledCategories?.length; ++i) {
        if (this.autofilledCategories[i].id === this.categoriesTree.id) {
          this.categoriesTree.is_on = true;
          this.addToArr(this.categoriesTree.id);
          break;
        }
      }
    },
    openSubtree() {
      this.subtreeOpened ^= true;
    },
  },
};
</script>

<style scoped>
.category_selector_node {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.category_manipulations {
  display: flex;
  align-items: center;
  gap: 5px;
}
.subtree_opener {
  display: flex;
  align-items: center;
  gap: 5px;
}
.subtree_opener_icon {
  height: 24px;
}
.subtree_opener_icon.opened {
  transform: rotate(180deg);
}
.category_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}
.subtree {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 10px;
}
</style>
