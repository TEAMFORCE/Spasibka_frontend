<template>
    <div class="rated_users">
        <div class="rated_users_list">
            <button
                class="rated_user_info minor-info-secondary-bg"
                v-for="item in ratedUsers"
                @click="openOtherProfile(item.userID)"
            >
                <div class="rated_user_avatar_wrapper">
                    <img
                        class="rated_user_avatar"
                        :src="photoAddress(item.userAvatar)"
                    />
                    <img
                        class="rated_user_reaction_icon"
                        :src="
                            item.reactionType == 'like'
                                ? this.getFeedImgUrl('UserPressedLike')
                                : this.getFeedImgUrl(
                                        'UserPressedDislike'
                                    )
                        "
                    />
                </div>
                <div class="rated_user_name">
                    <h1 class="rated_user_name_text">
                        {{ item.userFirstName }}
                    </h1>
                    <h1 class="rated_user_name_text">{{}}</h1>
                </div>
            </button>
        </div>
        <button
            v-if="feedItem.ratedUsers.length < feedItem.likesCount"
            class="show_next_comments_button"
            @click="fetchRatedUsers(10000)"
        >
            <h1 class="show_next_comments_text general-brand-color">
                ПОКАЗАТЬ ВСЕХ
            </h1>
        </button>
    </div>
</template>

<script>
import { SERVER_IP } from '@/constants/api';

export default {
    name: "RatedUsers",
    props: {   
        feedItem: {
            required: true
        },
        ratedUsersStore: {
            required: true
        }
    },
    data(){
        return {

        }
    },
    computed: {
        ratedUsers() {
            return this.feedItem.ratedUsers;
        },
    },
    methods: {
        openOtherProfile(userID) {
            this.$router.push("/other_profile/" + userID);
        },
        getFeedImgUrl(imageName) {
            var images = require.context(
                "@/assets/FeedImages/",
                false,
                /\.png$/
            );
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
        fetchRatedUsers(limit = 15) {
            this.ratedUsersStore.fetchRatedUsersForFeedItem(
                this.feedItem.eventObjectID,
                limit
            );
        },
    }
}
</script>


<style scoped>

.rated_users {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.rated_users_filters {
    display: flex;
    gap: 8px;
}
.rated_users_filter_button {
    height: 32px;
    border-radius: 8px;
    padding: 4px 8px;
    align-items: center;
}
.rated_users_filter_button.active {
    background-color: var(--generalBrand);
}
.rated_users_filter_button_text {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 18px;
}
.rated_users_filter_button_text.active {
    color: var(--generalColorWhite);
}
.rated_user_filter_button_icon_wrapper {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
}
.rated_users_filter_button_icon {
    width: 16px;
    height: 16px;
}

.rated_users_list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    row-gap: 8px;
}

.rated_user_info {
    height: 60px;
    width: 210px;
    border-radius: 12px;
    padding-left: 14px;
    display: flex;
    gap: 10px;
    justify-content: flex-start;
}
.rated_user_avatar_wrapper {
    height: 36px;
    width: 36px;
    position: relative;
    align-self: center;
}
.rated_user_avatar {
    height: 36px;
    width: 36px;
    object-fit: cover;
    border-radius: 50%;
}
.rated_user_reaction_icon {
    position: absolute;
    right: 0px;
    bottom: 0px;
    height: 12px;
    width: 12px;
}
.rated_user_name {
    display: flex;
    flex-direction: column;
    align-self: center;
}
.rated_user_name_text {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
}
.show_next_comments_text {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 32px;
    text-align: left;
}
.show_next_comments_button {
    padding: 0px;
    background-color: rgba(0, 0, 0, 0);
}

button:focus {
    outline: none;
}
input:focus {
    outline: none;
}
</style>