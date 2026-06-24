import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Plus } from 'lucide-react';
import { products, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [search, setSearch] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'Tout' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.menu-card');
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      }
    );
  }, [activeCategory, search]);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelector('.menu-header'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section id="menu" ref={sectionRef} className="py-[100px] px-[5vw] bg-[#F5EFE6]">
      <div className="max-w-[1200px] mx-auto">
        <div className="menu-header">
          <h2 className="font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1A1A1A] text-center">
            Notre Menu
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#C41E1E] text-white'
                    : 'bg-white text-[#1A1A1A] border border-[#E8E2D9] hover:bg-[#FDE8E8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-[400px] mx-auto mt-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B0A4]" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E2D9] bg-white font-body text-sm text-[#1A1A1A] placeholder:text-[#B8B0A4] focus:outline-none focus:border-[#C41E1E] focus:ring-2 focus:ring-[#C41E1E]/20 transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        >
          {filtered.map((product) => (
            <div
              key={product.id}
              className="menu-card bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-[#FDE8E8] text-[#C41E1E] text-[10px] font-semibold uppercase tracking-wider rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-body text-lg font-semibold text-[#1A1A1A]">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-[#7A7A7A] mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-body text-xl font-bold text-[#C41E1E]">
                    {product.price} MAD
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-3 py-3 bg-[#C41E1E] text-white font-body text-sm font-semibold rounded-xl hover:bg-[#A31818] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-body text-[#7A7A7A] mt-10">
            Aucun produit trouvé.
          </p>
        )}
      </div>
    </section>
  );
}
