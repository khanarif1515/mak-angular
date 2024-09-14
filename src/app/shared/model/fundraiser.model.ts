export interface IFundraiser {
  action_at?: string;
  action_date?: string;
  isEnded?: boolean;
  isSuccessfullyFunded?: boolean;
  activeteam?: [{
    designation?: string;
    entity_id?: number;
    id?: number;
    role?: string;
    status?: number;
    type?: string;
    type_id?: number;
    member?: {
      avtar?: string;
      entity_type?: string;
      fname?: string;
      full_name?: string;
      id?: number;
      lname?: string;
      sociallinks?: any[];
      status_flag?: number;
    }
  }];
  address_1?: string;
  address_2?: string;
  address_3?: string;
  amount_requested?: number;
  banktransfer?: {
    account_ifsc?: string;
    account_name?: string;
    account_number?: string;
    entity_details_id?: number;
    entity_type?: number;
    id?: number;
    info_1?: string;
    info_3?: string;
    info_type?: string;
  };
  basicinfo?: any[];
  basicInfo?: {
    about?: string;
    beneficiary_name?: string;
    beneficiary_relation?: {
      info_1: string;
      info_2: string;
    };
    contribute?: string;
    disease?: string;
    doctor_name?: string;
    hospital?: string;
    is_private?: string | number;
    manager?: string | number;
    social?: string;
    video_leaderboard?: string | number;
  } | any;
  beneficiary?: {
    access_url?: string;
    address_1?: string;
    address_2?: string;
    address_3?: string;
    age?: string;
    avtar?: {
      cdn_path?: string;
      entity_type?: string;
      entity_type_id?: number;
      file_name?: string;
      media_type?: string;
      path?: string;
    };
    city?: string;
    disable_foreign_donation?: number;
    email?: string;
    entity_type?: string;
    fname?: string;
    full_name?: string;
    gender?: string;
    id?: number;
    lname?: string;
    no_80g?: boolean;
    phone_1?: string;
    phone_2?: string;
    pincode?: string;
    status_flag?: 1;
    tax_benefit?: boolean
    user_details_id?: number;
    website_1?: string;
    website_2?: string;
  };
  beneficiaryname?: {
    info_1?: string;
  };
  campaigner?: ICampaigner;
  cause?: {
    id?: 51;
    info_1?: string;
    info_2?: string;
    info_3?: string;
    info_4?: string;
    parent_cause_id?: number;
    status_flag?: number;
  };
  cause_id?: number;
  corporate_entity_details_id?: number;
  costbreakdown?: any[];
  count_medical_bill?: number;
  creation_date?: string;
  creator_entity_details_id?: number;
  cta_label?: any;
  custom_tag?: string;
  custom_thankyou?: string;
  disable_foreign_donation?: boolean;
  disease?: {
    creation_time?: string;
    entity_details_id?: number;
    entity_type?: string;
    id?: number;
    info_1?: string;
    info_2?: string;
    info_3?: string;
    info_type?: string;
    path?: string;
    updation_time?: string;
  };
  display_type_self?: string;
  doctor?: {
    info_1?: string;
  };
  doctoravatar?: {
    cdn_path?: string;
  };
  end_date?: string;
  entity_details_id?: number;
  event_entity_details_id?: number;
  gallery?: [{
    cdn_path?: string;
    display_type_1?: string;
    entity_type?: string;
    file_name?: string;
    id?: number;
    path?: string;
  }];
  hospital?: {
    entity_details_id?: number;
    entity_type?: string;
    full_name?: string;
    id?: number;
    info_1?: string;
    info_3?: string;
    info_type?: string;
    phone_1?: string;
  };
  hospitallogo?: {
    cdn_path?: string;
  };
  id?: number;
  info?: [
    {
      entity_details_id?: number;
      entity_type?: string;
      id?: number;
      info_1?: string;
      info_type?: string;
    }
  ];
  isDonated?: boolean;
  isFundraiserEnded?: boolean;
  is_multi_patient?: any;
  is_multi_patient_campaign?: boolean;
  is_selected?: boolean;
  is_sip_story?: any;
  leaderboard?: {
    cdn_path?: string;
  };
  main_custom_tag?: string;
  manager?: {
    entity?: {
      full_name?: string;
    }
  };
  manager_id?: number;
  matching_donor?: IMatchingDonor;
  media_beneficiary?: IMediaBeneficiary;
  // medicalbill?: [];
  msw_name?: {
    creation_time?: string;
    info_1?: string;
    info_type?: string;
  };
  msw_date?: {
    creation_time?: string;
    info_1?: string;
    info_type?: string;
    updation_time?: string;
  };
  multi_patient_beneficiaries?: any[];
  non_medical?: boolean;
  organiser?: IOrganiser;
  parent_cause_id?: number;
  parent_entity_details_id?: number;
  patientstatus?: IPatienStatus[];
  priority_self?: number;
  product_banner_description?: string;
  raised?: {
    backers?: number;
    beforeTickr?: number;
    beforeTickrBackers?: number;
    campaign_id?: number;
    increasedby?: any;
    last24hrtotal?: number;
    lastweektotal?: number;
    raised?: number;
    initRaised?: number;
    raisedPerc?: number;
    increaseRaiseBy?: number;
    increaseRaiseByPerc?: number;
    usdraised?: number;
  };
  rewards?: IReward[];
  settings?: {
    donation_button?: boolean;
    hidedaysleft?: boolean;
    nobenedetails?: boolean;
    nodonorlist?: boolean;
    norecenttab?: boolean;
    show_qr?: boolean;
  };
  shortdescription?: {
    info_1?: string;
  };
  show_product?: boolean;
  sipcause?: ISipCause;
  start_date?: string;
  status_flag?: number;
  stop_google_index?: boolean;
  story_description?: IStoryDescription;
  story_title?: IStoryTitle;
  story_widget?: {
    cdn_path?: string;
  };
  support_campaign?: ISupportCampaign;
  team?: [{
    designation?: string;
    entity_id?: number;
    id?: number;
    role?: string;
    status?: number;
    type?: string;
    type_id?: number;
  }];
  thankyouvideo?: { path?: string; };
  theater?: {
    cdn_path?: string;
  };
  tip_model?: boolean;
  title?: string;
  updates_count?: {
    entity_id?: number;
    count?: number;
  };
  user_followed?: {
    status?: number;
    type_id?: number;
  };
  valid_coupon?: ICouponInfo;
  video_appeal?: IVideoAppeal;
  viewmedicalbill?: [{
    cdn_path?: string;
    detail_1?: string;
    entity_type_id?: number;
    file_name?: string;
    media_type?: string;
    path?: string;
  }];
  widget?: {
    cdn_path?: string;
  };
}

export interface ISipCause {
  entity_details_id?: number;
  entity_type?: number;
  id?: number;
  info_1?: string;
  info_2?: string;
  info_3?: string;
  info_type?: string;
}

export interface IPatienStatus {
  creation_time?: string;
  entity_details_id?: number;
  entity_type?: string;
  info_1?: string;
  info_type?: string;
  pstatus_1?: string;
  pstatus_2?: string;
}

export interface IMatchingDonor {
  campaign_id?: string;
  descriptions?: string;
  image?: string;
  logo?: string;
  max_amount?: number;
  multiplier?: number;
  name?: string;
  per_donation_cap?: number;
  start_date?: string;
  status?: number;
}

export interface ICampaigner {
  agg_fundraiser?: {
    cnt?: number;
    creator_entity_details_id?: number;
  };
  aggdonation?: {
    donations?: number;
    donor_entity_details_id?: number;
    funds?: number
  };
  avtar?: {
    cdn_path?: string;
    entity_type?: string;
    entity_type_id?: number;
    file_name?: string;
    media_type?: string;
    path?: string;
  };
  city?: string;
  disable_foreign_donation?: 0;
  fname?: string;
  full_name?: string;
  id?: number;
  lname?: string;
  no_80g?: boolean;
  social?: {
    friends_count?: number;
    status?: number;
    system_user_id?: number;
    tp_provider?: string;
  };
  story_widget?: {
    cdn_path?: string;
  };
  tax_benefit?: boolean;
  user_details_id?: number;
}

export interface IReward {
  active_backers_count?: number;
  amount?: number;
  amount_from?: number;
  amount_to?: number;
  amount_usd?: number;
  backers?: number;
  campaign_id?: number;
  descp?: string;
  display_text?: string;
  expected_date?: string;
  id?: number;
  notes?: string;
  status?: boolean;
  status_flag?: number;
}

export interface IBasicInfo {
  about?: string;
  beneficiary_name?: string;
  beneficiary_relation?: string;
  contribute?: string;
  disease?: string;
  hospital?: string;
  manager?: string;
  social?: string;
  translation?: string;
  video_leaderboard?: string;
}

export interface IFundraiserMetaData {
  beneficiary?: string;
  campaigner?: string;
  description?: string;
  image?: string;
  keywords?: string;
  site?: string;
  title?: string;
  url?: string;
}

export interface IStoryDescription {
  entity_details_id?: number;
  entity_type?: string;
  id?: number;
  info_1?: string;
  info_3?: string;
  info_type?: string;
}

export interface IStoryDescription {
  entity_details_id?: number;
  entity_type?: string;
  id?: number;
  info_1?: string;
  info_3?: string;
  info_type?: string;
}

export interface IStoryTitle {
  entity_details_id?: number;
  entity_type?: string;
  id?: number;
  info_1?: string;
  info_3?: string;
  info_type?: string;
}

export interface IMediaBeneficiary {
  cdn_path?: string;
  file_name?: string;
  id?: number;
  media_type?: string;
  path?: string;
}

export interface IVideoAppeal {
  cdn_path?: string;
  file_name?: string;
  id?: number;
  media_type?: string;
  path?: string;
}

export interface ISupportCampaign {
  amount_requested?: string;
  appeal?: string;
  campaign_id?: number;
  created_at?: string;
  creator_entity_details_id?: number;
  creator_name?: string;
  custom_tag?: string;
  entity?: ISupportEntity;
  id?: number;
  reason?: string;
  status_flag?: string;
  type?: string;
  updated_at?: string;
}

export interface IOrganiser {
  access_url?: string;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  email?: string;
  entity_type?: string;
  fname?: string;
  full_name?: string;
  gender?: string;
  id?: number;
  lname?: string;
  no_80g?: boolean;
  phone_1?: string;
  status_flag?: number;
  tax_benefit?: boolean;
  user_details_id?: number;
}

export interface ISupportEntity {
  avtar?: ISupportAvatar;
  email?: string;
  entity_type?: string;
  fname?: string;
  full_name?: string;
  id?: number;
  lname?: string;
  phone_1?: string;
  tax_benefit?: boolean;
  user_details_id?: number;
}

export interface ISupportAvatar {
  cdn_path?: string;
  entity_type?: string;
  entity_type_id?: number;
  file_name?: string;
  media_type?: string;
}

export interface ICouponInfo {
  campaign_id?: number;
  coupon_id?: number;
  redeem_transfer_apply?: {
    coupon_code?: string;
    created_at?: string;
    created_by?: number;
    criteria?: string;
    description?: string;
    id?: number;
    status_flag?: number;
    type?: string;
    updated_at?: string;
  };
}
