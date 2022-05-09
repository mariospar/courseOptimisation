/**
 * The `Registry` type is a map from entity names to a list of entities.
 *
 * @property {Entity[]} [entity: Entity[]] - An array of entities that are in the registry.
 */
export type Registry = { [entity: string]: Entity[] };

/**
 * The `Matching` type is a map from entity names to a list of matching values.
 *
 * @property {string[]} [entity: string[]] - string[]
 */
export type Matching = { [entity: string]: string[] };

/**
 * The `Optimisation` type is a collection of all courses and applicants with their corresponding
 * preferences.
 *
 * @property {Entity[]} courses - A list of courses that are available to be assigned to applicants.
 * @property {Entity[]} applicants - A list of all the applicants.
 */
export type Optimisation = {
    courses: Entity[];
    applicants: Entity[];
};

/**
 * The `RankTable` type is a map from entity names to their rank.
 *
 * @property {number} [entity: number] - string
 */
export type RankTable = { [entity: string]: number };

/**
 * An `Entity` type can be either a Course or an Applicant.
 *
 * @property {string} name - The name of the entity.
 * @property {Entity[]} preferences - A list of entities that the entity ranks in order of preference.
 * @property {RankTable} rankTable - A rank table is a mapping of ranks to entities.
 * @property {number} capacity - The maximum number of entities that can be assigned to this entity.
 */
export type Entity = {
    name: string;
    preferences: Entity[];
    rankTable: RankTable;
    capacity: number;
};

export interface Application extends Record<string, any> {
    Application_: string;
    TS_modify_: string;
    TS_create_: string;
    code_?: any;
    stud_: string;
    activ_: string;
    sendingLBG_: string;
    courses_: string;
    ml_: string;
    visa_?: any;
    studentRankingPosition_: string;
    organiserRankingPosition_?: any;
    rankingStatus_?: any;
    optimisationPosition_?: any;
    optimisationStatus_?: any;
    testRankingStatus_?: any;
    testOptimisationPosition_?: any;
    testOptimisationStatus_?: any;
    finalListPosition_?: any;
    extraAccepted_?: any;
    confirmed_?: any;
    participated_?: any;
    certified_?: any;
    evaluationSigned_?: any;
    evaluation_?: any;
    arrival_?: any;
    arrivalRef_?: any;
    finalStatus_?: any;
    extraAcceptedDate_?: any;
    customAnswer1_: string;
    depositReturned_?: any;
    customAnswer2_: string;
    customAnswer3_: string;
    multiChoiceAnswer1_?: any;
    multiChoiceAnswer2_?: any;
    multiChoiceAnswer3_?: any;
    courseInformationForm_?: any;
    arrivalPlace_?: any;
    arrivalMean_?: any;
    departure_?: any;
    departurePlace_?: any;
    departureMean_?: any;
    departureRef_?: any;
    subscribedToMailingList_?: any;
    finalListNotificationSent_?: any;
    evaluationDLNotificationSent_?: any;
    evaluated_?: any;
}

export interface Course {
  Activity_: string;
  TS_modify_: string;
  TS_create_: string;
  responsible_: string;
  season_: string;
  lbg_?: any;
  rankingPlaces_: string;
  optimisedPlaces_: string;
  testOptimisedPlaces_?: any;
  finalPlaces_: string;
  actualPlace_: string;
  name_: string;
  number_?: any;
  descr_: string;
  budget_: string;
  leaflet_?: any;
  survival_: string;
  url_: string;
  inSeason_: string;
  type_: string;
  start_: string;
  end_: string;
  appDeadline_?: any;
  lastRanked_?: any;
  lbgEvalForm_?: any;
  studentEvalForm_?: any;
  profEvalForm_?: any;
  lbgEval_?: any;
  email_?: any;
  learningHours_: string;
  examination_: string;
  goals_: string;
  requirements_: string;
  topics_: string;
  isGreenApple_?: any;
  isGreenAppleStamped_?: any;
  grapResponsible_?: any;
  level_: string;
  participants_: string;
  lodging_: string;
  food_: string;
  transportation_: string;
  schedule_: string;
  customQuestion1_: string;
  customQuestion2_: string;
  customQuestion3_: string;
  isLearningEventStamped_: string;
  multiChoiceQuestion1_?: any;
  multiChoiceQuestion2_?: any;
  multiChoiceQuestion3_?: any;
  rankingWaitingPlaces_: string;
  courseInformationForm_?: any;
  showRelevantCoursesBox_: string;
  isRecognisedByUniversity_: string;
  ectsCredits_?: any;
  ectsCreditsClarification_: string;
  relatedWebpages_?: any;
  mailingListName_?: any;
  repliesTo_: string;
  cifCounter_: string;
  oldTypeCharEnum_?: any;
  oldTextFee_?: any;
  fee_: string;
  priorKnowledgeRequired_: string;
  visibleToCompanies_: string;
  companiesNumber_?: any;
  visitorsNumber_?: any;
  feeForCompanies_: string;
  contactDeadline_?: any;
  meanOfPromotion_: string;
  eventAgenda_: string;
  targetStudentsDescription_: string;
  isRedAppleStamped_?: any;
  video_: string;
  isAppleStamped_: string;
  canceled_?: any;
}