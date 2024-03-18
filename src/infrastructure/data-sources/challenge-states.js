import { CHALLENGE_STATE } from "../constants/challenge-state";

export const CHALLENGE_STATES = (context) => [
  {
    state: CHALLENGE_STATE.Deferred,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.deferred"
    ),
  },
  {
    state: CHALLENGE_STATE.Published,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.published"
    ),
  },
  {
    state: CHALLENGE_STATE.RegistrationOngoing,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.registrationOngoing"
    ),
  },
  {
    state: CHALLENGE_STATE.ReportsBeingAccepted,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.reportsBeingAccepted"
    ),
  },
  {
    state: CHALLENGE_STATE.ResultsBeingFinalized,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.resultsBeingFinalized"
    ),
  },
  {
    state: CHALLENGE_STATE.Ended,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.ended"
    ),
  },
  {
    state: CHALLENGE_STATE.Deleted,
    title: context.$t(
      "analyticsPage.adminAnalytics.challengesStats.challengeStates.deleted"
    ),
  },
];
