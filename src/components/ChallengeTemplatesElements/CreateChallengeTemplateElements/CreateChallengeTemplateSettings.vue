<template>
  <div 
    class="create_challenge_template_settings general-white-bg"
  >
    <div class="header_info">
      <h1 class="header_main general-contrast-color"> {{ $t("challenges.challenge_templates.settings")  }}</h1>
      <h1 class="header_additional general-secondary-color"> {{ $t("challenges.challenge_templates.set_limitations") }}</h1>
    </div>
    <!-- <vSelect
      v-model="challengeType"
      :options="challengeTypes"
      :placeholder="$t('challenges.challenge_templates.challenge_type')"
      label="name"
      @option:selected="changeOrganization()"
    /> -->
    <div class="settings_tumblers">
      <div 
        class="tubmler_and_description_wrapper"
        v-for="(setting, index) in challengeTemplatesStore.settings"  
      >
        <div 
          v-if="validSetting(setting)"
          class="tumbler_and_description"
          :class="{ border_bottom: index < challengeTemplatesStore.settings.length - 1 }"
        >
          <h1
            class="setting_description general-contrast"
          >
            {{ setting.name }}
          </h1>
          <div 
            class="tumbler general-grey-bg" 
            :class="{ 'is-active': challengeTemplatesStore.settings[index].isActive }" 
            @click="toggleButton(index)"
          >
            <div 
              class="tumbler-button general-white-bg" 
            >        
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="action_buttons">
      <button 
        class="action_button general-brand-bg general-white-color"
        @click="saveSettings"
      >
        {{ $t("challenges.challenge_templates.save_template") }}
      </button>
      <button 
        class="action_button brand-secondary-bg general-brand-color"
        @click="cancelSettings"
      >
        {{ $t("challenges.challenge_templates.cancel_settings") }}
      </button>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

import { mapStores } from 'pinia';
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { useStore as useProfileStore } from "@/store/profile";
import { notify } from '@/general-scripts/toast-notification';

export default {
  name: "CreateChallengeTemplateSettings",
  components: {
    vSelect
  },
  data(){
    return {
      isActive: false,
      // challengeType: [
      //   {
      //     name: $t("challenges.challenge_templates.challenge_with_voting")
      //   },
      //   {
      //     name: $t("challenges.challenge_templates.challenge_with_voting")
      //   }
      // ],
    }
  },
  mounted(){
    let selectedTemplate = this.challengeTemplatesStore.selectedTemplate;
    if (selectedTemplate){
      let settings = this.challengeTemplatesStore.settings;
      for (let i = 0; i < settings.length; ++i){
        if (settings[i].fieldName == "challenge_with_voting"){
          if (selectedTemplate.challenge_type == "voting"){
            settings[i].isActive = true;
          } else {
            settings[i].isActive = false;
          }
        }
        if (settings[i].fieldName == "multiple_reports"){
          settings[i].isActive = selectedTemplate.multiple_reports;
        } 
        if (settings[i].fieldName == "show_contenders"){
          settings[i].isActive = selectedTemplate.show_contenders;
        }
      }
    }
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useProfileStore),
    role(){
      if (this.profileStore?.profileInfo?.superuser) return 2;
      else {
        let rolesList = this.profileStore?.profileInfo?.privileged;
        for (let i = 0; i < rolesList?.length; ++i){
          if (rolesList[i].role_name === "Администратор") return 1;
        }
        return 0;
      }
    },
  },
  methods: {
    validSetting(setting){
      if (setting.fieldName === "visible_to_org" && this.role < 1){
        return false;
      } else if (setting.fieldName === "visible_to_all" && this.role < 2){
        return false;
      } else {
        return true;
      }
    },
    toggleButton(index) {
      let settings = this.challengeTemplatesStore.settings;
      let enabledSettingScope = 0;

      settings[index].isActive ^= true;
      if (settings[index].isActive) enabledSettingScope = settings[index].scope;
      if (settings[index].visibility){
        for (let i = 0; i < settings.length; ++i){
          if (i != index && settings[i].visibility){
            settings[i].isActive = false;
          }
        }
        if (!settings[index].isActive){
          for (let i = 0; i < settings.length; ++i){
            if (settings[i].fieldName == "visible_to_me"){
              settings[i].isActive = true;
              enabledSettingScope = settings[i].scope;
              break;
            }
          }
        }
      }

      let navigationTabs = this.challengeTemplatesStore?.categoriesNavigationTabs;
      for (let i = 0; i < navigationTabs?.length; ++i) {
        if (navigationTabs[i].scope === enabledSettingScope) {
          this.challengeTemplatesStore.selectedCategoryNavigationTab = navigationTabs[i];
          this.challengeTemplatesStore.getCategoriesList();
          break;
        }
      }

      if (settings[index].fieldName == "challenge_with_voting" &&
        settings[index].isActive){
        for (let i = 0; i < settings.length; ++i){
          if (settings[i].fieldName == "show_contenders"){
            settings[i].isActive = true;
            break;
          }
        }
      }

      if (settings[index].fieldName == "show_contenders" &&
        !settings[index].isActive
      ) {
        for (let i = 0; i < settings.length; ++i){
          if (settings[i].fieldName == "challenge_with_voting" &&
            settings[i].isActive){
              settings[index].isActive = true;
              break;
            }
        }
      }
    },
    cancelSettings(){
      this.challengeTemplatesStore.settings.map((e) => e.isActive = e.isActiveDefault);
      this.challengeTemplatesStore.openedTab = "inputs";
      notify(this.$t("challenges.challenge_templates.settings_cancelled"), "success");
    },
    saveSettings(){
      this.challengeTemplatesStore.openedTab = "inputs";
      notify(this.$t("challenges.challenge_templates.settings_saved"), "success");
    }
  }
}
</script>

<style scoped>
.create_challenge_template_settings {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;   
  padding: 32px;
  gap: 16px;
  margin: auto;
}
.header_info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.header_main {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.header_additional {
  font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
}
.settings_tumblers {
  margin-top: 8px;
}
.tubmler_and_description_wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tumbler_and_description {
  padding: 16px;
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
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

</style>