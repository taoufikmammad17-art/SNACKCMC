import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Utensils, ShoppingCart, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Utensils,
    title: 'Choisissez',
    text: 'Parcourez notre menu et sélectionnez vos plats préférés.',
  },
  {
    icon: ShoppingCart,
    title: 'Commandez',
    text: 'Ajoutez au panier et validez votre commande en quelques clics.',
  },
  {
    icon: Clock,
    title: 'Récupérez',
    text: 'Votre commande est prête en minutes. Récupérez-la au snack !',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll('.step-item');
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-[100px] px-[5vw] bg-[#FAF8F5]">
      <div className="max-w-[900px] mx-auto">
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1A1A1A] text-center">
          Comment Commander ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute top-[40px] left-[20%] right-[20%] h-0 border-t border-dashed border-[#E8E2D9]" />

          {steps.map((step, i) => (
            <div key={i} className="step-item flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-[#FDE8E8] flex items-center justify-center mb-5">
                <step.icon size={32} className="text-[#C41E1E]" />
              </div>
              <h3 className="font-body text-xl font-semibold text-[#1A1A1A]">{step.title}</h3>
              <p className="font-body text-sm text-[#7A7A7A] mt-2 max-w-[250px]">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
