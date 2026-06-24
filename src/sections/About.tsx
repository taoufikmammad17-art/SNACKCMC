import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll('.about-animate');
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section id="apropos" ref={sectionRef} className="py-[100px] px-[5vw] bg-[#FAF8F5]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left - Photo */}
        <div className="about-animate">
          <img
            src="/images/about-photo.jpg"
            alt="Snack CMC Casa-Settat"
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </div>

        {/* Right - Text */}
        <div>
          <span className="about-animate block text-[12px] font-medium uppercase tracking-[0.03em] text-[#7A7A7A] font-body">
            À PROPOS
          </span>
          <h2 className="about-animate font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1A1A1A] mt-2">
            Snack CMC Casa-Settat
          </h2>
          <p className="about-animate font-body text-base text-[#4A4A4A] leading-relaxed mt-6">
            Situé au cœur du Centre de Formation CMC Casa-Settat, notre snack est né d'une envie simple :
            offrir aux stagiaires des repas rapides, abordables et de qualité. Chaque jour, nous préparons
            nos produits avec des ingrédients frais et beaucoup de passion. Que ce soit pour une pause rapide
            ou un déjeuner entre amis, nous sommes là pour vous régaler !
          </p>
          <blockquote className="about-animate mt-6 pl-4 border-l-[3px] border-[#C41E1E]">
            <p className="font-body text-base text-[#4A4A4A] italic">
              Notre mission : offrir des repas rapides, abordables et de qualité aux stagiaires du CMC Casa-Settat.
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
