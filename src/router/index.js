import { createRouter, createWebHistory } from "vue-router";
import { useStore as useProfileStore } from "@/store/profile";

const retryImport = (importFunction, retries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attemptLoad = (attemptsLeft) => {
      importFunction().then(resolve).catch(error => {
        if (/Loading chunk [\d]+ failed./i.test(error.message) && attemptsLeft > 0) {
          console.log(`Chunk load failed, attempting to retry... Retries left: ${attemptsLeft - 1}`);
          setTimeout(() => {
            attemptLoad(attemptsLeft - 1);
          }, delay);
        } else {
          reject(error);
        }
      });
    };
    attemptLoad(retries);
  });
};

const routes = [
  {
    path: "/:catchAll(.*)",
    redirect: "/main",
  },
  {
    path: "/community/invite",
    name: "LoginBySharedKeyCommunityPage",
    meta: { layout: "auth" },
    component: () => retryImport(() => import("@/views/LoginBySharedKeyCommunity.vue"))
  },
  {
    path: "/",
    name: "LoginBySharedKey",
    meta: { layout: "auth" },
    component: () => retryImport(() => import("@/views/LoginBySharedKey.vue")),
  },
  {
    path: "/login",
    name: "Login",
    meta: { layout: "auth" },
    component: () => retryImport(() => import("../views/Login.vue"))
  },
  {
    path: "/vk_redirect",
    name: "VKRedirect",
    meta: { layout: "auth" },
    component: () => retryImport(() => import("@/views/VKRedirect.vue"))
  },
  {
    path: "/terms_of_use",
    name: "TermsOfUse",
    meta: { layout: "auth" },
    component: () => retryImport(() => import("@/views/TermsOfUse.vue"))
  },
  {
    path: "/privacy_policy",
    name: "PrivacyPolicy",
    meta: { layout: "auth" },
    component: () => retryImport(() => import("@/views/PrivacyPolicy.vue"))
  },
  {
    path: "/main",
    name: "MainPage",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/MainPage.vue"))
  },
  {
    path: "/profile",
    name: "Profile",
    props: true,
    meta: { layout: "main" },
    component: () => retryImport(() => import("../views/Profile.vue"))
  },
  {
    path: "/other_profile/:id",
    name: "OtherProfile",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/OtherProfile.vue"))
  },
  {
    path: "/new_transfer",
    name: "NewTransfer",
    meta: { layout: "main" },
    component: () => retryImport(() => import("../views/NewTransfer.vue"))
  },
  {
    path: "/organization_administration/:id",
    name: "OrganizationAdministration",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/OrganizationAdministration/index.vue")),
    beforeEnter: adminPageGuard,
  },
  {
    path: "/history",
    name: "History",
    meta: { layout: "main" },
    component: () => retryImport(() => import("../views/History.vue"))
  },
  {
    path: "/feed",
    name: "Feed",
    meta: { layout: "main" },
    component: () => retryImport(() => import("../views/Feed.vue"))
  },
  {
    path: "/challenges",
    name: "Challenges",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/Challenges.vue"))
  },
  {
    path: "/all_challenges",
    name: "AllChallenges",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/AllChallenges.vue"))
  },
  {
    path: "/challenge/:id",
    name: "ChallengeItem",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/ChallengeItem.vue"))
  },
  {
    path: "/challenge_chain/:id",
    name: "ChallengeChain",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/ChallengeChain.vue"))
  },
  {
    path: "/challenge_templates",
    name: "ChallengeTemplates",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/ChallengeTemplates.vue"))
  },
  {
    path: "/challenge_chains",
    name: "ChallengeChains",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/ChallengeChains.vue"))
  },
  {
    path: "/organization_administration_settings/:id/:name",
    name: "OrganizationAdministrationSettings",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/OrganizationAdministration/settings.vue")),
    beforeEnter: adminPageGuard
  },
  {
    path: "/market",
    name: "Market",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/Market.vue"))
  },
  {
    path: "/market/:id/offers",
    name: "PublicMarket",
    component: () => retryImport(() => import("@/views/PublicMarket.vue"))
  },
  {
    path: "/analytics",
    name: "Analytics",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/Analytics/index.vue"))
  },
  {
    path: "/market_orders",
    name: "MarketOrders",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/MarketOrders.vue"))
  },
  {
    path: "/global_admin",
    name: "GlobalAdmin",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/GlobalAdmin.vue"))
  },
  {
    path: "/admin_market_goods",
    name: "AdminMarketGoods",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/AdminMarketGoods.vue"))
  },
  {
    path: "/admin_market_purchases",
    name: "AdminMarketPurchases",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/AdminMarketPurchases.vue"))
  },
  {
    path: "/employees",
    name: "Employees",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/Employees.vue"))
  },
  {
    path: "/onboarding",
    name: "OnboardingPage",
    meta: { layout: "onboarding" },
    component: () => retryImport(() => import("@/views/Onboarding.vue"))
  },
  {
    path: "/awards",
    name: "AwardsPage",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/AwardsPage.vue"))
  },
  {
    path: "/surveys",
    name: "SurveysPage",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/SurveysPage.vue"))
  },
  {
    path: "/survey_preview/:id",
    name: "SurveyPreview",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/SurveyPreview.vue"))
  },
  {
    path: "/survey/:id",
    name: "Survey",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/Survey.vue"))
  },
  {
    path: "/admin_surveys",
    name: "AdminSurveys",
    meta: { layout: "main-without-footer" },
    component: () => retryImport(() => import("@/views/AdminSurveys.vue"))
  },
  {
    path: "/survey_management/:id",
    name: "SurveyManagement",
    meta: { layout: "main-without-footer" },
    component: () => retryImport(() => import("@/views/SurveyManagement.vue"))
  },
  {
    path: "/survey_management/:id/user_result",
    name: "SurveyUserResult",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/SurveyUserResult.vue"))
  },
  {
    path: "/test_management/:id",
    name: "TestManagement",
    meta: { layout: "main-without-footer" },
    component: () => retryImport(() => import("@/views/TestManagement.vue"))
  },
  {
    path: "/test_management/:id/user_result",
    name: "TestUserResult",
    meta: { layout: "main" },
    component: () => retryImport(() => import("@/views/TestUserResult.vue"))
  }
];

async function adminPageGuard() {
  const store = useProfileStore();
  await store.getProfileInfo();
  const isAdmin = store.profileInfo.privileged.some((p) => p.role === "A");
  if (!isAdmin) return "/feed";
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   const { getProfileInfo } = useProfileStore();
//   await getProfileInfo();
// })

let currentPath;

router.beforeEach((to, from, next) => {
  currentPath = to.path; // Save the current path
  next();
});

router.onError(error => {
  if (/Loading chunk [\d]+ failed./i.test(error.message)) {
    window.location.href = currentPath; // Use the saved path for the redirect
  } else {
    console.error(error);
  }
});
export default router;