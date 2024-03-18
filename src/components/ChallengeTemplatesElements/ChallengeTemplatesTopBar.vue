<template>
  <div class="challenge_templates_top_bar general-white-bg">
    <div class="challenges_filters">
      <button
        class="challenge_filter minor-info-secondary-bg general-contrast-color"
        :class="{ active: filter.name == challengeTemplatesStore.selectedFilter.name }"
        v-for="filter in challengeTemplatesStore.challengeTemplatesFilters"
        @click="selectFilter(filter)"
      > 
        {{ filter.name }}
      </button>
    </div>
    <div 
      class="challenges_actions"
      v-if="isPrivileged"
    >
      <h1
        class="challenge_action general-brand-color"
        v-for="action in challengeTemplatesActions"
        @click="action.onClick"
      >
        {{ action.name }}
      </h1>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index.js";
import { useStore as useProfileStore } from "@/store/profile";

export default {
  name: "ChallengeTemplatesTopBar",
  data(){
    return {
      challengeTemplatesActions: [
        {
          name: this.$t("challenges.challenge_templates.create_new_template"),
          onClick: () => {
            this.challengeTemplatesStore.createChallengeTemplateEnabled = true;
          }
        },
      ],
    }
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useProfileStore),
    isPrivileged(){
      let scope = this.challengeTemplatesStore?.selectedFilter?.scope;
      if (scope === 0) return true;
      else if (scope === 1){
        let roles = this.profileStore?.profileInfo?.privileged;
        if (roles && roles.length > 0){
          for (let i = 0; i < roles.length; ++i){
            if (roles[i].role_name === "Администратор") return true;
          }
        }
        return false;
      } else {
        let superuser = this.profileStore?.profileInfo?.superuser;
        if (superuser) return true;
        return false;
      }
    }
  },
  methods: {
    selectFilter(filter){
      this.challengeTemplatesStore.selectFilter(filter);
    }
  }
}
</script>

<style scoped>
.challenge_templates_top_bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.challenges_filters {
  display: flex;
  gap: 8px;
}
.challenge_filter {
  border-radius: 12px;
  padding: 8px 14px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.challenge_filter.active {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}


.challenges_actions {
  display: flex;
  gap: 21px;
}
.challenge_action {
  font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.28px;
  text-decoration-line: underline;
}
.challenge_action:hover {
  cursor: pointer;
}
</style>