<template>
  <div class="no_communities_card_wrapper">
    <h3 class="card_title">
      {{ $t("onboarding.communities.inviteEmployee") }}
    </h3>
    <h4 class="card_description">
      {{ $t("onboarding.communities.noCommunities") }}
    </h4>
    <button class="close_button" @click="closeError">
      {{ $t("onboarding.communities.close") }}
    </button>
  </div>
</template>

<script>
export default {
  name: "NoCommunityCard",
  methods: {
    closeError() {
      this.$emit("closeErrorNoCommunity");
    },
  },
};
</script>

<style scoped>
.card_title {
  text-align: left;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  margin: 0;
  color: var(--generalContrast);
}
.card_description {
  text-align: left;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  margin: 4px 0 0 0;
  color: var(--generalColorSecondary);
}
.close_button {
  width: 100%;
  padding: 16px 0;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-radius: 6px;
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
  margin: 24px 0 0 0;
}
</style>