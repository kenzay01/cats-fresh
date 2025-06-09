"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/types/product";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  DollarSign,
  Package,
  // FileText,
  Save,
  Edit,
  ArrowBigLeft,
  // Plus,
  // Trash2,
  Globe,
} from "lucide-react";
import Link from "next/link";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  // const [isNewProduct, setIsNewProduct] = useState(false);
  const isSaved = useRef(false);

  const adminUsername = process.env.NEXT_PUBLIC_ADMIN_LOGIN;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const [tempData, setTempData] = useState<Product>({
    id: "",
    name: { uk: "", ru: "" },
    description: { uk: "", ru: "" },
    price: { single: 0, from_6: 0 },
  });

  // Завантажити товари з API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        if (data.products?.length > 0 && !selectedProduct) {
          setSelectedProduct(data.products[0]);
          setTempData(data.products[0]);
        }
      }
    } catch (error) {
      console.error("Помилка завантаження товарів:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, isSaved.current]);

  const handleLogin = () => {
    if (
      loginData.username === adminUsername &&
      loginData.password === adminPassword
    ) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Невірний логін або пароль");
    }
  };

  const handleEdit = () => {
    if (isEditing && selectedProduct) {
      setTempData({ ...selectedProduct });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      // let response;
      // if (isNewProduct) {
      //   response = await fetch("/api/products", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(tempData),
      //   });
      // } else {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempData),
      });
      // }

      if (response.ok) {
        const updatedProducts = products.map((p) =>
          p.id === tempData.id ? tempData : p
        );
        setProducts(updatedProducts);
        setSelectedProduct(tempData);
        setIsEditing(false);
        isSaved.current = true;
        alert("Зміни збережено успішно!");
      } else {
        const error = await response.json();
        alert(`Помилка: ${error.error}`);
      }
    } catch (error) {
      alert("Помилка збереження");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleProductSelect = (product: Product) => {
  //   setSelectedProduct(product);
  //   setTempData(product);
  //   setIsEditing(false);
  // };

  // const handleAddProduct = () => {
  //   const newProduct: Product = {
  //     id: `product-${Date.now()}`,
  //     name: { uk: "Новий товар", ru: "Новый товар" },
  //     description: { uk: "Опис товару", ru: "Описание товара" },
  //     price: { single: 0, from_6: 0 },
  //   };
  //   isSaved.current = false;
  //   setIsNewProduct(true);
  //   setSelectedProduct(newProduct);
  //   setTempData(newProduct);
  //   setIsEditing(true);
  // };

  // const handleDeleteProduct = async (productId: string) => {
  //   if (!confirm("Ви впевнені, що хочете видалити цей товар?")) return;

  //   try {
  //     setLoading(true);
  //     const response = await fetch("/api/products", {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id: productId }),
  //     });

  //     if (response.ok) {
  //       const updatedProducts = products.filter((p) => p.id !== productId);
  //       setProducts(updatedProducts);
  //       if (selectedProduct?.id === productId) {
  //         setSelectedProduct(updatedProducts[0] || null);
  //         setTempData(
  //           updatedProducts[0] || {
  //             id: "",
  //             name: { uk: "", ru: "" },
  //             description: { uk: "", ru: "" },
  //             price: { single: 0, box: 0 },
  //           }
  //         );
  //       }
  //       alert("Товар видалено!");
  //     }
  //   } catch (error) {
  //     alert("Помилка видалення");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: "", password: "" });
    setProducts([]);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <Link
          href="/"
          className="absolute top-12 left-12 bg-[var(--color-forest-green)] text-[var(--color-cream)] font-semibold py-4 px-8 rounded-xl flex items-center space-x-2 shadow-lg"
        >
          <ArrowBigLeft className="w-5 h-5" />
          <span>На головну</span>
        </Link>
        <div className="bg-[var(--color-forest-green)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--color-cream)]/20 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-[var(--color-burnt-orange)]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[var(--color-burnt-orange)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-cream)] mb-2">
              Адмін-панель
            </h1>
            <p className="text-[var(--color-cream)]/70">
              Введіть дані для входу
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-cream)]/50" />
              <input
                type="text"
                placeholder="Логін"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-cream)]/10 border border-[var(--color-cream)]/20 rounded-xl text-[var(--color-cream)] placeholder-[var(--color-cream)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-burnt-orange)] focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-cream)]/50" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full pl-12 pr-12 py-3 bg-[var(--color-cream)]/10 border border-[var(--color-cream)]/20 rounded-xl text-[var(--color-cream)] placeholder-[var(--color-cream)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-burnt-orange)] focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-cream)]/50 hover:text-[var(--color-cream)] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {loginError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[var(--color-burnt-orange)] hover:from-[var(--color-forest-green)]/90 hover:to-[var(--color-burnt-orange)]/90 text-[var(--color-cream)] font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Увійти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-lime-green)]">
      {/* Header */}
      <div className="bg-[var(--color-cream)] shadow-lg border-b border-[var(--color-lime-green)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--color-forest-green)] w-10 h-10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[var(--color-cream)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-forest-green)]">
                  Адмін-панель
                </h1>
                <p className="text-sm text-[var(--color-forest-green)]/70">
                  Управління товарами
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[var(--color-burnt-orange)] hover:bg-[var(--color-burnt-orange)]/90 text-[var(--color-cream)] px-4 py-2 rounded-lg transition-colors"
            >
              Вийти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Список товарів */}
        {/* <div className="mb-8 bg-[var(--color-cream)] rounded-2xl shadow-lg border border-[var(--color-lime-green)]/20 overflow-hidden">
          <div className="bg-[var(--color-forest-green)] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-[var(--color-cream)]" />
              <h2 className="text-xl font-semibold text-[var(--color-cream)]">
                Список товарів
              </h2>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-[var(--color-burnt-orange)] hover:bg-[var(--color-burnt-orange)]/90 text-[var(--color-cream)] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Додати товар</span>
            </button>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center py-4">Завантаження...</p>
            ) : products.length === 0 ? (
              <p className="text-center py-4 text-[var(--color-forest-green)]/70">
                Товарів не знайдено. Додайте перший товар!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? "border-[var(--color-forest-green)] bg-[var(--color-forest-green)]/5"
                        : "border-[var(--color-lime-green)]/30 hover:border-[var(--color-forest-green)]/50"
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-[var(--color-forest-green)]">
                        {product.name.uk}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--color-forest-green)]/70 mb-2">
                      {product.name.ru}
                    </p>
                    <div className="text-sm">
                      <span className="font-medium">
                        {product.price.single} грн
                      </span>
                      <span className="text-[var(--color-forest-green)]/70">
                        {" "}
                        / штука
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}

        {selectedProduct && (
          <div className="relative">
            {!isEditing && (
              <div className="absolute z-10 w-full h-full bg-black/30 rounded-2xl border-4 flex justify-center items-center">
                <button
                  onClick={handleEdit}
                  className="bg-[var(--color-forest-green)] text-[var(--color-cream)] font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-xl"
                >
                  <Edit className="w-5 h-5" />
                  <span>Редагувати</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Управління цінами */}
              <div className="bg-[var(--color-cream)] rounded-2xl shadow-lg border border-[var(--color-lime-green)]/20 overflow-hidden">
                <div className="bg-[var(--color-forest-green)] px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-[var(--color-cream)]" />
                    <h2 className="text-xl font-semibold text-[var(--color-cream)]">
                      Управління цінами
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      ID товару
                    </label>
                    <input
                      type="text"
                      value={tempData.id}
                      onChange={(e) =>
                        setTempData({ ...tempData, id: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all"
                      placeholder="product-id"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      Ціна за 1 штуку (грн)
                    </label>
                    <input
                      type="number"
                      value={tempData.price.single}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          price: {
                            ...tempData.price,
                            single: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      Ціна за від 6 шт (грн)
                    </label>
                    <input
                      type="number"
                      value={tempData.price.from_6}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          price: {
                            ...tempData.price,
                            from_6: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="bg-[var(--color-lime-green)]/10 rounded-xl p-4">
                    <p className="text-sm text-[var(--color-forest-green)]">
                      <strong>Економія при покупці ящика:</strong>{" "}
                      {(tempData.price.single - tempData.price.from_6).toFixed(
                        2
                      )}{" "}
                      грн
                    </p>
                    <p className="text-sm text-[var(--color-forest-green)] mt-1">
                      <strong>Знижка:</strong>{" "}
                      {(
                        ((tempData.price.single - tempData.price.from_6) /
                          tempData.price.single) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* Управління контентом */}
              <div className="bg-[var(--color-cream)] rounded-2xl shadow-lg border border-[var(--color-lime-green)]/20 overflow-hidden">
                <div className="bg-[var(--color-forest-green)] px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-[var(--color-cream)]" />
                    <h2 className="text-xl font-semibold text-[var(--color-cream)]">
                      Управління контентом
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Назва українською */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      Назва (українська)
                    </label>
                    <input
                      type="text"
                      value={tempData.name.uk}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          name: { ...tempData.name, uk: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all"
                      placeholder="Назва товару українською"
                    />
                  </div>

                  {/* Назва російською */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      Назва (російська)
                    </label>
                    <input
                      type="text"
                      value={tempData.name.ru}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          name: { ...tempData.name, ru: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all"
                      placeholder="Назва товару російською"
                    />
                  </div>

                  {/* Опис українською */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      Опис (українська)
                    </label>
                    <textarea
                      value={tempData.description.uk}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          description: {
                            ...tempData.description,
                            uk: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all resize-none"
                      placeholder="Опис товару українською"
                    />
                  </div>

                  {/* Опис російською */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-forest-green)] mb-2">
                      Опис (російська)
                    </label>
                    <textarea
                      value={tempData.description.ru}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          description: {
                            ...tempData.description,
                            ru: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-[var(--color-lime-green)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent transition-all resize-none"
                      placeholder="Опис товару російською"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопка збереження */}
            {isEditing && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[var(--color-forest-green)] text-[var(--color-cream)] font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? "Збереження..." : "Зберегти зміни"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
