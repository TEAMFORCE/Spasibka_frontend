<template>
  <div class="welcome_block">
    <div class="thx_coin_icon_wrapper">
      <img
        class="thx_coin_icon"
        src="@/assets/svgIcons/thx_coin.svg"
        alt="thx_coin"
      />
    </div>
    <div class="thx_coin_icon_wrapper_two">
      <img
        class="thx_coin_icon"
        src="@/assets/svgIcons/thx_coin.svg"
        alt="thx_coin"
      />
    </div>
    <div class="thx_coin_icon_wrapper_three">
      <img
        class="thx_coin_icon"
        src="@/assets/svgIcons/thx_coin.svg"
        alt="thx_coin"
      />
    </div>
    <div class="welcome_greeting">
      <h2 class="greeting_title">
        {{ $t("onboarding.welcome_block.welcome") }}
      </h2>
      <h4 class="greeting_description">
        {{ $t("onboarding.welcome_block.description") }}
      </h4>
      <div class="greeting_buttons_wrapper">
        <button
          class="greeting_button"
          @click="createOrganization"
          :disabled="inviteLink"
        >
          {{ $t("onboarding.welcome_block.create") }}
        </button>
        <button class="greeting_button" @click="openOrganizationCreatedCard">
          {{ $t("onboarding.welcome_block.invite") }}
        </button>
        <button class="greeting_button" @click="scrollToPeriod">
          {{ $t("onboarding.welcome_block.start") }}
        </button>
      </div>
    </div>
    <div class="welcome_img_wrapper">
      <img
        class="welcome_img"
        src="@/assets/svgIcons/welcome_img.svg"
        alt="welcome_img"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "OnboardingWelcomeBlock",
  props: {
    inviteLink: {
      required: true,
    },
  },
  methods: {
    createOrganization() {
      this.$emit("createOrganization");
    },
    openOrganizationCreatedCard() {
      this.$emit("openOrganizationCreatedCard");
    },
    scrollToPeriod() {
      this.$emit("scrollToPeriod");
    },
  },
};
</script>

<style scoped>
.welcome_block {
  width: 89.3%;
  height: 680px;
  border-radius: 24px 0px 0px 24px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  display: flex;
  position: relative;
}
.thx_coin_icon_wrapper {
  position: absolute;
  left: 4%;
  top: -3%;
  z-index: 0;
}
.thx_coin_icon_wrapper_two {
  display: none;
}
.thx_coin_icon_wrapper_three {
  display: none;
}
.thx_coin_icon {
  width: 90%;
}
.welcome_greeting {
  width: 55%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 4.4%;
  position: relative;
  z-index: 2;
}
.greeting_title {
  font-family: "Golos";
  font-weight: 600;
  font-size: 96px;
  text-align: center;
  margin: 0;
  color: var(--generalBrand);
}
.greeting_description {
  font-family: "Golos";
  font-weight: 400;
  font-size: 24px;
  text-align: center;
  margin: 0;
  color: var(--generalContrast);
  margin: 43px 0 0 0;
}
.greeting_buttons_wrapper {
  display: flex;
  gap: 12px;
  margin: 52px 0 0 0;
}
.greeting_button {
  outline: 0;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 25px;
  color: var(--generalContrast);

  padding: 11.5px 14px;
  background-color: transparent;
  border: 1px solid var(--generalContrast);
  border-radius: 12px;
  transition: 0.3s;
}
.greeting_button:active {
  transform: scale(0.99);
  border: 1px solid var(--generalColorSecondary);
}
.welcome_img_wrapper {
  width: 45%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.welcome_img {
  height: 86%;
  max-height: 585px;
}
@media (max-width: 1600px) {
  .thx_coin_icon_wrapper {
    position: absolute;
    left: 4%;
    top: 4%;
    z-index: 0;
  }
  .thx_coin_icon {
    width: 80%;
  }
  .greeting_title {
    font-size: 64px;
  }
  .welcome_img {
    height: 86%;
    max-height: 420px;
  }
}
@media (max-width: 1280px) {
  .thx_coin_icon_wrapper {
    position: absolute;
    left: 4%;
    top: 4%;
    z-index: 0;
  }
  .thx_coin_icon {
    width: 80%;
  }
  .greeting_title {
    font-size: 48px;
  }
  .greeting_description {
    font-size: 20px;
    margin: 28px 0 0 0;
  }
  .greeting_button {
    font-size: 14px;
  }
  .welcome_img {
    height: 86%;
    max-height: 420px;
  }
}
@media (max-width: 1024px) {
  .welcome_block {
    width: 97%;
    height: 472px;
    overflow: hidden;
  }
  .welcome_greeting {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 0 0 4.4%;
    position: relative;
    z-index: 2;
  }
  .greeting_title {
    font-size: 48px;
  }

  .greeting_description {
    width: 80%;
    font-size: 16px;
  }
  .greeting_button {
    font-size: 16px;
  }
  .thx_coin_icon_wrapper {
    width: 48%;
    top: -2%;
    left: -2%;
  }
  .thx_coin_icon_wrapper_two {
    width: 48%;
    display: block;
    position: absolute;
    top: 50%;
    left: 30%;
  }
  .thx_coin_icon_wrapper_three {
    width: 48%;
    display: block;
    position: absolute;
    top: -8%;
    right: -10%;
  }
  .welcome_img_wrapper {
    display: none;
  }
}
@media (max-width: 768px) {
  .welcome_block {
    display: none;
  }
}
</style>