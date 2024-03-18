<template>
  <div class="settings_phone_frame_wrapper">
    <img
      src="@/assets/OrganizationAdministrationImages/phoneFrame.png"
      alt="phone_frame"
      class="phone_img"
    />
    <div
      class="phone_frame"
      :style="`background-color: ${colorSchemeList['general-brand']}`"
    >
      <div class="status_bar">
        <div class="time">
          <span :style="`color: ${colorSchemeList['general-negative']}`"
            >9:41</span
          >
        </div>
        <div class="functions">
          <NetworkIcon :currentColor="colorSchemeList['general-negative']" />
          <WifiIcon :currentColor="colorSchemeList['general-negative']" />
          <BatteryIcon :currentColor="colorSchemeList['general-negative']" />
        </div>
      </div>
      <div class="user_bar">
        <div class="logo_wrapper">
          <img
            class="logo"
            src="@/assets/svgIcons/logo_mobile.svg"
            alt="logo_mobile"
          />
        </div>
        <div class="user">
          <RingIcon :currentColor="colorSchemeList['general-negative']" />
          <div
            class="avatar"
            :style="`background-color: ${colorSchemeList['general-negative']}`"
          >
            <UserIcon :currentColor="colorSchemeList['general-brand']" />
          </div>
        </div>
      </div>
      <h2
        class="title"
        :style="`color: ${colorSchemeList['general-negative']}`"
      >
        Лента событий
      </h2>
      <div
        class="frame_content"
        :style="`background-color: ${colorSchemeList['general-negative']}`"
      >
        <div class="nav_bar">
          <div class="nav_buttons">
            <div
              class="nav_button"
              :style="`background-color: ${colorSchemeList['general-brand']}; color: ${colorSchemeList['general-negative']}`"
            >
              Все
            </div>
            <div
              class="nav_button"
              :style="`background-color: ${colorSchemeList['general-negative']}; color: ${colorSchemeList['general-contrast']}`"
            >
              Мои
            </div>
            <div
              class="nav_button"
              :style="`background-color: ${colorSchemeList['general-negative']}; color: ${colorSchemeList['general-contrast']}`"
            >
              Публичные
            </div>
          </div>
          <div
            class="calendar"
            :style="`background-color: ${colorSchemeList['general-brand-secondary']}`"
          >
            <CalendarIcon :currentColor="colorSchemeList['general-brand']" />
          </div>
        </div>
        <div class="items_list">
          <div class="item">
            <div class="item_avatar_wrapper">
              <img
                class="item_avatar"
                src="@/assets/userOne.png"
                alt="user_avatar"
              />
            </div>
            <div class="item_info">
              <span class="info_time">вчера в 20:30</span>
              <p class="info_text">
                <span :style="`color: ${colorSchemeList['general-brand']}`">
                  @AnnaKin_TF
                </span>
                <span :style="`color: ${colorSchemeList['general-contrast']}`">
                  получила
                </span>
                <span :style="`color: ${colorSchemeList['minor-success']}`">
                  150 спасибок
                </span>
                <span :style="`color: ${colorSchemeList['general-contrast']}`">
                  от
                </span>
                <span :style="`color: ${colorSchemeList['general-brand']}`">
                  @mekhaga
                </span>
              </p>
              <div class="item_actions">
                <div
                  class="button"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}`"
                >
                  <CommentIcon
                    :currentColor="colorSchemeList['general-contrast']"
                  />
                  <span
                    :style="`color: ${colorSchemeList['general-contrast']}`"
                  >
                    435
                  </span>
                </div>
                <div
                  class="button"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}`"
                >
                  <DislikeIcon
                    :currentColor="colorSchemeList['general-contrast']"
                  />
                  <span
                    :style="`color: ${colorSchemeList['general-contrast']}`"
                  >
                    12к
                  </span>
                </div>
                <div
                  class="button"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}`"
                >
                  <LikeIcon
                    :currentColor="colorSchemeList['general-contrast']"
                  />
                  <span
                    :style="`color: ${colorSchemeList['general-contrast']}`"
                  >
                    213к
                  </span>
                </div>
              </div>
              <div class="item_tags">
                <div
                  class="tag"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}; color: ${colorSchemeList['minor-info']}`"
                >
                  # Новатор
                </div>
                <div
                  class="tag"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}; color: ${colorSchemeList['minor-info']}`"
                >
                  # Надежное плечо
                </div>
              </div>
            </div>
          </div>
          <div
            class="item"
            :style="`background-color: ${colorSchemeList['minor-success-secondary']}`"
          >
            <div class="item_avatar_wrapper">
              <img
                class="item_avatar"
                src="@/assets/userTwo.png"
                alt="user_avatar"
              />
            </div>
            <div class="item_info">
              <span class="info_time">вчера в 18:42</span>
              <p class="info_text">
                <span :style="`color: ${colorSchemeList['general-contrast']}`">
                  Вы получили
                </span>
                <span :style="`color: ${colorSchemeList['minor-success']}`">
                  99 спасибок
                </span>
                <span :style="`color: ${colorSchemeList['general-contrast']}`">
                  от
                </span>
                <span :style="`color: ${colorSchemeList['general-brand']}`">
                  @AnnaKim_TF
                </span>
              </p>
              <div class="item_actions">
                <div
                  class="button"
                  :style="`background-color: ${colorSchemeList['general-negative']}`"
                >
                  <CommentIcon
                    :currentColor="colorSchemeList['general-contrast']"
                  />
                  <span
                    :style="`color: ${colorSchemeList['general-contrast']}`"
                  >
                    324
                  </span>
                </div>
                <div
                  class="button"
                  :style="`background-color: ${colorSchemeList['general-negative']}`"
                >
                  <DislikeIcon
                    :currentColor="colorSchemeList['general-contrast']"
                  />
                  <span
                    :style="`color: ${colorSchemeList['general-contrast']}`"
                  >
                    123к
                  </span>
                </div>
                <div
                  class="button"
                  :style="`background-color: ${colorSchemeList['general-negative']}`"
                >
                  <LikeIcon
                    :currentColor="colorSchemeList['general-contrast']"
                  />
                  <span
                    :style="`color: ${colorSchemeList['general-contrast']}`"
                  >
                    43к
                  </span>
                </div>
              </div>
              <div class="item_tags">
                <div
                  class="tag"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}; color: ${colorSchemeList['minor-info']}`"
                >
                  # Новатор
                </div>
                <div
                  class="tag"
                  :style="`background-color: ${colorSchemeList['minor-info-secondary']}; color: ${colorSchemeList['minor-info']}`"
                >
                  # Надежное плечо
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone_botom_bar_wrapper">
        <div
          class="send_wrapper"
          :style="`background: linear-gradient(132.4deg, ${colorSchemeList['general-brand']} -2.06%, ${colorSchemeList['general-brand-secondary']} 111.97%)`"
        >
          <SendIcon :currentColor="colorSchemeList['general-negative']" />
        </div>
        <div class="phone_botom_bar">
          <div class="bar_buttons">
            <div
              class="bar_button"
              :style="`background-color: ${colorSchemeList['general-brand-secondary']}`"
            >
              <RibbonIcon :currentColor="colorSchemeList['general-brand']" />
            </div>
            <div class="bar_button">
              <BalanceIcon
                :currentColor="colorSchemeList['general-contrast']"
              />
            </div>
          </div>
          <div class="bar_buttons">
            <div class="bar_button">
              <HistoryIcon
                :currentColor="colorSchemeList['general-contrast']"
              />
            </div>
            <div class="bar_button">
              <SettingsIcon
                :currentColor="colorSchemeList['general-contrast']"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkIcon from "@/components/Icons/network.vue";
import CalendarIcon from "@/components/Icons/calendar.vue";
import WifiIcon from "@/components/Icons/wifi.vue";
import BatteryIcon from "@/components/Icons/battery.vue";
import RingIcon from "@/components/Icons/ring.vue";
import CommentIcon from "@/components/Icons/comment.vue";
import LikeIcon from "@/components/Icons/like.vue";
import DislikeIcon from "@/components/Icons/dislike.vue";
import RibbonIcon from "@/components/Icons/ribbon.vue";
import BalanceIcon from "@/components/Icons/balance.vue";
import HistoryIcon from "@/components/Icons/history.vue";
import SettingsIcon from "@/components/Icons/settings.vue";
import SendIcon from "@/components/Icons/send.vue";
import UserIcon from "@/components/Icons/user.vue";

export default {
  name: "BrandingPhoneFrame",
  props: {
    colorSchemeList: {
      required: true,
    },
  },
  components: {
    NetworkIcon,
    CalendarIcon,
    WifiIcon,
    BatteryIcon,
    RingIcon,
    CommentIcon,
    LikeIcon,
    DislikeIcon,
    RibbonIcon,
    BalanceIcon,
    HistoryIcon,
    SettingsIcon,
    SendIcon,
    UserIcon,
  },
};
</script>

<style scoped>
.settings_phone_frame_wrapper {
  max-width: 380px;
  width: 100%;
  min-height: 575px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  z-index: 10;
}
.phone_img {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
}
.phone_frame {
  z-index: 8;
  width: 64%;
  height: 91%;
  position: absolute;
  top: 2.8%;
  left: 18.5%;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
}
.status_bar {
  margin: 2px 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px 0 18px;
}
.time {
  font-family: "SF Pro Text";
  font-weight: 600;
  font-size: 11px;
  line-height: 18px;
  margin: 4px 0 0 0;
}
.functions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.network_icon {
  width: 10px;
}
.wifi_icon {
  width: 9px;
}
.battery_icon {
  width: 15px;
}
.user_bar {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin: 15px 0 0 0;
}
.logo_wrapper {
  width: 30px;
  height: 30px;
}
.logo {
  width: 100%;
  object-fit: cover;
}
.user {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ring_icon {
  width: 16px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user_icon {
  height: 22px;
  width: 22px;
}
.title {
  font-family: "SF Pro Text";
  font-weight: 700;
  font-size: 22px;
  line-height: 36px;
  text-align: left;
  margin: 10px 0 0 0;
  padding: 0 0 0 16px;
}
.frame_content {
  width: 100%;
  height: 76%;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  border-radius: 24px 24px 0 0;
}
.nav_bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin: 10px 0 0 0;
}
.nav_buttons {
  display: flex;
  gap: 4px;
}
.nav_button {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 20px;
  padding: 4px 8px;
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
  border-radius: 12px;
}
.calendar {
  width: 22px;
  height: 20px;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.calendar_icon {
  height: 15px;
}
.items_list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.item {
  padding: 8px;
  margin: 10px 0 0 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  /* width: 100%; */
  border-radius: 12px;
}
.item_avatar_wrapper {
  min-height: 30px !important;
  min-width: 30px !important;
  width: 30px !important;
  height: 30px !important;
  border-radius: 100%;
  overflow: hidden;
}
.item_avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item_info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.info_time {
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  margin: 0;
}
.info_text {
  font-family: "SF Pro Text";
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  margin: 2px 0 0 0;
}
.item_actions {
  display: flex;
  gap: 4px;
  margin: 10px 0 0 0;
}
.button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 8px;
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
}
.comment_icon {
  width: 11px;
  height: 11px;
}
.dislike_icon {
  width: 11px;
  height: 11px;
}
.like_icon {
  width: 11px;
  height: 11px;
}
.item_tags {
  margin: 6px 0 0 0;
  display: flex;
  gap: 4px;
}
.tag {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  border-radius: 8px;
  padding: 3px 6px;
}
.phone_botom_bar_wrapper {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.send_wrapper {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 30%);
  height: 46px;
  width: 46px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.send_icon {
  width: 18px;
}
.phone_botom_bar {
  width: 93%;
  height: 64px;
  padding: 0 8px !important;
  border-radius: 14px 14px 0 0;
  -webkit-box-shadow: 0px -4px 9px -3px rgba(138, 138, 138, 0.25);
  -moz-box-shadow: 0px -4px 9px -3px rgba(138, 138, 138, 0.25);
  box-shadow: 0px -4px 9px -3px rgba(138, 138, 138, 0.25);
  display: flex;
  justify-content: space-between;
}
.bar_buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}
.bar_button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 24px;
  border-radius: 10px;
  padding: 4px 6px;
}
.ribbon_icon {
  height: 16px;
}
.balance_icon {
  height: 14px;
}
.history_icon {
  height: 18px;
}
.settings_icon {
  height: 24px;
}
@media (max-width: 800px) {
  .settings_phone_frame_wrapper {
    max-width: 100%;
  }
}
</style>