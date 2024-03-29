const API = "/api";

export const API_URIS = {
    getBalanceURL: API + "/user/balance/",
    getBalanceByPeriodURL: API + "/user/stat/",
    getPeriodsURL: API + "/periods/",
    getCurrentPeriod: API + "/get-current-period/",
    getPeriodByDateURL: API + "/get-period-by-date/",
    getInitialUsersURL: API + "/users-list/",
    getTransactionsByPeriodURL: API + "/user/transactions-by-period/",
    userTransactionsURL: API + "/user/transactions/",
    userTransactionsGroup: API + "/user/transactions/group/",
    userTransactionsByPeriod: API + "/user/transactions-by-period/",

    events: API + "/events/",
    eventsNew: API + "/api/events/",
    eventsPostEventtypesFilter: "/api/api/events/post_eventtypes_filter/",
    eventsTransactions: API + "/events/transactions/",
    eventsWinners: API + "/events/winners/",
    eventsChallenges: API + "/events/challenges/",

    feedURL: API + "/feed/",
    pressReaction: API + "/press-like/",
    createComment: API + "/create-comment/",
    updateComment: API + "/update-comment/",
    deleteComment: API + "/delete-comment/",
    getComments: API + "/get-comments/",
    getLikesCommentsStatistics: API + "/get-likes-comments-statistics/",
    getLikes: API + "/get-likes/",

    awards: API + "/api/organization_id/awards/",
    awardTypes: API + "/api/organization_id/awards/awardtypes/",
    awardGroups: API + "/api/organization_id/awards/awardgroups/",
    scaleCounters: API + "/api/organization_id/awards/scalecounters/",
    scaleFactor: API + "/api/organization_id/awards/scalefactor/",
    scaleFactors: API + "/api/organization_id/awards/scalefactors/",
    scales: API + "/api/organization_id/awards/scales/",
    systemEvents: API + "/api/organization_id/awards/system-events/",

    challenges: API + "/challenges/",
    challengesUpdate: API + "/api/challenges/",
    challengeContenders: API + "/challenge-contenders/",
    challengeWinners: API + "/challenge-winners/",
    challengeWinnersReports: API + "/challenge-winners-reports/",
    challengeReport: API + "/challenge-report/",
    createChallenge: API + "/create-challenge/",
    createChallengeReport: API + "/create-challenge-report/",
    checkChallengeReport: API + "/check-challenge-report/",
    challengeResult: API + "/challenge-result/",


    challengeGroups: API + "/api/organization_id/challenges/groups/",
    challengeGroupsParticipants: API + "/api/organization_id/challenges/groups/group_id/participants/",

    getChallengeTemplate: API + "/get-challenge-template/",
    getChallengesTemplates: API + "/get-challenges-templates/",
    createChallengeTemplate: API + "/create-challenge-template/",
    updateChallengeTemplate: API + "/update-challenge-template/",
    deleteChallengeTemplate: API + "/template/",
    getSections: API + "/get-sections/",
    templateSection: API + "/template-section/",
    createChallengeTemplateSection: API + "/create-challenge-template-section/",

    userProfileURL: API + "/user/profile/",
    otherProfile: API + "/profile/",
    cancelTransactionURL: API + "/cancel-transaction/",
    authURL: API + "/auth/",
    authMethod: API + "/api/auth/authmethod/",
    VKAuth: API + "/api/auth/vkauth/",
    VKGetToken: API + "/api/auth/vkgettoken/",
    VKChooseOrg: API + "/api/auth/vkchooseorg/",
    verifyURL: API + "/verify/",
    searchUserURL: API + "/search-user/",
    transferURL: API + "/send-coins/",
    logOutURL: API + "/logout/",
    checkTransactionByController: API + "/check-transaction-by-controller/",
    createRootOrganization: API + "/create-root-organization/",
    organizations: API + "/organizations/",
    organizationsSettings: API + "/organization/settings/",
    brand: "/brand/",
    organizationCharts: API + "/organization/stats/tags/",
    organizationStats: API + "/organization/stats/",
    profileSettings: API + "/api/profile/settings/",

    transactionsAccounts: API + "/api/transactions/accounts",
    transactionsAdmtransaction: API + "/api/transactions/admtransaction/",

    updateProfileImageURL: API + "/update-profile-image/",

    breadcrumbsOrganizations: API + "/breadcrumbs/organizations/",
    chooseOrganization: API + "/choose-organization/",
    userOrganizations: API + "/user/organizations/",
    userChangeOrganization: API + "/user/change-organization/",
    userChangeOrganizationVerify: API + "/user/change-organization/verify/",
    getRootOrganizations: API + "/root-organizations/",
    getOrganizationDepartments: API + "/get-organization-departments/",
    createDepartment: API + "/create-department/",
    createOrganization: API + "/create-organization/",
    createEmployee: API + "/create-employee/",
    employees: API + "/employees/",
    employeesBlock: API + "/employees/block/",
    employeesBirthdays: API + "/employees/birthdays/",
    userTree: API + "/api/questionnaires/users/tree/",

    getUserProfileForAdmin: API + "/get-user-profile-for-admin/",
    getUserRoles: API + "/get-user-roles/",
    userroles: API + "/api/auth/userroles/",
    getUserLocation: API + "/get-user-location/",
    profileSettingsLocation: API + "/profile/settings/location",
    removeUserRole: API + "/remove-user-role/",
    createUserRole: API + "/create-user-role/",

    updateProfileByUser: API + "/update-profile-by-user/",
    updateContactByUser: API + "/update-contact-by-user/",
    updateProfileByAdmin: API + "/update-profile-by-admin/",
    updateContactByAdmin: API + "/update-contact-by-admin/",
    createContactByUser: API + "/create-contact-by-user/",
    createContactByAdmin: API + "/create-contact-by-admin/",
    deleteContact: API + "/delete-contact/",
    createFewContacts: API + "/create-few-contacts/",

    marketAdminAddOffers: API + "/market/id/admin/add/offers/",
    marketAdminOffers: API + "/market/id/admin/offers/",
    marketAdminOrders: API + "/market/id/admin/orders/",
    marketAdminOrdersArchive: API + "/market/id/admin/orders/archive/",
    marketsAvailable: API + "/markets/available/",
    marketCategories: API + "/market/id/categories/",
    marketOffers: API + "/market/id/offers/",
    marketOrders: API + "/market/id/orders/",
    addToCart: API + "/market/id/add-to-cart/",
    cartItems: API + "/market/id/cart/",
    market: API + "/market/",
    orderStatusAdmin: "/admin/order-status/",
    marketAnalyticsBenefit: API + "/api/analytics/benefits/",
    marketAnalyticsBenefitExcel: API + "/api/analytics/benefits/to_xlsx/",

    getTags: API + "/send-coins-settings/",

    termsOfUse: API + "/files/terms_of_use.pdf",
    privacyPolicy: API + "/files/policy_web.pdf",

    stickerpacks: API + "/stickerpacks/",
    addStickers: API + "/stickers/add/",
    getStickers: API + "/stickers/get/",

    analyticsByRating: API + "/rating/overall/",
    downloadAnalyticsByRating: API + "/rating/download/",
    analyticsByDetailing: API + "/transactions/stats/",
    myPulse: API + "/user/pulse/",
    organizationPulse: API + "/organization/pulse/",

    colleagues: API + "/colleagues/",
    departmentsTree: API + "/departments/tree/",

    periodsAPI: API + "/api/periods/",
    globalPeriods: API + "/global/periods/",
    globalSendCoins: API + "/global/send-coins/",
    organizationTelegramGroups: API + "/organization/telegram-groups/",
    apiOrganizationsTelegramGroups: API + "/api/organizations/telegramgroups/",

    community: API + "/community/",
    inviteLink: API + "/invitelink/",
    communityPeriod: API + "/community/period/",
    communityInvite: API + "/community/invite/",

    questionnaries: API + "/api/questionnaires/",
    questionnariesBlock: API + "/api/questionnaires/block/",
    questionnariesGroups: API + "/api/questionnaires/groups/",
    questionnariesScale: API + "/api/questionnaires/answer/scale/",
    questionnariesAdmin: API + "/api/questionnaires/admin/",
    questionnariesAnswerSelect: API + "/api/questionnaires/answer/select/",
    questionnariesSession: API + "/api/questionnaires/session/",
    questionnariesSessionResult: API + "/api/questionnaires/session/session_id/result/",
    questionnariesAnswerUserScale: API + "/api/questionnaires/answer/user/scale/",
    questionnariesAnswerUserText: API + "/api/questionnaires/answer/user/text/",
    questionnariesAnswerUserSelect: API + "/api/questionnaires/answer/user/select/",
    questionnariesPermission: API + "/api/questionnaires/permission/",
    questionnariesPermissionList: API + "/api/questionnaires/permission/list/",
    questionnariesPreview: API + "/api/questionnaires/id/preview/",
    questionnariesParticipants: API + "/api/questionnaires/id/statistic/",
    questionnariesResult: API + "/api/questionnaires/id/result/",
    questionnariesDetailResult: API + "/api/questionnaires/session/id/result/",
    questionnariesUsersPermission: API + "/api/questionnaires/id/permissions/",
    questionnariesCreateVoting: API + "/api/questionnaires/create-vote",
    questionnariesVotes: API + "/api/questionnaires/votes/",

    adminAnalyticsUserActivity: API + "/api/analytics/activity/",
    adminAnalyticsUserActivityXlsx: API + "/api/analytics/activity/to_xlsx/",
    adminAnalyticsBalance: API + "/api/analytics/balances/",
    adminAnalyticsBalanceXlsx: API + "/api/analytics/balances/to_xlsx/",
    adminAnalyticsChallenges: API + "/api/analytics/challenges/",
    adminAnalyticsChallengesXlsx: API + "/api/analytics/challenges/to_xlsx/",
    adminAnalyticsQuestionnaires: API + "/api/analytics/questionnaires/",
    adminAnalyticsQuestionnairesXlsx: API + "/api/analytics/questionnaires/to_xlsx/",
    adminAnalyticsUserActivityDepartment: API + "/api/analytics/activity/department/",
    adminAnalyticsUserActivityDepartmentXlsx: API + "/api/analytics/activity/department/to_xlsx/",
    adminAnalyticsBenefitCafe: API + "/api/analytics/benefit-cafe/",
    adminAnalyticsBenefitCafeXlsx: API + "/api/analytics/benefit-cafe/to_xlsx/",

};

// export const SERVER_IP =
//     process.env.NODE_ENV == "production"
//         ? "https://back.teamforce360.com"
//         : "http://176.99.6.251:8888"

export const SERVER_IP = process.env.VUE_APP_API_URL;
