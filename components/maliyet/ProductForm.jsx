'use client'
import { useState, useEffect } from 'react'
import { formatCurrency, calculateFullCost } from '@/lib/maliyet/calculations'

const YIELD_UNITS = ['adet', 'porsiyon', 'dilim', 'bardak', 'tabak', 'kişilik']

export default function ProductForm({ onSave, onCancel, editingProduct, materials, categories, onAddCategory, settings }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [sellingPrice, setSellingPrice] = useState('')
  const [yieldAmount, setYieldAmount] = useState('')
  const [yieldUnit, setYieldUnit] = useState('adet')
  const [productMaterials, setProductMaterials] = useState([])
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [wasteRate, setWasteRate] = useState('')
  const [extraCosts, setExtraCosts] = useState('')
  const [vatRate, setVatRate] = useState('')

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name)
      setDescription(editingProduct.description || '')
      setCategory(editingProduct.category || '')
      setSellingPrice(editingProduct.sellingPrice.toString())
      setYieldAmount(editingProduct.yield ? editingProduct.yield.toString() : '')
      setYieldUnit(editingProduct.yieldUnit || 'adet')
      setProductMaterials(editingProduct.materials)
      setWasteRate(editingProduct.wasteRate != null ? editingProduct.wasteRate.toString() : '')
      setExtraCosts(editingProduct.extraCosts != null ? editingProduct.extraCosts.toString() : '')
      setVatRate(editingProduct.vatRate != null ? editingProduct.vatRate.toString() : '')
    }
  }, [editingProduct])

  const rawCost = productMaterials.reduce((sum, pm) => {
    const mat = materials.find(m => m.id === pm.materialId)
    return sum + (mat ? mat.unitPrice * pm.quantity : 0)
  }, 0)

  const effectiveWaste = wasteRate !== '' ? parseFloat(wasteRate) || 0 : (settings?.defaultWasteRate || 0)
  const effectiveExtra = extraCosts !== '' ? parseFloat(extraCosts) || 0 : (settings?.defaultExtraCosts || 0)
  const effectiveVat = vatRate !== '' ? parseFloat(vatRate) || 0 : (settings?.defaultVatRate || 0)

  const costBreakdown = calculateFullCost(rawCost, effectiveWaste, effectiveExtra, effectiveVat)
  const totalCost = costBreakdown.totalCost

  const yieldNum = parseFloat(yieldAmount) || 0
  const unitCost = yieldNum > 0 ? totalCost / yieldNum : totalCost
  const unitSellingPrice = yieldNum > 0 && sellingPrice ? parseFloat(sellingPrice) / yieldNum : parseFloat(sellingPrice) || 0

  const handleAddMaterial = () => {
    if (!selectedMaterialId || !quantity || parseFloat(quantity) <= 0) return
    const exists = productMaterials.find(pm => pm.materialId === selectedMaterialId)
    if (exists) {
      setProductMaterials(productMaterials.map(pm =>
        pm.materialId === selectedMaterialId ? { ...pm, quantity: pm.quantity + parseFloat(quantity) } : pm
      ))
    } else {
      setProductMaterials([...productMaterials, { materialId: selectedMaterialId, quantity: parseFloat(quantity) }])
    }
    setSelectedMaterialId(''); setQuantity('')
  }

  const handleRemoveMaterial = (materialId) => {
    setProductMaterials(productMaterials.filter(pm => pm.materialId !== materialId))
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim())
      setCategory(newCategory.trim())
      setNewCategory('')
      setShowNewCategory(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !sellingPrice || productMaterials.length === 0) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      sellingPrice: parseFloat(sellingPrice),
      yield: yieldNum || null,
      yieldUnit: yieldNum > 0 ? yieldUnit : null,
      materials: productMaterials,
      wasteRate: wasteRate !== '' ? parseFloat(wasteRate) || 0 : null,
      extraCosts: extraCosts !== '' ? parseFloat(extraCosts) || 0 : null,
      vatRate: vatRate !== '' ? parseFloat(vatRate) || 0 : null,
    })
  }

  const availableMaterials = materials.filter(m => !productMaterials.find(pm => pm.materialId === m.id))
  const productCategories = categories?.products || []

  const inputCls = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Oluştur'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Adı</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Ekmek, Börek..." className={inputCls} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Kısa açıklama (opsiyonel)" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
          {showNewCategory ? (
            <div className="flex gap-1">
              <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Yeni kategori..." autoFocus
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())} />
              <button type="button" onClick={handleAddNewCategory} className="px-2 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </button>
              <button type="button" onClick={() => setShowNewCategory(false)} className="px-2 py-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-1">
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Kategori yok</option>
                {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" onClick={() => setShowNewCategory(true)}
                className="px-2 py-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg" title="Yeni kategori">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reçete Miktarı</label>
          <div className="flex gap-1">
            <input type="number" step="1" min="0" value={yieldAmount} onChange={e => setYieldAmount(e.target.value)} placeholder="Kaç adet?"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            <select value={yieldUnit} onChange={e => setYieldUnit(e.target.value)}
              className="w-24 px-2 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
              {YIELD_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Material selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Malzemeler</label>
        {materials.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">Önce malzeme eklemeniz gerekiyor.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <select value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)} className={`flex-1 ${inputCls}`}>
              <option value="">Malzeme seçin...</option>
              {availableMaterials.map(m => <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.unitPrice)}/{m.unit})</option>)}
            </select>
            <input type="number" step="0.01" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Miktar"
              className="w-full sm:w-28 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            <button type="button" onClick={handleAddMaterial} disabled={!selectedMaterialId || !quantity}
              className="px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
              Ekle
            </button>
          </div>
        )}

        {productMaterials.length > 0 && (
          <div className="mt-3 space-y-2">
            {productMaterials.map(pm => {
              const mat = materials.find(m => m.id === pm.materialId)
              if (!mat) return null
              const cost = mat.unitPrice * pm.quantity
              return (
                <div key={pm.materialId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{mat.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{pm.quantity} {mat.unit} x {formatCurrency(mat.unitPrice)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(cost)}</span>
                    <button type="button" onClick={() => handleRemoveMaterial(pm.materialId)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              )
            })}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Hammadde Maliyeti</span>
              <span className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(rawCost)}</span>
            </div>
            {yieldNum > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">1 {yieldUnit} başına maliyet</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(unitCost)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Maliyet Ayarları */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maliyet Ayarları</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Boş bırakırsanız Ayarlar sayfasındaki varsayılan değerler uygulanır.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fire Oranı (%)</label>
            <input type="number" step="0.1" min="0" max="100" value={wasteRate} onChange={e => setWasteRate(e.target.value)}
              placeholder={`Varsayılan: %${settings?.defaultWasteRate || 0}`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ek Giderler (₺)</label>
            <input type="number" step="0.01" min="0" value={extraCosts} onChange={e => setExtraCosts(e.target.value)}
              placeholder={`Varsayılan: ${formatCurrency(settings?.defaultExtraCosts || 0)}`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">KDV Oranı (%)</label>
            <input type="number" step="1" min="0" max="100" value={vatRate} onChange={e => setVatRate(e.target.value)}
              placeholder={`Varsayılan: %${settings?.defaultVatRate || 0}`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Selling price */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Satış Fiyatı (TL)</label>
        <input type="number" step="0.01" min="0" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} placeholder="0.00"
          className={inputCls} required />
        {yieldNum > 0 && sellingPrice && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 {yieldUnit} = {formatCurrency(unitSellingPrice)}</p>
        )}
      </div>

      {/* Cost breakdown + Profit preview */}
      {sellingPrice && rawCost > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Hammadde Maliyeti</span>
              <span className="text-gray-700 dark:text-gray-300">{formatCurrency(costBreakdown.rawCost)}</span>
            </div>
            {costBreakdown.wasteCost > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Fire Maliyeti (%{effectiveWaste})</span>
                <span className="text-gray-700 dark:text-gray-300">{formatCurrency(costBreakdown.wasteCost)}</span>
              </div>
            )}
            {costBreakdown.extraCosts > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Ek Giderler</span>
                <span className="text-gray-700 dark:text-gray-300">{formatCurrency(costBreakdown.extraCosts)}</span>
              </div>
            )}
            {costBreakdown.vat > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">KDV (%{effectiveVat})</span>
                <span className="text-gray-700 dark:text-gray-300">{formatCurrency(costBreakdown.vat)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1.5 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">Toplam Maliyet</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalCost)}</span>
            </div>
          </div>
          <div className={`p-3 ${parseFloat(sellingPrice) >= totalCost ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Kar Tutarı</span>
              <span className={`font-semibold ${parseFloat(sellingPrice) >= totalCost ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {formatCurrency(parseFloat(sellingPrice) - totalCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Kar Yüzdesi</span>
              <span className={`font-semibold ${parseFloat(sellingPrice) >= totalCost ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                %{totalCost > 0 ? (((parseFloat(sellingPrice) - totalCost) / totalCost) * 100).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">İptal</button>
        )}
        <button type="submit" disabled={productMaterials.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
          {editingProduct ? 'Güncelle' : 'Oluştur'}
        </button>
      </div>
    </form>
  )
}
