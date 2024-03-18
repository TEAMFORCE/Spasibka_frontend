import { defineStore } from "pinia";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { useStore as useFeedStore } from "./feed.js";

export class Comment {
    constructor(data) {
        this.id = data.id;
        this.text = data.text;
        this.createdAt = data.created;
        this.editedAt = data.edited;
        this.canDelete = data.can_delete;
        this.isEdited = data.is_edited;

        this.authorID = data.user.id;
        this.authorFirstName = data.user.name;
        this.authorLastName = data.user.surname;
        this.authorAvatar = data.user.avatar;
    }
}

export const useStore = defineStore("comments", {
    actions: {
        async fetchCommentsForFeedItem(feedItemID, options) {
            options = Object.assign({ limit: 3, clear: false }, options);
            const { limit, clear } = options;
            const feedStore = useFeedStore();
            const feedItem = feedStore.findFeedItem(feedItemID);
            if (!feedItem) return;

            try {
                let requestObject = {
                    offset: clear ? 0 : feedItem.currentCommentOffset,
                    limit,
                    include_name: true,
                    is_reverse_order: true,
                };
                if (feedItem.objectSelector == "T") {
                    requestObject.transaction_id = feedItemID;
                }
                else if (feedItem.objectSelector == "Q"){
                    requestObject.challenge_id = feedItemID;
                }
                else if (feedItem.objectSelector == "R"){
                    requestObject.challenge_report_id = feedItemID;
                }
                const response = await axios.post(API_URIS.getComments, requestObject);
                const comments = response.data.comments.map(
                    (c) => new Comment(c)
                );
                if (!clear) feedItem.appendComments(comments);
                else feedItem.setComments(comments);
                feedStore.fetchFeedItemReactions(feedItemID);
            } catch (err) {
                throw err;
            }
        },
        async commentFeedItem(feedItemID, text) {
            try {
                const feedStore = useFeedStore();
                const feedItem = feedStore.findFeedItem(feedItemID);
                let requestObject = {text};
                if (feedItem.objectSelector == "T") {
                    requestObject.transaction_id = feedItemID;
                }
                else if (feedItem.objectSelector == "Q"){
                    requestObject.challenge_id = feedItemID;
                }
                else if (feedItem.objectSelector == "R"){
                    requestObject.challenge_report_id = feedItemID;
                }
                await axios.post(API_URIS.createComment, requestObject);
                await this.fetchCommentsForFeedItem(feedItemID, {
                    clear: true,
                });
            } catch (err) {
                throw err;
            }
        },
    },
});
