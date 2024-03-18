<template>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1"
  />
  <div class="login_page">
    <ConfirmationPopup
      v-if="confirmationPopupEnabled"
      :orgName="orgToProceedName"
      :orgID="orgToProceedID"
      @confirmProceed="confirmProceed"
      @cancelProceed="cancelProceed"
    />
    <div class="login_frame">
      <!-- <button
        @click="loginWithVK"
      >
        VK
      </button> -->
      <h1 class="enter_text">{{ $t("login.login_or_register") }}</h1>
      <h1 class="enter_data_text general-secondary-color">
        {{ enterDataText }}
      </h1>
      <input
        :class="{ error: err }"
        @keyup.enter="proceedLogin()"
        @input="onInput()"
        class="login_input"
        v-model="enteredInput"
        :placeholder="inputPlaceholder"
      />
      <template v-if="defer(2)">
        <Relogin
          v-if="step == 2"
          :organizations="organizations"
          :initialLogin="true"
          @relogin="relogin"
          @cancelRelogin="cancelRelogin"
        />
        <Relogin
          v-if="step === 4"
          :organizations="organizationsForVK"
          :initialLogin="true"
          @relogin="selectOrganizationForVK"
          @cancelRelogin="cancelVKLogin"
        />
      </template>
      <!-- <template v-if="defer(3)"> -->
      <div class="login_and_accept">
        <button
          :class="{ active: nonEmptyInput }"
          class="login_button"
          @click="proceedLogin()"
        >
          {{ loginButtonText }}
        </button>
        <div class="accept_wrapper" v-if="!termsAccepted">
          <button
            class="accept_toggler general-white-bg"
            :class="{ active: isButtonAccept }"
            @click="toggleAccept"
          >
            <img
              v-if="isButtonAccept"
              class="toggle_icon"
              :src="togglerIcon"
              alt="accept-checkbox"
            />
          </button>
          <div class="accept_text">
            <h1 class="accept_text_words general-contrast-color">Согласен</h1>
            <h1 class="accept_text_words general-contrast-color">c</h1>
            <a class="link_to_doc" :href="'/privacy_policy'" target="_blank">
              <h1 class="accept_text_words general-brand-color">Политикой</h1>
              <h1 class="accept_text_words general-brand-color">
                конфиденциальности
              </h1>
            </a>
            <h1 class="accept_text_words general-contrast-color">и</h1>
            <h1 class="accept_text_words general-contrast-color">условиями</h1>
            <a class="link_to_doc" :href="'/terms_of_use'" target="_blank">
              <h1 class="accept_text_words general-brand-color">
                Пользовательского
              </h1>
              <h1 class="accept_text_words general-brand-color">соглашения</h1>
            </a>
          </div>
        </div>
      </div>
      <button
        @click="openHint"
        v-if="step !== 1 && !hintOpened"
        class="code_not_received transparent-bg general-secondary-color"
      >
        {{ $t("login.code_not_received") }}
      </button>
      <div v-if="hintOpened && hintTarget" class="hint_texts">
        <h1
          v-if="hintTarget === 'telegram'"
          class="hint_text general-contrast-color"
        >
          {{ $t("login.in_dialogue_with_bot") }}
        </h1>
        <a
          v-if="hintTarget === 'telegram'"
          class="hint_text general-brand-color"
          href="https://t.me/DigitalRefBot"
          target="_blank"
        >
          https://t.me/DigitalRefBot
        </a>
        <h1
          v-if="hintTarget === 'telegram'"
          class="hint_text general-contrast-color"
        >
          {{ $t("login.enter_command") + " " }}
        </h1>
        <h1
          v-if="hintTarget === 'telegram'"
          class="hint_text general-brand-color"
        >
          /start
        </h1>
        <h1
          v-if="hintTarget === 'telegram'"
          class="hint_text general-contrast-color"
        >
          {{ $t("login.after_which_repeat") + " " }}
        </h1>
        <button
          @click="reloadAuthWindow"
          v-if="hintTarget === 'telegram'"
          class="hint_text general-brand-color transparent-bg"
        >
          {{ $t("login.auth_procedure") + " " }}
        </button>
        <h1
          v-if="hintTarget === 'email'"
          class="hint_text general-contrast-color"
        >
          {{ $t("login.check_folder") + " " }}
        </h1>
        <h1 v-if="hintTarget === 'email'" class="hint_text general-brand-color">
          {{ $t("login.spam") + " " }}
        </h1>
        <h1
          v-if="hintTarget === 'email'"
          class="hint_text general-contrast-color"
        >
          {{ $t("login.and_correctness_of_entered_email_address") + " " }}
        </h1>
        <h1 v-if="hintTarget === 'email'" class="hint_text general-brand-color">
          {{ hintEmail }}
        </h1>
        <h1
          v-if="hintTarget === 'email'"
          class="hint_text general-contrast-color"
        >
          {{ $t("login.after_which_repeat") + " " }}
        </h1>
        <button
          @click="reloadAuthWindow"
          v-if="hintTarget === 'email'"
          class="hint_text general-brand-color transparent-bg"
        >
          {{ $t("login.auth_procedure") + " " }}
        </button>
      </div>
      <!-- </template> -->
      <template v-if="defer(3)">
        <div v-if="step === 1" class="marketplaces">
          <a
            href="https://apps.rustore.ru/app/com.teamforce.thanksapp"
            class="ru_store marketplace_button"
          ></a>
          <a
            href="https://apps.apple.com/us/app/teamforce360/id1671445604"
            class="app_store marketplace_button"
          ></a>
          <a
            href="https://play.google.com/store/apps/details?id=com.teamforce.thanksapp"
            class="google_play marketplace_button"
          ></a>
        </div>
      </template>
      <template v-if="defer(4)">
        <div v-if="err" class="error_message minor-error-secondary-bg">
          <img
            class="error_icon"
            src="@/assets/LoginErrorIcon.png"
            alt="error-icon"
          />
          <h1 class="error_text minor-error-primary-color">
            {{ loginErrorMessage }}
          </h1>
        </div>
      </template>
    </div>
    <!-- <div class="brand yellow-gradient-bg"> -->
    <div class="footer">
      <div class="footer_links">
        <a class="link_to_doc general-contrast-color" href="/terms_of_use">
          {{ $t("login.terms_of_use") }}
        </a>
        <a class="link_to_doc general-contrast-color" href="/privacy_policy">
          {{ $t("login.privacy_policy") }}
        </a>
      </div>
      <h1 class="footer_copyright general-white-color">
        © 2008-2023, ТИМ ФОРС
      </h1>
    </div>
    <img
      class="brand_image"
      :class="{ fade: curImageIndex === 1 }"
      :src="brandImageLaptop"
      alt="brand-image"
    />
    <img
      class="brand_image"
      :class="{ fade: curImageIndex === 2 }"
      :src="brandImageHand"
      alt="brand-image"
    />
    <img class="tf_logo" :src="TFLogo" />
    <img class="gradient_hand_1" :src="gradient1" />
    <img class="gradient_hand_2" :src="gradient2" />
    <img
      class="form_culture"
      :class="{ fade: curImageIndex === 1 }"
      :src="formCulture"
    />
    <img
      class="broadcast_values"
      :class="{ fade: curImageIndex === 1 }"
      :src="broadcastValues"
    />
    <img
      class="increase_activity"
      :class="{ fade: curImageIndex === 2 }"
      :src="increaseActivity"
    />
    <img
      class="motivate_participants"
      :class="{ fade: curImageIndex === 2 }"
      :src="motivateParticipants"
    />
    <div class="cover_image_switcher">
      <button
        class="image_switcher_button brand-secondary-bg"
        :class="{ active: curImageIndex === 1 }"
        @click="curImageIndex = 1"
      ></button>
      <button
        class="image_switcher_button brand-secondary-bg"
        :class="{ active: curImageIndex === 2 }"
        @click="curImageIndex = 2"
      ></button>
    </div>
    <!-- </div> -->

    <BrandLogoIcon class="brand_coins_top_left" alt="brand-image" />
    <BrandLogoIcon class="brand_coins_middle_right" alt="brand-image" />
    <BrandLogoIcon class="brand_coins_bottom_left" alt="brand-image" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import Defer from "@/mixins/defer";
import BrandLogoIcon from "@/components/Icons/LoginIcons/BrandLogoIcon.vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { notify } from "@/general-scripts/toast-notification";

// import ConfirmationPopup from ;
import { Config, Connect, ConnectEvents } from "@vkontakte/superappkit";

export default {
  name: "Login",
  components: {
    Relogin: defineAsyncComponent(() =>
      import("@/components/ReloginElements/Relogin.vue")
    ),
    ConfirmationPopup: defineAsyncComponent(() =>
      import("@/components/LoginElements/ConfirmationPopup.vue")
    ),
    BrandLogoIcon,
  },
  mixins: [Defer()],
  data() {
    return {
      changeOrganizationEnabled: false,
      step: 1,
      code: "",
      enteredInput: "",
      status: "",
      err: false,
      organizations: [],
      selectedOrganization: null,
      changeOrg: false,
      isButtonAccept: false,
      termsAccepted: false,
      confirmationPopupEnabled: false,
      orgToProceedName: null,
      orgToProceedID: null,

      organizationsForVK: [],
      chooseOrganizationForVK: false,
      selectedOrganizationForVK: null,
      accessTokenForVK: null,

      curImageIndex: 1,
      hintOpened: false,
      hintTarget: "",
      hintEmail: "",
    };
  },

  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    brandImageLaptop() {
      return this.getImgUrl("LoginBrandImage1");
    },
    brandImageHand() {
      return this.getImgUrl("LoginBrandImage2");
    },
    TFLogo() {
      return this.getSvgUrl("TFLogo");
    },
    gradient1() {
      let type = "Hand";
      if (this.curImageIndex === 1) {
        type = "Laptop";
      }
      return this.getImgUrl(`Gradient${type}1`);
    },
    gradient2() {
      let type = "Hand";
      if (this.curImageIndex === 1) {
        type = "Laptop";
      }
      return this.getImgUrl(`Gradient${type}2`);
    },
    motivateParticipants() {
      return this.getSvgUrl("MotivateParticipants");
    },
    broadcastValues() {
      return this.getSvgUrl("BroadcastValues");
    },
    increaseActivity() {
      return this.getSvgUrl("IncreaseActivity");
    },
    formCulture() {
      return this.getSvgUrl("FormCulture");
    },
    enterDataText() {
      if (this.step == 1)
        return "Введите адрес электронной почты или имя пользователя в Telegram";
      else return this.status;
    },
    loginButtonText() {
      if (this.step == 1) return "Получить код";
      return "Войти";
    },
    nonEmptyInput() {
      if (!this.isButtonAccept && !this.termsAccepted) return false;
      return this.enteredInput.length > 0;
    },
    inputPlaceholder() {
      if (this.step == 1) return "Email/Telegram";
      else return "Введите код подтверждения";
    },
    loginErrorMessage() {
      if (this.step == 1) return "Пользователь не найден";
      else return "Неверный код";
    },
    togglerIcon() {
      return this.getImgUrl("TogglerIcon");
    },
    sharedKey() {
      if (this.$route?.query?.invite) {
        return this.$route.query.invite;
      } else {
        return null;
      }
    },
  },
  methods: {
    reloadAuthWindow() {
      window.location.reload();
    },
    openHint() {
      this.hintOpened = true;
    },
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
      const inviteLink = this.$route.query.invite;
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
              let pathFromFullAuthNeeded = "/vk_redirect";
              let requestObjectFromFullAuthNeeded = {
                url: window.location.origin + pathFromFullAuthNeeded,
              };

              if (inviteLink) {
                requestObjectFromFullAuthNeeded.state = inviteLink;
              }
              return Connect.redirectAuth(requestObjectFromFullAuthNeeded);
            case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED:
              let pathFromPhoneValidationNeeded = "/vk_redirect";
              let requestObjectFromPhoneValidationNeeded = {
                url: window.location.origin + pathFromPhoneValidationNeeded,
              };

              if (inviteLink) {
                requestObjectFromPhoneValidationNeeded.state = inviteLink;
              }
              return Connect.redirectAuth(
                requestObjectFromPhoneValidationNeeded
              );
            case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN:
              let pathFromShowLogin = "/vk_redirect";
              let requestObjectFromShowLogin = {
                url: window.location.origin + pathFromShowLogin,
              };

              if (inviteLink) {
                requestObjectFromShowLogin.state = inviteLink;
              }
              return Connect.redirectAuth(requestObjectFromShowLogin);
            case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS:
              let pathFromLoginOptions = "/vk_redirect";

              let requestObjectFromLoginOptions = {
                url: window.location.origin + pathFromLoginOptions,
                screen: "phone",
              };

              if (inviteLink) {
                requestObjectFromLoginOptions.state = inviteLink;
              }

              return Connect.redirectAuth(requestObjectFromLoginOptions);
            default:
              let pathFromDefaultCase = "/vk_redirect";
              let requestObjectFromDefaultCase = {
                url: window.location.origin + pathFromDefaultCase,
              };

              if (inviteLink) {
                requestObjectFromDefaultCase.state = inviteLink;
              }
            //return Connect.redirectAuth(requestObjectFromDefaultCase);
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
        const targetDiv = document.querySelector(`div.login_and_accept`);
        if (targetDiv) {
          const newDiv = document.createElement("div");
          newDiv.id = "vkAuthButton";
          if (targetDiv.nextSibling) {
            targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);
          } else {
            targetDiv.parentNode.appendChild(newDiv);
          }
        }
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
        if (this.$route.query.invite) {
          requestObject.shared_key = this.$route.query.invite;
        }
        const response = await axios.post(API_URIS.VKGetToken, requestObject);
        this.accessTokenForVK = response.data.access_token;
        localStorage.setItem("VKAccessToken", this.accessTokenForVK);
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
        if (this.$route.query.invite) {
          requestObject.shared_key = this.$route.query.invite;
        }
        const response = await axios.post(API_URIS.VKAuth, requestObject);
        if (response.data.details === "need to choose organization") {
          this.chooseOrganizationForVK = true;
          this.organizationsForVK = response.data.organizations_data;
          this.step = 4;
        } else {
          this.$router.push("/main");
        }
      } catch (err) {
        throw err;
      }
    },
    async selectOrganizationForVK(selectedOrganization) {
      try {
        await axios.post(API_URIS.VKChooseOrg, {
          user_id: selectedOrganization.user_id,
          organization_id: selectedOrganization.organization_id,
          access_token: this.accessTokenForVK,
        });
        this.$router.push("/main");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    cancelVKLogin() {
      window.location.reload();
    },

    async confirmProceed() {
      const myProfileInfo = this.profileInfo;
      await axios.get(API_URIS.logOutURL);
      this.confirmationPopupEnabled = false;
      let login = myProfileInfo.profile.tg_name;
      if (!login) {
        for (let i = 0; i < myProfileInfo?.profile?.contacts?.length; ++i) {
          if (myProfileInfo.profile.contacts[i].contact_type === "@") {
            login = myProfileInfo.profile.contacts[i].contact_id;
            break;
          }
        }
      }
      if (!login) {
        login = myProfileInfo.profile.nickname;
      }
      const response = await axios.post(
        API_URIS.authURL,
        {
          type: "authorize",
          login: login,
          shared_key: this.$route.query.invite,
        },
        {
          withCredentials: true,
        }
      );
      this.status = response?.data?.status;
      this.step = 3;
      const div = document.getElementById("vkAuthButton");
      if (div) {
        div.parentNode.removeChild(div);
      }
    },
    cancelProceed() {
      this.$router.push("/main");
    },
    async logoutByOrganizationKey() {
      await this.getProfile();
      try {
        const response = await axios.get(API_URIS.communityInvite, {
          params: {
            invite: this.$route.query.invite,
          },
        });
        if (
          response.data.organization_id ===
          this.profileInfo.profile.organization_id
        ) {
          this.$router.push("/main");
          return;
        } else {
          this.orgToProceedName = response.data.organization_name;
          this.orgToProceedID = response.data.organization_id;
          this.confirmationPopupEnabled = true;
        }
      } catch (err) {
        throw err;
      }
    },
    async changeOrganizationVerify() {
      try {
        await axios.post(API_URIS.userChangeOrganizationVerify, {
          code: this.enteredInput,
        });
        this.$router.push("/main");
      } catch (err) {
        notify(
          err?.response?.data?.reason ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/LoginImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getSvgUrl(imageName) {
      var images = require.context("@/assets/LoginImages", false, /\.svg$/);
      return images("./" + imageName + ".svg");
    },
    toggleAccept() {
      this.isButtonAccept ^= 1;
      if (this.isButtonAccept) {
        const div = document.getElementById("vkAuthButton");
        if (!div) this.createVkAuthButton();
      } else {
        const div = document.getElementById("vkAuthButton");
        if (div) {
          div.parentNode.removeChild(div);
        }
      }
    },
    onInput() {
      this.err = false;
    },
    proceedLogin() {
      if (this.nonEmptyInput) {
        if (this.step == 1) this.sendCodeToUser();
        else if (this.changeOrganizationEnabled) {
          this.changeOrganizationVerify();
        } else this.enterTheCode();
      }
    },
    cancelRelogin() {
      this.step = 1;
    },
    checkTermsAccepted(noVK = false) {
      let isTermsAccepted = localStorage.getItem("isTermsAccepted");
      if (isTermsAccepted == "true") {
        this.termsAccepted = true;
        if (!noVK) {
          const div = document.getElementById("vkAuthButton");
          if (!div) this.createVkAuthButton();
        }
      }
    },
    async relogin(organization) {
      try {
        const response = await axios.post(API_URIS.chooseOrganization, {
          user_id: organization.user_id,
          organization_id: organization.organization_id,
        });
        if (response.data?.target) {
          this.hintTarget = response.data.target;
        }
        notify(response?.data?.status || response?.data, "success");
        this.status = response.data.status;
        this.selectedOrganization = organization;
        this.step = 3;
        localStorage.setItem("isTermsAccepted", "true");
        this.checkTermsAccepted(true);
        const div = document.getElementById("vkAuthButton");
        if (div) {
          div.parentNode.removeChild(div);
        }
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },

    async sendCodeToUser() {
      try {
        let query = {
          type: "authorize",
          login: this.enteredInput,
          //shared_key: this.sharedKey,
        };
        this.hintEmail = JSON.parse(JSON.stringify(this.enteredInput));
        if (this.sharedKey) query.shared_key = this.sharedKey;
        const response = await axios.post(API_URIS.authURL, query, {
          withCredentials: true,
        });
        if (response.data?.target) {
          this.hintTarget = response.data.target;
        }
        this.err = false;
        if (response.data.organizations?.length) {
          this.step = 2;
          this.changeOrg = true;
        } else {
          this.changeOrg = false;
          this.step = 3;
          const div = document.getElementById("vkAuthButton");
          if (div) {
            div.parentNode.removeChild(div);
          }
        }
        this.enteredInput = "";
        this.organizations = response.data.organizations;
        localStorage.setItem("isTermsAccepted", "true");
        this.checkTermsAccepted(true);
      } catch (err) {
        this.err = true;
        throw err;
      }
    },
    async enterTheCode() {
      try {
        let query = {
          type: "authcode",
          code: this.enteredInput,
          //shared_key: this.sharedKey,
        };
        if (this.sharedKey) query.shared_key = this.sharedKey;
        if (this.changeOrg) {
          query.organization_id = this.selectedOrganization.organization_id;
        }
        await axios.post(API_URIS.verifyURL, query);
        this.err = false;
        await this.getProfile();
        if (this.profileInfo.profile.organization_id) {
          this.$router.push("/main");
        } else {
          this.$router.push("/onboarding");
        }
      } catch (err) {
        this.err = true;
        throw err;
      }
    },
    async getProfile() {
      await this.profileStore.getProfileInfo();
    },
  },
  mounted() {
    setInterval(() => {
      this.curImageIndex = 3 - this.curImageIndex;
    }, 12500);
    if (this.$route.query.newOrgID) {
      this.orgToProceedName = this.$route.query.newOrgName;
      this.orgToProceedID = this.$route.query.newOrgID;
      this.confirmationPopupEnabled = true;
    } else if (this.$route.query.invite) {
      this.logoutByOrganizationKey();
    }
    this.checkTermsAccepted();
  },
};
</script>

<style scoped>
.login_page {
  position: relative;
  background-color: #fdfdfd;
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
}

.login_frame {
  position: relative;
  padding: 67px 52px;
  width: 518px;
  box-sizing: border-box;
  height: fit-content;
  /* align-self: center; */
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 76px;
  border-radius: 24px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 12;
}
@media (max-width: 630px) {
  .login_frame {
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
  }
  .brand_image {
    display: none;
  }
  .gradient_hand_1 {
    display: none;
  }
  .gradient_hand_2 {
    display: none;
  }
  .cover_image_switcher {
    display: none !important;
  }
}
.enter_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: #1c1c1c;
}
.enter_data_text {
  margin: auto;
  margin-top: 20px;
  margin-bottom: 0px;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.login_input {
  margin: auto;
  margin-top: 36px;
  margin-bottom: 0px;
  padding: 18px 16px;
  max-width: 382px;
  width: calc(100% - 32px);
  height: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  color: var(--generalContrast);
  border: 1px solid var(--generalColorGrey);
}
.login_input.error {
  color: var(--minorError);
  border: 1px solid var(--minorError);
}
.login_input:focus {
  outline: none;
}
::placeholder {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #cecece;
}
.login_and_accept {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
::v-deep(#vkAuthButton) {
  margin-top: 20px;
  max-width: 414px;
  align-self: center;
  width: 100%;
}
.login_button {
  margin: auto;
  margin-bottom: 0px;
  margin-top: 22px;
  padding: 18px 36px;
  width: 100%;
  max-width: 414px;
  height: 56px;
  background-color: var(--neutral93);
  color: var(--generalColorSecondary);
  border-style: none;
  border-radius: 6px;
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
.login_button.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.login_button:focus {
  outline: none;
}
.accept_wrapper {
  margin: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  max-width: 414px;
  width: 100%;
}
.accept_toggler {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  min-width: 16px;
  border: 2px solid var(--generalColorGrey);
  border-radius: 2px;
}
.accept_toggler.active {
  padding: 5px 2.69px 3.38px 2.69px;
  border: none;
  background-color: var(--generalBrand);
}
.toggle_icon {
  height: 7.62px;
  width: 10.62px;
}
.accept_text {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.accept_text_words {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.code_not_received {
  margin-top: 20px;
  font-family: "Ubuntu";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}
.hint_texts {
  display: flex;
  flex-wrap: wrap;
  row-gap: 0px;
  align-items: center;
  margin-top: 20px;
  column-gap: 7px;
}
.hint_text {
  font-family: "Ubuntu";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
}
.link_to_doc {
  display: flex;
  text-decoration: none;
  flex-wrap: wrap;
  gap: 4px;
}
.marketplaces {
  margin-top: 52px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}
.marketplace_button {
  width: 135px;
  height: 40px;
  border-style: none;
  padding: 0px;
}
.marketplace_button:focus {
  outline: none;
}
.ru_store {
  background: url("@/assets/LoginImages/RuStore.png") no-repeat;
  background-size: 119.66px 40px;
  width: 119.66px;
}
.app_store {
  background: url("@/assets/LoginImages/AppStore.png") no-repeat;
  background-size: 119.66px 40px;
  width: 119.66px;
}
.google_play {
  background: url("@/assets/LoginImages/GooglePlay.png");
  background-size: 135px 40px;
}
.error_message {
  margin: auto;
  margin-top: 64px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  height: 24px;
  padding: 12px;
  border-radius: 12px;
}
.error_icon {
  width: 24px;
  height: 24px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
.error_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
}
.brand {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 468px;
  height: 100%;
  flex-shrink: 0;
  z-index: 3;
}
@media (max-width: 770px) {
  .brand {
    display: none;
  }
}
.footer {
  left: 0;
  right: 0;
  z-index: 12;
  position: absolute;
  bottom: 0;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 24px;
  flex-wrap: wrap;
}
@media (max-height: 800px) {
  .footer {
    display: none;
  }
}
@media (max-width: 448px) {
  .footer_copyright {
    display: none;
  }
}
.footer_links {
  display: flex;
  gap: 24px;
}
.link_to_doc {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.footer_copyright {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: right;
  text-decoration: underline;
}
.brand_image {
  z-index: 10;
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0;
  transition: opacity 2s;
  height: 100%;
}
.fade {
  opacity: 1 !important;
}

.tf_logo {
  position: absolute;
  top: 30px;
  right: 30px;
}
.gradient_hand_1 {
  z-index: 9;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 90%;
}
.gradient_hand_2 {
  z-index: 9;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 70%;
}
.motivate_participants {
  z-index: 9;
  position: absolute;
  right: 40%;
  bottom: 9%;
  opacity: 0;
  transition: opacity 2s;
}
.broadcast_values {
  z-index: 9;
  position: absolute;
  right: 5%;
  top: 20%;
  opacity: 0;
  transition: opacity 2s;
}
.increase_activity {
  z-index: 9;
  position: absolute;
  right: 4%;
  top: 14%;
  opacity: 0;
  transition: opacity 2s;
}
.form_culture {
  z-index: 9;
  position: absolute;
  right: 30%;
  top: 8%;
  opacity: 0;
  transition: opacity 2s;
}
.cover_image_switcher {
  height: 36px;
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 12px;
  top: 50%;
  transform: translateY(-50%);
  left: 16px;
  z-index: 10;
}
.image_switcher_button {
  border-radius: 50%;
  width: 12px;
  height: 12px;
}
.image_switcher_button.active {
  background-color: var(--generalBrand);
}
.brand_coins_top_left {
  position: fixed;
  top: -64.78px;
  left: -102.58px;
  width: 386.26px;
  height: 386.26px;
}
.brand_coins_middle_right {
  position: fixed;
  top: 0%;
  /* transform: translateY(-50%); */
  /* right: 413.33px; */
  left: 445px;
  width: 386.26px;
  height: 386.26px;
}
.brand_coins_bottom_left {
  position: fixed;
  bottom: 50%;
  left: 0;
  transform: translateY(450px);
  width: 297.92px;
  height: 297.92px;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  color: black;
}
h1 {
  margin: 0px;
}
</style>
