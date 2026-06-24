import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { reviews } from '@/data/reviews';

gsap.registerPlugin(ScrollTrigger);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'text-[#D4A017] fill-[#D4A017]' : 'text-[#B8B0A4]'}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.review-card');
    gsap.fromTo(
      cards,
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-[100px] px-[5vw] bg-[#F5EFE6]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1A1A1A] text-center">
          Avis des Stagiaires
        </h2>

        <div className="flex gap-6 mt-12 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="review-card flex-shrink-0 w-[320px] snap-start bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FDE8E8] flex items-center justify-center">
                  <span className="font-body text-sm font-semibold text-[#C41E1E]">
                    {review.initials}
                  </span>
                </div>
                <div>
                  <h4 className="font-body text-base font-semibold text-[#1A1A1A]">
                    {review.name}
                  </h4>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="font-body text-sm text-[#4A4A4A] italic mt-4 leading-relaxed">
                "{review.comment}"
              </p>
              <span className="block font-body text-xs text-[#7A7A7A] mt-4 tracking-wider">
                {review.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
