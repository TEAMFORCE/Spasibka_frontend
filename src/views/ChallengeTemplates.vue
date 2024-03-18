<template>
  <div
    class="challenge_templates general-white-bg"
    v-scroll-end="handleScrollEnd"
    ref="scrollContainer"
  >
    <Loading
      class="spinner_loader"
      :active="challengeTemplatesStore.isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <CreateChallenge
      v-if="challengesStore?.createChallengeEnabled"
      @click.stop
      :challengeTemplate="challengeTemplatesStore?.selectedTemplate"
    />
    <CreateChallengeTemplate
      v-if="challengeTemplatesStore.createChallengeTemplateEnabled"
    />
    <button
      class="back_to_challenges general-contrast-color brand-secondary-bg"
      @click="backToChallenges"
    >
      {{ $t("challenges.challenge_templates.back_to_challenges") }}
      <BackToChallengesIcon
        class="back_icon"
        :currentColor="getBackIconColor"
      />
    </button>
    <h1 class="header_text general-contrast-color">
      {{ $t("challenges.challenge_templates.challenge_templates") }}
    </h1>
    <ChallengeTemplatesTopBar />
    <div class="list_and_sections">
      <ChallengeTemplatesList />
      <ChallengeTemplatesSections
        class="challenges_templates_sections_component"
      />
    </div>
  </div>
</template>

<script>
import ChallengeTemplatesTopBar from "@/components/ChallengeTemplatesElements/ChallengeTemplatesTopBar.vue";
import ChallengeTemplatesList from "@/components/ChallengeTemplatesElements/ChallengeTemplatesList.vue";
import CreateChallengeTemplate from "@/components/ChallengeTemplatesElements/CreateChallengeTemplate.vue";
import CreateChallenge from "@/components/ChallengesElements/CreateChallenge.vue";

import BackToChallengesIcon from "@/components/Icons/back_to_challenges.vue";

import Loading from "vue3-loading-overlay";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index.js";
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index";
import ChallengeTemplatesSections from "@/components/ChallengeTemplatesElements/ChallengeTemplatesSections.vue";

export default {
  name: "ChallengeTemplates",
  components: {
    BackToChallengesIcon,
    ChallengeTemplatesTopBar,
    ChallengeTemplatesList,
    CreateChallengeTemplate,
    Loading,
    ChallengeTemplatesSections,
    CreateChallenge,
  },
  directives: {
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler; // Store the handler on the element
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useChallengesStore),
    getBackIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalContrast"
      );
      return color;
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.challengeTemplatesStore.selectFilter(
      this.challengeTemplatesStore.selectedFilter
    );
    this.ensureScrollable();
  },
  watch: {
    "challengeTemplatesStore.isLoading": {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    "challengeTemplatesStore.selectedFilter": {
      handler() {
        if (this.challengeTemplatesStore.challengeTemplatesList.length == 0) {
          setTimeout(() => this.ensureScrollable(), 300);
        }
      },
    },
  },
  methods: {
    backToChallenges() {
      this.$router.go(-1);
    },
    createChallengeTemplateCancel() {
      this.challengeTemplatesStore.createChallengeTemplateEnabled = false;
      this.challengeTemplatesStore.selectFilter(
        this.challengeTemplatesStore.selectedFilter
      );
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    handleScrollEnd() {
      if (!this.challengeTemplatesStore.isLoading) {
        this.challengeTemplatesStore.fetchOlderTemplates().then(() => {
          this.ensureScrollable();
        });
      }
    },
    ensureScrollable() {
      if (!this.challengeTemplatesStore.isLoading) {
        if (!this.challengeTemplatesStore.stopFetching) {
          const el = this.$refs.scrollContainer;
          if (el.clientHeight >= el.scrollHeight) {
            this.challengeTemplatesStore.fetchOlderTemplates().then(() => {
              this.ensureScrollable();
            });
          }
        }
      } else {
        setTimeout(() => this.ensureScrollable(), 300);
      }
    },
  },
};
</script>

<style scoped>
.challenge_templates {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
  padding: 52px;
  border-radius: 24px 0px 0px 24px;
  margin-bottom: 80px;
  overflow-y: auto;
}
.challenge_templates::-webkit-scrollbar {
  width: 8px;
}
.challenge_templates::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 768px) {
  .challenge_templates {
    padding: 24px;
  }
}
.back_to_challenges {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  padding: 12px 20px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
.back_icon {
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header_text {
  margin-top: 8px;
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}
.list_and_sections {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
</style>