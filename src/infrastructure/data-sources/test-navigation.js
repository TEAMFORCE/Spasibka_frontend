import { TEST_NAVIGATION_ITEMS } from "@/infrastructure/constants/test-navigation-items"

export const TEST_NAVIGATION = (context, isActive) => {
    let items = [
        {
            name: TEST_NAVIGATION_ITEMS.questions,
            title: context.$t("surveys.management_navigation.questions"),
        },
        {
            name: TEST_NAVIGATION_ITEMS.settings,
            title: context.$t("surveys.management_navigation.settings")
        },
    ]

    if (isActive === true) {
        items = [
            {
                name: TEST_NAVIGATION_ITEMS.questions,
                title: context.$t("surveys.management_navigation.questions"),
            },
            {
                name: TEST_NAVIGATION_ITEMS.participants,
                title: context.$t("surveys.management_navigation.participants")
            },
            {
                name: TEST_NAVIGATION_ITEMS.results,
                title: context.$t("surveys.management_navigation.results")
            },
            {
                name: TEST_NAVIGATION_ITEMS.settings,
                title: context.$t("surveys.management_navigation.settings")
            },
        ]
    }
    return items
}