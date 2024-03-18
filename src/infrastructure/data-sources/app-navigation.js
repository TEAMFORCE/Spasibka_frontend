export let APP_NAVIGATION = (context, marketsExist, userRole, orgId, superUser) => {
    const items = [
        { image: "SendThanksIcon", name: context.$t("sidebar.gratitude"), url: "/new_transfer" },
        { image: "EventsIcon", name: context.$t("sidebar.events"), url: "/feed" },
        { image: "HistoryIcon", name: context.$t("sidebar.story"), url: "/history" },
        { image: "ChallengesIcon", name: context.$t("sidebar.challenges"), url: "/challenges" },
        { image: "SurveysIcon", name: context.$t("sidebar.surveys"), url: "/surveys" },
        { image: "AwardsIcon", name: context.$t("sidebar.awards"), url: "/awards" },
    ]
    if (marketsExist) {
        items.push({ image: "MarketIcon", name: context.$t("sidebar.benefitCafe"), url: "/market" })
    }
    items.push(...[
        { image: "EmployeesIcon", name: context.$t("sidebar.participants"), url: "/employees" },
        { image: "AnalyticsIcon", name: context.$t("sidebar.analytics"), url: "/analytics" }
    ])
    if (userRole == "Администратор") {
        items.push({ image: "OrganizationIcon", name: context.$t("sidebar.organization"), url: "/organization_administration/" + orgId })
    }
    if (superUser) {
        items.push({ image: "SettingsIcon", name: context.$t("sidebar.superAdmin"), url: "/global_admin", })
    }

    return items
}



