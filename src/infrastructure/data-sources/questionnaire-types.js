import { QUESTIONNAIRE_TYPE } from "@/infrastructure/constants/questionnaire-type"

export const QUESTIONNAIRE_TYPES = (context) => [
    {
        type: QUESTIONNAIRE_TYPE.SURVEY,
        title: context.$t('types.questionaireTypes.survey')
    },
    {
        type: QUESTIONNAIRE_TYPE.TEST,
        title: context.$t('types.questionaireTypes.test')
    },
    {
        type: QUESTIONNAIRE_TYPE.VOTE,
        title: context.$t('types.questionaireTypes.vote')
    },
]