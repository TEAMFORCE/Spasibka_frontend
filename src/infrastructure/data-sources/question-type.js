import { QUESTION_TYPES } from "@/infrastructure/constants/question-types"

export const QUESTION_TYPE = (context) => [
    {
        type: QUESTION_TYPES.SINGLE_CHOICE,
        title: context.$t("surveys.single_choice"),
        icon: "SingleChoiceIcon",
        component: "SingleChoice"
    },
    {
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        title: context.$t("surveys.multiple_choice"),
        icon: "MultiChoiceIcon",
        component: "MultipleChoice"
    },
    {
        type: QUESTION_TYPES.TEXT_INPUT,
        title: context.$t("surveys.text_answer"),
        icon: "TextAnswerIcon",
        component: "TextAnswer"
    },
    {
        type: QUESTION_TYPES.SCALE,
        title: context.$t("surveys.linear_scale"),
        icon: "LinearScaleIcon",
        component: "LinearScale"
    },
]
