<template>
  <div class="user_invited_card_wrapper">
    <h3 class="card_title">
      {{ $t("onboarding.communities.goToCommunitie") }}
      {{ communitieName }}
      ?
    </h3>
    <div class="card_buttons_wrapper">
      <button class="card_button _create" @click="goToOrganization">
        {{ $t("onboarding.communities.goTo") }}
      </button>
      <button class="card_button _cancel" @click="cancelGoTo">
        {{ $t("onboarding.communities.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserIvitedCard",
  props: {
    communitieName: {
      required: true,
    },
  },
  methods: {
    goToOrganization() {
      this.$emit("goToOrganization");
    },
    cancelGoTo() {
      this.$emit("cancelGoTo");
    },
  },
};
</script>

<style scoped>
.card_title {
  text-align: center;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  margin: 0;
  color: var(--generalContrast);
}
.card_buttons_wrapper {
  width: 100%;
  display: flex;
  gap: 12px;
  margin: 24px 0 0 0;
}
.card_button {
  width: 50%;
  padding: 16px 0;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-radius: 6px;
}
._create {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
._cancel {
  color: var(--generalBrand);
  background-color: var(--secondaryColorBrand);
}
</style>