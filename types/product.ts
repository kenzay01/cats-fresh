export interface Product {
  id: string;
  name: {
    uk: string;
    ru: string;
  };
  description: {
    uk: string;
    ru: string;
  };
  price: {
    single: number;
    from_6: number;
  };
}
