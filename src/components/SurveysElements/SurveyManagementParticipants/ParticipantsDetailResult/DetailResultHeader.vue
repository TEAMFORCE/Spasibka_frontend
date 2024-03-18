<template>
  <div class="detail_result_header">
    <Transition name="fade" mode="out-in">
      <div class="_user_block" v-if="transferredUser">
        <div class="_user_block_selector">
          <button class="_user_block_selector_button" @click="prevUser()">
            <PrevPictureArrowIcon />
          </button>
          <span class="_user_block_selector_current_user">
            {{ `${$t("surveys.detail_result.user")} ${userNumber}` }}
            <!-- {{ $t("surveys.detail_result.user") }} -->
          </span>
          <button class="_user_block_selector_button" @click="nextUser()">
            <NextPictureArrowIcons />
          </button>
        </div>
        <div class="_user_block_info">
          <h4 class="_user_full_name">
            {{
              `${$t("surveys.detail_result.fullName")} ${
                this.transferredUser.profile.get_full_name_or_nickname
              }`
            }}
          </h4>
          <h4 class="_user_division">
            {{
              `${$t("surveys.detail_result.division")} ${
                this.transferredUser.profile.department?.name
              }`
            }}
          </h4>
        </div>
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <div class="_search_download_block" v-if="transferredUser">
        <div class="_search_input_wrapper">
          <input
            type="text"
            class="_search_input"
            :placeholder="$t('surveys.management_settings.search')"
          />
          <SearchIcon />
        </div>
        <div class="download_excell_wrapper" v-if="userRole == 'Администратор'">
          <button
            v-if="downloadPending"
            class="download_excell brand-secondary-bg general-brand-color"
            disabled
          >
            {{ $t("analyticsPage.reports.processing") }}
          </button>
          <button v-else class="download_excell general-brand-bg">
            <DownloadIcon :currentColor="getIconColor()" />
            {{ $t("analyticsPage.reports.inputs.uplToExcel") }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

import NextPictureArrowIcons from "@/components/Icons/MarketIcons/NextPictureArrowIcon.vue";
import PrevPictureArrowIcon from "@/components/Icons/MarketIcons/PrevPictureArrowIcon.vue";
import SearchIcon from "@/components/Icons/search.vue";
import DownloadIcon from "@/components/Icons/download.vue";

export default {
  name: "DetailResultHeader",
  components: {
    NextPictureArrowIcons,
    PrevPictureArrowIcon,
    SearchIcon,
    DownloadIcon,
  },
  props: {
    transferredUser: {
      requred: true,
    },
    userNumber: {
      requred: true,
    },
  },
  data() {
    return {
      currentUserIndex: null,

      downloadPending: false,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    userRole() {
      let role = "";
      for (let i = 0; i < this.profileInfo?.privileged.length; ++i) {
        let curRole = this.profileInfo.privileged[i];
        role = curRole.role_name;
        if (role == "Администратор") {
          break;
        }
      }
      if (role == "") {
        role = "Пользователь";
      }
      return role;
    },
  },

  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    // getUserNumber() {
    //   if (!this.changed) {
    //     let userNumber = this.userList.findIndex(
    //       (el) => el.id == this.transferredUser.id
    //     );
    //     return ++userNumber;
    //   } else {
    //     return this.currentUserIndex + 1;
    //   }
    // },
    prevUser() {
      this.$emit("prevUser");
    },
    nextUser() {
      this.$emit("nextUser");
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.detail_result_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid var(--negativeSecondary);
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
}
._user_block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
._user_block_selector {
  display: flex;
  align-items: center;
  gap: 10px;
}
._user_block_selector_button {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background-color: var(--secondaryColorBrand);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
}
._user_block_selector_button:hover {
  transform: scale(1.05);
}
._user_block_selector_button:active {
  transform: scale(0.99);
}
._user_block_selector_current_user {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  color: var(--generalContrast);
}
._user_block_info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
._user_full_name {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
._user_division {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
._search_download_block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 21px;
  width: 50%;
}
._search_input_wrapper {
  max-width: 354px;
  width: 100%;
  position: relative;
}
._search_input {
  outline: none;
  width: 100%;
  height: 52px;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  padding: 15px 16px;
  box-sizing: border-box;
}
._search_input::placeholder {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  color: var(--generalColorSecondary);
}
.search_icon {
  width: 12.5px;
  position: absolute;
  right: 16px;
  top: 19.75px;
}

.download_excell {
  width: 192px !important;
  height: 52px !important;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  transition: 0.3s;
}
.download_icon {
  width: 14px;
  height: 18px;
}
.download_excell:hover {
  opacity: 0.9;
  transform: translate(0px, -1px);
}

.next_picture_arrow_icon {
  height: 16px !important;
}
.prev_picture_arrow_icon {
  height: 16px !important;
}
</style>