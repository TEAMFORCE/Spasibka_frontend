import { defineStore } from "pinia";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import i18n from "@/i18n";

export class FeedItem {
  constructor(data) {
    this.id = data.id;
    // this.eventObjectID = data.event_object_id;
    this.eventObjectID = data.id;
    this.eventRecordID = data.event_record_id;
    this.eventTypeID = data.event_type_id;
    this.objectSelector = data.selector;
    this.scope_id = data.scope_id;
    this.time = data.time;
    this.userID = data.user_id;
    this.header = data.header;
    this.text = data.text;
    this.icon = data.icon;
    this.recipient = data.recipient;

    if (this.objectSelector == "T") {
      this.transactionID = data.id;
      this.transactionTags = data.tags;
      this.transactionUpdatedAt = data.time;
    }
    if (this.objectSelector == "Q") {
      this.challengeCreatedAt = data.time;
      this.challengeID = data.id;
      this.challengeName = data.text;
      if (data.photos?.length) this.challengePhoto = data.photos[0];
      this.userLiked = data.user_liked;
    }
    if (this.objectSelector == "R") {
      this.winnerChallengeID = data.id;
      this.winnerReportChallengeName = data.text;
      this.winnerReportUpdatedAt = data.time;
      this.userLiked = data.user_liked;
    }
    if (this.objectSelector === "B") {
      this.mainlink = data.mainlink;
      this.text_icon = data.text_icon;
    }

    this.commentsCount = data.comments_amount;
    this.currentCommentOffset = 0;
    this.comments = [];

    this.likesCount = data.likes_amount;

    this.ratedUsers = [];

    this.attachmentPhoto = null;
    this.attachmentPhotos = null;
    this.attachmentSticker = null;
  }

  async fetchAdditionalInfo() {
    try {
      const response = await axios.get(
        API_URIS.eventsTransactions + this.eventObjectID + "/"
      );
      this.attachmentPhoto = response.data.photo;
      this.attachmentPhotos = response.data.photos;
      this.attachmentSticker = response.data.sticker;
      this.reason = response.data.reason;
    } catch (err) {
      throw err;
    }
  }

  rate(reaction) {
    if (reaction == 1) {
      this.userLiked = !this.userLiked;
      this.userDisliked = false;
    } else if (reaction == 2) {
      this.userDisliked = !this.userDisliked;
      this.userLiked = false;
    }
  }

  setComments(comments) {
    this.comments = comments;
    this.currentCommentOffset = comments.length;
  }

  appendComments(comments) {
    this.comments.push(...comments);
    this.currentCommentOffset += comments.length;
  }

  setRatedUsers(ratedUsers) {
    this.ratedUsers = ratedUsers;
  }

  appendRatedUsers(ratedUsers) {
    this.ratedUsers.push(...ratedUsers);
  }

  /*static getReactions(data) {
        const reactions = {
            likesCount: 0,
            dislikesCount: 0,
        };
        for (const reaction of data.transaction.reactions) {
            if (reaction.code == "like")
                reactions.likesCount = reaction.counter;
            else if (reaction.code == "dislike")
                reactions.dislikesCount = reaction.counter;
        }
        return reactions;
    }*/
}

export const useStore = defineStore("feed", {
  state: () => ({
    /**@type {FeedItem[]} */
    feedItems: [],
    feedFilters: null,
    loading: false,
    reachedEnd: false,
  }),
  actions: {
    async fetchFeedItems(pageNumber, limit, filterType/*, fetchAll = false*/) {
      let apiURL = API_URIS.eventsNew;
      if (!this.reachedEnd) {
        try {
          this.loading = true;
          let filters = "";
          let categories = this.feedFilters?.eventtypes;
          let noFilters = true;
          filters += "?offset=" + pageNumber;
          filters += "&limit=" + limit;
          if (filterType === 0){
            for (let i = 0; i < categories?.length; ++i) {
              if (categories[i].on/* || fetchAll*/) {
                filters += "&filters=" + categories[i].id;
                noFilters = false;
              }
            }
          } else {
            filters += "&filters=" + filterType;
          }
        
          const response = await axios.get(apiURL + filters);
          const newFeedItems = response.data.data.map((f) => new FeedItem(f));
          this.feedItems.push(...newFeedItems);
          if (filterType === 0 && noFilters) {
            this.feedFilters = response.data.filter;
          }
          if (newFeedItems.length == 0) {
            this.reachedEnd = true;
          }
          this.loading = false;
        } catch (err) {
          this.loading = false;
          throw err;
        }
      }
    },
    async uploadFilterSettings(){
      try { 
        let categories = this.feedFilters?.eventtypes;
        let data = [];
        for (let i = 0; i < categories?.length; ++i) {
          if (categories[i].on) {
            data.push(categories[i].id);
          }
        }
        await axios.post(API_URIS.eventsPostEventtypesFilter, {
          data: data
        });
      } catch(err) {
        throw err;
      }
    },
    findFeedItem(feedItemID) {
      return this.feedItems.find((f) => f.eventObjectID == feedItemID);
    },
    async rateFeedItem(feedItemID, reaction) {
      const feedItem = this.findFeedItem(feedItemID);
      if (!feedItem) return;
      try {
        let requestObject = { like_kind: reaction };
        if (feedItem.objectSelector == "T") {
          requestObject.transaction_id = feedItemID;
        } else if (feedItem.objectSelector == "Q") {
          requestObject.challenge_id = feedItemID;
        } else if (feedItem.objectSelector == "R") {
          requestObject.challenge_report_id = feedItemID;
        }
        await axios.post(API_URIS.pressReaction, requestObject);
        feedItem.rate(reaction);
        this.fetchFeedItemReactions(feedItemID);
      } catch (err) {
        throw err;
      }
    },
    async fetchFeedItemReactions(feedItemID) {
      const feedItem = this.findFeedItem(feedItemID);
      if (!feedItem) return;
      try {
        let requestObject = {};
        if (feedItem.objectSelector == "T") {
          requestObject.transaction_id = feedItemID;
        } else if (feedItem.objectSelector == "Q") {
          requestObject.challenge_id = feedItemID;
        } else if (feedItem.objectSelector == "R") {
          requestObject.challenge_report_id = feedItemID;
        }
        const response = await axios.post(
          API_URIS.getLikesCommentsStatistics,
          requestObject
        );
        if (!response?.data.likes?.length) return;
        feedItem.commentsCount = response.data.comments;
        for (const reaction of response.data.likes) {
          if (reaction.like_kind.code == "like") {
            feedItem.likesCount = reaction.counter;
          } else if (reaction.like_kind.code == "dislike") {
            feedItem.dislikesCount = reaction.counter;
          }
        }
      } catch (err) {
        throw err;
      }
    },
  },
});
