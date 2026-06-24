export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  clientName: string;
  group: string;
  filiere: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'ready' | 'delivered';
  time: string;
}

export const categories = [
  'Tout',
  'Sandwichs',
  'Tacos',
  'Burgers',
  'Pizza',
  'Boissons',
  'Desserts',
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Sandwich Poulet',
    category: 'Sandwichs',
    description: 'Poulet grillé, salade, tomate, sauce maison',
    price: 25,
    image: '/images/hero-food-1.jpg',
    popular: true,
  },
  {
    id: 2,
    name: 'Sandwich Thon',
    category: 'Sandwichs',
    description: 'Thon, laitue, oignon, sauce tartare',
    price: 22,
    image: '/images/menu-sandwich-thon.jpg',
  },
  {
    id: 3,
    name: 'Tacos Poulet',
    category: 'Tacos',
    description: 'Poulet pané, frites, sauce algérienne',
    price: 30,
    image: '/images/menu-tacos-poulet.jpg',
  },
  {
    id: 4,
    name: 'Tacos Mixte',
    category: 'Tacos',
    description: 'Viande hachée + poulet, frites, sauce fromagère',
    price: 35,
    image: '/images/hero-food-2.jpg',
    popular: true,
  },
  {
    id: 5,
    name: 'Burger Classic',
    category: 'Burgers',
    description: 'Steak haché, cheddar, oignons, sauce BBQ',
    price: 40,
    image: '/images/hero-food-3.jpg',
    popular: true,
  },
  {
    id: 6,
    name: 'Burger Double',
    category: 'Burgers',
    description: 'Double steak, double cheddar, bacon',
    price: 55,
    image: '/images/menu-burger-double.jpg',
  },
  {
    id: 7,
    name: 'Pizza Margherita',
    category: 'Pizza',
    description: 'Sauce tomate, mozzarella, basilic frais',
    price: 30,
    image: '/images/hero-food-4.jpg',
    popular: true,
  },
  {
    id: 8,
    name: 'Pizza Pepperoni',
    category: 'Pizza',
    description: 'Sauce tomate, mozzarella, pepperoni',
    price: 45,
    image: '/images/menu-pizza-pepperoni.jpg',
  },
  {
    id: 9,
    name: 'Coca-Cola',
    category: 'Boissons',
    description: 'Canette 33cl',
    price: 10,
    image: '/images/menu-coca.jpg',
  },
  {
    id: 10,
    name: "Jus d'Orange",
    category: 'Boissons',
    description: 'Fraîchement pressé',
    price: 15,
    image: '/images/menu-jus.jpg',
  },
  {
    id: 11,
    name: 'Tiramisu',
    category: 'Desserts',
    description: 'Classique italien au café',
    price: 25,
    image: '/images/menu-tiramisu.jpg',
  },
  {
    id: 12,
    name: 'Cheesecake',
    category: 'Desserts',
    description: 'Citron, coulis de fruits rouges',
    price: 28,
    image: '/images/menu-cheesecake.jpg',
  },
];

export const filieres = ['DUT', 'BTS', 'Licence', 'Master', 'Autre'];
