export const ANALYTICS_REPORTS_NAVIGATION = (context, isAdmin) => {
    let items = [
        {
            name: "rating",
            title: context.$t("analyticsPage.reports.navigation.rating")
        },
    ]

    if (isAdmin) {
        items.push(...[

            {
                name: "challenges",
                title: context.$t("analyticsPage.adminAnalytics.navigation.challenges")
            },
            {
                name: "progressStatistics",
                title: context.$t("analyticsPage.adminAnalytics.navigation.progressStatistics")
            },
            {
                name: "market",
                title: context.$t("analyticsPage.reports.navigation.market")
            },
            {
                name: "detailing",
                title: context.$t("analyticsPage.reports.navigation.detailing")
            },
            {
                name: "balance",
                title: context.$t("analyticsPage.adminAnalytics.navigation.balance")
            },
            {
                name: "userActivity",
                title: context.$t("analyticsPage.adminAnalytics.navigation.userActivity")
            },
        ])
    }

    return items
}



// {
//     name: "userActivity",
//     title: context.$t("analyticsPage.adminAnalytics.navigation.userActivity")
// },
// {
//     name: "challenges",
//     title: context.$t("analyticsPage.adminAnalytics.navigation.challenges")
// },
// {
//     name: "balance",
//     title: context.$t("analyticsPage.adminAnalytics.navigation.balance")
// },
// {
//     name: "progressStatistics",
//     title: context.$t("analyticsPage.adminAnalytics.navigation.progressStatistics")
// },