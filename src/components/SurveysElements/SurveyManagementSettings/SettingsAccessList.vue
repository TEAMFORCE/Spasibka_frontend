<template>
  <div class="settings_access_list">
    <div class="settings_access_list_header">
      <h3 class="settings_access_list_title">
        {{ $t("surveys.management_settings.survey_access") }}
      </h3>
      <h4 class="settings_access_list_description">
        {{ $t("surveys.management_settings.survey_accessDesc") }}
      </h4>
    </div>
    <div class="settings_access_list_search_wrapper">
      <input
        type="text"
        class="settings_access_list_search"
        :placeholder="$t('surveys.management_settings.search')"
        v-model="searchString"
        v-debounce:800="searchByUser"
      />
      <SearchIcon />
    </div>
    <div class="settings_access_list_users" v-if="!searchString">
      <div class="_list_item" v-for="item in userList">
        <div class="_list_item_parent">
          <input
            type="checkbox"
            class="checkbox"
            v-model="item.selected"
            @change="parentChecked(item)"
          />
          <span class="_list_item_title" @click="openChildList(item)">
            {{ item[0] }}
          </span>
        </div>
        <div
          class="_list_item_children"
          v-if="
            (item[1].length && item.selected) ||
            (item[1].length && item.childOpened)
          "
        >
          <div class="_list_sub_item" v-for="subItem in item[1]">
            <input
              type="checkbox"
              class="checkbox"
              v-model="subItem.selected"
              @change="childChecked(subItem)"
            />
            <span class="_list_sub_item_title">
              {{ subItem.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div class="settings_access_list_users" v-else>
      <div class="_list_item" v-for="item in findedUserList">
        <div class="_list_item_parent">
          <input
            type="checkbox"
            class="checkbox"
            v-model="item.selected"
            @change="parentChecked(item)"
          />
          <span class="_list_item_title" @click="openChildList(item)">
            {{ item[0] }}
          </span>
        </div>
        <div
          class="_list_item_children"
          v-if="
            (item[1].length && item.selected) ||
            (item[1].length && item.childOpened)
          "
        >
          <div class="_list_sub_item" v-for="subItem in item[1]">
            <input
              type="checkbox"
              class="checkbox"
              v-model="subItem.selected"
              @change="childChecked(subItem)"
            />
            <span class="_list_sub_item_title">
              {{ subItem.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div class="settings_access_list_control">
      <button class="_access_list_control_button _save" @click="saveList">
        {{ $t("surveys.save") }}
      </button>
      <button class="_access_list_control_button _cancel" @click="cancel">
        {{ $t("surveys.back") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useSurveyUserPermissionStore } from "@/store/SurveyUserPermissionStore/index";

import { vue3Debounce } from "vue-debounce";

import SearchIcon from "@/components/Icons/search.vue";

export default {
  name: "SettingsAccessList",
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    SearchIcon,
  },
  data() {
    return {
      userList: [],
      selected: false,
      findedUserList: [],

      userListToSend: [],

      searchString: "",
    };
  },
  computed: {
    ...mapStores(useSurveyUserPermissionStore),
  },
  watch: {
    userList() {
      for (let i = 0; i < this.userList.length; i++) {
        if (this.userList[i][1].every((obj) => obj.selected)) {
          this.userList[i].selected = true;
        } else if (this.userList[i][1].some((obj) => obj.selected)) {
          this.userList[i].childOpened = true;
        }
        for (let j = 0; j < this.userList[i][1].length; j++) {
          if (this.userList[i][1][j].selected) {
            this.userListToSend.push(this.userList[i][1][j].id);
          }
        }
      }
      this.surveyUserPermissionStore.setUserList(this.userList);
      this.surveyUserPermissionStore.setUserListForSend(this.userListToSend);
    },
  },
  methods: {
    async getUsers() {
      if (this.surveyUserPermissionStore.userList.length) {
        this.userList = this.surveyUserPermissionStore.userList;
        this.userListToSend = this.surveyUserPermissionStore.userListForSend;
      } else {
        let response = await axios.get(
          API_URIS.questionnariesUsersPermission.replace(
            "id",
            this.$route.params.id
          )
        );
        this.userList = Object.entries(response.data);
      }
    },
    openChildList(item) {
      item.childOpened ^= true;
    },
    parentChecked(item) {
      if (item.selected) {
        for (let i = 0; i < item[1].length; i++) {
          this.userListToSend.push(item[1][i].id);
        }
        this.userList
          .find((el) => el[0] == item[0])[1]
          .forEach((el) => (el.selected = true));
        this.surveyUserPermissionStore.setUserList(this.userList);
        this.surveyUserPermissionStore.setUserListForSend(this.userListToSend);
      } else {
        for (let i = 0; i < item[1].length; i++) {
          this.userListToSend = this.userListToSend.filter(
            (el) => el !== item[1][i].id
          );
        }
        this.userList
          .find((el) => el[0] == item[0])[1]
          .forEach((el) => (el.selected = false));
        this.surveyUserPermissionStore.setUserList(this.userList);
        this.surveyUserPermissionStore.setUserListForSend(this.userListToSend);
      }
    },
    childChecked(subItem) {
      let alreadyContains = this.userListToSend.includes(subItem.id);
      if (subItem.selected && !alreadyContains) {
        this.userListToSend.push(subItem.id);
        this.surveyUserPermissionStore.setUserList(this.userList);
        this.surveyUserPermissionStore.setUserListForSend(this.userListToSend);
      } else {
        this.userListToSend = this.userListToSend.filter(
          (el) => el !== subItem.id
        );
        this.surveyUserPermissionStore.setUserList(this.userList);
        this.surveyUserPermissionStore.setUserListForSend(this.userListToSend);
      }
    },
    saveList() {
      this.$emit("listSaved");
    },
    cancel() {
      this.$emit("cancel");
    },
    async searchByUser(value) {
      if (value == "") {
        this.findedUserList = [];
      } else {
        let searchQuery = value.toLowerCase();
        const defaultUserList = this.userList.map(([department, users]) => {
          let copiedUsers = users.slice();
          return [department, copiedUsers];
        });
        let foundDepartment = defaultUserList.filter((item) => {
          if (item[0].toLowerCase().includes(searchQuery)) {
            return true;
          }
          let filteredUsers = item[1].filter((user) =>
            user.name.toLowerCase().includes(searchQuery)
          );

          if (filteredUsers.length > 0) {
            item[1] = filteredUsers;
            item.childOpened = true;
            return true;
          } else {
            return false;
          }
        });

        this.findedUserList = foundDepartment;
      }
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped>
.settings_access_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.settings_access_list_header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.settings_access_list_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.settings_access_list_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
.settings_access_list_search {
  width: 100%;
  height: 52px;
  outline: none;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  padding: 5px 34px 5px 16px;
  box-sizing: border-box;
}
.settings_access_list_search_wrapper {
  width: 100%;
  position: relative;
}
.settings_access_list_search::placeholder {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--generalColorSecondary);
}

.settings_access_list_users {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-height: 382px;
  width: 100%;
  overflow-x: auto;
}
.settings_access_list_users::-webkit-scrollbar {
  width: 30px;
}

.settings_access_list_users::-webkit-scrollbar-thumb {
  background: var(--generalBrand);
  background-clip: content-box;
  border: 12px solid transparent;
  border-radius: 20px;
}
._list_item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
._list_item_parent {
  display: flex;
  align-items: center;
  gap: 9px;
}
._list_item_title {
  font-family: "Golos";
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  color: var(--generalColorDark);
  cursor: pointer;
  user-select: none;
}
._list_item_children {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
}
._list_sub_item {
  margin: 0 0 0 30px;
  display: flex;
  align-items: center;
  gap: 9px;
}
._list_sub_item_title {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  color: var(--generalColorDark);
}
.settings_access_list_control {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}
._access_list_control_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  text-align: center;
}
._save {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
._cancel {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
.search_icon {
  width: 12.5px;
  position: absolute;
  right: 16px;
  top: 19.75px;
}
</style>