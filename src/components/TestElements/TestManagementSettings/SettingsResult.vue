<template>
  <div class="settings_result">
    <div class="settings_result_header">
      <h2 class="settings_result_title">
        {{ $t("tests.settings.resultSettings.title") }}
      </h2>
      <h3 class="settings_result_description">
        {{ $t("tests.settings.resultSettings.description") }}
      </h3>
    </div>
    <div class="settings_result_item" v-for="(item, index) in defaultItems">
      <input
        type="text"
        class="_item_description_input"
        :placeholder="$t('tests.settings.resultSettings.inputDescription')"
        v-model="item.description"
      />
      <div class="_item_values_wrapper">
        <div class="_item_value_box">
          <input
            type="number"
            class="_item_value"
            placeholder="0"
            v-model="item.minValue"
          />
          <button class="_item_clear_value">
            <CloseIcon />
          </button>
        </div>
        <div class="_divider"></div>
        <div class="_item_value_box">
          <input
            type="number"
            class="_item_value"
            placeholder="10"
            v-model="item.maxValue"
          />
          <button class="_item_clear_value">
            <CloseIcon />
          </button>
        </div>
        <button class="_delete_item" @click="deleteItem(item)">
          <DeleteIcon :currentColor="getIconColor()" />
        </button>
      </div>
    </div>
    <button class="_add_item_button" @click="addItem">
      <PlusIcon :currentColor="getPlusIconColor()" />
      {{ $t("tests.settings.resultSettings.addRange") }}
    </button>
  </div>
</template>

<script>
import CloseIcon from "@/components/Icons/close_select.vue";
import DeleteIcon from "@/components/Icons/delete.vue";
import PlusIcon from "@/components/Icons/plus.vue";

export default {
  name: "SettingsResult",
  components: {
    CloseIcon,
    DeleteIcon,
    PlusIcon,
  },
  data() {
    return {
      defaultItems: [
        {
          id: 1,
          description: "",
          minValue: "",
          maxValue: "",
        },
        {
          id: 2,
          description: "",
          minValue: "",
          maxValue: "",
        },
      ],
    };
  },
  methods: {
    getIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalContrast"
      );
      return color;
    },
    getPlusIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalColorWhite"
      );
      return color;
    },
    deleteItem(item) {
      this.defaultItems = this.defaultItems.filter((el) => el.id !== item.id);
    },
    generateUniqueId(arr) {
      let newId;
      do {
        newId = Math.floor(Math.random() * 1000) + 1;
      } while (arr.some((item) => item.id === newId));
      return newId;
    },
    addItem() {
      this.defaultItems.push({
        id: this.generateUniqueId(this.defaultItems),
        description: "",
        minValue: "",
        maxValue: "",
      });
    },
  },
};
</script>

<style scoped>
.settings_result {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
}
.settings_result_header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.settings_result_title {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  margin: 0;
  color: var(--generalContrast);
}
.settings_result_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
  color: var(--generalColorSecondary);
}
.settings_result_item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
input {
  box-sizing: border-box;
  outline: none;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 16px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalContrast);
}
input::placeholder {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalColorSecondary);
}
._item_description_input {
  width: 567px;
  height: 52px;
}
._item_values_wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
._item_value_box {
  position: relative;
}
._item_value {
  width: 120px;
  height: 52px;
  padding: 16px 26px 16px 16px;
}
._item_clear_value {
  background-color: transparent;
  outline: none;
  position: absolute;
  right: 8px;
  top: 53%;
  transform: translate(0, -50%);
  transition: 0.3s;
}
._item_clear_value:active {
  transform: scale(0.9) translate(0, -50%);
}
._divider {
  width: 10px;
  height: 1px;
  background-color: var(--generalColorGrey);
}
._delete_item {
  width: 18px;
  height: 20px;
  background-color: transparent;
  margin: 0 0 0 4px;
}
._add_item_button {
  width: 239px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: var(--generalBrand);
  border-radius: 12px;
  outline: none;
  transition: 0.3s;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  color: var(--generalColorWhite);
}
._add_item_button:active {
  transform: scale(0.99);
  opacity: 0.9;
}
.plus_icon {
  width: 20px;
  height: 20px;
}
</style>