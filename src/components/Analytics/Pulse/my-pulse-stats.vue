<template>
  <div class="my_pulse_stats_wrapper">
    <div class="stats_side_wrapper">
      <div class="stat_item">
        <HeartIcon />
        <h2 class="stat_count">{{ statsData.total_as_recipient }}</h2>
        <h4 class="stat_name">
          {{ $t("analyticsPage.myPulse.iReceivedThanks") }}
          {{ valueName }}
        </h4>
      </div>
      <div class="stat_item">
        <MainCommentIcon />
        <h2 class="stat_count">{{ statsData.total_as_sender }}</h2>
        <h4 class="stat_name">
          {{ $t("analyticsPage.myPulse.iSendThanks") }}
          {{ valueName }}
        </h4>
      </div>

      <div class="stat_item">
        <DocumentIcon />
        <h2 class="stat_count">{{ statsData.count_as_recipient }}</h2>
        <h4 class="stat_name">{{ $t("analyticsPage.myPulse.meThanked") }}</h4>
      </div>
    </div>
    <div class="stats_side_wrapper">
      <div class="stat_item">
        <ContactIcon />
        <h2 class="stat_count">{{ statsData.count_as_sender }}</h2>
        <h4 class="stat_name">{{ $t("analyticsPage.myPulse.iThanked") }}</h4>
      </div>
      <div class="stat_item">
        <PresentIcon />
        <h2 class="stat_count">{{ statsData.challenges_created }}</h2>
        <h4 class="stat_name">
          {{ $t("analyticsPage.myPulse.iCreateChallenge") }}
        </h4>
      </div>
      <div class="stat_item">
        <LightIcon />
        <h2 class="stat_count">{{ statsData.challenges_won }}</h2>
        <h4 class="stat_name">{{ $t("analyticsPage.myPulse.iWinner") }}</h4>
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
  name: "MyPulseStats",
  components: {
    ContactIcon,
    DocumentIcon,
    PresentIcon,
    MainCommentIcon,
    HeartIcon,
    LightIcon,
  },
  props: {
    statsData: {
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
.my_pulse_stats_wrapper {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  width: 100%;
}
.stats_side_wrapper {
  display: flex;
  /* align-items: center; */
  gap: 16px;
  width: 50%;
}
.stat_item {
  width: 100%;
  min-height: 112px;
  padding: 24px 14px 24px 24px;
  border: 2px solid var(--lightGray);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.stat_count {
  font-family: "Golos";
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  color: var(--generalContrast);
  margin: 0;
}
.stat_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
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
@media (max-width: 1440px) {
  .my_pulse_stats_wrapper {
    flex-direction: column;
  }
  .stats_side_wrapper {
    width: 100%;
  }
}
@media (max-width: 680px) {
  .stats_side_wrapper {
    flex-direction: column;
    align-items: center;
  }
  .stat_item {
    width: 92%;
  }
}
@media (max-width: 480px) {
  .stat_item {
    width: 90%;
  }
}
</style>