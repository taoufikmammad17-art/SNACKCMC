import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

gsap.registerPlugin(ScrollTrigger);

const popularProducts = products.filter((p) => p.popular);

export default function PopularProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll('.product-card');
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-[100px] px-[5vw] bg-[#FAF8F5]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1A1A1A] text-center">
          Les Plus Populaires
        </h2>
        <p className="font-body text-base text-[#7A7A7A] text-center mt-2">
          Les favoris des stagiaires
        </p>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {popularProducts.map((product) => (
            <div
              key={product.id}
              className="product-card bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:border-[#B8B0A4] transition-all duration-300"
            >
              <div className="h-[200px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
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
                  <button
                    onClick={() => addToCart(product)}
                    className="w-9 h-9 rounded-lg bg-[#C41E1E] text-white flex items-center justify-center hover:bg-[#A31818] transition-colors duration-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
