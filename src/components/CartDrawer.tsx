import { useState } from 'react';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { filieres } from '@/data/products';
import type { Order } from '@/data/products';

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    addOrder,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    groupe: '',
    filiere: 'DUT',
    telephone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nom.trim()) errs.nom = 'Le nom est requis';
    if (!formData.groupe.trim()) errs.groupe = 'Le groupe est requis';
    if (!formData.telephone.trim()) errs.telephone = 'Le téléphone est requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const orderId = Math.floor(1000 + Math.random() * 9000).toString();
    const order: Order = {
      id: orderId,
      clientName: formData.nom,
      group: formData.groupe,
      filiere: formData.filiere,
      phone: formData.telephone,
      items: [...items],
      total: cartTotal,
      status: 'pending',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    addOrder(order);
    setSuccess(`Commande #${orderId} confirmée !`);
    setTimeout(() => {
      setSuccess(null);
      setShowForm(false);
      clearCart();
      setIsCartOpen(false);
      setFormData({ nom: '', groupe: '', filiere: 'DUT', telephone: '' });
    }, 3000);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-[60]"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FAF8F5] shadow-[-4px_0_24px_rgba(0,0,0,0.1)] z-[70] flex flex-col"
        style={{
          animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E2D9]">
          <h2 className="font-display text-2xl font-semibold text-[#1A1A1A]">
            Votre Panier
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#F5EFE6] transition-colors"
          >
            <X size={20} className="text-[#4A4A4A]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5EFE6] flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B8B0A4" strokeWidth="1.5">
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                  <path d="M6 6L5 3H2" />
                </svg>
              </div>
              <p className="font-body text-[#7A7A7A]">Votre panier est vide</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="font-body text-sm text-[#C41E1E] mt-2 hover:underline"
              >
                Parcourez le menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white rounded-xl p-3 border border-[#E8E2D9]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[60px] h-[60px] rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-semibold text-[#1A1A1A] truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F5EFE6] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-body text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F5EFE6] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-body text-sm font-bold text-[#C41E1E]">
                      {item.price * item.quantity} MAD
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-[#B8B0A4] hover:text-[#C41E1E] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E8E2D9] bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-sm text-[#4A4A4A]">Sous-total</span>
              <span className="font-body text-lg font-bold text-[#1A1A1A]">
                {cartTotal} MAD
              </span>
            </div>
            <p className="font-body text-xs text-[#7A7A7A] mb-4">À récupérer au snack</p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 bg-[#C41E1E] text-white font-body font-semibold rounded-xl hover:bg-[#A31818] transition-colors duration-200"
            >
              Valider la commande
            </button>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-[400px] w-full shadow-2xl">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#2D8A4E]/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8A4E" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#1A1A1A]">
                  Commande confirmée !
                </h3>
                <p className="font-body text-sm text-[#4A4A4A] mt-2">{success}</p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-semibold text-[#1A1A1A] mb-4">
                  Votre commande
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-[#4A4A4A] mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] focus:ring-2 focus:ring-[#C41E1E]/20"
                      placeholder="Votre nom"
                    />
                    {errors.nom && (
                      <span className="text-[#C41E1E] text-xs font-body mt-1">{errors.nom}</span>
                    )}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-[#4A4A4A] mb-1">
                      Groupe
                    </label>
                    <input
                      type="text"
                      value={formData.groupe}
                      onChange={(e) => setFormData({ ...formData, groupe: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] focus:ring-2 focus:ring-[#C41E1E]/20"
                      placeholder="Ex: G1"
                    />
                    {errors.groupe && (
                      <span className="text-[#C41E1E] text-xs font-body mt-1">{errors.groupe}</span>
                    )}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-[#4A4A4A] mb-1">
                      Filière
                    </label>
                    <select
                      value={formData.filiere}
                      onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] focus:ring-2 focus:ring-[#C41E1E]/20 bg-white"
                    >
                      {filieres.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-[#4A4A4A] mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] focus:ring-2 focus:ring-[#C41E1E]/20"
                      placeholder="+212 6XX-XXXXXX"
                    />
                    {errors.telephone && (
                      <span className="text-[#C41E1E] text-xs font-body mt-1">{errors.telephone}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-[#E8E2D9] text-[#4A4A4A] font-body font-medium rounded-xl hover:bg-[#F5EFE6] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-[#C41E1E] text-white font-body font-semibold rounded-xl hover:bg-[#A31818] transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
