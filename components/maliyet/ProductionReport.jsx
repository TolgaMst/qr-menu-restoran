'use client'
import { useState } from 'react'
import { formatCurrency, calculateProductCost, getProductCostParams, calculateFullCost, calculateProfitPercentage } from '@/lib/maliyet/calculations'

export default function ProductionReport({ materials, products, settings }) {
  const [quantities, setQuantities] = useState({})

  const setQty = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value })
  }

  const productRows = products.map(product => {
    const qty = parseFloat(quantities[product.id]) || 0
    const rawCost = calculateProductCost(product, materials)
    const params = getProductCostParams(product, settings)
    const full = calculateFullCost(rawCost, params.wasteRate, params.extraCosts, params.vatRate)
    const unitCost = product.yield && product.yield > 0 ? full.totalCost / product.yield : full.totalCost
    const unitSelling = product.yield && product.yield > 0 ? product.sellingPrice / product.yield : product.sellingPrice
    const totalCost = unitCost * qty
    const totalSelling = unitSelling * qty
    const profit = totalSelling - totalCost
    return { ...product, qty, unitCost, unitSelling, totalCost, totalSelling, profit }
  })

  const activeRows = productRows.filter(r => r.qty > 0)
  const totalProductionCost = activeRows.reduce((s, r) => s + r.totalCost, 0)
  const totalSelling = activeRows.reduce((s, r) => s + r.totalSelling, 0)
  const totalProfit = totalSelling - totalProductionCost
  const avgMargin = totalProductionCost > 0 ? ((totalSelling - totalProductionCost) / totalProductionCost) * 100 : 0

  // Material consumption
  const materialConsumption = {}
  activeRows.forEach(row => {
    const product = products.find(p => p.id === row.id)
    if (!product) return
    const multiplier = product.yield && product.yield > 0 ? row.qty / product.yield : row.qty
    product.materials.forEach(pm => {
      const mat = materials.find(m => m.id === pm.materialId)
      if (!mat) return
      if (!materialConsumption[pm.materialId]) {
        materialConsumption[pm.materialId] = { name: mat.name, unit: mat.unit, unitPrice: mat.unitPrice, quantity: 0 }
      }
      materialConsumption[pm.materialId].quantity += pm.quantity * multiplier
    })
  })
  const consumptionList = Object.values(materialConsumption).sort((a, b) => (b.quantity * b.unitPrice) - (a.quantity * a.unitPrice))

  return (
    <div className="space-y-6">
      {/* Quantity inputs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Üretim Raporu</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Her üründen kaç adet ürettiğinizi girin, toplam maliyet ve karı görün.
        </p>

        {products.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Henüz ürün oluşturulmamış.</p>
        ) : (
          <div className="space-y-3">
            {products.map(product => {
              const unit = product.yield && product.yield > 0 ? product.yieldUnit : 'adet'
              return (
                <div key={product.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                    {product.yield && product.yield > 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(reçete: {product.yield} {product.yieldUnit})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={quantities[product.id] || ''}
                      onChange={e => setQty(product.id, e.target.value)}
                      placeholder="0"
                      className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm text-right focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-12">{unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary cards */}
      {activeRows.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label="Toplam Üretim Maliyeti" value={formatCurrency(totalProductionCost)} color="gray" />
            <SummaryCard label="Toplam Satış Tutarı" value={formatCurrency(totalSelling)} color="blue" />
            <SummaryCard label="Toplam Kar" value={formatCurrency(totalProfit)} color={totalProfit >= 0 ? 'emerald' : 'red'} />
            <SummaryCard label="Ortalama Kar Marjı" value={`%${avgMargin.toFixed(1)}`} color={avgMargin >= 0 ? 'emerald' : 'red'} />
          </div>

          {/* Detail table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Üretim Detayı</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Ürün</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Miktar</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Birim Maliyet</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Toplam Maliyet</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Toplam Satış</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Kar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {activeRows.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{r.name}</td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
                        {r.qty} {r.yield && r.yield > 0 ? r.yieldUnit : 'adet'}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(r.unitCost)}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(r.totalCost)}</td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(r.totalSelling)}</td>
                      <td className={`px-5 py-3 text-right font-bold ${r.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(r.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <td colSpan={3} className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Toplam</td>
                    <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(totalProductionCost)}</td>
                    <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(totalSelling)}</td>
                    <td className={`px-5 py-3 text-right font-bold ${totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(totalProfit)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Material consumption */}
          {consumptionList.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Malzeme Tüketimi</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Malzeme</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Toplam Miktar</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Birim Fiyat</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {consumptionList.map(c => (
                      <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                        <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{c.quantity.toFixed(2)} {c.unit}</td>
                        <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(c.unitPrice)}</td>
                        <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(c.quantity * c.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <td colSpan={3} className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Toplam Hammadde</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                        {formatCurrency(consumptionList.reduce((s, c) => s + c.quantity * c.unitPrice, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color }) {
  const colorClasses = {
    gray: 'border-gray-200 dark:border-gray-700',
    blue: 'border-blue-200 dark:border-blue-800',
    emerald: 'border-emerald-200 dark:border-emerald-800',
    red: 'border-red-200 dark:border-red-800',
  }
  const textClasses = {
    gray: 'text-gray-900 dark:text-white',
    blue: 'text-blue-700 dark:text-blue-400',
    emerald: 'text-emerald-700 dark:text-emerald-400',
    red: 'text-red-700 dark:text-red-400',
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border ${colorClasses[color]} p-5`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textClasses[color]}`}>{value}</p>
    </div>
  )
}
