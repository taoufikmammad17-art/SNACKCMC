export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1A1A] pt-[60px] pb-[30px] px-[5vw]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1 - Brand */}
        <div>
          <h3 className="font-display text-xl font-semibold text-white">Snack CMC</h3>
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#7A7A7A] font-body">
            Casa-Settat
          </span>
          <p className="font-body text-sm text-[#7A7A7A] mt-3 max-w-[250px]">
            Des repas rapides et savoureux pour les stagiaires.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h4 className="font-body text-sm font-semibold text-white mb-4">Liens Rapides</h4>
          <ul className="space-y-2">
            {[
              { label: 'Accueil', id: 'accueil' },
              { label: 'Menu', id: 'menu' },
              { label: 'Horaires', id: 'horaires' },
              { label: '\u00c0 propos', id: 'apropos' },
              { label: 'Contact', id: 'contact' },
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="font-body text-sm text-[#7A7A7A] hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Hours */}
        <div>
          <h4 className="font-body text-sm font-semibold text-white mb-4">Horaires</h4>
          <p className="font-body text-sm text-[#7A7A7A]">Lun-Ven: 8h-18h</p>
          <p className="font-body text-sm text-[#7A7A7A] mt-1">Sam: 8h-13h</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1200px] mx-auto mt-10 pt-5 border-t border-[rgba(255,255,255,0.1)] text-center">
        <p className="text-[11px] uppercase tracking-[0.03em] text-[#7A7A7A] font-body">
          © 2026 Snack CMC Casa-Settat. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
