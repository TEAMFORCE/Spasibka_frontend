<template>
  <div
    class="avatar"
    :class="{
      feed: type == 'feed',
      my_profile: type == 'profile',
      challenges: type == 'challenges',
      employee_avatar: type == 'employee',
      comments: type == 'comments',
      other_user_profile: type == 'other_profile',
      history_avatar: type == 'history',
      main_page: type == 'main_page',
      disabled: type !== 'profile' && type !== 'other_profile',
    }"
  >
    <div v-if="birthday" class="birthday_gift_wrapper general-brand-bg">
      <BirthdayGiftIcon class="birthday_gift_icon" />
    </div>
    <button
      class="avatar_wrapper transparent-bg"
      :class="{
        avatar_text_wrapper: !userPhoto,
      }"
      @click="avatarClick"
    >
      <img
        v-if="userPhoto"
        class="avatar_photo"
        :src="photoAddress(userPhoto)"
      />
      <h1
        v-else
        class="avatar_text general-white-color"
        :class="{
          profile: type == 'profile' || type == 'other_profile',
        }"
      >
        {{ contractUsername }}
      </h1>
    </button>
    <div class="avatar_menu_list" v-if="showMenu">
      <div
        v-for="item in avatarMenuList"
        @click="handleEvent(item.eventName)"
        class="menu_list_item"
      >
        <span class="menu_list_item_title">{{ item.title }}</span>
        <component :is="item.image" :currentColor="getIconColor()"></component>
      </div>
    </div>
  </div>
</template>

<script>
import BirthdayGiftIcon from "@/components/Icons/FeedIcons/BirthdayGiftIcon.vue";
import { SERVER_IP } from "@/constants/api";
import { AVATAR_MENU_LIST } from "@/infrastructure/data-sources/avatar-menu-list.js";

export default {
  name: "Avatar",
  props: {
    userID: {
      required: true,
    },
    userName: {
      required: true,
    },
    userSurname: {
      required: true,
    },
    userPhoto: {
      required: true,
    },
    type: {
      required: true,
    },
    recipient: {},
    isCurrentUser: {
      default: false,
    },
    isChanging: {
      default: false,
    },
    birthday: {
      default: false,
    },
  },
  components: { BirthdayGiftIcon },
  computed: {
    showMenu() {
      if (!this.userPhoto && !this.isCurrentUser) {
        return false;
      } else {
        return true;
      }
    },
    avatarMenuList() {
      if (this.userPhoto) {
        return AVATAR_MENU_LIST(this, this.isCurrentUser, this.isChanging);
      } else if (!this.userPhoto && this.type == "other_profile") {
        let list = AVATAR_MENU_LIST(this, this.isCurrentUser, this.isChanging);
        list.shift();
        list = list.slice(0, 1);
        return list;
      } else if (!this.userPhoto) {
        return AVATAR_MENU_LIST(
          this,
          this.isCurrentUser,
          this.isChanging
        ).slice(0, 1);
      }
    },
    contractUsername() {
      if (!this.userName && !this.userSurname) {
        if (!this.recipient) return "?";
        else {
          var parts = this.recipient.split(" ");
          if (parts.length !== 2) {
            return "?";
          }
          var [name, surname] = parts;
          return `${name.charAt(0)}${surname.charAt(0)}`;
        }
      } else if (!this.userName) return this.userSurname.charAt(0);
      else if (!this.userSurname) return this.userName.charAt(0);
      else return this.userName.charAt(0) + this.userSurname.charAt(0);
    },
  },
  methods: {
    photoAddress(photo) {
      if (photo.slice(0, 7) == "http://" || photo.slice(0, 8) == "https://") {
        return photo;
      }
      return SERVER_IP + photo;
    },
    avatarClick() {
      if (this.userID && this.type != "profile" && this.type != "main_page") {
        this.$router.push("/other_profile/" + this.userID);
      }
    },
    handleEvent(eventName) {
      if (eventName == "updatePhoto") {
        this.updatePhoto();
      }
      if (eventName == "updatePhoto" && this.type == "other_profile") {
        this.updatePhotoWithTransit();
      }
      if (eventName == "openPhoto") {
        this.$emit("increasePhotoSize");
      }
      if (eventName == "changeThumbnail") {
        this.changeThumbnail();
      }
      if (eventName == "changeThumbnail" && this.type == "other_profile") {
        this.changeThumbnailWithTransit();
      }
      if (eventName == "deletePhoto") {
        this.deletePhoto();
      }
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalColorWhite;
    },
    updatePhoto() {
      this.$emit("handleInputOpen");
    },
    updatePhotoWithTransit() {
      this.$router.push({ name: "Profile", query: { photoChange: true } });
    },
    changeThumbnail() {
      this.$emit("changeThumbnail");
    },
    changeThumbnailWithTransit() {
      this.$router.push({ name: "Profile", query: { changeThumbnail: true } });
    },
    deletePhoto() {
      this.$emit("deletePhoto");
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.$route.query?.photoChange) {
        this.updatePhoto();
      }
      if (this.$route.query?.changeThumbnail) {
        this.changeThumbnail();
      }
    }, 500);
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.open_photo_icon {
  width: 18px;
}
.change_photo_icon {
  width: 18px;
}
.branding_icon {
  width: 14px;
  margin: 0 2px 0 0;
}
.delete_icon {
  width: 13px;
  margin: 0 3px 0 0;
}

.avatar {
  width: fit-content;
  height: fit-content;
  border-radius: 50%;
  padding: 0px;
  position: relative;
}
.avatar.feed {
  width: 44px;
  min-width: 44px;
  height: 44px;
}
.avatar.my_profile {
  width: 120px;
  height: 120px;
}
.avatar.other_user_profile {
  width: 180px;
  height: 180px;
  min-width: 180px;
}
.avatar.challenges {
  width: 44px;
  height: 44px;
  min-width: 44px;
}
.avatar.employee_avatar {
  width: 52px;
  height: 52px;
}
.avatar.comments {
  width: 44px;
  height: 44px;
}
.avatar.history_avatar {
  min-width: 40px;
  max-width: 40px;
  height: 40px;
}
.avatar.main_page {
  width: 52px;
  height: 52px;
}
.avatar.main_page:hover {
  cursor: pointer;
}
.birthday_gift_wrapper {
  position: absolute;
  border-radius: 50%;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  height: 21px;
  width: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-5px, 5px);
}
.birthday_gift_icon {
  width: 11px;
  height: 11px;
  margin-bottom: 6px;
}
.avatar_wrapper {
  height: 100%;
  width: 100%;
  padding: 0px;
  overflow: hidden;
  border-radius: 100%;
}
.avatar_wrapper.avatar_text_wrapper {
  background: linear-gradient(
    132.4deg,
    var(--generalBrand) -2.06%,
    var(--secondaryColorBrand) 111.97%
  );
  box-shadow: 0px 10px 20px rgba(var(--generalBrandRGB), 0.3);
}
.avatar_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
.avatar_text.profile {
  font-size: 40px;
  line-height: 40px;
}
.avatar_photo {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.avatar_menu_list {
  opacity: 0;
  width: 222px;
  border-radius: 8px;
  padding: 9px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 0px 44px 18px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 0px 44px 18px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 44px 18px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  transition: 0.3s;
  z-index: 10;
}
.avatar:hover .avatar_menu_list {
  opacity: 1;
}
.disabled:hover .avatar_menu_list {
  opacity: 0 !important;
}
.menu_list_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 22px;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 10px;
}
.menu_list_item_title {
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  font-family: "Roboto" !important;
}
.menu_list_item:hover {
  transform: scale(1.02) translate(1%);
}
</style>
