import { IFundraiser } from "./fundraiser.model";
import { IUser } from "./user.model";

export const PAYMENT_DEFAULT_CONFIG: IPayConfig = {
  pCurrency: '',
  disableCard: false,
  showDock: false,
  donateBtnLabel: '',
  formTitle: 'Enter donation amount',
  optionsTitle: 'Please select your payment mode',
  supported_cards: ['MX', 'VISA', 'MASTER', 'STRIPE'],
  otherAmountBtnLabel: 'Other Amount',
  showSlabs: true,
  showTip: false
};

export interface IPayConfig {
  pCurrency?: string;
  selectedAmount?: number;
  cartAmount?: number;
  displayAmount?: number;
  campaignId?: number;
  formTitle?: string;
  donateBtnLabel?: string;
  disableCard?: boolean;
  fundraiser?: IFundraiser;
  hideCaptchaNote?: boolean;
  cartResponse?: ICartResponse;
  lastOrder?: {
    iso_currency?: string;
    payment_details?: {
      customer_id: string;
      last4: string;
    };
    payment_gateway?: string;
    payment_mode?: string;
    payment_mode_value?: string;
    upi_id?: string;
  };
  showOtherAmount?: boolean;
  otherAmountBtnLabel?: string;
  origin?: string;
  page?: 'f' | 'op';
  contributeRes?: IContribute;
  optionsRes?: IPaymentOptions;
  optionsTitle?: string;
  visibleTabs?: IOptionsTab[];
  selectedTab?: IOptionsTab;
  min_donation?: number;
  supported_cards?: any;
  user?: IUser;
  showTip?: boolean;
  showSlabs?: boolean;
  tipAmount?: number;
  tipAmountPerc?: number;
  showDock?: boolean;
  isIndian?: boolean;
  tipPercentage?: number;
}


export interface IOptionsTab {
  icon: string;
  label: string;
  mode: string;
  name: string;
  note: string;
  order_mode: string;
  recommended: boolean;
  selected: boolean;
  show: boolean;
  tabs?: string[];
}

export interface IContribute {
  address: boolean;
  anonymous: boolean;
  is_anonymous?: boolean;
  ask_pan: boolean;
  ask_passport: boolean;
  ask_citizenship: boolean;
  default_amount: number;
  min_donation: number;
  only_foreign: boolean;
  only_inr: boolean;
  pan_validation_amount: number;
  pan_required_amount: number;
  pincode: boolean;
  selected_currency: string;
  rewards: IRewards[];
  slabs: number[];
  supported_currency: any[];
  campaign?: IFundraiser;
  show_popular?: boolean;
  ngo_sip_campaign?: boolean;
  mandate_fee?: number;
  timestamp?: number;
}

export interface IRewards {
  active_backers_count: number;
  amount: number;
  amount_from: number;
  amount_to: number;
  amount_usd: number;
  backers: number;
  campaign_id: number;
  creation_date: string;
  descp: string;
  display_text: string;
  expected_date: string;
  id: number;
  notes: string;
  status_flag: number;
}

export interface IContributeParams {
  currency: string;
  campaign_id?: number;
  origin?: string;
  device?: string;
  slab_ab?: any;
  is_story?: boolean;
  currency_only?: string;
  previousCurrency?: string;
  min_donation?: number;
  birthdaytime?: number | string;
}

export interface ICartParams {
  campaign_id: number;
  currency: string;
  donated_amount: number;
  donor_name: string;
  donor_email: string;
  donor_extension: string;
  donor_phone: string | number;
  is_anonymous?: '1' | '0';
  donor_pincode?: number;
  'g-recaptcha-response'?: string;
  tip_amount?: number;
  tip_amount_perc?: number;
  skipmin?: boolean;
  donor_address?: string;
  pan?: string;
  passport?: string;
  reward_id?: string | number;
  indian?: boolean;
  coupon_code?: string | number;
  bulkdonation?: any;
  bulkAmount?: number;
}

export interface ICartResponse {
  cart?: ICart;
  campaign?: ICartCampaign;
  login?: boolean;
  token?: string;
  user?: any;
}

export interface ICartCampaign {
  action_at?: any;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  amount_requested?: number;
  beneficiary?: any;
  cause_id?: number;
  cause_id_old?: number;
  corporate_entity_details_id?: number;
  creation_date?: string;
  creator_entity_details_id?: number;
  custom_tag?: string;
  display_type_self?: any;
  end_date?: string;
  entity_details_id?: number;
  event_entity_details_id?: number;
  id?: number;
  ketto_commission?: string;
  manager_id?: number;
  only_foreign?: {
    entity_details_id?: number;
    entity_type?: string;
    info_1?: string;
    info_2?: string;
    info_type?: string;
  }
  owner?: {
    access_url?: string;
    address_1?: string;
    address_2?: string;
    address_3?: string;
    age?: string;
    city?: string;
    creation_time?: string;
    disable_foreign_donation?: number;
    entity_type?: string;
    fname?: string;
    full_name?: string;
    gender?: string;
    id?: number;
    lname?: string;
    no_80g?: boolean;
    pincode?: string;
    profileIncomplete?: boolean;
    status_flag?: number;
    tax_benefit?: boolean;
    user_details_id?: number;
    website_1?: string;
    website_2?: string;
  }
  parent_cause_id?: number;
  parent_entity_details_id?: number;
  priority_self?: number;
  start_date?: string;
  status_flag?: number;
  submitted_at?: string;
  sucess_story_flag?: number;
  title?: string;
  updated_at?: string;
  user_details_id?: number;
  timestamp?: number;
}

export interface ICart {
  campaign_id?: number;
  currency?: string;
  donated_amount?: number;
  donated_amount_inr?: number;
  donor_address?: string;
  donor_email?: string;
  donor_entity_details_id?: number;
  donor_name?: string;
  donor_phone?: number;
  donor_pincode?: number;
  id?: number;
  is_anonymous?: number;
  pan?: string;
  recurring?: boolean;
  status_flag?: boolean;
  selected_currency?: string;
  donated_amount_local?: string;
  donor_extension?: string;
  indian?: any;
  tip_amount?: number;
  tip_amount_perc?: number;
  tip_amount_inr?: number;
  skipCardPrefil?: boolean;
  reward_id?: boolean;
  sip_cause?: string;
  slabs?: Array<number>;
  bulkdonation?: any;
  plan?: string;
  vendor?: string;
  timestamp?: number;
}

export interface IOrderParams {
  VPA?: string;
  bin?: any;
  campaign_id?: number;
  card_number_fill?: string;
  cart_id?: number;
  customer_id?: number | string;
  donor_pincode?: number | string;
  gateway?: string;
  is_indian?: any;
  is_multi_patient_campaign?: any;
  mode?: string;
  mode_value?: string;
  page_type?: string;
  payment_gateway?: string;
  subscription_id?: number;
  support_campaign_id?: number;
  tenure?: number;
  vpa?: string;
}

export interface ISendParams {
  order_id?: string;
  token?: any;
  token_1?: any;
  save_card?: any;
  customer_id?: any;
  account_no?: number;
  ifsc_code?: string;
  bank_code?: number | string;
  bank_name?: string;
  auth_mode?: any;
  payment_method_change?: any;
  return_url?: string;
  multi_patient_opted?: any;
}

export interface ISendResponse {
  UPI?: boolean;
  charged?: boolean;
  method?: string;
  params?: any;
  url?: string;
}


export interface IPaymentOptions {
  gateway?: string;
  options?: {
    CARD?: any;
    NB?: any;
    TOPNB?: any;
    WALLET?: any;
    PAYTM?: any;
    TOPWALLET?: any;
    UPI?: any;
    REWARD?: any;
    TOPUPI?: any;
    RECOMMENDED_VPA?: string;
    PREVIOUSPAYMENTGATEWAY?: any;
    PREVPAYGATEWAYRECOMM?: any;
  };
  setting?: any;
}

export interface IOptions {
  name: string;
  icon: string;
  route?: string;
  data: any;
}


export interface IPageBasedFormConfig {
  mostDonors: boolean;
  nationality?: boolean;
  address?: boolean;
  anonymous_from_api?: boolean;
  only_inr?: boolean;
  donate_label?: string;
  tip?: boolean;
  passport?: boolean;
  pan?: boolean;
  utm_nudge?: boolean;
  story_link?: boolean;
  most_donors?: boolean;
  pincode?: boolean;
}

export interface ITypParams {
  amt?: number;
  ct?: string;
  dnr?: string;
  donated_amount?: number;
  donated_currency?: string;
  id?: number;
  lpm?: string;
  oi?: string;
  or?: string;
  tip_amount?: number;
  u_or?: string;
  url?: string;
  last_pay_mode?: string;
  pledge_more?: any;
  multi_patient_opted?: any;
  page?: string;
  st?: string;
  last_success_order_id?: string;
  payment?: string;
  method?: string;
  method_type?: string;
  sub_campaign_id?: number;
}



export const STORY_CONFIG: IPageBasedFormConfig = {
  mostDonors: false,
  nationality: true,
  address: false,
  anonymous_from_api: true,
  only_inr: false,
  donate_label: 'Stories.proceedDonate',
  story_link: true,
  most_donors: true,
  pincode: false
};