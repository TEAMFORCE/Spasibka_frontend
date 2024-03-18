import { defineStore } from "pinia";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { useStore as useFeedStore } from "./feed.js";

export class UserReaction {
    constructor(data, reactionType) {
        this.userID = data.user.id;
        this.userAvatar = data.user.avatar;
        this.userFirstName = data.user.name;

        this.reactionType = reactionType;
    }
}

export const useStore = defineStore("ratedUsers", {
    actions: {
        async fetchRatedUsersForFeedItem(feedItemID, limit = 15) {
            const feedStore = useFeedStore();
            const feedItem = feedStore.findFeedItem(feedItemID);
            if (!feedItem) return;
            try {
                let requestObject = {
                    offset: 0,
                    limit: limit,
                    include_name: true,
                    include_code: true,
                };
                if (feedItem.objectSelector == "T") {
                    requestObject.transaction_id = feedItemID;
                }
                else if (feedItem.objectSelector == "Q") {
                    requestObject.challenge_id = feedItemID;
                }
                else if (feedItem.objectSelector == "R") {
                    requestObject.challenge_report_id = feedItemID;
                }
                const response = await axios.post(API_URIS.getLikes, requestObject);
                if (!response?.data.likes?.length) return;
                let allRatedUsers = [];
                for (const reaction of response.data.likes) {
                    const ratedUsers = reaction.items.map(
                        (userReaction) =>
                            new UserReaction(
                                userReaction,
                                reaction.like_kind.code
                            )
                    );
                    allRatedUsers.push(...ratedUsers);
                }
                feedItem.setRatedUsers(allRatedUsers);
            } catch (err) {
                throw err;
            }
        },
    },
});
