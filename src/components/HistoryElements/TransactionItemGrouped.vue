<template>
  <div class="transaction_item">
    <div class="transaction_info_and_buttons">
      <div class="user_main_info">
        <Avatar
          :type="'history'"
          :userID="transaction.user_id"
          :userName="
            transaction.first_name ||
            transaction.nickname ||
            transaction.tg_name
          "
          :userSurname="transaction.surname"
          :userPhoto="transaction.user_photo"
        />
        <div class="text_and_status">
          <div class="contacts">
            <h1
              @click="openOtherProfile()"
              class="sender_name general-contrast-color"
            >
              {{
                (transaction.first_name ||
                  transaction.nickname ||
                  transaction.tg_name) +
                (transaction.first_name ? " " + transaction.surname || "" : "")
              }}
            </h1>
            <h1 v-if="transaction.tg_name" class="sender_telegram">
              {{ transaction.tg_name }}
            </h1>
            <!-- <h1 v-else @click="openOtherProfile()" class="sender_telegram">
              {{
                myUserID == transaction.sender?.sender_id
                  ? transaction.recipient?.recipient_tg_name
                  : transaction.sender?.sender_tg_name ||
                    transaction.sender?.sender_first_name
              }}
            </h1> -->
          </div>
          <!-- <div
            class="transaction_tags_wrapper"
            v-if="transaction.tags?.length > 0"
          >
            <div
              class="transaction_tag primary1-bg"
              v-for="item in transaction.tags"
            >
              <h1 class="transaction_tag_text primary6-color">
                #{{ item.name }}
              </h1>
            </div>
          </div>
          <div :style="{ backgroundColor: transactionColor }" class="status">
            {{ transactionStatusName }}
          </div> -->
        </div>
      </div>
      <div class="amount_and_button">
        <div class="cancel_transaction_and_transfer_amount">
          <!-- <button
            v-if="canUserCancel"
            class="cancel_transaction transparent-bg general-secondary-color"
            @click="enableTransactionCancel"
          >
            {{ $t("history.cancel_transaction") }}
          </button> -->
          <div class="transfer_amount minor-success-bg">
            <h1 class="transfer_amount_number general-white-color">
              {{ transaction.received }}
            </h1>
            <DetailTFLogoIcon :currentColor="getIconColor()" />
          </div>
          <div class="transfer_amount minor-error-primary-bg">
            <h1 class="transfer_amount_number general-white-color">
              {{ transaction.ready }}
            </h1>
            <DetailTFLogoIcon :currentColor="getIconColor()" />
          </div>
          <!-- <button
            v-if="canUserCancel"
            class="cancel_transaction_small_screen transparent-bg general-secondary-color"
            @click="enableTransactionCancel"
          >
            {{ $t("history.cancel_transaction") }}
          </button> -->
        </div>
        <!-- <div class="additional_info_toggler_wrapper">
          <button class="additional_info_toggler" @click="enableAdditionalInfo">
            <img
              class="additional_info_toggler_icon"
              :src="
                additionalInfoEnabled
                  ? getImgUrl('ContractNewTransfer')
                  : getImgUrl('ExpandNewTransfer')
              "
            />
          </button>
        </div> -->
      </div>
    </div>
    <!-- <div class="additional_info" v-if="additionalInfoEnabled">
      <h1 class="additional_info_header general-secondary-color">Информация</h1>
      <div class="additional_info_details">
        <div class="additional_info_detail_item">
          <h1 class="additional_info_detail_item_text general-contrast-color">
            Дата обновления статуса
          </h1>
          <h1 class="additional_info_detail_item_text general-contrast-color">
            {{ getDisplayDate(transaction.updated_at, false) }}
          </h1>
        </div>
        <div
          class="additional_info_detail_item"
          v-if="
            transaction.reason ||
            transaction.transaction_class.id == 'W' ||
            transaction.transaction_class.id == 'F' ||
            transaction.transaction_class.id == 'H'
          "
        >
          <h1 class="additional_info_detail_item_text general-contrast-color">
            Сообщение:
          </h1>
        </div>
        <div
          class="additional_info_detail_item mt-10"
          v-if="
            transaction.reason ||
            transaction.transaction_class.id == 'W' ||
            transaction.transaction_class.id == 'F' ||
            transaction.transaction_class.id == 'H' ||
            transaction.transaction_class.id == 'I' ||
            transaction.transaction_class.id == 'P'
          "
        >
          <h1
            v-if="
              transaction.transaction_class.id == 'W' ||
              transaction.transaction_class.id == 'F' ||
              transaction.transaction_class.id == 'H' ||
              transaction.transaction_class.id == 'I' ||
              transaction.transaction_class.id == 'P'
            "
            class="additional_info_message_text general-contrast-color"
          >
            {{ `${transaction.transaction_class.name} ${challengeName}` }}
          </h1>
          <h1
            v-else
            class="additional_info_message_text general-contrast-color"
          >
            {{ transaction.reason }}
          </h1>
        </div>
        <h1
          v-if="addedPhotos?.length > 0"
          class="additional_info_detail_item_text general-contrast-color"
        >
          Фото:
        </h1>
        <div v-if="addedPhotos?.length > 0" class="added_photos_list">
          <button
            v-for="photo in addedPhotos"
            class="added_photo_wrapper"
            @click="increasePhotoSize(photo)"
          >
            <img :src="photoAddress(photo)" class="added_photo" />
          </button>
        </div>
        <div
          @click="decreasePhotoSize"
          v-if="increasedPhotoEnabled"
          class="increased_photo_wrapper"
        >
          <img :src="photoAddress(selectedPhoto)" class="increased_photo" />
        </div>
        <h1
          v-if="addedSticker"
          class="additional_info_detail_item_text general-contrast-color"
        >
          Стикер:
        </h1>
        <div v-if="addedSticker" class="additional_info_detail_item">
          <img :src="photoAddress(addedSticker)" class="added_sticker" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import Avatar from "@/widgets/Avatar.vue";
import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

export default {
  name: "TransactionItemGrouped",
  props: {
    transaction: {
      required: true,
    },
    myUserID: {
      required: true,
    },
  },
  components: { Avatar, DetailTFLogoIcon },
  data() {
    return {
      increasedPhotoEnabled: false,
      additionalInfoEnabled: false,
      canUserCancel: this.transaction.can_user_cancel,
      addedPhotos: [],
      addedSticker: null,
      challengeName: "",
      transactionStatus: this.transaction.transaction_status?.id,
      transactionStatusName: this.transaction.transaction_status?.name,
    };
  },
  computed: {
    transactionColor() {
      const colors = {
        W: getComputedStyle(document.documentElement).getPropertyValue(
          "--minorInfo"
        ),
        G: getComputedStyle(document.documentElement).getPropertyValue(
          "--minorInfo"
        ),
        R: getComputedStyle(document.documentElement).getPropertyValue(
          "--minorSuccess"
        ),
        A: getComputedStyle(document.documentElement).getPropertyValue(
          "--minorSuccess"
        ),
        D: getComputedStyle(document.documentElement).getPropertyValue(
          "--minorError"
        ),
        C: getComputedStyle(document.documentElement).getPropertyValue(
          "--negativeSecondary"
        ),
      };
      return colors[this.transactionStatus];
    },
    transactionLastUpdateTime() {
      let updatedAt = new Date(Date.parse(this.transaction.updated_at));
      let day =
        updatedAt.getDate() > 9
          ? updatedAt.getDate()
          : "0" + updatedAt.getDate();
      let month =
        updatedAt.getMonth() > 8
          ? updatedAt.getMonth() + 1
          : "0" + (updatedAt.getMonth() + 1);
      return day + "." + month + "." + updatedAt.getFullYear();
    },
  },
  methods: {
    getIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalColorWhite"
      );
      return color;
    },
    increasePhotoSize(photo) {
      this.selectedPhoto = photo;
      this.increasedPhotoEnabled = true;
    },
    decreasePhotoSize() {
      this.increasedPhotoEnabled = false;
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getHistoryImgUrl(imageName) {
      var images = require.context("@/assets/HistoryImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    photoAddress(photo) {
      if (photo == null) {
        let images = require.context("@/assets/", false, /\.png$/);
        return images("./Logo.png");
      } else {
        if (photo.slice(0, 7) == "http://") {
          return photo;
        }
        return SERVER_IP + photo;
      }
    },
    openOtherProfile() {
      this.$router.push("/other_profile/" + this.transaction.user_id);
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
      if (
        createdAt.getFullYear() == currentDate.getFullYear() &&
        createdAt.getMonth() == currentDate.getMonth() &&
        createdAt.getDate() == currentDate.getDate()
      ) {
        dateString = "сегодня";
      } else {
        createdAt.setDate(createdAt.getDate() + 1);
        if (
          createdAt.getFullYear() == currentDate.getFullYear() &&
          createdAt.getMonth() == currentDate.getMonth() &&
          createdAt.getDate() == currentDate.getDate()
        ) {
          dateString = "вчера";
        } else {
          createdAt.setDate(createdAt.getDate() - 1);
          let day = createdAt.getDate();
          let month = createdAt.getMonth();
          let months = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
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
      return dateString + " в " + hours + ":" + minutes;
    },
    enableTransactionCancel() {
      this.$emit("enableTransactionCancel", this.transaction);
    },
    async enableAdditionalInfo() {
      this.additionalInfoEnabled ^= true;
      if (this.additionalInfoEnabled) {
        try {
          const response = await axios.get(
            API_URIS.userTransactionsURL + this.transaction.id + "/"
          );
          this.addedPhotos = response.data.photos;
          this.addedSticker = response.data.sticker;
        } catch (err) {
          throw err;
        }
        if (this.transaction.from_challenge) {
          try {
            const response = await axios.get(
              API_URIS.challenges + this.transaction.from_challenge + "/"
            );
            this.challengeName = response.data.name;
          } catch (err) {
            throw err;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.transaction_item {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.transaction_info_and_buttons {
  display: flex;
  justify-content: space-between;
}
.user_avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
.user_avatar:hover {
  cursor: pointer;
}
.user_main_info {
  display: flex;
  gap: 12px;
}
.text_and_status {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}
.contacts {
  display: flex;
  flex-direction: column;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.sender_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.sender_name:hover {
  cursor: pointer;
}
.sender_telegram {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  color: var(--generalBrand);
}
.sender_telegram:hover {
  cursor: pointer;
}
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&display=swap");
.transaction_tags_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.transaction_tag {
  border-radius: 100px;
  padding: 0px 8px;
}
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&display=swap");
.transaction_tag_text {
  font-family: "Montserrat";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  word-break: break-word;
}
.status {
  background-color: #7f39fb;
  padding: 0px 8px;
  border-radius: 100px;
  width: fit-content;

  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: var(--generalColorWhite);
}
.amount_and_button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
}
.cancel_transaction_and_transfer_amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}
.cancel_transaction_small_screen {
  display: none;
  text-align: right;
  font-family: "Golos";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  padding: 0px;
  white-space: nowrap;
}
@media (max-width: 1000px) {
  .cancel_transaction_and_transfer_amount {
    flex-direction: column;
    align-items: flex-end;
  }
  .cancel_transaction {
    display: none;
  }
  .cancel_transaction_small_screen {
    display: block;
  }
}
@media (max-width: 600px) {
  .cancel_transaction_small_screen {
    white-space: normal;
    text-align: right;
    word-break: break-word;
  }
}
@media (max-width: 450px) {
  .transaction_info_and_buttons {
    flex-direction: column;
    gap: 20px;
  }
  .amount_and_button {
    align-self: flex-start;
  }
  .cancel_transaction_and_transfer_amount {
    align-items: flex-start;
  }
  .additional_info_toggler_wrapper {
    justify-content: flex-start !important;
  }
}
.cancel_transaction {
  text-align: right;
  font-family: "Golos";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  padding: 0px;
  white-space: nowrap;
}
.cancel_transaction_image {
  height: 24px;
  width: 24px;
}
.transfer_amount {
  display: flex;
  align-items: center;
  gap: 5px;

  border-radius: 8px;
  padding: 8px;
}
.transfer_amount_number {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: -0.3px;
  color: var(--generalColorWhite);
}
.additional_info_toggler_wrapper {
  display: flex;
  justify-content: flex-end;
}
.additional_info_toggler {
  align-self: right;
  background-color: var(--generalColorWhite);
  height: 24px;
  width: 24px;
  margin: 0px;
  padding: 0px;
}
.additional_info_toggler_icon {
  height: 24px;
  width: 24px;
}
.additional_info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.additional_info_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.additional_info_details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.additional_info_detail_item {
  display: flex;
  justify-content: space-between;
}
.additional_info_detail_item_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  max-width: 50%;
  text-align: left;
}
.additional_info_message_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  word-break: break-word;
}
.mt-10 {
  margin-top: -10px;
}
.added_photos_list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.added_photo {
  height: 60px;
  border: 1px solid black;
}
.added_sticker {
  border-radius: 12px;
  max-width: 288px;
  width: 100%;
  aspect-ratio: 9/16;
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

button:disabled,
button[disabled] {
  opacity: 0.33;
}
button:focus {
  outline: none;
}
button:active {
  outline: none;
}

@media (max-width: 480px) {
  .transaction_info_and_buttons {
    position: relative;
  }
  .text_and_status {
    gap: 16px;
    position: relative;
  }
  .transaction_tags_wrapper {
    gap: 8px;
  }
  .transaction_tag_text {
    position: sticky;
  }
}
.detail_tf_logo_icon {
  width: 14px;
  display: flex;
  justify-content: center;
}
</style>
