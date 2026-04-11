// TODO: Replace with GET /tenants/plans endpoint when available in backend

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  is_popular?: boolean;
}

export const AVAILABLE_PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    features: ["Hasta 50 productos", "1 miembro del equipo", "Reportes básicos", "Soporte comunitario"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 9990,
    features: ["Hasta 500 productos", "3 miembros", "Cupones y descuentos", "Reportes avanzados"],
    is_popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 24990,
    features: ["Productos ilimitados", "10 miembros", "API completa", "Soporte prioritario 24/7", "Dominio personalizado"],
  },
];
