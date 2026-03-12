'use client'
import { useState } from 'react'
import { formatCurrency, calculateProductCost, getProductCostParams, calculateFullCost, calculateProfitPercentage } from '@/lib/maliyet/calculations'

export default function PriceSimulation({ materials, products, settings }) {
  const [mode, setMode] = useState('single') // 'single' | 'all'
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [changePercent, setChangePercent] = useState('')

  const pct = parseFloat(changePercent) || 0

  // Create simulated materials array
  const simulatedMaterials = materials.map(m => {
    if (mode === 'all') {
      return { ...m, unitPrice: m.unitPrice * (1 + pct / 100) }
    }
    if (mode === 'single' && m.id === selectedMaterialId) {
      return { ...m, unitPrice: m.unitPrice * (1 + pct / 100) }
    }
    return m
  })

  const affectedProducts = products.filter(p => {
    if (mode === 'all') return true
    return p.materials.some(pm => pm.materialId === selectedMaterialId)
  })

  const results = affectedProducts.map(product => {
    const params = getProductCostParams(product, settings)

    const currentRaw = calculateProductCost(product, materials)
    const currentFull = calculateFullCost(currentRaw, params.wasteRate, params.extraCosts, params.vatRate)
    const currentProfit = product.sellingPrice - currentFull.totalCost
    const currentPct = calculateProfitPercentage(product.sellingPrice, currentFull.totalCost)

    const newRaw = calculateProductCost(product, simulatedMaterials)
    const newFull = calculateFullCost(newRaw, params.wasteRate, params.extraCosts, params.vatRate)
    const newProfit = product.sellingPrice - newFull.totalCost
    const newPct = calculateProfitPercentage(product.sellingPrice, newFull.totalCost)

    return {
      ...product,
      currentCost: currentFull.totalCost,
      newCost: newFull.totalCost,
      costDiff: newFull.totalCost - currentFull.totalCost,
      currentProfit,
      newProfit,
      profitDiff: newProfit - currentProfit,
      currentPct,
      newPct,
      pctDiff: newPct - currentPct,
    }
  })

  const hasResults = pct !== 0 && (mode === 'all' || selectedMaterialId)
  const selectedMaterial = materials.find(m => m.id === selectedMaterialId)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Fiyat Değişim Simülasyonu</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Malzeme fiyatları değişirse ürünleriniz nasıl etkilenir? Gerçek veriler değiştirilmez.
        </p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => { setMode('single'); setSelectedMaterialId('') }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'single' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            Tek Malzeme
          </button>
          <button onClick={() => setMode('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            Tüm Malzemeler
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {mode === 'single' && (
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Malzeme</label>
              <select value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Malzeme seçin...</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.unitPrice)}/{m.unit})</option>
                ))}
              </select>
            </div>
          )}
          <div className={mode === 'all' ? 'flex-1 max-w-xs' : 'w-full sm:w-48'}>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fiyat Değişimi (%)</label>
            <input type="number" step="1" value={changePercent} onChange={e => setChangePercent(e.target.value)}
              placeholder="Örn: 20 veya -10"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
        </div>

        {mode === 'single' && selectedMaterial && pct !== 0 && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>{selectedMaterial.name}</strong>: {formatCurrency(selectedMaterial.unitPrice)} → {formatCurrency(selectedMaterial.unitPrice * (1 + pct / 100))}
              <span className={`ml-2 font-medium ${pct > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ({pct > 0 ? '+' : ''}{pct}%)
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {hasResults && results.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Etkilenen Ürünler ({results.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Ürün</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Mevcut Maliyet</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Yeni Maliyet</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Mevcut Kar</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Yeni Kar</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Kar % Değişim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {results.map(r => {
                  const worse = r.profitDiff < 0
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{r.name}</td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(r.currentCost)}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(r.newCost)}</td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(r.currentProfit)}</td>
                      <td className={`px-5 py-3 text-right font-medium ${r.newProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(r.newProfit)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${worse ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                          %{r.currentPct.toFixed(1)} → %{r.newPct.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Summary */}
          <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Toplam Maliyet Farkı: </span>
                <span className={`font-bold ${results.reduce((s, r) => s + r.costDiff, 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formatCurrency(results.reduce((s, r) => s + r.costDiff, 0))}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Toplam Kar Farkı: </span>
                <span className={`font-bold ${results.reduce((s, r) => s + r.profitDiff, 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formatCurrency(results.reduce((s, r) => s + r.profitDiff, 0))}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Zarara düşen: </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {results.filter(r => r.newProfit < 0 && r.currentProfit >= 0).length} ürün
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasResults && results.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Bu malzemeyi kullanan ürün bulunamadı.</p>
        </div>
      )}

      {!hasResults && products.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {mode === 'single' ? 'Bir malzeme seçin ve fiyat değişim yüzdesini girin.' : 'Fiyat değişim yüzdesini girin.'}
          </p>
        </div>
      )}
    </div>
  )
}
