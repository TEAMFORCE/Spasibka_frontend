export const ADMIN_ANALYTICS_NAVIGATION = (context) => {
    let items = [
        {
            name: "userActivity",
            title: context.$t("analyticsPage.adminAnalytics.navigation.userActivity")
        },
        {
            name: "challenges",
            title: context.$t("analyticsPage.adminAnalytics.navigation.challenges")
        },
        {
            name: "benefits",
            title: context.$t("analyticsPage.adminAnalytics.navigation.benefitCafe")
        },
        {
            name: "progressStatistics",
            title: context.$t("analyticsPage.adminAnalytics.navigation.progressStatistics")
        },
        {
            name: "rating",
            title: context.$t("analyticsPage.reports.navigation.rating")
        },

    ]
    return items
}