<template>
  <div class="my_results_list">
    <div class="my_result general-white-bg" v-for="(item, index) in myResult">
      <div class="top_info">
        <div class="status_and_time">
          <div class="status" :class="statusBackground(item)">
            <h1 class="status_text" :class="statusTextColor(item)">
              {{ item.status }}
            </h1>
          </div>
          <h1 class="last_update_time general-secondary-color">
            {{ $t("challenges.my_result.last_updated") }}
            {{ getDisplayDate(item.updated_at) }}
          </h1>
        </div>
        <h1
          class="report_text general-contrast-color"
          v-html="reportTextWithLineBreaks(item)"
        ></h1>
      </div>
      <img
        @click.stop="enableIncreasedPhoto(item.photo)"
        v-if="item.photo"
        class="photo"
        :src="photoAddress(item.photo)"
      />
      <div
        @click.stop="disableIncreasedPhoto"
        v-if="increasedPhotoEnabled"
        class="increased_photo_wrapper"
        :id="index"
      >
        <img
          class="increased_photo"
          :src="photoAddress(increasedPhotoLink)"
          :id="index"
        />
      </div>
      <div v-if="item.status == 'Получено вознаграждение'" class="reward_info">
        <h1 class="your_reward_text general-contrast-color">
          {{ $t("challenges.my_result.your_reward") }}
        </h1>
        <div class="amount_and_coin_logo">
          <h1 class="reward_amount_text minor-success-color">
            +{{ item.received }}
          </h1>
          <img class="coin_logo" :src="getImgUrl('CoinLogoGreen')" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { SERVER_IP } from "@/constants/api";

export default {
  name: "ChallengeMyResult",
  props: {
    myResult: {
      required: true,
    },
  },
  data() {
    return {
      increasedPhotoEnabled: false,
      increasedPhotoLink: "",
    };
  },
  methods: {
    reportTextWithLineBreaks(item) {
      return item.text.replace(/\r\n/g, "<br>");
    },
    enableIncreasedPhoto(photo) {
      this.increasedPhotoLink = photo;
      this.increasedPhotoEnabled = true;
    },
    disableIncreasedPhoto() {
      this.increasedPhotoEnabled = false;
      this.increasedPhotoLink = "";
    },
    statusBackground(myResult) {
      if (
        myResult.status == "Получено вознаграждение" ||
        myResult.status == "Подтверждено"
      ) {
        return "minor-success-secondary-bg";
      } else if (myResult.status == "Отклонено")
        return "minor-error-secondary-bg";
      else return "general-secondary-bg";
    },
    statusTextColor(myResult) {
      if (
        myResult.status == "Получено вознаграждение" ||
        myResult.status == "Подтверждено"
      ) {
        return "minor-success-color";
      } else if (myResult.status == "Отклонено")
        return "minor-error-primary-color";
      else return "general-contrast-color";
    },
    getDisplayDate(data) {
      let createdAt = new Date(Date.parse(data));

      let currentDate = new Date(Date.now());
      let createdAtTimeZoneOffset = createdAt.getTimezoneOffset();
      let currentTimeZoneOffset = currentDate.getTimezoneOffset();
      let timeZoneOffsetDifference =
        currentTimeZoneOffset - createdAtTimeZoneOffset;

      createdAt.setTime(
        createdAt.getTime() - timeZoneOffsetDifference * 60 * 1000
      );

      let dateString = "";

      if (createdAt.getDate() == currentDate.getDate()) {
        dateString = this.$t("general.date.today");
      } else {
        createdAt.setDate(createdAt.getDate() + 1);

        if (createdAt.getDate() == currentDate.getDate()) {
          dateString = this.$t("general.date.yesterday");
        } else {
          createdAt.setDate(createdAt.getDate() - 1);
          let day = createdAt.getDate();
          let month = createdAt.getMonth();
          let months = [
            this.$t("general.date.months.at_january"),
            this.$t("general.date.months.at_february"),
            this.$t("general.date.months.at_march"),
            this.$t("general.date.months.at_april"),
            this.$t("general.date.months.at_may"),
            this.$t("general.date.months.at_june"),
            this.$t("general.date.months.at_july"),
            this.$t("general.date.months.at_august"),
            this.$t("general.date.months.at_september"),
            this.$t("general.date.months.at_october"),
            this.$t("general.date.months.at_november"),
            this.$t("general.date.months.at_december"),
          ];
          dateString = day + " " + months[month];
        }
      }

      let hours =
        createdAt.getHours() > 9
          ? createdAt.getHours()
          : "0" + createdAt.getHours();
      let minutes =
        createdAt.getMinutes() > 9
          ? createdAt.getMinutes()
          : "0" + createdAt.getMinutes();
      return (
        dateString +
        " " +
        this.$t("general.date.at") +
        " " +
        hours +
        ":" +
        minutes
      );
    },
    photoAddress(photo) {
      if (photo.slice(0, 7) == "http://") {
        return photo;
      }
      return SERVER_IP + photo;
    },
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/ChallengeDetailsImages/",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
  },
  mounted() {
    setTimeout(() => {
      console.log("this.myResult", this.myResult);
    }, 100);
  },
};
</script>

<style scoped>
.my_results_list {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.my_result {
  max-width: 470px;
  width: auto;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.top_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.status_and_time {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 550px) {
  .status_and_time {
    flex-wrap: wrap;
  }
}
.status {
  height: fit-content;
  padding: 2px 8px;
  border-radius: 8px;
}
.status_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.last_update_time {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: -0.28px;
}

.report_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.28px;
  text-align: left;
}

.photo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
}

.reward_info {
  display: flex;
  gap: 14px;
  align-items: center;
}
.your_reward_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

.amount_and_coin_logo {
  display: flex;
  gap: 4px;
  align-items: center;
}

.reward_amount_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
}
.coin_logo {
  height: 16px;
  width: 16px;
}

.increased_photo_wrapper {
  position: fixed;
  z-index: 3;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.increased_photo {
  position: fixed;
  max-height: 50%;
  max-width: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
</style>
