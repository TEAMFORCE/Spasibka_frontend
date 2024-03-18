<template>
  <div class="profile_page main-layout-page general-white-bg">
    <PhotoCropper
      v-if="cropperEnabled"
      :photo="uploadPhoto"
      @cropPhoto="cropPhoto"
      @cropCancel="cropCancel"
    />
    <div class="profile_header">
      <div class="profile_greeting_avatar_stats">
        <div class="profile_greeting">
          <h1 class="profile_greeting_text general-contrast-color">
            {{ $t("profile.hello") }}
          </h1>
          <div class="profile_greeting_name_and_exclamation">
            <h1 class="profile_greeting_text general-brand-color">
              {{ userName }}
            </h1>

            <h1 class="profile_greeting_text general-contrast-color">!</h1>
          </div>
        </div>
        <div class="profile_avatar_stats">
          <div class="profile_image_wrapper general-white-bg">
            <input
              ref="avatarInput"
              class="select_file_button"
              type="file"
              :accept="allowedFileExtensions"
              @change="handleFileSelect"
            />
            <Avatar
              @handleInputOpen="handleInputOpen"
              @increasePhotoSize="increasePhotoSize"
              @changeThumbnail="changeThumbnail"
              @deletePhoto="deletePhoto"
              :isCurrentUser="isMyProfile"
              :type="'profile'"
              :userID="this.profileInfo?.profile.id"
              :userName="profileInfo?.profile.first_name"
              :userSurname="profileInfo?.profile.surname"
              :userPhoto="photoAddress"
              :isChanging="true"
            />
            <div
              @click="decreasePhotoSize"
              v-if="increasedPhotoEnabled"
              class="increased_photo_wrapper"
            >
              <img
                :src="increasedPhotoAddress(photo.replace('_thumb', ''))"
                class="increased_photo"
              />
            </div>
          </div>
          <div class="profile_stats">
            <div class="circular_chart"></div>
            <div class="advantages"></div>
          </div>
        </div>
      </div>
      <div class="profile_lang_status">
        <div class="profile_status">
          <button
            class="status_select_header_button brand-secondary-bg"
            @click="openOrCloseStatusVariants"
          >
            <h1 class="status_header general-brand-color">
              {{ $t("profile.status") }}
            </h1>
            <div class="status_text_and_icon">
              <h1 class="status_text general-brand-color">
                {{ status }}
              </h1>
              <ChangeStatusIcon class="change_status_icon" />
            </div>
          </button>
          <div v-if="showStatusVariants" class="statuses_selection">
            <button
              class="select_status_button"
              v-for="item in statuses"
              @click="changeStatus(item)"
              :class="{ active: item.name == status }"
            >
              <h1
                class="status_option_text"
                :class="{ active: item.name == status }"
              >
                {{ item.name }}
              </h1>
            </button>
          </div>
        </div>
        <div class="profile_lang">
          <LangSelector />
        </div>
      </div>
    </div>
    <div v-if="!profileInfo?.profile?.vk_id" id="vkAuthButton">
      <h1 class="data_header_text general-contrast-color">
        {{ $t("organization.settings.connect_vk_id") }}
      </h1>
    </div>
    <div class="profile_info">
      <div class="personal_data">
        <h1 class="data_header_text general-contrast-color">
          {{ $t("profile.profileFields.title") }}
        </h1>
        <div class="data_input_fields">
          <div class="data_input_wrapper" v-for="item in profileData">
            <div
              v-if="item.vModel"
              class="data_input_header_wrapper general-white-bg"
            >
              <h1 class="data_input_header general-secondary-color">
                {{ item.placeholder }}
              </h1>
            </div>
            <input
              v-if="
                (item.isText && item.placeholder !== 'VK ID') ||
                (item.placeholder === 'VK ID' && item.vModel)
              "
              class="data_input"
              v-model="item.vModel"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
            />
            <div class="date_wrap" v-if="item.isDate">
              <Datepicker
                v-model="item.vModel"
                text-input
                auto-apply
                format="dd.MM.yyyy"
                locale="ru"
                position="left"
                :clearable="true"
                placeholder="День рождения"
                :enable-time-picker="false"
              />
            </div>
            <div class="select_wrap" v-if="item.isSelect">
              <vSelect
                class="style-chooser"
                v-model="item.vModel"
                :options="genders"
                :placeholder="gender"
                label="title"
                :reduce="(title) => title.gender"
              >
                <template #no-options="{ search, searching, loading }">
                  {{ $t("v_select.no_matching_options") }}
                </template>
              </vSelect>
            </div>
          </div>
        </div>
      </div>

      <div class="personal_data">
        <h1 class="data_header_text general-contrast-color">
          {{ $t("profile.current_org") }}
        </h1>
        <div class="data_input_fields">
          <div class="work_info_field">
            <div class="data_input_header_wrapper general-white-bg">
              <h1 class="data_input_header general-secondary-color">
                {{ $t("profile.organization_name") }}
              </h1>
            </div>
            <h1 class="work_info_field_text general-contrast-color">
              {{
                profileInfo?.profile.organization ||
                $t("profile.wasnt_set_feminitive")
              }}
            </h1>
          </div>
          <div class="work_info_field">
            <div class="data_input_header_wrapper general-white-bg">
              <h1 class="data_input_header general-secondary-color">
                {{ $t("profile.department") }}
              </h1>
            </div>
            <h1 class="work_info_field_text general-contrast-color">
              {{
                profileInfo?.profile.department ||
                $t("profile.wasnt_set_neutral")
              }}
            </h1>
          </div>
          <div class="work_info_field">
            <div class="data_input_header_wrapper general-white-bg">
              <h1 class="data_input_header general-secondary-color">
                {{ $t("profile.job_title") }}
              </h1>
            </div>
            <h1 class="work_info_field_text general-contrast-color">
              {{
                profileInfo?.profile.job_title ||
                $t("profile.wasnt_set_feminitive")
              }}
            </h1>
          </div>
          <div class="work_info_field">
            <div class="data_input_header_wrapper general-white-bg">
              <h1 class="data_input_header general-secondary-color">
                {{ $t("profile.role") }}
              </h1>
            </div>
            <h1 class="work_info_field_text general-contrast-color">
              {{ displayedRole }}
            </h1>
          </div>
        </div>
      </div>
    </div>
    <ProfileMap
      @saveProfile="updateProfile"
      @locationUpdatedTrue="locationUpdated = true"
      @locationUpdatedFalse="locationUpdated = false"
    />
  </div>
</template>

<script>
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { EMPLOYEE_GENDERS } from "@/infrastructure/data-sources/employee-genders";
import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import Avatar from "@/widgets/Avatar.vue";
import PhotoCropper from "@/widgets/PhotoCropper.vue";
import ProfileMap from "@/components/ProfileElements/ProfileMap.vue";
import ChangeAvatarIcon from "@/components/Icons/ProfileIcons/ChangeAvatarIcon.vue";
import ChangeStatusIcon from "@/components/Icons/ProfileIcons/ChangeStatusIcon.vue";
import { notify } from "@/general-scripts/toast-notification";
import LangSelector from "@/components/app/LangSelector.vue";

import { Config, Connect, ConnectEvents } from "@vkontakte/superappkit";

export default {
  name: "Profile",
  components: {
    Avatar,
    ProfileMap,
    PhotoCropper,
    Datepicker,
    vSelect,
    ChangeAvatarIcon,
    ChangeStatusIcon,
    LangSelector,
  },
  data() {
    return {
      profileData: [],

      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],
      showStatusVariants: false,
      statuses: [
        { name: this.$t("employee.statuses.office"), code: "O" },
        { name: this.$t("employee.statuses.remotely"), code: "D" },
        { name: this.$t("employee.statuses.vacation"), code: "H" },
        { name: this.$t("employee.statuses.illness"), code: "S" },
      ],

      photo: null,
      status: "Не указан",
      userRole: "Роль отсутствует",

      emailTypeID: null,
      phoneTypeID: null,

      isEmailWrong: false,
      emailError: "",

      isPhoneWrong: false,
      phoneError: "",

      profileSuccessfullyUpdated: false,

      uploadPhoto: null,
      fullPhoto: null,
      cropperEnabled: false,
      increasedPhotoEnabled: false,

      locationUpdated: false,
      profileUpdated: false,
      contactsUpdated: false,
    };
  },

  computed: {
    ...mapStores(useProfileStore),
    isMyProfile() {
      return (
        this.profileStore.profileInfo?.profile.id ===
        this.profileInfo?.profile.id
      );
    },
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    genders() {
      return EMPLOYEE_GENDERS(this);
    },
    userName() {
      if (this.profileInfo) {
        let first_name = this.profileInfo.profile.first_name || "";

        if (!first_name) {
          return this.profileInfo.profile.nickname;
        }
        return first_name;
      } else return "";
    },
    displayedRole() {
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
    gender() {
      let genderCode = this.profileInfo?.profile.gender;
      if (genderCode == "M") return "Мужской";
      else if (genderCode == "W") return "Женский";
      else return "Не указан";
    },
    birthDate() {
      let birthday = this.profileInfo?.profile.date_of_birth;
      if (birthday)
        return this.prettyPrintTimestamp(
          this.profileInfo.profile.date_of_birth
        );
      return "Не указан";
    },
    photoAddress() {
      if (this.photo == null) {
        return null;
      } else {
        if (this.photo.slice(0, 7) == "http://") {
          return this.photo;
        }
        return SERVER_IP + this.photo;
      }
    },
    statusSelectIcon() {
      if (this.showStatusVariants) return this.getImgUrl("StatusIconUp");
      else return this.getImgUrl("StatusIconDown");
    },
    hiredDate() {
      let date = new Date(Date.parse(this.hired_at));
      let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      let month =
        date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      return day + "." + month + "." + date.getFullYear();
    },
  },
  watch: {
    profileInfo: {
      handler() {
        this.ifProfileReady();
      },
      flush: "post",
    },
    profileUpdated: {
      handler() {
        if (
          this.profileUpdated &&
          this.locationUpdated &&
          this.contactsUpdated
        ) {
          //this.$router.push("/other_profile/" + this.profileInfo?.id);
          window.location.reload();
        }
      },
    },
    contactsUpdated: {
      handler() {
        if (
          this.profileUpdated &&
          this.locationUpdated &&
          this.contactsUpdated
        ) {
          //this.$router.push("/other_profile/" + this.profileInfo?.id);
          window.location.reload();
        }
      },
    },
    locationUpdated: {
      handler() {
        if (
          this.profileUpdated &&
          this.locationUpdated &&
          this.contactsUpdated
        ) {
          //this.$router.push("/other_profile/" + this.profileInfo?.id);
          window.location.reload();
        }
      },
    },
  },
  methods: {
    createVkAuthButton() {
      let appId = "";
      if (process.env.VUE_APP_API_URL === "https://backdev.teamforce360.com") {
        appId = 51724480;
      } else {
        appId = 51726705;
      }

      Config.init({
        appId: appId, // идентификатор приложения
      });

      var buttonOneTap = Connect.buttonOneTapAuth({
        callback: (evt) => {
          const type = evt.type;
          if (!type) {
            return;
          }
          switch (type) {
            case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS:
              return this.onAuthUser(evt);
            case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED:
              break;
            case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED:
              break;
            case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN:
              let pathFromShowLogin = "/vk_redirect";

              let requestObjectFromShowLogin = {
                url: window.location.origin + pathFromShowLogin,
                state: "profile",
              };
              return Connect.redirectAuth(requestObjectFromShowLogin);
            case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS:
              let pathFromLoginOptions = "/vk_redirect";

              let requestObjectFromLoginOptions = {
                url: window.location.origin + pathFromLoginOptions,
                screen: "phone",
                state: "profile",
              };
              return Connect.redirectAuth(requestObjectFromLoginOptions);
            default:
              console.log(type);
          }
          return;
        },
        options: {
          showAlternativeLogin: false,
          showAgreements: false,
          showAgreementsDialog: false,
          displayMode: "default",
        },
      });

      if (buttonOneTap) {
        document
          .getElementById("vkAuthButton")
          .appendChild(buttonOneTap.getFrame());
      }
    },

    async onAuthUser(evt) {
      const payload = evt.payload;
      try {
        let requestObject = {
          silent_token: payload.token,
          uuid: payload.uuid,
        };
        const response = await axios.post(API_URIS.VKGetToken, requestObject);
        localStorage.setItem("VKAccessToken", response.data.access_token);
        this.accessTokenLogin(response.data.access_token);
        //this.$router.push("/main");
      } catch (err) {
        throw err;
      }
      // payload contains the silent token and user information
      // Call your backend API to exchange the silent token for an access token
    },
    async accessTokenLogin(access_token) {
      try {
        let requestObject = {
          access_token: access_token,
        };
        const response = await axios.post(API_URIS.VKAuth, requestObject);
        notify("OK", "success");
        window.location.reload();
      } catch (err) {
        throw err;
      }
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
      return (
        hiredAt.getDate() +
        " " +
        months[hiredAt.getMonth()] +
        " " +
        hiredAt.getFullYear()
      );
    },
    ifProfileReady() {
      if (this.profileInfo) {
        this.getProfileInfo();
        this.status = this.mapStatusCodeToName(this.profileInfo.profile.status);
      }
    },
    getProfileInfo() {
      try {
        this.emailTypeID = null;
        this.phoneTypeID = null;
        this.profileData = [
          {
            vModel: this.profileInfo.profile.vk_id,
            placeholder: "VK ID",
            isText: true,
            disabled: true,
          },
          {
            vModel: this.profileInfo.profile.first_name,
            placeholder: this.$t("profile.profileFields.name"),
            isText: true,
          },
          {
            vModel: this.profileInfo.profile.surname,
            placeholder: this.$t("profile.profileFields.lastName"),
            isText: true,
          },
          {
            vModel: this.profileInfo.profile.middle_name,
            placeholder: this.$t("profile.profileFields.middleName"),
            isText: true,
          },
          {
            vModel: "",
            placeholder: this.$t("profile.profileFields.email"),
            isText: true,
          },
          {
            vModel: "",
            placeholder: this.$t("profile.profileFields.phone"),
            isText: true,
          },
          {
            vModel: this.profileInfo.profile.date_of_birth,
            placeholder: this.$t("profile.profileFields.birthday"),
            isDate: true,
          },
          {
            vModel: this.profileInfo.profile.gender,
            placeholder: this.$t("profile.profileFields.gender"),
            isSelect: true,
          },
        ];
        this.getContacts();
      } catch (err) {
        throw err;
      }
    },
    handleInputOpen() {
      this.$refs.avatarInput.click();
    },
    handleFileSelect(e) {
      this.fullPhoto = e.target.files[0];
      this.uploadPhoto = URL.createObjectURL(this.fullPhoto);
      this.cropperEnabled = true;
    },

    increasePhotoSize() {
      this.increasedPhotoEnabled = true;
    },
    decreasePhotoSize() {
      this.increasedPhotoEnabled = false;
    },
    increasedPhotoAddress(increasedPhoto) {
      if (increasedPhoto.slice(0, 7) == "http://") {
        return photo;
      }
      return SERVER_IP + increasedPhoto;
    },

    async cropPhoto(croppedPhoto) {
      this.cropperEnabled = false;
      try {
        const formData = new FormData();
        if (this.fullPhoto) {
          formData.append("photo", this.fullPhoto);
        }
        formData.append("cropped_photo", croppedPhoto);
        const response = await axios.put(
          API_URIS.updateProfileImageURL + this.profileInfo.profile.id + "/",
          formData
        );
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          notify(this.$t("profile.photoUpdated"), "success");
        }
        let photoAddress = response.data.photo;
        for (let i = photoAddress.length; i > 0; --i) {
          if (photoAddress.charAt(i) == ".") {
            photoAddress =
              photoAddress.slice(0, i) + "_thumb" + photoAddress.slice(i);
            break;
          }
        }
        this.photo = photoAddress;
        this.profileStore.getProfileInfo();
        this.$router.replace({ query: null });
      } catch (err) {
        throw err;
      }
    },
    cropCancel() {
      this.cropperEnabled = false;
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/ProfileImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    mapStatusCodeToName(statusCode) {
      for (let i = 0; i < this.statuses.length; ++i) {
        if (this.statuses[i].code == statusCode) {
          return this.statuses[i].name;
        }
      }
    },
    async changeStatus(status) {
      try {
        await axios.put(
          API_URIS.updateProfileByUser + this.profileInfo.profile.id + "/",
          {
            status: status.code,
          }
        );
        this.showStatusVariants = false;
        this.profileStore.getProfileInfo();
      } catch (err) {
        throw err;
      }
    },
    getContacts() {
      this.photo = this.profileInfo.profile.photo;
      this.status = this.mapStatusCodeToName(this.profileInfo.profile.status);
      let offset = 1;
      for (let i = 0; i < this.profileInfo.profile.contacts.length; ++i) {
        let curContact = this.profileInfo.profile.contacts[i];
        if (curContact.contact_type == "@") {
          this.emailTypeID = curContact.id;
          this.profileInfo.profile.email = curContact.contact_id;
          this.profileData[3 + offset].vModel = this.profileInfo.profile.email;
        }
        if (curContact.contact_type == "P") {
          this.phoneTypeID = curContact.id;
          this.profileInfo.profile.mobile_number = curContact.contact_id;
          this.profileData[4 + offset].vModel =
            this.profileInfo.profile.mobile_number;
        }
      }
    },
    async updateProfile() {
      this.updateContacts();
      try {
        this.profileUpdated = false;

        let offset = 1;
        let requestObject = {
          first_name: this.profileData[0 + offset].vModel,
          surname: this.profileData[1 + offset].vModel,
          middle_name: this.profileData[2 + offset].vModel,
          gender: this.profileData[6 + offset].vModel,
        };

        if (!this.profileData[5 + offset].vModel) {
          requestObject.date_of_birth = null;
        } else {
          requestObject.date_of_birth =
            this.profileData[5 + offset].vModel ==
            this.profileInfo.profile.date_of_birth
              ? this.profileData[5 + offset].vModel
              : this.profileData[5 + offset].vModel.toISOString().slice(0, 10);
        }
        await axios.put(
          API_URIS.updateProfileByUser + this.profileInfo.profile.id + "/",
          requestObject
        );
        notify(this.$t("profile.profile_info_updated"), "success");
        this.profileUpdated = true;
      } catch (err) {
        notify(
          err?.response?.data?.non_field_errors[0] ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
    },
    async updateContacts() {
      let phoneContact = {};
      let emailContact = {};
      let contactsList = [];

      let offset = 1;

      emailContact.contact_type = "@";
      emailContact.contact_id = this.profileData[3 + offset].vModel;
      if (this.emailTypeID) {
        emailContact.id = this.emailTypeID;
        contactsList.push(emailContact);
      } else {
        if (emailContact.contact_id != "") contactsList.push(emailContact);
      }

      phoneContact.contact_type = "P";
      phoneContact.contact_id = this.profileData[4 + offset].vModel;
      if (this.phoneTypeID) {
        phoneContact.id = this.phoneTypeID;
        contactsList.push(phoneContact);
      } else {
        if (phoneContact.contact_id != "") contactsList.push(phoneContact);
      }

      try {
        this.contactsUpdated = false;
        if (contactsList.length > 0)
          await axios.post(API_URIS.createFewContacts, contactsList);
        this.profileStore.getProfileInfo();
        notify(this.$t("profile.contacts_updated"), "success");
        this.contactsUpdated = true;
      } catch (err) {
        let errorMessage = err?.response?.data;
        if (errorMessage?.length > 0) {
          errorMessage = errorMessage[0];
        } else {
          errorMessage = err?.response?.data?.non_field_errors;
          if (errorMessage) errorMessage = errorMessage[0];
          else {
            errorMessage = err?.response?.data?.contact_id;
            if (errorMessage) errorMessage = errorMessage[0];
          }
        }
        notify(
          errorMessage ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
    },
    openOrCloseStatusVariants() {
      this.showStatusVariants ^= 1;
    },
    goToReadOnlyProfile() {
      this.$router.push("/other_profile/" + this.profileInfo.profile.id);
    },

    async changeThumbnail() {
      if (this.profileInfo.profile.photo == null) {
        return null;
      } else if (this.profileInfo.profile.photo.slice(0, 7) == "http://") {
        fetch("/api" + this.profileInfo.profile.photo.replace("_thumb", ""))
          .then((response) => response.blob())
          .then((imageBlob) => {
            const file = new File([imageBlob], "imageForCropp.png", {
              type: imageBlob.type,
            });
            this.uploadPhoto = URL.createObjectURL(file);
          });
      } else {
        await fetch(
          "/api" + this.profileInfo.profile.photo.replace("_thumb", "")
        )
          .then((response) => response.blob())
          .then((imageBlob) => {
            const file = new File([imageBlob], "imageForCropp.png", {
              type: imageBlob.type,
            });
            this.uploadPhoto = URL.createObjectURL(file);
          });
      }
      setTimeout(() => {
        this.cropperEnabled = true;
      }, 300);
    },
    async deletePhoto() {
      try {
        const response = await axios.delete(
          API_URIS.updateProfileImageURL + this.profileInfo.profile.id + "/"
        );
        this.profileStore.getProfileInfo();
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
  mounted() {
    this.ifProfileReady();
    if (!this?.profileInfo?.profile?.vk_id) {
      this.createVkAuthButton();
    }
  },
};
</script>

<style scoped>
.profile_page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
}
.profile_page::-webkit-scrollbar {
  width: 8px;
}
.profile_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.profile_header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* margin-right: 22px; */
}
.profile_greeting_avatar_stats {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.profile_greeting {
  display: flex;
  gap: 10px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.profile_greeting_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}
.profile_avatar_stats {
  display: flex;
  gap: 20px;
}
.profile_greeting_name_and_exclamation {
  display: flex;
}
.profile_image_wrapper {
  position: relative;
  height: 120px;
  width: 120px;
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.increased_photo_wrapper {
  position: fixed;
  z-index: 50;
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
.select_file_button {
  display: none;
}

.profile_photo_select_wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.profile_photo_select {
  border-radius: 6px;
}
.profile_photo_select_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.select_icon {
  height: 24px;
  width: 24px;
}
.profile_lang_status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.profile_status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.status_select_header_button {
  width: 257px;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.status_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
}
.status_text_and_icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.status_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
}
.change_status_icon {
  height: 24px;
  width: 24px;
}
.status_select_icon {
  height: 16px;
  width: 16px;
}

.statuses_selection {
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0px 8px 32px rgba(0, 0, 0, 0.08));
  border-radius: 12px;
  overflow: hidden;
  position: absolute;
  top: 100%;
  width: 257px;
  z-index: 10;
}
.select_status_button {
  width: 257px;
  padding: 10px 24px;
  border-radius: 0px;
  background-color: var(--generalColorWhite);
}
.select_status_button.active {
  background-color: var(--secondaryColorBrand);
}

.status_option_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--generalColorDark);
}
.status_option_text.active {
  color: var(--generalBrand);
}

#vkAuthButton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
::v-deep(iframe) {
  max-width: 500px;
}

.profile_info {
  /* margin-bottom: 50px; */
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.personal_data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.data_header_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
}
.date_wrap {
  width: 100%;
  max-width: 740px;
}
.select_wrap {
  width: 100%;
  max-width: 740px;
}
.data_input_fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.data_input_wrapper {
  position: relative;
  display: flex;
}
.data_input_header_wrapper {
  position: absolute;
  top: -5px;
  left: 10px;
  padding: 0px 4px;
  z-index: 10;
  background-color: var(--generalColorWhite);
}
.data_input_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  text-align: left;
}
.data_input {
  width: 100%;
  max-width: 706px;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  padding: 14px 16px;

  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.data_input.invalid {
  border: 1px solid var(--generalBrand);
}
.data_input:focus {
  border: 1px solid var(--generalBrand) !important;
}
.data_input::placeholder {
  color: var(--generalColorSecondary);
}

.erorrable_data_input {
  display: flex;
  gap: 16px;
}
.data_input_error {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  align-self: center;
}

.work_info_field {
  position: relative;
  max-width: 706px;
  opacity: 0.6;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  background-color: var(--conditionalItemBackgroundHover);
  padding: 14px 16px;
}
.work_info_field_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}

.footer_buttons {
  display: flex;
  flex-wrap: wrap;
}
.save_info_button {
  width: 200px;
  height: 56px;
  border-radius: 6px;
  padding: 6.4px 24px;
  background-color: var(--generalBrand);
}
.save_info_button.active {
  background-color: var(--secondaryColorBrand);
}
.save_info_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.profile_updated_prompt {
  position: absolute;
  top: 50%;
  left: 25%;
}
.how_others_see_my_profile_button {
  height: 56px;
  padding: 6.4px 24px;
  display: flex;
  gap: 10px;
}
.how_others_see_my_profile_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  align-self: center;
}
.how_others_see_my_profile_button_icon {
  width: 14px;
  height: 14px;
  align-self: center;
}

input:focus {
  outline: none;
}
@media (max-width: 768px) {
  .profile_header {
    gap: 80px;
  }
}
</style>
