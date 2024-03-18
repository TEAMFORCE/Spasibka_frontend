import { ACTIVITY_TYPE } from "../constants/activity-type"

export const ACTIVITY_TYPES = (context) => [
    {
        type: ACTIVITY_TYPE.OutgoingTransfer,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.outgoingTransfer")
    },
    {
        type: ACTIVITY_TYPE.ChallengeParticipation,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.challengeParticipation")
    },
    {
        type: ACTIVITY_TYPE.ChallengeCreation,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.challengeCreation")
    },
    {
        type: ACTIVITY_TYPE.Comment,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.comment")
    },
    {
        type: ACTIVITY_TYPE.PurchaseAtBenefitCafe,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.purchaseAtBenefitCafe")
    },
    {
        type: ACTIVITY_TYPE.CreateSurvey,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.createSurvey")
    },
    {
        type: ACTIVITY_TYPE.SurveyParticipation,
        title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.surveyParticipation")
    },
    // {
    //     type: ACTIVITY_TYPE.VoteCreation,
    //     title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.voteCreation")
    // },
    // {
    //     type: ACTIVITY_TYPE.ParticipationInVoting,
    //     title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.participationInVoting")
    // },
    // {
    //     type: ACTIVITY_TYPE.BenefitReview,
    //     title: context.$t("analyticsPage.adminAnalytics.userActivity.activityTypes.benefitReview")
    // },
]