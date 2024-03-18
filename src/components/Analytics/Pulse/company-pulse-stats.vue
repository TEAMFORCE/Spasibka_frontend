<template>
  <div class="company_pulse_stats">
    <div class="left_values_wrapper">
      <div class="value_block_wrapper">
        <div class="value_block">
          <MainCommentIcon />
          <p class="value_number">
            {{ valuesData.transactions_recipient_total }}
          </p>
        </div>
        <p class="value_name">
          {{ valueName }}
          {{ $t("companyPulsePage.transactionsRecipientTotal") }}
        </p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <DocumentIcon />
          <p class="value_number">{{ valuesData.transactions_sender_total }}</p>
        </div>
        <p class="value_name">
          {{ valueName }}
          {{ $t("companyPulsePage.transactionsSenderTotal") }}
        </p>
      </div>

      <div class="value_block_wrapper">
        <div class="value_block">
          <HeartIcon />
          <p class="value_number">
            {{ valuesData.recipient_transactions_count }}
          </p>
        </div>
        <p class="value_name">
          {{ $t("companyPulsePage.organizationReceivedThanks") }}
        </p>
      </div>
    </div>
    <div class="right_values_wrapper">
      <div class="value_block_wrapper">
        <div class="value_block">
          <ContactIcon />
          <p class="value_number">{{ valuesData.sender_transactions_count }}</p>
        </div>
        <p class="value_name">
          {{ $t("companyPulsePage.organizationSendedThanks") }}
        </p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <PresentIcon />
          <p class="value_number">{{ valuesData.challenges_created }}</p>
        </div>
        <p class="value_name">
          {{ $t("companyPulsePage.createdChalenges") }}
        </p>
      </div>
      <div class="value_block_wrapper">
        <div class="value_block">
          <LightIcon />
          <p class="value_number">{{ valuesData.challenges_won }}</p>
        </div>
        <p class="value_name">
          {{ $t("companyPulsePage.challengeWins") }}
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

import { organizationSettingsStore } from "@/store/organization-settings";

export default {
  name: "CompanyPulseStats",
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
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form4;
    },
  },
};
</script>

<style scoped>
.company_pulse_stats {
  display: flex;
  gap: 16px;
  width: 100% !important;
}
.left_values_wrapper {
  width: 100%;
  display: flex;
  gap: 16px;
}
.right_values_wrapper {
  width: 100%;
  display: flex;
  gap: 16px;
}
.value_block_wrapper {
  width: 33%;
  border: 2px solid var(--lightGray);
  border-radius: 24px;
  padding: 24px !important;
}
.value_block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.value_number {
  font-family: "Golos";
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin: 0;
}
.value_name {
  text-align: left;
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin: 4px 0 0 0;
}
@media (max-width: 1440px) {
  .company_pulse_stats {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .left_values_wrapper {
    width: 100%;
  }
  .right_values_wrapper {
    width: 100%;
  }
}
@media (max-width: 700px) {
  .left_values_wrapper {
    flex-direction: column;
  }
  .right_values_wrapper {
    flex-direction: column;
  }
  .value_block_wrapper {
    width: 92%;
  }
}
@media (max-width: 600px) {
  .value_block_wrapper {
    width: 90%;
  }
}
@media (max-width: 500px) {
  .value_block_wrapper {
    width: 88%;
  }
}
@media (max-width: 400px) {
  .value_block_wrapper {
    width: 86%;
  }
}
.main_comment_icon {
  width: 40px;
  height: 40px;
}
.document_icon {
  width: 40px;
  height: 40px;
}
.heart_icon {
  width: 36px;
  height: 36px;
}
.contact_icon {
  width: 40px;
  height: 40px;
}
.present_icon {
  width: 40px;
  height: 40px;
}
.light_icon {
  width: 40px;
  height: 40px;
}
</style>