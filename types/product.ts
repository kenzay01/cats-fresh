export interface Product {
  id: string;
  idNumber: number;
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
    from_8: number;
    from_80: number;
  };
}
