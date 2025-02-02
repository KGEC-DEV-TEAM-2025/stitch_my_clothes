export interface DD_Option {
  name: string;
  id: number;
}

export interface MonogramScript {
  text: string;
  design: string;
}

export interface Monogram {
  enabled: boolean;
  style: DD_Option;
  position: DD_Option;
  color: DD_Option;
  block: string;
  script: MonogramScript;
}

export interface Collar {
  style: DD_Option;
  height: DD_Option;
  collar_button: DD_Option;
}

export interface Cuff {
  style: DD_Option;
  cufflinks: DD_Option;
  watch_compatible: DD_Option;
}

export interface Measurements {
  unit: string;
  neck: number;
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  elbow_width: number;
  forearm_width: number;
  wrist_cuff: number;
  bicep: number;
  shirt_length: number;
  armhole: number;
}

export interface OrderInfo {
  customer_id: string;
  shipping_address: string;
  phone: string;
  email: string;
}

export interface Pricing {
  base_price: number;
  extra_costs: { feature: string; cost: number }[];
  total_price: number;
}

export interface Payment {
  method: string;
  transaction_id: string;
}

export interface Shirt {
  name: string;
  cloth: DD_Option;
  fit: DD_Option;
  pocket: DD_Option;
  placket: DD_Option;
  bottom: DD_Option;
  back: DD_Option;
  sleeves: DD_Option;
  color: DD_Option;
  monogram: Monogram;
  collar: Collar;
  cuff: Cuff;
  measurements: Measurements;
  order_info: OrderInfo;
  pricing: Pricing;
  payment: Payment;
}
