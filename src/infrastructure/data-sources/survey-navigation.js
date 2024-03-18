import { SURVEY_NAVIGATION_ITEMS } from "@/infrastructure/constants/survey-navigation-items"

export const SURVEY_NAVIGATION = (context, isActive, isStarted) => {
    let items = [
        {
            name: SURVEY_NAVIGATION_ITEMS.questions,
            title: context.$t("surveys.management_navigation.questions"),
        },
        {
            name: SURVEY_NAVIGATION_ITEMS.settings,
            title: context.$t("surveys.management_navigation.settings")
        },
    ]

    if (isActive === true || isStarted === true) {
        items = [
            {
                name: SURVEY_NAVIGATION_ITEMS.questions,
                title: context.$t("surveys.management_navigation.questions"),
            },
            {
                name: SURVEY_NAVIGATION_ITEMS.participants,
                title: context.$t("surveys.management_navigation.participants")
            },
            {
                name: SURVEY_NAVIGATION_ITEMS.results,
                title: context.$t("surveys.management_navigation.results")
            },
            {
                name: SURVEY_NAVIGATION_ITEMS.settings,
                title: context.$t("surveys.management_navigation.settings")
            },
        ]
    }

    return items
}