import { TEMPLATE_TYPE } from "../constants/template-type"

export const TEMPLATE_TYPES = (context) => [
    {
        type: TEMPLATE_TYPE.challenge,
        title: context.$t("challenges.templateTypes.challenge")
    },
    {
        type: TEMPLATE_TYPE.chain,
        title: context.$t("challenges.templateTypes.chain")
    },
]