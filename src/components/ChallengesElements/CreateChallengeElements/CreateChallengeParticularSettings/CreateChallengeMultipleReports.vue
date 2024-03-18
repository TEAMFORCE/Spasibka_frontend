<template>
  <div class="create_challenge_multiple_reports">
    <div 
      class="tubmler_and_description_wrapper"
    >
      <div 
        class="tumbler_and_description"
      >
        <h1
          class="setting_description general-contrast"
        >
          {{ $t("challenges.challenge_settings.multiple_reports") }}
        </h1>
        <div 
          class="tumbler general-grey-bg" 
          :class="{ 'is-active': createChallengeStore?.multipleReports }" 
          @click="createChallengeStore.multipleReports ^= 1"
        >
          <div 
            class="tumbler-button general-white-bg" 
          >        
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

export default {
  name: "CreateChallengeMultipleReports",
  data(){
    return {}
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
  }
}
</script>

<style scoped>
.create_challenge_multiple_reports {
  
}
.tubmler_and_description_wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tumbler_and_description {
  /* padding: 16px; */
  display: flex;
  justify-content: space-between;
}
.tumbler_and_description.border_bottom {
  border-bottom: 1px solid var(--generalColorGrey);
}
.setting_description {
  font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.tumbler {
  height: 23.85px;
  width: 39.23px;
  border-radius: 11.925px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1.54px;
  box-sizing: border-box;
}
.tumbler.is-active {
  justify-content: flex-end;
  background-color: var(--generalBrand);
}

.tumbler-button {
  width: 20.77px;
  height: 20.77px;
  border-radius: 50%;
  transition: transform 0.3s;  
}
</style>