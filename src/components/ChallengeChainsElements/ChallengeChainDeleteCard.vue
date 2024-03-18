<template>
  <div class="challenge_delete_card">
    <h3 class="challenge_delete_card_title">
      {{ $t("challenges.challenge_chains.sure_to_delete_chain") }}
    </h3>
    <img
      src="@/assets/svgIcons/deleteChallengeImg.svg"
      alt="delete_img"
      class="challenge_delete_card_img"
    />
    <div class="challenge_delete_card_buttons">
      <button class="card_button _delete" @click="deleteChallenge">
        {{ $t("challenges.challenge_delete.delete") }}
      </button>
      <button class="card_button _cancel" @click="cancel">
        {{ $t("challenges.challenge_delete.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChallengeChainDeleteCard",
  methods: {
    deleteChallenge() {
      this.$emit("deleteChain");
    },
    cancel() {
      this.$emit("cancelChainDelete");
    },
  },
}
</script>

<style scoped>
.challenge_delete_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.challenge_delete_card_title {
  font-size: 28px;
  line-height: 36px;
  font-weight: 500;
  font-family: "Golos";
  text-align: center;
  color: var(--generalContrast);
  margin: 0;
}
.challenge_delete_card_img {
  max-width: 100%;
}
.challenge_delete_card_buttons {
  width: 100%;
  display: flex;
  gap: 12px;
}
.card_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  font-size: 16px;
  font-family: "Roboto";
}
._delete {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
._cancel {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
</style>