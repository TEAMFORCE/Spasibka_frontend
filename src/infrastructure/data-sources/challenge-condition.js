import { CHALLENGE_CONDITIONS } from "../constants/challenge-conditions"

export const CHALLENGE_CONDITION = (context) => [
    {
        condition: CHALLENGE_CONDITIONS.waitToStart,
        title: context.$t("types.challengeConditions.waitToStart")
    },
    {
        condition: CHALLENGE_CONDITIONS.active,
        title: context.$t("types.challengeConditions.active")
    },
    {
        condition: CHALLENGE_CONDITIONS.completed,
        title: context.$t("types.challengeConditions.completed")
    },
]