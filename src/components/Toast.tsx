import { useCart } from '@/context/CartContext';

export default function Toast() {
  const { toasts } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-6 py-3 bg-[#C41E1E] text-white font-body text-sm font-medium rounded-xl shadow-lg pointer-events-auto"
          style={{
            animation: 'toastIn 0.3s ease-out, toastOut 0.3s ease-in 1.7s forwards',
          }}
        >
          <style>{`
            @keyframes toastIn {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes toastOut {
              from { transform: translateY(0); opacity: 1; }
              to { transform: translateY(-20px); opacity: 0; }
            }
          `}</style>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
