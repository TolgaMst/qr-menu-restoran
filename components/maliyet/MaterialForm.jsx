'use client'
import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/maliyet/calculations'

const UNITS = ['kg', 'g', 'lt', 'ml', 'adet', 'paket', 'kutu', 'porsiyon']

export default function MaterialForm({ onSave, onCancel, editingMaterial, categories, onAddCategory }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('kg')
  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [priceMode, setPriceMode] = useState('unit')
  const [unitPrice, setUnitPrice] = useState('')
  const [bulkQuantity, setBulkQuantity] = useState('')
  const [bulkPrice, setBulkPrice] = useState('')

  useEffect(() => {
    if (editingMaterial) {
      setName(editingMaterial.name)
      setUnit(editingMaterial.unit)
      setCategory(editingMaterial.category || '')
      setUnitPrice(editingMaterial.unitPrice.toString())
      setPriceMode('unit')
    }
  }, [editingMaterial])

  const calculatedUnitPrice = priceMode === 'bulk' && bulkQuantity && bulkPrice
    ? parseFloat(bulkPrice) / parseFloat(bulkQuantity)
    : null

  const finalUnitPrice = priceMode === 'unit'
    ? parseFloat(unitPrice) || 0
    : calculatedUnitPrice || 0

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
    if (!name.trim() || finalUnitPrice <= 0) return
    onSave({
      name: name.trim(),
      unit,
      category,
      unitPrice: parseFloat(finalUnitPrice.toFixed(4)),
    })
    setName(''); setUnit('kg'); setCategory(''); setUnitPrice('')
    setBulkQuantity(''); setBulkPrice(''); setPriceMode('unit')
  }

  const materialCategories = categories?.materials || []

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {editingMaterial ? 'Malzeme Düzenle' : 'Yeni Malzeme Ekle'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Malzeme Adı</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Örn: Un, Şeker, Yağ..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birim</label>
          <select value={unit} onChange={e => setUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
          {showNewCategory ? (
            <div className="flex gap-1">
              <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                placeholder="Yeni kategori..." autoFocus
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())} />
              <button type="button" onClick={handleAddNewCategory}
                className="px-2 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </button>
              <button type="button" onClick={() => setShowNewCategory(false)}
                className="px-2 py-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-1">
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Kategori yok</option>
                {materialCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" onClick={() => setShowNewCategory(true)}
                className="px-2 py-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg" title="Yeni kategori">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fiyat Giriş Şekli</label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
            <button type="button" onClick={() => setPriceMode('unit')}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${priceMode === 'unit' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              Birim Fiyatı
            </button>
            <button type="button" onClick={() => setPriceMode('bulk')}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${priceMode === 'bulk' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              Toptan Fiyat
            </button>
          </div>
        </div>
      </div>

      {priceMode === 'unit' ? (
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">1 {unit} Fiyatı (TL)</label>
          <input type="number" step="0.01" min="0" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            required={priceMode === 'unit'} />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aldığınız Miktar ({unit})</label>
              <input type="number" step="0.01" min="0" value={bulkQuantity} onChange={e => setBulkQuantity(e.target.value)} placeholder="Örn: 18"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required={priceMode === 'bulk'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toplam Ödediğiniz Fiyat (TL)</label>
              <input type="number" step="0.01" min="0" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required={priceMode === 'bulk'} />
            </div>
          </div>
          {calculatedUnitPrice !== null && calculatedUnitPrice > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-400">Hesaplanan birim fiyat: <strong>1 {unit}</strong></span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(calculatedUnitPrice)}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            İptal
          </button>
        )}
        <button type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
          {editingMaterial ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  )
}
