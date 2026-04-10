export interface InventoryMovement {
  id: string;
  created_at: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  reason?: string;
}

export interface InventoryValuation {
  total_retail_value: number;
  total_cost_value?: number;
  total_items?: number;
}

export interface InventoryAlert {
  product: {
    id: string;
    name: string;
    sku?: string;
    image_url?: string;
  };
  variant?: {
    id: string;
    name: string;
  };
  current_stock: number;
  low_stock_alert: number;
  alert_type: string;
}
