'use client'
import { useState } from 'react'
import ProductForm from '@/components/maliyet/ProductForm'
import { generateId, formatCurrency, calculateProductCost, calculateProfitPercentage, calculateUnitCost, getProductCostParams, calculateFullCost } from '@/lib/maliyet/calculations'
import { syncMaliyetToMenu } from '@/lib/maliyet/menuSync'

export default function ProductList({ products, setProducts, materials, categories, setCategories, settings, onViewProduct, menuItems = [] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedImports, setSelectedImports] = useState([])

  const filteredProducts = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchName && matchCat
  })

  const handleAddCategory = (name) => {
    if (!categories.products.includes(name)) {
      setCategories({ ...categories, products: [...categories.products, name] })
    }
  }

  const handleSave = (data) => {
    let updatedProducts
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...data } : p)
      setEditingProduct(null)
    } else {
      updatedProducts = [...products, { ...data, id: generateId(), createdAt: new Date().toISOString() }]
    }
    setProducts(updatedProducts)
    // Maliyet → Menü senkronizasyonu
    syncMaliyetToMenu(updatedProducts)
    setShowForm(false)
  }

  // Menüden seçilen ürünleri maliyet'e aktar
  const handleImportFromMenu = () => {
    if (selectedImports.length === 0) return
    const newProducts = selectedImports.map(menuItem => ({
      id: generateId(),
      name: menuItem.name,
      description: menuItem.description || '',
      category: menuItem.categoryName,
      sellingPrice: menuItem.price,
      yield: null,
      yieldUnit: null,
      materials: [],
      wasteRate: null,
      extraCosts: null,
      vatRate: null,
      menuItemId: menuItem.id,
      createdAt: new Date().toISOString(),
    }))
    // Kategorileri de ekle
    const existingCats = categories?.products || []
    const newCats = [...new Set(selectedImports.map(m => m.categoryName).filter(c => c && !existingCats.includes(c)))]
    if (newCats.length > 0) {
      setCategories({ ...categories, products: [...existingCats, ...newCats] })
    }
    setProducts([...products, ...newProducts])
    setSelectedImports([])
    setShowImportModal(false)
  }

  const toggleImportSelection = (menuItem) => {
    setSelectedImports(prev =>
      prev.find(m => m.id === menuItem.id)
        ? prev.filter(m => m.id !== menuItem.id)
        : [...prev, menuItem]
    )
  }

  const handleDuplicate = (product) => {
    const copy = {
      ...product,
      id: generateId(),
      name: product.name + ' (Kopya)',
      materials: [...product.materials],
      createdAt: new Date().toISOString(),
    }
    setProducts([...products, copy])
  }

  const handleEdit = (product) => { setEditingProduct(product); setShowForm(true) }
  const handleDelete = (id) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }
  const handleCancel = () => { setShowForm(false); setEditingProduct(null) }

  const productCategories = categories?.products || []
  const targetMargin = settings?.targetProfitMargin || 0

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 gap-2 max-w-lg">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text" placeholder="Ürün ara..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          {productCategories.length > 0 && (
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Tüm Kategoriler</option>
              {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>
        <div className="flex gap-2">
          {menuItems.length > 0 && (
            <button onClick={() => { setShowImportModal(true); setSelectedImports([]) }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
              Menüden İçe Aktar
            </button>
          )}
          <button onClick={() => { setShowForm(true); setEditingProduct(null) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Ürün Oluştur
          </button>
        </div>
      </div>

      {showForm && (
        <ProductForm onSave={handleSave} onCancel={handleCancel} editingProduct={editingProduct}
          materials={materials} categories={categories} onAddCategory={handleAddCategory} settings={settings}
          menuItems={menuItems} linkedMenuItemIds={products.filter(p => p.menuItemId).map(p => p.menuItemId)} />
      )}

      {/* Menüden İçe Aktar Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Menüden İçe Aktar</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {(() => {
                const linkedIds = new Set(products.filter(p => p.menuItemId).map(p => p.menuItemId))
                const availableItems = menuItems.filter(m => !linkedIds.has(m.id))
                if (availableItems.length === 0) {
                  return <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Tüm menü ürünleri zaten bağlı.</p>
                }
                // Kategoriye göre grupla
                const grouped = {}
                for (const item of availableItems) {
                  const cat = item.categoryName || 'Diğer'
                  if (!grouped[cat]) grouped[cat] = []
                  grouped[cat].push(item)
                }
                return Object.entries(grouped).map(([catName, items]) => (
                  <div key={catName}>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{catName}</h4>
                    {items.map(item => {
                      const isSelected = selectedImports.find(m => m.id === item.id)
                      return (
                        <button key={item.id} type="button" onClick={() => toggleImportSelection(item)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-gray-50 dark:bg-gray-800 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                ))
              })()}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{selectedImports.length} ürün seçildi</span>
              <button onClick={handleImportFromMenu} disabled={selectedImports.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
                İçe Aktar
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {search || filterCategory ? 'Aramanızla eşleşen ürün bulunamadı.' : 'Henüz ürün oluşturulmamış. İlk ürününüzü oluşturun!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            const rawCost = calculateProductCost(product, materials)
            const params = getProductCostParams(product, settings)
            const costBreakdown = calculateFullCost(rawCost, params.wasteRate, params.extraCosts, params.vatRate)
            const totalCost = costBreakdown.totalCost
            const profit = product.sellingPrice - totalCost
            const profitPct = calculateProfitPercentage(product.sellingPrice, totalCost)
            const isProfit = profit >= 0
            const belowTarget = targetMargin > 0 && profitPct < targetMargin
            const unitCost = product.yield ? calculateUnitCost(totalCost, product.yield) : null

            return (
              <div key={product.id} className={`bg-white dark:bg-gray-900 rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${
                belowTarget ? 'border-amber-300 dark:border-amber-700' : 'border-gray-200 dark:border-gray-800'
              }`}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      {product.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.description}</p>}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.category && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">{product.category}</span>
                        )}
                        {product.menuItemId && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">Menü</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${
                        isProfit ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>%{profitPct.toFixed(1)}</span>
                      {belowTarget && (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                          Hedef altı
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Maliyet</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(totalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Satış Fiyatı</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(product.sellingPrice)}</span>
                    </div>
                    {unitCost !== null && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 dark:text-gray-500">1 {product.yieldUnit} maliyet</span>
                        <span className="text-gray-500 dark:text-gray-400">{formatCurrency(unitCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Kar</span>
                      <span className={`font-bold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => onViewProduct(product.id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">Detay</button>
                    <button onClick={() => handleDuplicate(product)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors">Kopyala</button>
                    <button onClick={() => handleEdit(product)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Düzenle</button>
                    <button onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors">Sil</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
