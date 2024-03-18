export const ANALYTICS_NAVIGATION = (context, isAdmin) => {
    const items = [
        {
            name: "myPulse",
            title: context.$t("analyticsPage.navigation.myPulse")
        },
        {
            name: "companyPulse",
            title: context.$t("analyticsPage.navigation.companyPulse")
        },
        {
            name: "reports",
            title: context.$t("analyticsPage.navigation.reports")
        },
    ]
    // if (isAdmin) {
    //     items.push({
    //         name: "analyticsForAdmin",
    //         title: context.$t("analyticsPage.navigation.analyticsForAdmin")
    //     })
    // }
    return items
}