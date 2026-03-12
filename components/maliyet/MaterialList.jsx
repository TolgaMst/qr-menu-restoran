'use client'
import { useState } from 'react'
import MaterialForm from '@/components/maliyet/MaterialForm'
import PriceHistoryPanel from '@/components/maliyet/PriceHistoryPanel'
import { generateId, formatCurrency } from '@/lib/maliyet/calculations'

export default function MaterialList({ materials, setMaterials, products, categories, setCategories }) {
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [historyMaterial, setHistoryMaterial] = useState(null)

  const filteredMaterials = materials.filter(m => {
    const matchName = m.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategory || m.category === filterCategory
    return matchName && matchCat
  })

  const handleAddCategory = (name) => {
    if (!categories.materials.includes(name)) {
      setCategories({ ...categories, materials: [...categories.materials, name] })
    }
  }

  const handleSave = (data) => {
    if (editingMaterial) {
      const oldPrice = editingMaterial.unitPrice
      const newPrice = data.unitPrice
      let priceHistory = editingMaterial.priceHistory || []
      if (oldPrice !== newPrice) {
        priceHistory = [{ price: oldPrice, date: new Date().toISOString() }, ...priceHistory]
      }
      setMaterials(materials.map(m =>
        m.id === editingMaterial.id ? { ...m, ...data, priceHistory } : m
      ))
      setEditingMaterial(null)
    } else {
      setMaterials([...materials, { ...data, id: generateId(), priceHistory: [], createdAt: new Date().toISOString() }])
    }
    setShowForm(false)
  }

  const handleEdit = (material) => { setEditingMaterial(material); setShowForm(true) }

  const handleDelete = (id) => {
    const isUsed = products.some(p => p.materials.some(pm => pm.materialId === id))
    if (isUsed) { alert('Bu malzeme bir üründe kullanılıyor. Önce üründen çıkarmanız gerekiyor.'); return }
    if (confirm('Bu malzemeyi silmek istediğinize emin misiniz?')) {
      setMaterials(materials.filter(m => m.id !== id))
    }
  }

  const handleCancel = () => { setShowForm(false); setEditingMaterial(null) }
  const materialCategories = categories?.materials || []

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 gap-2 max-w-lg">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text" placeholder="Malzeme ara..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          {materialCategories.length > 0 && (
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="">Tüm Kategoriler</option>
              {materialCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>
        <button onClick={() => { setShowForm(true); setEditingMaterial(null) }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Malzeme Ekle
        </button>
      </div>

      {showForm && (
        <MaterialForm onSave={handleSave} onCancel={handleCancel} editingMaterial={editingMaterial}
          categories={categories} onAddCategory={handleAddCategory} />
      )}

      {historyMaterial && (
        <PriceHistoryPanel material={historyMaterial} onClose={() => setHistoryMaterial(null)} />
      )}

      {filteredMaterials.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {search || filterCategory ? 'Aramanızla eşleşen malzeme bulunamadı.' : 'Henüz malzeme eklenmemiş. İlk malzemenizi ekleyin!'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Malzeme Adı</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Kategori</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Birim</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Birim Fiyatı</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredMaterials.map(material => (
                  <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{material.name}</td>
                    <td className="px-5 py-3">
                      {material.category ? (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">{material.category}</span>
                      ) : <span className="text-xs text-gray-400">-</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">{material.unit}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(material.unitPrice)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setHistoryMaterial(material)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Fiyat Geçmişi">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        </button>
                        <button onClick={() => handleEdit(material)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Düzenle">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>
                        <button onClick={() => handleDelete(material.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Sil">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
