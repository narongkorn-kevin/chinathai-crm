export interface IOrderProduct {
    product_code: string
    product_name: string
    product_url: string
    product_image: string
    product_category: string
    product_store_type: string
    product_note: string
    product_price: string
    product_qty: string
    add_on_services: IOrderAddOnService[]
    options: IOrderOption[]
}

export interface IOrderAddOnService {
    add_on_service_id: number
    add_on_service_price: number
  }

  export interface IOrderOption {
    option_name: string
    option_image: string
    option_note: string
  }
