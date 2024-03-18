<template>
  <div class="search_by_worker_status">
    <input
      class="search_by_user_input"
      type="text"
      :placeholder="$t('employeesPage.searchByUser')"
      v-model="searchByUsername"
      v-debounce:800="searchByUser"
    />
    <div class="filter_by_statuses">
      <h3 class="filter_title">{{ $t("employeesPage.status") }}</h3>
      <div class="checkbox_wrapper" v-if="isAdmin">
        <input
          type="checkbox"
          class="checkbox"
          v-model="currentStatuses.dismissed"
        />
        <span class="item_text" @click="showChildren">
          {{ $t("employeesPage.dismissed") }}
        </span>
      </div>
      <div class="checkbox_wrapper">
        <input
          type="checkbox"
          class="checkbox"
          v-model="currentStatuses.inOffice"
        />
        <span class="item_text" @click="showChildren">
          {{ $t("employeesPage.inOffice") }}
        </span>
      </div>
      <div class="checkbox_wrapper">
        <input
          type="checkbox"
          class="checkbox"
          v-model="currentStatuses.inVacation"
        />
        <span class="item_text" @click="showChildren">
          {{ $t("employeesPage.inVacation") }}
        </span>
      </div>
      <div class="checkbox_wrapper">
        <input
          type="checkbox"
          class="checkbox"
          v-model="currentStatuses.remotely"
        />
        <span class="item_text" @click="showChildren">
          {{ $t("employeesPage.remotely") }}
        </span>
      </div>
      <div class="checkbox_wrapper">
        <input
          type="checkbox"
          class="checkbox"
          v-model="currentStatuses.onSick"
        />
        <span class="item_text" @click="showChildren">
          {{ $t("employeesPage.onSick") }}
        </span>
      </div>
    </div>
    <div class="buttons_wrapper">
      <button class="save_button" @click="saveFilter">
        {{ $t("employeesPage.save") }}
      </button>
      <button class="reset_button" @click="resetFilter">
        {{ $t("employeesPage.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { vue3Debounce } from "vue-debounce";
import { ROLE_TYPE } from "@/infrastructure/constants/role-type";
// import { debounce } from "vue-debounce";

export default {
  name: "SearchByWorkerStatus",
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  props: {
    statuses: {
      type: Object,
      requred: true,
    },
  },
  data() {
    return {
      searchByUsername: "",

      currentStatuses: {
        dismissed: false,
        inOffice: false,
        inVacation: false,
        remotely: false,
        onSick: false,
      },
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    isAdmin() {
      if (this.profileInfo?.privileged.length > 0) {
        if (
          this.profileInfo.privileged.some((el) => el.role == ROLE_TYPE.admin)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    saveFilter() {
      this.$emit("filterChanged", this.currentStatuses);
    },
    resetFilter() {
      this.currentStatuses.dismissed = false;
      this.currentStatuses.inOffice = false;
      this.currentStatuses.inVacation = false;
      this.currentStatuses.remotely = false;
      this.currentStatuses.onSick = false;
      this.$emit("filterChanged", this.currentStatuses);
    },
    searchByUser() {
      this.$emit("searchByUsername", this.searchByUsername);
    },
  },
  mounted() {
    this.currentStatuses = this.statuses;
  },
};
</script>

<style scoped>
.search_by_worker_status {
  width: 255px;
  min-height: 344px;
  border-radius: 12px;
  border: 1px solid var(--negativeSecondary);
  padding: 24px;
  background-color: var(--generalColorWhite);
  position: sticky;
  top: 136px;
  z-index: 10000;
}
.search_by_user_input {
  background-color: var(--generalColorWhite);
  width: 229px;
  height: 22px;
  padding: 8px 12px;
  border: 1px solid var(--neutral5);
  border-radius: 8px;
  outline: none;
  color: var(--generalColorSecondary);
  font-size: 16px;
}
.filter_by_statuses {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  margin: 24px 0 0 0;
}
.filter_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: var(--generalColorDark);
  margin: 0;
}
.checkbox_wrapper {
  display: flex;
  align-items: center;
  gap: 9px;
}
.checkbox {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #ecf0f3;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
.item_text {
  font-family: "Golos" !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: var(--generalColorDark);
  margin: 0;
}
.buttons_wrapper {
  margin: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 255px;
}
.save_button {
  width: 100%;
  height: 49px;
  border-radius: 9px;
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  transition: 0.4s;
}
.save_button:hover {
  background-color: var(--generalBrandLight);
}
.save_button:active {
  transform: scale(0.99);
}
.reset_button {
  background-color: transparent;
  font-family: "Golos";
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: var(--generalBrand);
}
</style>