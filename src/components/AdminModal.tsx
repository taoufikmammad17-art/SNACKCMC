import { useState, useEffect } from 'react';
import { X, Package, ClipboardList, BarChart3, Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { products as initialProducts, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import type { Product, Order } from '@/data/products';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'products' | 'orders' | 'stats';

const ADMIN_PASSWORD = 'admin123';

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [productList, setProductList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('adminProducts');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const { orders, updateOrderStatus } = useCart();

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Sandwichs',
    description: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    const saved = sessionStorage.getItem('adminAuth');
    if (saved === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('adminProducts', JSON.stringify(productList));
  }, [productList]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
    onClose();
  };

  const resetForm = () => {
    setProductForm({ name: '', category: 'Sandwichs', description: '', price: '', image: '' });
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    resetForm();
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productForm.name,
                category: productForm.category,
                description: productForm.description,
                price: Number(productForm.price),
                image: productForm.image || p.image,
              }
            : p
        )
      );
    } else {
      const newId = Math.max(...productList.map((p) => p.id), 0) + 1;
      setProductList((prev) => [
        ...prev,
        {
          id: newId,
          name: productForm.name,
          category: productForm.category,
          description: productForm.description,
          price: Number(productForm.price),
          image: productForm.image || '/images/hero-food-1.jpg',
        },
      ]);
    }

    setShowProductForm(false);
    resetForm();
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  // Stats
  const todayOrders = orders.length;
  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const productCount = productList.length;
  const clientsServed = new Set(orders.map((o) => o.clientName)).size;

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const weekData = [3, 5, 8, 6, 12, 4, 2];
  const maxWeek = Math.max(...weekData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[900px] h-[80vh] shadow-2xl overflow-hidden flex flex-col">
        {!authenticated ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-[320px] w-full">
              <div className="w-16 h-16 rounded-full bg-[#FDE8E8] flex items-center justify-center mx-auto mb-6">
                <Package size={28} className="text-[#C41E1E]" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1A1A1A] text-center">
                Espace Administrateur
              </h3>
              <p className="font-body text-sm text-[#7A7A7A] text-center mt-2">
                Entrez le mot de passe pour accéder au tableau de bord
              </p>
              <div className="mt-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] focus:ring-2 focus:ring-[#C41E1E]/20"
                  placeholder="Mot de passe"
                />
                {passwordError && (
                  <p className="text-[#C41E1E] text-xs font-body mt-2">{passwordError}</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full mt-4 py-3 bg-[#C41E1E] text-white font-body font-semibold rounded-xl hover:bg-[#A31818] transition-colors"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E8E2D9]">
              <h2 className="font-display text-xl font-semibold text-[#1A1A1A]">
                Tableau de bord
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-body text-[#7A7A7A] hover:text-[#C41E1E] transition-colors"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#F5EFE6] transition-colors"
                >
                  <X size={20} className="text-[#4A4A4A]" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-[200px] border-r border-[#E8E2D9] bg-[#FAF8F5] flex-shrink-0 hidden sm:block">
                <div className="p-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-body">
                    Menu
                  </span>
                  <div className="mt-3 space-y-1">
                    {([
                      { id: 'products', label: 'Produits', icon: Package },
                      { id: 'orders', label: 'Commandes', icon: ClipboardList },
                      { id: 'stats', label: 'Statistiques', icon: BarChart3 },
                    ] as const).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-all ${
                          activeTab === tab.id
                            ? 'bg-[#FDE8E8] text-[#C41E1E] border-l-[3px] border-[#C41E1E]'
                            : 'text-[#4A4A4A] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="sm:hidden flex border-b border-[#E8E2D9] w-full">
                {([
                  { id: 'products', label: 'Produits', icon: Package },
                  { id: 'orders', label: 'Commandes', icon: ClipboardList },
                  { id: 'stats', label: 'Stats', icon: BarChart3 },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 font-body text-xs transition-all ${
                      activeTab === tab.id
                        ? 'text-[#C41E1E] border-b-2 border-[#C41E1E]'
                        : 'text-[#4A4A4A]'
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'products' && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-body text-lg font-semibold text-[#1A1A1A]">
                        Gérer les Produits
                      </h3>
                      <button
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C41E1E] text-white font-body text-sm font-medium rounded-lg hover:bg-[#A31818] transition-colors"
                      >
                        <Plus size={16} />
                        Ajouter
                      </button>
                    </div>

                    {showProductForm && (
                      <div className="bg-[#FAF8F5] rounded-xl p-4 mb-5 border border-[#E8E2D9]">
                        <h4 className="font-body font-semibold text-[#1A1A1A] mb-3">
                          {editingProduct ? 'Modifier' : 'Nouveau'} produit
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Nom"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E]"
                          />
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] bg-white"
                          >
                            {categories.filter((c) => c !== 'Tout').map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E]"
                          />
                          <input
                            type="number"
                            placeholder="Prix (MAD)"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E]"
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={productForm.image}
                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-[#E8E2D9] font-body text-sm focus:outline-none focus:border-[#C41E1E] sm:col-span-2"
                          />
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleSaveProduct}
                            className="px-4 py-2 bg-[#C41E1E] text-white font-body text-sm rounded-lg hover:bg-[#A31818] transition-colors"
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={() => { setShowProductForm(false); resetForm(); }}
                            className="px-4 py-2 border border-[#E8E2D9] text-[#4A4A4A] font-body text-sm rounded-lg hover:bg-[#F5EFE6] transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E8E2D9]">
                            <th className="text-left font-body text-xs font-semibold text-[#7A7A7A] py-2 pr-4">Image</th>
                            <th className="text-left font-body text-xs font-semibold text-[#7A7A7A] py-2 pr-4">Nom</th>
                            <th className="text-left font-body text-xs font-semibold text-[#7A7A7A] py-2 pr-4">Catégorie</th>
                            <th className="text-left font-body text-xs font-semibold text-[#7A7A7A] py-2 pr-4">Prix</th>
                            <th className="text-right font-body text-xs font-semibold text-[#7A7A7A] py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productList.map((product) => (
                            <tr key={product.id} className="border-b border-[#F5EFE6]">
                              <td className="py-3 pr-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              </td>
                              <td className="py-3 pr-4 font-body text-sm text-[#1A1A1A]">{product.name}</td>
                              <td className="py-3 pr-4">
                                <span className="px-2 py-1 bg-[#FDE8E8] text-[#C41E1E] text-[10px] font-semibold rounded-full">
                                  {product.category}
                                </span>
                              </td>
                              <td className="py-3 pr-4 font-body text-sm font-semibold text-[#C41E1E]">
                                {product.price} MAD
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-1.5 text-[#7A7A7A] hover:text-[#C41E1E] transition-colors"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1.5 text-[#7A7A7A] hover:text-[#C41E1E] transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h3 className="font-body text-lg font-semibold text-[#1A1A1A] mb-5">
                      Commandes reçues
                    </h3>
                    {orders.length === 0 ? (
                      <p className="font-body text-sm text-[#7A7A7A] text-center py-10">
                        Aucune commande pour le moment.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E2D9]"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-body text-sm font-semibold text-[#1A1A1A]">
                                  Commande #{order.id}
                                </span>
                                <p className="font-body text-xs text-[#7A7A7A] mt-0.5">
                                  {order.clientName} — {order.filiere} — {order.phone}
                                </p>
                              </div>
                              <span className="font-body text-lg font-bold text-[#C41E1E]">
                                {order.total} MAD
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-body text-xs text-[#7A7A7A]">
                                {order.items.length} article(s) — {order.time}
                              </span>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                className={`px-3 py-1 rounded-full font-body text-xs font-medium border ${
                                  order.status === 'pending'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : order.status === 'ready'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }`}
                              >
                                <option value="pending">En attente</option>
                                <option value="ready">Prête</option>
                                <option value="delivered">Livrée</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div>
                    <h3 className="font-body text-lg font-semibold text-[#1A1A1A] mb-5">
                      Statistiques
                    </h3>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: "Commandes aujourd'hui", value: todayOrders, color: '#C41E1E' },
                        { label: "Revenus aujourd'hui", value: `${todayRevenue} MAD`, color: '#2D8A4E' },
                        { label: 'Produits en stock', value: productCount, color: '#D4A017' },
                        { label: 'Clients servis', value: clientsServed || 0, color: '#4A4A4A' },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E2D9]"
                        >
                          <p className="font-body text-xs text-[#7A7A7A]">{stat.label}</p>
                          <p className="font-body text-2xl font-bold mt-1" style={{ color: stat.color }}>
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Weekly Chart */}
                    <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E8E2D9]">
                      <h4 className="font-body text-sm font-semibold text-[#1A1A1A] mb-4">
                        Commandes cette semaine
                      </h4>
                      <div className="flex items-end gap-3 h-[120px]">
                        {weekData.map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-[#C41E1E] rounded-t-md transition-all duration-500"
                              style={{ height: `${(val / maxWeek) * 80}px`, opacity: 0.6 + (i / weekDays.length) * 0.4 }}
                            />
                            <span className="font-body text-[10px] text-[#7A7A7A]">{weekDays[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
