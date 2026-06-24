import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const schedule = [
  { day: 'Lundi — Vendredi', hours: '8h00 – 18h00' },
  { day: 'Samedi', hours: '8h00 – 13h00' },
  { day: 'Dimanche', hours: 'Fermé' },
];

export default function Hours() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const content = sectionRef.current.querySelectorAll('.hours-animate');
    gsap.fromTo(
      content,
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
    <section id="horaires" ref={sectionRef} className="py-[100px] px-[5vw] bg-[#F5EFE6]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left - Text */}
        <div>
          <h2 className="hours-animate font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1A1A1A]">
            Nos Horaires
          </h2>

          <div className="mt-8 space-y-0">
            {schedule.map((item, i) => (
              <div
                key={i}
                className="hours-animate flex justify-between items-center py-4 border-b border-[#E8E2D9]"
              >
                <span className="font-body text-base font-medium text-[#1A1A1A]">
                  {item.day}
                </span>
                <span
                  className={`font-body text-base font-semibold ${
                    item.hours === 'Fermé' ? 'text-[#7A7A7A]' : 'text-[#C41E1E]'
                  }`}
                >
                  {item.hours}
                </span>
              </div>
            ))}
          </div>

          <div className="hours-animate flex items-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full bg-[#2D8A4E]" />
            <span className="font-body text-sm text-[#7A7A7A]">
              Service continu pendant les pauses
            </span>
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="hours-animate flex justify-center">
          <img
            src="/images/illustration-hours.jpg"
            alt="Horaires illustration"
            className="rounded-2xl shadow-lg max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
