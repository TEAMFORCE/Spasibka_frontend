<template>
  <div class="challenge_templates_list">
    <ChallengeTemplateItem
      v-for="challengeTemplate in challengeTemplatesStore.challengeTemplatesList"
      :challengeTemplate="challengeTemplate"
      @challengeDeleted="challengeDeleted"
    />
  </div>
</template>

<script>
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index.js";
import { mapStores } from "pinia";
import ChallengeTemplateItem from "./ChallengeTemplatesListElements/ChallengeTemplateItem.vue";

export default {
  name: "ChallengeTemplatesList",
  components: {
    ChallengeTemplateItem,
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    challengeDeleted() {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
  },
};
</script>

<style scoped>
.challenge_templates_list {
  width: 100%;
  height: fit-content;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>