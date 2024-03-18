<template>
  <div class="other_profile main-layout-page general-white-bg">
    <div class="other_profile_inner_wrapper">
      <ChangeOrganization
        v-if="changeOrganizationEnabled"
        @closeOrganizationChange="closeOrganizationChange"
        @changedOrg="changedOrg"
        :organizations="organizations"
        :proceededOrganizationInfo="proceededOrganizationInfo"
      />
      <template v-if="defer(2)">
        <CreateNewOrganization
          v-if="organizationCreationEnabled"
          @closeOrganizationCreation="closeOrganizationCreation"
          @proceedToCreatedOrg="proceedToCreatedOrg"
        />
      </template>
      <template v-if="defer(3)">
        <div class="profile_top">
          <button
            v-if="isMyProfile"
            class="edit_profile_button tooltip_container brand-secondary-bg"
            @click="editProfile"
            :data-tooltip="$t('profile.edit_profile')"
          >
            <EditProfileIcon class="edit_profile_icon" />
          </button>
          <Avatar
            @increasePhotoSize="enableIncreasedPhoto"
            @deletePhoto="deletePhoto"
            :type="'other_profile'"
            :userID="$route.params.id"
            :userName="profile_info?.profile.first_name"
            :userSurname="profile_info?.profile.surname"
            :userPhoto="profile_info?.profile.photo"
            :isCurrentUser="isMyProfile"
          />
          <div
            @click.stop="disableIncreasedPhoto"
            v-if="increasedPhotoEnabled"
            class="increased_photo_wrapper"
          >
            <img
              class="increased_photo"
              :src="
                photoAddress(profile_info?.profile.photo.replace('_thumb', ''))
              "
            />
          </div>
          <div class="profile_top_info">
            <div class="vacation_info_wrapper brand-secondary-bg">
              <h1 class="vacation_info general-brand-color">
                {{ vacationInfo }}
              </h1>
            </div>
            <div class="user_name_and_involvement">
              <h1 class="user_name general-contrast-color">
                {{ userName }}
              </h1>
              <div class="user_involvement_wrapper">
                <h1
                  class="user_involvement minor-success-color"
                  v-if="rate"
                >
                  {{ isMyProfile ? rate : otherRate }}
                </h1>
                <div
                  v-if="isMyProfile"
                  class="user_involvement_tooltip general-brand-bg general-white-color"
                >
                  {{ $t("profile.your_involvement_index") }}
                </div>
                <div
                  v-else
                  class="user_involvement_tooltip general-brand-bg general-white-color"
                >
                  {{ $t("profile.involvement_index") }}
                </div>
              </div>
            </div>
            <h1
              v-if="profile_info?.profile.first_name"
              class="user_nickname general-brand-color"
            >
              {{ userNickname }}
            </h1>
          </div>
        </div>
      </template>
      <template v-if="defer(4)">
        <div class="user_information">
          <UserInfoContainer
            class="fit_content"
            :header="$t('profile.personal_info')"
            :info="personalInfo"
          />
          <UserInfoContainer
            class="fit_content"
            :header="$t('profile.contacts')"
            :info="contacts"
          />
          <UserInfoContainer
            class="fit_content"
            :header="$t('profile.organization')"
            :info="organizationInfo"
            :organizations="organizations"
            :isOrganization="isMyProfile"
            @enableOrganizationChange="enableOrganizationChange"
            @enableOrganizationCreation="enableOrganizationCreation"
          />
        </div>
      </template>
      <template v-if="defer(5)">
        <OtherProfileMap
          v-if="
            profile_info?.profile?.latitude && profile_info?.profile?.longitude
          "
          :profile_info="profile_info"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

import axios from "axios";

import { API_URIS, SERVER_IP } from "@/constants/api";
import { formatTimestamp } from "@/general-scripts/timestamps";
import { notify } from "@/general-scripts/toast-notification";

import Defer from "@/mixins/defer";

export default {
  name: "OtherProfile",
  components: {
    UserInfoContainer: defineAsyncComponent(() =>
      import("@/components/OtherProfileElements/UserInfoContainer.vue")
    ),
    Avatar: defineAsyncComponent(() => import("@/widgets/Avatar.vue")),
    ChangeOrganization: defineAsyncComponent(() =>
      import("@/components/OtherProfileElements/ChangeOrganization.vue")
    ),
    CreateNewOrganization: defineAsyncComponent(() =>
      import("@/components/OtherProfileElements/CreateNewOrganization.vue")
    ),
    OtherProfileMap: defineAsyncComponent(() =>
      import("@/components/OtherProfileElements/OtherProfileMap.vue")
    ),
    EditProfileIcon: defineAsyncComponent(() =>
      import("@/components/Icons/ProfileIcons/EditProfileIcon.vue")
    ),
  },
  mixins: [Defer()],
  data() {
    return {
      profile_info: null,
      increasedPhotoEnabled: false,
      changeOrganizationEnabled: false,
      organizationCreationEnabled: false,
      proceededOrganizationInfo: null,
      organizations: [],
    };
  },
  mounted() {
    this.getProfileInfo();
  },
  watch: {
    "$route.params.id": {
      handler(newVal) {
        if (newVal && this.$route.name === "OtherProfile")
          this.getProfileInfo();
      },
    },
  },
  computed: {
    ...mapStores(useProfileStore),
    isMyProfile() {
      return (
        this.profileStore.profileInfo?.profile.id ===
        this.profile_info?.profile.id
      );
    },
    avatarLink() {
      if (this.profile_info != null)
        return this.photoAddress(this.profile_info.profile.photo);
      else return this.photoAddress(null);
    },
    vacationInfo() {
      let status = this.profile_info?.profile.status;
      if (status == "D") return this.$t("employee.statuses.remotely");
      else if (status == "O") return this.$t("employee.statuses.office");
      else if (status == "H") return this.$t("employee.statuses.vacation");
      else if (status == "S") return this.$t("employee.statuses.illness");
      else return this.$t("employee.statuses.noStatus");
    },
    otherRate() {
      return this.profile_info?.rate + "%";
    },
    rate() {
      return this.profileStore.profileInfo?.rate + "%";
    },
    gender() {
      let genderCode = this.profile_info?.profile.gender;
      if (genderCode == "M") return "Мужской";
      else if (genderCode == "W") return "Женский";
      else return "Не указан";
    },
    birthDate() {
      let birthday = this.profile_info?.profile.date_of_birth;
      if (birthday)
        return this.prettyPrintTimestamp(
          this.profile_info.profile.date_of_birth
        );
      return "Не указан";
    },
    userName() {
      if (this.profile_info !== null) {
        let surname = this.profile_info.profile.surname || "";
        let first_name = this.profile_info.profile.first_name || "";
        let middle_name = this.profile_info.profile.middle_name || "";

        if (!first_name) {
          return this.profile_info.profile.nickname;
        }
        return surname + " " + first_name + " " + middle_name;
      } else return "";
    },
    userNickname() {
      if (this.profile_info !== null) {
        return this.profile_info.profile.nickname;
      } else return "";
    },
    contacts() {
      let contactsList = [
        { header: "Корпоративная почта", text: "Не указано" },
        { header: "Мобильный номер", text: "Не указано" },
      ];
      if (this.profile_info != null) {
        for (let i = 0; i < this.profile_info.profile.contacts.length; ++i) {
          let curContact = this.profile_info.profile.contacts[i];
          if (curContact.contact_type == "@") {
            contactsList[0].text = curContact.contact_id;
          }
          if (curContact.contact_type == "P") {
            contactsList[1].text = curContact.contact_id;
          }
        }
      }
      return [contactsList];
    },
    personalInfo() {
      return [
        [
          {
            header: this.$t("profile.birthday"),
            text: this.formattedDate(this.profile_info?.profile?.date_of_birth),
          },
          {
            header: this.$t("profile.hired_at"),
            text: this.formattedDate(this.profile_info?.profile?.hired_at),
          },
        ],
        [
          {
            header: this.$t("profile.gender"),
            text: this.genderName(this.profile_info?.profile?.gender),
          },
          {
            header: this.$t("profile.location"),
            text: this.profile_info?.profile?.location_text,
          },
        ],
      ];
    },
    organizationInfo() {
      return [
        [
          {
            header: this.$t("profile.organization"),
            text: this.profile_info?.profile?.organization,
          },
          {
            header: this.$t("profile.department"),
            text: this.profile_info?.profile?.department,
          },
        ],
        [
          {
            header: this.$t("profile.job_title"),
            text: this.profile_info?.profile?.job_title,
          },
          {
            header: this.$t("profile.role"),
            text: this.displayedRole,
          },
        ],
      ];
    },
    displayedRole() {
      let role = "";
      for (let i = 0; i < this.profile_info?.privileged.length; ++i) {
        let curRole = this.profile_info.privileged[i];
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
    formattedDate(date) {
      if (!date) return null;
      const timestamp = formatTimestamp(date);
      return (
        (timestamp.day < 10 ? "0" : "") +
        timestamp.day +
        "." +
        (timestamp.month < 9 ? "0" : "") +
        (timestamp.month + 1) +
        (timestamp.year < 2020 ? "." +
        timestamp.year : "")
      );
    },
    genderName(gender) {
      if (gender === "M") return this.$t("profile.male");
      else if (gender === "W") return this.$t("profile.female");
      else return null;
    },
    proceedToCreatedOrg(organizationInfo) {
      this.proceededOrganizationInfo = organizationInfo;
      this.organizationCreationEnabled = false;
      this.getOrganizationsList();
      this.enableOrganizationChange();
    },
    closeOrganizationCreation() {
      this.organizationCreationEnabled = false;
      this.getOrganizationsList();
    },
    enableOrganizationCreation() {
      this.organizationCreationEnabled = true;
    },
    async getOrganizationsList() {
      try {
        const response = await axios.get(API_URIS.userOrganizations);
        this.organizations = response.data;
        for (let i = 0; i < this.organizations.length; ++i) {
          if (this.organizations[i].is_current) {
            this.organizations.splice(i, 1);
            break;
          }
        }
      } catch (err) {
        throw err;
      }
    },
    async changedOrg() {
      this.changeOrganizationEnabled = false;
      await this.$router.push("/main");
      location.reload();
    },
    enableOrganizationChange() {
      this.changeOrganizationEnabled = true;
    },
    closeOrganizationChange() {
      this.changeOrganizationEnabled = false;
    },
    prettyPrintTimestamp(timestamp) {
      let hiredAt = new Date(Date.parse(timestamp));
      let months = [
        "Января",
        "Февраля",
        "Марта",
        "Апреля",
        "Мая",
        "Июня",
        "Июля",
        "Августа",
        "Сентября",
        "Октября",
        "Ноября",
        "Декабря",
      ];
      return hiredAt.getDate() + " " + months[hiredAt.getMonth()];
    },
    enableIncreasedPhoto() {
      if (this.profile_info?.profile.photo) {
        this.increasedPhotoEnabled = true;
      }
    },
    disableIncreasedPhoto() {
      this.increasedPhotoEnabled = false;
    },
    editProfile() {
      this.$router.push("/profile");
    },
    photoAddress(photo) {
      if (photo == null) {
        let images = require.context("@/assets/", false, /\.png$/);
        return images("./Logo.png");
      } else {
        if (photo.slice(0, 7) == "http://") {
          return photo;
        }
        return SERVER_IP + photo;
      }
    },
    async getProfileInfo() {
      try {
        let response = await axios.get(
          API_URIS.otherProfile + this.$route.params.id + "/"
        );
        this.profile_info = response.data;
        this.getOrganizationsList();
      } catch (err) {
        throw err;
      }
    },
    async deletePhoto() {
      try {
        const response = await axios.delete(
          API_URIS.updateProfileImageURL + this.profile_info.profile.id + "/"
        );
        this.getProfileInfo();
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          notify(this.$t("profile.photoDeleteSuccesfull"), "success");
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.other_profile {
  width: 100%;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.other_profile::-webkit-scrollbar {
  width: 8px;
  background-color: var(--negativeSecondary);
}
.other_profile::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.other_profile_inner_wrapper {
  max-width: 1200px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  padding: 20px;
}

.profile_top {
  position: relative;
  display: flex;
  gap: 29px;
  /* flex-wrap: wrap; */
}
@media (max-width: 700px) {
  .profile_top {
    flex-wrap: wrap;
    gap: 100px;
  }
}
.profile_top_info {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 29px;
}
.vacation_info_wrapper {
  border-radius: 12px;
  padding: 12px 16px;
  width: fit-content;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.vacation_info {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
}
.user_name_and_involvement {
  position: relative;
  align-items: center;
  width: 100%;
  display: flex;
  gap: 20px;
  justify-content: space-between;
}
.user_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
  margin-top: 16px;
}
.user_involvement_wrapper {
  position: relative;
}
@import url("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");
.user_involvement_tooltip {
  left: 0;
  top: 50%;
  width: 180px;
  padding: 5px 10px;
  border-radius: 4px;
  transform: translate(calc(-100% - 12px), -50%);
  /* border: 3px solid var(--generalContrast); */
  position: absolute;
  display: none;
  font-family: "Open Sans";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
.user_involvement_tooltip::after {
  content: " ";
  position: absolute;
  bottom: calc(50% - 5px); /* At the bottom of the tooltip */
  right: 0%;
  margin-right: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent var(--generalBrand);
}
@media (max-width: 768px) {
  .user_involvement_tooltip {
    top: calc(100% + 10px);
    left: -200%;
    transform: none;
    height: fit-content;
  }
  .user_involvement_tooltip::after {
    content: " ";
    bottom: 100%;
    right: 25%;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent var(--generalBrand) transparent;
  }
}
.user_involvement:hover ~ .user_involvement_tooltip {
  display: block;
}
.user_involvement {
  cursor: pointer;
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
}
.user_nickname {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  margin-top: 4px;
}
.edit_profile_button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px;
  border-radius: 8px;
  width: auto;
}
.edit_profile_icon {
  height: 18px;
  width: 18px;
}
.edit_profile_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.user_stats {
  height: 184px;
  width: 706px;
  background-color: #ffffff;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.user_information {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.fit_content {
  width: fit-content;
}

.detailed_info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.detailed_info_left_column {
  width: 100%;
  max-width: 375px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.detailed_info_right_column {
  width: 100%;
  max-width: 375px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.user_role_wrapper {
  width: auto;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user_role_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}
.user_role_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
}
.increased_photo_wrapper {
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.increased_photo {
  position: fixed;
  max-height: 80%;
  max-width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.involvement_index {
  width: 100%;
  max-width: 343px;
}
</style>
