<template>
  <div 
    class="challenge_chains general-white-bg"
    ref="scrollContainer"
  >
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <div 
      class="chains_list"
      v-if="challengeChains"
    >
      <ChallengeChallengeCard
        v-for="item in challengeChains"
        :challenge="item"
      />    
    </div>
  </div>
</template>

<script>
import ChallengeChallengeCard from './ChallengeChallengeCard.vue';
import { API_URIS } from '@/constants/api';
import { useStore as useProfileStore } from "@/store/profile";
import axios from 'axios';
import { mapStores } from 'pinia';
import Loading from "vue3-loading-overlay";

export default {
  name: "ChallengeChallenges",
  props: {
    scrolledToBottom: {
      required: true
    }
  },
  components: {
    ChallengeChallengeCard,
    Loading,
  },
  data() {
    return {
      challengeChains: [],

      isLoading: false,
      stopFetching: false,
      offset: 1,
      limit: 20,
    }
  },
  mounted() {
  },
  computed: {
    ...mapStores(useProfileStore),
  },
  watch: {
    scrolledToBottom: {
      handler() {
        this.handleScrollEnd();
      }
    },
    isLoading: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      }
    },
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal) {
          this.getChainsList();
        }
      },
      immediate: true
    }
  },
  methods: {
    goToChallengeTemplates() {
      this.$router.push("/challenge_templates");
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      if (el) {
        const rect = el.getBoundingClientRect();
        const loaderEl = this.$refs.spinnerLoader.$el;
        loaderEl.style.position = "fixed";
        loaderEl.style.top = `${rect.top}px`;
        loaderEl.style.left = `${rect.left}px`;
        loaderEl.style.width = `${rect.width}px`;
        loaderEl.style.height = `${rect.height}px`;
      }
    },
    handleScrollEnd() {
      if (!this.isLoading && !this.stopFetching) {
        this.offset++;
        this.getChainsList();
      }
    },
    async getChainsList() {
      try {
        this.isLoading = true;
        let params = {
          offset: this.offset,
          limit: this.limit,
          dependent: this.$route.params.id
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params
        });
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
        this.challengeChains.push(...response.data.data);
        this.isLoading = false;
      } catch(err) {
        this.isLoading = false;
        throw err;
      }
    }
  }
}
</script>

<style scoped>
.challenge_chains {  
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 24px 0px 0px 24px;
  margin-bottom: 80px;
} 
@media (max-width: 768px) {
  .challenge_chains {
    padding: 24px;
  }
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

.tabs_and_actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.tabs {
  display: flex;
}
.actions {
  display: flex;
  gap: 12px;
}
.action_button {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: underline;
}
.chains_list {
  display: flex;
  gap: 29.5px;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>