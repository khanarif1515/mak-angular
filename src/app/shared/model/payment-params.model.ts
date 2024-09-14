export interface IPaymentParam {
  order_id?: string;
  ORDERID?: string | number;
  oi?: string; // Order ID
  or?: string; // Origin of the payment like fundraiser or story page
  u_or?: string; // if exist in query parma then origin(or) must be replace with this while return falied payment
  id?: number; // ID of the fundraiser
  st?: string; // Status of the payment like failed of success
  ct?: string; // Custom tag of the fundraiser
  payment?: string; // Options of the payment type
  type?: string; // payment flow type
  social?: string; // to hide/show all the the social links
  payops?: string; // to hide/show the other payment options present on page
  in_id?: string; // Insurance id
  eventPage?: boolean;
  ward_id?: number;
  served?: number;
  ward_name?: string;
  update_id?: string;
  utm_campaign?: string;
  drn?: string;
  email?: string;
  fmd_id?: string;
  pcurrency?: string;
  pledge_more?: any;
  amt?: string;
  pn?: string;
  ord?: string;
  typOr?: string;
  action_date?: string;
  donated_amount?: number;
  donated_currency?: string;
  is_donor?: number;
  lpb?: number;
  offer?: number;
  utm_source?: string;
  utm_medium?: string;
  auto_pay_m1?: number;
  url?: number;
  payment_v?: string;
  coupon?: string;
  sip_cause?: any;
  p_params?: string;
  month_interval?: number;
  sl?: string; // sl for story link
  sip_story?: number;
  min_donation?: number;
  sip_wallet?: number;
  wallet_tenure?: number;
  mini_story?: number;
  tip_amount?: number;
  hide_el?: any;
  vendor?: string;
  plan?: string;
  frtip?: any;
  birthdaytime?: any;
  reason?: string;
  person?: number;
  cover?: string;
  cover_amount?: number;
  hfmini?: number;
  hfmental?: number;
  coupon_code?: string;
  sub_campaign_id?: number;
  multi_patient_opted?: any;
}
