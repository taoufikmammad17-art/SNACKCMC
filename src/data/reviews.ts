export interface Review {
  id: number;
  name: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Youssef A.',
    initials: 'YA',
    rating: 5,
    comment: 'Le meilleur sandwich poulet de Settat ! Rapide et toujours chaud.',
    date: '12 juin 2026',
  },
  {
    id: 2,
    name: 'Fatima Z.',
    initials: 'FZ',
    rating: 4,
    comment: "Les tacos sont incroyables, surtout la sauce fromagère.",
    date: '10 juin 2026',
  },
  {
    id: 3,
    name: 'Karim B.',
    initials: 'KB',
    rating: 5,
    comment: 'Prix très abordables pour des stagiaires. Je recommande !',
    date: '8 juin 2026',
  },
  {
    id: 4,
    name: 'Amina L.',
    initials: 'AL',
    rating: 4,
    comment: 'Le burger classic est mon préféré. Service rapide !',
    date: '5 juin 2026',
  },
];
