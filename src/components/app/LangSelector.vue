<template>
  <div
    class="lang_selector"
    v-click-outside="closeLangList"
    @click="openOrCloseLangList"
  >
    <div class="_current_lang_wrapper">
      <h3 class="lang_selector_title">
        {{ $t("profile.lang.title") }}
      </h3>
      <div class="current_locale">
        <component :is="currentLang.icon"></component>
        <span class="current_locale_name">
          {{ currentLang.title }}
        </span>
        <ChangeStatusIcon />
      </div>
    </div>
    <Transition name="fade" mode="out-in">
      <div v-show="langListVisible" class="_lang_list">
        <div
          class="_lang_list_item"
          v-for="locale in localesDataSource"
          @click="setLanguage(locale.locale)"
        >
          <component :is="locale.icon"></component>
          <span class="_lang_list_item_title">
            {{ locale.title }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { LOCALES } from "@/infrastructure/data-sources/locales";
import RuFlagIcon from "@/components/Icons/RuFlag.vue";
import EnFlagIcon from "@/components/Icons/EnFlag.vue";

import ChangeStatusIcon from "@/components/Icons/ProfileIcons/ChangeStatusIcon.vue";

export default {
  name: "LangSelector",
  components: {
    ChangeStatusIcon,
    RuFlagIcon,
    EnFlagIcon,
  },
  data() {
    return {
      langListVisible: false,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    localesDataSource() {
      return LOCALES(this);
    },
    currentLang() {
      return this.localesDataSource.find(
        (el) => el.locale === this.$i18n.locale
      );
    },
  },
  methods: {
    openOrCloseLangList() {
      if (this.langListVisible) {
        this.langListVisible = false;
      } else {
        this.langListVisible = true;
      }
    },
    closeLangList() {
      this.langListVisible = false;
    },
    async setLanguage(locale) {
      try {
        let response = await axios.patch(API_URIS.profileSettings, {
          language: locale,
        });
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          localStorage.setItem("lang", locale);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      } catch (error) {
        throw error;
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.lang_selector {
  width: 257px;
  border-radius: 12px;
  background-color: var(--minorInfoSecondaryColor);
  cursor: pointer;
  position: relative;
  user-select: none;
}
._current_lang_wrapper {
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 12px 16px;
}
.lang_selector_title {
  margin: 0;
  font-family: "Ubuntu";
  font-size: 16px;
  font-weight: 500;
  color: var(--generalBrand);
}
.current_locale {
  display: flex;
  align-items: center;
  gap: 8px;
}
.current_locale_name {
  margin: 0;
  font-family: "Ubuntu";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalBrand);
}
.change_status_icon {
  margin: 6px 0 0 0;
}
._lang_list {
  width: 160px;
  background-color: var(--generalColorWhite);
  border-radius: 8px;
  padding: 4px 0px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 120%;
  left: 100%;
  transform: translate(-100%, 0);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
._lang_list_item {
  width: 100%;
  height: 32px;
  padding: 5px 12px 5px 22px;
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  align-items: center;
  transition: 0.3s;
}
._lang_list_item_title {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
._lang_list_item:hover {
  transform: scale(1.02) translate(2%);
}
</style>