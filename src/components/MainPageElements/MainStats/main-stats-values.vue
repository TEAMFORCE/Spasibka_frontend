<template>
  <div class="main_state_values_cover">
    <h2 class="main_stats_values_title">
      {{ $t("mainPage.values.title") }}
    </h2>
    <div class="main_state_values_wrapper">
      <div class="value_block_wrapper">
        <div class="value_block">
          <p class="value_number">{{ valuesData.employees_total }}</p>
          <ContactIcon />
        </div>
        <p class="value_name">{{ $t("mainPage.values.numberOfUsers") }}</p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <p class="value_number">{{ valuesData.transactions_quantity }}</p>
          <DocumentIcon />
        </div>
        <p class="value_name">{{ $t("mainPage.values.numberOfThanks") }}</p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <p class="value_number">{{ valuesData.transactions_sum }}</p>
          <PresentIcon />
        </div>
        <p class="value_name">
          {{ $t("mainPage.values.numberOfTransactions") }}
        </p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <p class="value_number">{{ valuesData.comments_total }}</p>
          <MainCommentIcon />
        </div>
        <p class="value_name">
          {{ $t("mainPage.values.numberOfComments") }}
        </p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <p class="value_number">{{ valuesData.likes_total }}</p>
          <HeartIcon />
        </div>
        <p class="value_name">
          {{ $t("mainPage.values.numberOfLikes") }}
        </p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <p class="value_number">{{ valuesData.challenges_total }}</p>
          <LightIcon />
        </div>
        <p class="value_name">
          {{ $t("mainPage.values.numberOfChallenges") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ContactIcon from "@/components/Icons/contact.vue";
import DocumentIcon from "@/components/Icons/document.vue";
import PresentIcon from "@/components/Icons/present.vue";
import MainCommentIcon from "@/components/Icons/mainComments.vue";
import HeartIcon from "@/components/Icons/heart.vue";
import LightIcon from "@/components/Icons/lightbulb.vue";

export default {
  name: "MainPageValues",
  components: {
    ContactIcon,
    DocumentIcon,
    PresentIcon,
    MainCommentIcon,
    HeartIcon,
    LightIcon,
  },
  props: {
    valuesData: {
      required: true,
    },
  },
};
</script>

<style scoped>
.main_state_values_cover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 32%;
  border-radius: 24px;
  padding: 52px;
  background-color: var(--generalColorWhite);
}
.main_state_values_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.main_stats_values_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
  margin: 0 0 20px 0;
  white-space: nowrap;
}
.value_block_wrapper {
  border: 2px solid var(--lightGray);
  border-radius: 24px;
  padding: 24px;
  width: 88%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.value_block {
  display: flex;
  gap: 4px;
  align-items: flex-start;
  justify-content: space-between;
}
.value_number {
  font-family: "Golos";
  font-weight: 500;
  font-size: 32px;
  margin: 0;
  line-height: 40px;
  color: var(--generalContrast);
}
.value_name {
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  margin: 0;
  line-height: 24px;
  color: var(--generalContrast);
  text-align: left;
}

.contact_icon {
  width: 40px;
  height: 40px;
}
.document_icon {
  width: 40px;
  height: 40px;
}
.present_icon {
  width: 40px;
  height: 40px;
}
.main_comment_icon {
  width: 40px;
  height: 40px;
}
.heart_icon {
  width: 40px;
  height: 40px;
}
.light_icon {
  width: 40px;
  height: 40px;
}
@media (max-width: 1600px) {
  .main_state_values_cover {
    width: 26%;
  }
}
@media (max-width: 1440px) {
  .main_state_values_cover {
    width: auto;
    padding: 52px;

    border-radius: 0;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
  .main_state_values_wrapper {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .value_block_wrapper {
    width: 26%;
    height: 104px;
  }
}
@media (max-width: 1280px) {
  .main_state_values_cover {
    padding: 24px;
    width: auto;
  }
  .value_block_wrapper {
    width: 24%;
  }
}
@media (max-width: 767px) {
  .main_state_values_wrapper {
    flex-direction: column;
    flex-wrap: nowrap;
    height: auto;
  }
  .value_block_wrapper {
    width: 92%;
    height: 64px;
  }
}
</style>