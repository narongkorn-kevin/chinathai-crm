export interface Pallet {
  id: number
  code: string
  product_type_id: number
  tracking_number: any
  received_date: string
  shipped_by: string
  remark: any
  create_by: string
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  pallet_lists: PalletList[]
  product_type: ProductType
}

export interface PalletList {
  id: number
  pallet_id: number
  delivery_order_id: number
  delivery_order_list_id: number
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  pallet_images: any[]
  delivery_order_list: DeliveryOrderList
  delivery_order: DeliveryOrder
}

export interface DeliveryOrder {
  [x: string]: any
  sack_id?: string;
  id: number
  code: string
  po_no: string
  member_id: number
  order_id: number
  date: string
  driver_name: string
  driver_phone: string
  note: string
  member?: Member
  shipment_by: string
  shipment_china: string
  store_id: number
  member_importer_code_id: number
  product_type_id: number
  status: string
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  order: Order
}

export interface DeliveryOrderList {
  id: number
  code: string
  barcode: any
  product_draft_id: number
  delivery_order_id: number
  delivery_order_tracking_id: number
  product_type_id: number
  product_name: string
  product_image: string
  standard_size_id: number
  weight: string
  width: string
  height: string
  long: string
  qty: number
  qty_box: number
  pallet_id: number
  sack_id: any
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  cbm: number
  images: [{
    image_url: string
    image: string
  }]
  delivery_order: DeliveryOrder
  product_type: ProductType
  standard_size: StandardSize
}

export interface ProductType {
  id: number
  code: string
  name: string
  description: string
  status: string
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
}

export interface StandardSize {
  id: number
  code: any
  name: string
  weight: string
  width: string
  height: string
  long: string
  note: any
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
}

export interface Order {
  id: number
  code: string
  member_id: number
  member_address_id: number
  shipping_type: string
  payment_term: string
  date: string
  total_price: string
  note: any
  deposit_fee: string
  exchange_rate: string
  china_shipping_fee: string
  bill_vat: string
  importer_code: string
  remark_cancel: any
  status: string
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  order_lists: OrderList[]
}

export interface OrderList {
  id: number
  track_ecommerce_no: string
  po_no: string
  order_id: number
  product_shop: string
  product_code: string
  product_name: string
  product_url: string
  product_image: string
  product_category: string
  product_store_type: string
  product_note: any
  product_price: string
  product_qty: number
  product_real_price: string
  product_real_link: string
  product_negotiated_price: string
  status: string
  note: any
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
}

export interface Member {
  id: number
  code: string
  member_type: string
  fname: string
  lname: string
  phone: string
  birth_date: string
  gender: string
  importer_code: string
  password: string
  referrer: any
  address: string
  province: string
  district: string
  sub_district: string
  postal_code: string
  wallet_balance: string
  point_balance: any
  image: any
  transport_rate_id: number
  create_by: any
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  avaliable_time: any
  credit_limit: any
  loan_amount: any
  bus_route: any
  email: string
  facebook: any
  line_id: any
  wechat: any
  uid: any
  notify_sms: any
  notify_line: any
  notify_email: any
  found_via: any
  priority_update_tracking: any
  priority_package_protection: any
  priority_order_system: any
  responsible_person: any
  responsible_sale: any
  responsible_remark: any
  id_card_copy: any
  company_certificate: any
  pp20_document: any
  language: any
  transport_rate: TransportRate
}

export interface TransportRate {
  id: number
  code: string
  name: string
  remark: string
  min_rate: string
  status: string
  create_by: string
  update_by: string
  created_at: string
  updated_at: string
  deleted_at: any
  rate_lists: RateList[]
}

export interface RateList {
  id: number
  transport_rate_id: number
  transport_type_id: number
  product_type_id: number
  rate_type: string
  rate_price: string
  status: string
  create_by: string
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
  transport_type: TransportType
}

export interface TransportType {
  id: number
  code: string
  name_th: string
  name_en: string
  name_ch: string
  status: string
  create_by: string
  update_by: any
  created_at: string
  updated_at: string
  deleted_at: any
}
