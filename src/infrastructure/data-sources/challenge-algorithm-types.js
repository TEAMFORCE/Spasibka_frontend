import { CHALLENGE_ALGORITHM_TYPE } from "../constants/challenge-algorithm-type"

export const CHALLENGE_ALGORITHM_TYPES = (context) => [
    {
        type: CHALLENGE_ALGORITHM_TYPE.default,
        title: context.$t("challenges.challenge_settings.default_type")
    },
    {
        type: CHALLENGE_ALGORITHM_TYPE.voting,
        title: context.$t("challenges.challenge_settings.voting_type")
    },
]