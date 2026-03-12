export interface CartItem {
  /** Product ID (WooCommerce). */
  id: number;
  /** Store API cart line item key (needed for update/remove). */
  key: string;
  name: string;
  slug: string;
  price: string;
  imageSrc: string | null;
  quantity: number;
}
