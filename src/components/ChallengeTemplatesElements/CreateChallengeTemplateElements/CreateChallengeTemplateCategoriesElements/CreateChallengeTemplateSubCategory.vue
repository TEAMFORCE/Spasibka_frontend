<template>
  <div
    class="create_challenge_template_sub_category"
  >
    <div class="sub_category_header">
      <div class="icon_and_text">
        <DeleteCategoryIcon
          @click="openCategoryDeletion"
          class="delete_category_icon"
        />
        <h1 
          class="sub_category_header_text general-contrast-color"
          :class="{ not_bold: !(category.children?.length > 0) }"
        >
          {{ category.name }}
        </h1>
      </div>
      <SectionsCategoryOpenerIcon
        v-if="category.children?.length > 0"
        class="category_opener_icon"
        @click="category.opened ^= true"
        :class="{ closed: !category?.opened }"
      />
    </div>
    <div 
      v-if="category.opened && category.children?.length > 0"
      class="sub_categories_list"
    >
      <CreateChallengeTemplateSubCategory
        v-for="subCategory in category.children"
        :category="subCategory"
      />
    </div>
  </div>
</template>

<script>
import DeleteCategoryIcon from '@/components/Icons/ChallengesIcons/DeleteCategoryIcon.vue';
import SectionsCategoryOpenerIcon from '@/components/Icons/ChallengesIcons/SectionsCategoryOpenerIcon.vue';
import CreateChallengeTemplateSubCategory from "./CreateChallengeTemplateSubCategory.vue";
import { mapStores } from 'pinia';
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { notify } from '@/general-scripts/toast-notification';

export default {
  name: "CreateChallengeTemplateSubCategory",
  props: {
    category: {
      required: true
    }
  },  
  components: {
    DeleteCategoryIcon,
    SectionsCategoryOpenerIcon,
    CreateChallengeTemplateSubCategory
  },
  data(){
    return {
    }
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    openCategoryDeletion(){
      if (this.category.children?.length > 0){
        notify(this.$t("challenges.challenge_templates.cannot_delete_category_with_children"));  
      } else {
        this.challengeTemplatesStore.openedTab = "delete_category"; 
        this.challengeTemplatesStore.selectedCategoryForDelete = this.category;
      }
    }
  }
}
</script>

<style scoped>
.create_challenge_template_sub_category {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.delete_category_icon {
  height: 24px;
  width: 24px;
}
.delete_category_icon:hover {
  cursor: pointer;
}
.sub_category_header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.icon_and_text {
  display: flex;
  gap: 8px;
}
.sub_category_header_text {
  font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}
.sub_category_header_text.not_bold {
  font-weight: 400;
}
.category_opener_icon {
  width: 24px;
  height: 24px;
}
.category_opener_icon.closed {
  transform: rotate(180deg);
}
.category_opener_icon:hover {
  cursor: pointer;
}
.sub_categories_list {
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>