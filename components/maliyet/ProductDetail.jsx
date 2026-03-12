'use client'
import { formatCurrency, calculateProductCost, calculateProfit, calculateProfitPercentage, calculateUnitCost, getProductCostParams, calculateFullCost } from '@/lib/maliyet/calculations'

export default function ProductDetail({ product, materials, settings, onBack }) {
  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Ürün bulunamadı.</p>
        <button onClick={onBack} className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium">Ürünlere Dön</button>
      </div>
    )
  }

  const rawCost = calculateProductCost(product, materials)
  const params = getProductCostParams(product, settings)
  const costBreakdown = calculateFullCost(rawCost, params.wasteRate, params.extraCosts, params.vatRate)
  const totalCost = costBreakdown.totalCost
  const profit = calculateProfit(product.sellingPrice, totalCost)
  const profitPct = calculateProfitPercentage(product.sellingPrice, totalCost)
  const isProfit = profit >= 0
  const hasYield = product.yield && product.yield > 0
  const unitCost = hasYield ? calculateUnitCost(totalCost, product.yield) : null
  const unitProfit = hasYield ? (product.sellingPrice / product.yield) - unitCost : null
  const targetMargin = settings?.targetProfitMargin || 0
  const belowTarget = targetMargin > 0 && profitPct < targetMargin
  const hasExtraCosts = costBreakdown.wasteCost > 0 || costBreakdown.extraCosts > 0 || costBreakdown.vat > 0

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Ürünlere Dön
      </button>

      {/* Product header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
            {product.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>}
            <div className="flex items-center gap-2 mt-2">
              {product.category && (
                <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">{product.category}</span>
              )}
              {hasYield && (
                <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                  {product.yield} {product.yieldUnit}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
              isProfit ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>%{profitPct.toFixed(1)} {isProfit ? 'Kar' : 'Zarar'}</span>
            {belowTarget && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                Hedef: %{targetMargin}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className={`grid grid-cols-1 gap-4 ${hasYield ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toplam Maliyet</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalCost)}</p>
          {hasYield && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 {product.yieldUnit} = {formatCurrency(unitCost)}</p>}
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Satış Fiyatı</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(product.sellingPrice)}</p>
          {hasYield && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 {product.yieldUnit} = {formatCurrency(product.sellingPrice / product.yield)}</p>}
        </div>
        <div className={`rounded-xl border p-5 ${isProfit ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <p className={`text-sm mb-1 ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {isProfit ? 'Kar Tutarı' : 'Zarar Tutarı'}
          </p>
          <p className={`text-2xl font-bold ${isProfit ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {formatCurrency(Math.abs(profit))}
          </p>
          {hasYield && unitProfit !== null && (
            <p className={`text-xs mt-1 ${isProfit ? 'text-emerald-500 dark:text-emerald-500' : 'text-red-500'}`}>
              1 {product.yieldUnit} = {formatCurrency(Math.abs(unitProfit))}
            </p>
          )}
        </div>
        {hasYield && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reçete Miktarı</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.yield}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{product.yieldUnit}</p>
          </div>
        )}
      </div>

      {/* Cost breakdown - Sonuçlar */}
      {hasExtraCosts && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Maliyet Kırılımı</h3>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Hammadde Maliyeti</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costBreakdown.rawCost)}</span>
            </div>
            {costBreakdown.wasteCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Fire Maliyeti (%{params.wasteRate})</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costBreakdown.wasteCost)}</span>
              </div>
            )}
            {costBreakdown.extraCosts > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Ek Giderler</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costBreakdown.extraCosts)}</span>
              </div>
            )}
            {costBreakdown.vat > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">KDV (%{params.vatRate})</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costBreakdown.vat)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Toplam Maliyet</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalCost)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Materials breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Malzeme Detayları</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Malzeme</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Miktar</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Birim Fiyat</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Toplam</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Oran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {product.materials.map(pm => {
                const mat = materials.find(m => m.id === pm.materialId)
                if (!mat) return null
                const cost = mat.unitPrice * pm.quantity
                const ratio = rawCost > 0 ? (cost / rawCost) * 100 : 0
                return (
                  <tr key={pm.materialId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{mat.name}</td>
                    <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{pm.quantity} {mat.unit}</td>
                    <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(mat.unitPrice)}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(cost)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(ratio, 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">%{ratio.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <td colSpan={3} className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Hammadde Maliyeti</td>
                <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(rawCost)}</td>
                <td className="px-5 py-3 text-right text-xs text-gray-500 dark:text-gray-400">%100</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
