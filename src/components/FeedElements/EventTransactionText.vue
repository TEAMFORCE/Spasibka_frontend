<template>
  <div class="transaction_text_wrapper">
    <h1
      v-if="feedItem.transactionRecipientID == selfUserID"
      class="transaction_text general-contrast-color"
    >
      {{ $t("feed.you") }}
    </h1>
    <h1
      v-if="feedItem.transactionRecipientID != selfUserID"
      class="transaction_text cursor_pointer general-brand-color"
      @click="$router.push('/other_profile/' + feedItem.transactionRecipientID)"
    >
      {{ recipientDisplayName }}
    </h1>
    <h1 class="transaction_text general-contrast-color">
      {{
        feedItem.transactionRecipientID == selfUserID
          ? $t("feed.you_received")
          : $t("feed.somebody_received")
      }}
    </h1>
    <h1 class="transaction_text minor-success-color">
      {{ thanksDeclension }}
    </h1>
    <h1
      class="transaction_text general-contrast-color"
      v-if="!feedItem.transactionIsAnonymous"
    >
      {{ $t("general.from") }}
    </h1>
    <h1
      class="transaction_text general-brand-color"
      @click="
        feedItem.transactionIsAnonymous
          ? () => {}
          : $router.push('/other_profile/' + feedItem.transactionSenderID)
      "
      :class="{
        cursor_pointer: !feedItem.transactionIsAnonymous,
      }"
    >
      {{
        feedItem.transactionSenderID == selfUserID
          ? $t("feed.from_you")
          : feedItem.transactionIsAnonymous
          ? ""
          : senderDisplayName
      }}
    </h1>
  </div>
</template>

<script>
import { organizationSettingsStore } from "@/store/organization-settings";

export default {
  name: "EventTransactionText",
  props: {
    feedItem: {
      required: true,
    },
    selfUserID: {
      reqiured: true,
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    thanksDeclension() {
      if (
        this.feedItem.transactionAmount % 100 != 11 &&
        this.feedItem.transactionAmount % 10 == 1
      ) {
        return (
          this.feedItem.transactionAmount +
          " " +
          this.organizationSettings.settings.bonusname.RU.form1
        );
      } else if (
        (this.feedItem.transactionAmount % 100 < 12 ||
          this.feedItem.transactionAmount % 100 > 14) &&
        this.feedItem.transactionAmount % 10 > 1 &&
        this.feedItem.transactionAmount % 10 < 5
      ) {
        return (
          this.feedItem.transactionAmount +
          " " +
          this.organizationSettings.settings.bonusname.RU.form5
        );
      } else {
        return (
          this.feedItem.transactionAmount +
          " " +
          this.organizationSettings.settings.bonusname.RU.form4
        );
      }
    },
    senderDisplayName() {
      let displayName = "";
      if (this.feedItem.transactionSenderFirstName) {
        displayName += this.feedItem.transactionSenderFirstName;
        if (this.feedItem.transactionSenderSurname) {
          displayName += " " + this.feedItem.transactionSenderSurname;
        }
        return displayName;
      } else {
        return "@" + this.feedItem.transactionSenderTgName;
      }
    },
    recipientDisplayName() {
      let displayName = "";
      if (this.feedItem.transactionRecipientFirstName) {
        displayName += this.feedItem.transactionRecipientFirstName;
        if (this.feedItem.transactionRecipientSurname) {
          displayName += " " + this.feedItem.transactionRecipientSurname;
        }
        return displayName;
      } else {
        return "@" + this.feedItem.transactionRecipientTgName;
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.transaction_text_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  row-gap: 0px;
}
.transaction_text {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.cursor_pointer:hover {
  cursor: pointer;
}
</style>