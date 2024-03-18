<template>
  <div class="challenge_templates_sections">
    <h1 class="sections_header_text general-dark-color">
      {{ $t("challenges.challenge_templates.select_parent_category") }}
    </h1>
    <!-- <ChallengeTemplatesTopCategories
      :sections="sections.data"
    /> -->
    <div class="sections">
      <CategoryAdditionTreeNode
        v-for="section in sections.data"
        :category="section"
      />
    </div>
    <!-- <button
      class="reset_filters transparent-bg general-brand-color"
      @click="resetFilters"
    >
      {{ $t("challenges.challenge_templates.reset_filters") }}
    </button> -->
  </div>
</template>

<script>
import axios from "axios";
import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { API_URIS } from "@/constants/api";
import CategoryAdditionTreeNode from "./CategoryAdditionTreeNode.vue";

export default {
  name: "CategoryAdditionTree",
  components: {
    CategoryAdditionTreeNode,
  },
  data() {
    return {
      sections: {
        data: [],
      },
    };
  },
  watch: {
    "challengeTemplatesStore.selectedCategoryNavigationTab": {
      handler() {
        this.getSections();
      },
      immediate: true,
    },
    "challengeTemplatesStore.categoriesList": {
      handler() {
        this.getSections();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    async getSections() {
      try {
        let params = {
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
        };
        const response = await axios.get(API_URIS.getSections, {
          params: params,
        });
        this.sections = response.data;
      } catch (err) {
        throw err;
      }
    },
    resetFilters() {
      this.deselectAllSections(this.sections.data);
      //this.challengeTemplatesStore.selectFilter(this.challengeTemplatesStore.selectedFilter);
    },
    deselectAllSections(list) {
      if (!list || list.length == 0) return;
      for (let i = 0; i < list.length; ++i) {
        list[i].selected = false;
        this.deselectAllSections(list[i].children);
      }
    },
  },
};
</script>

<style scoped>
.challenge_templates_sections {
  display: flex;
  height: fit-content;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
}
.sections_header_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-align: left;
}
.sections {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.reset_filters {
  padding: 12px;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
}
</style>
