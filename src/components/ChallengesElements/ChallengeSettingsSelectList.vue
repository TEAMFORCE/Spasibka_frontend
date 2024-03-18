<template>
  <div class="challenge_settings_select_list">
    <button
      class="toggle_list_button general-white-bg"
      @click="settingsListOpened ^= true"
    >
      <h1 class="selected_item_text general-contrast-color">
        {{ selectedSettingsOption?.name }}
      </h1>
    </button>
    <div class="settings_list_wrapper" v-if="settingsListOpened">
      <button
        class="settings_list general-white-bg"
        v-for="item in settings"
        @click="selectItem(item)"
      >
        <h1 class="settings_option_text general-contrast-color">
          {{ item.name }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChallengeSettingsSelectList",
  props: {
    settings: {
      required: true,
    },
    selectedSettingsItem: {}
  },
  data() {
    return {
      selectedItem: null,
      settingsListOpened: false,
    };
  },
  mounted(){
    
  },
  computed: {
    selectedSettingsOption() {
      if (this.selectedItem) return this.selectedItem;
      else {
        if (this.settings?.length) return this.settings[0];
        else return null;
      }
    },
  },
  methods: {
    selectItem(item) {
      this.settingsListOpened = false;
      this.selectedItem = item;
      this.$emit("selectSettingsOption", item);
    },
  },
};
</script>

<style scoped>
.settings_list_wrapper {
  display: flex;
  flex-direction: column;
}
.toggle_list_button {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--generalBrand);
  border-radius: 6px;
}
.settings_list {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 6px;
}
.selected_item_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.settings_option_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
