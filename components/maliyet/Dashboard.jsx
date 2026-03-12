'use client'
import { formatCurrency, calculateProductCost, calculateProfitPercentage, getProductCostParams, calculateFullCost } from '@/lib/maliyet/calculations'
import { exportToExcel } from '@/lib/maliyet/exportExcel'

export default function Dashboard({ materials, products, settings, onViewProduct }) {
  const productStats = products.map(product => {
    const rawCost = calculateProductCost(product, materials)
    const params = getProductCostParams(product, settings)
    const costBreakdown = calculateFullCost(rawCost, params.wasteRate, params.extraCosts, params.vatRate)
    const totalCost = costBreakdown.totalCost
    const profit = product.sellingPrice - totalCost
    const profitPct = calculateProfitPercentage(product.sellingPrice, totalCost)
    return { ...product, totalCost, profit, profitPct, costBreakdown }
  })

  const avgProfitPct = productStats.length > 0
    ? productStats.reduce((sum, p) => sum + p.profitPct, 0) / productStats.length : 0
  const totalRevenue = productStats.reduce((sum, p) => sum + p.profit, 0)
  const mostProfitable = [...productStats].sort((a, b) => b.profitPct - a.profitPct)[0]
  const leastProfitable = [...productStats].sort((a, b) => a.profitPct - b.profitPct)[0]

  const targetMargin = settings?.targetProfitMargin || 0
  const belowTargetCount = targetMargin > 0
    ? productStats.filter(p => p.profitPct < targetMargin).length : 0

  const handleExport = () => exportToExcel(materials, products, settings)

  return (
    <div className="space-y-6">
      {/* Export button */}
      {(materials.length > 0 || products.length > 0) && (
        <div className="flex justify-end">
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Excel'e Aktar
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${targetMargin > 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <StatCard label="Toplam Malzeme" value={materials.length} color="blue"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>} />
        <StatCard label="Toplam Ürün" value={products.length} color="purple"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>} />
        <StatCard label="Ortalama Kar Marjı" value={`%${avgProfitPct.toFixed(1)}`} color="emerald"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>} />
        <StatCard label="Toplam Kar" value={formatCurrency(totalRevenue)} color={totalRevenue >= 0 ? 'emerald' : 'red'}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} />
        {targetMargin > 0 && (
          <StatCard label={`Hedef Altı (%${targetMargin})`} value={belowTargetCount} color={belowTargetCount > 0 ? 'amber' : 'emerald'}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>} />
        )}
      </div>

      {/* Top products */}
      {productStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mostProfitable && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">En Karlı Ürün</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{mostProfitable.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Maliyet: {formatCurrency(mostProfitable.totalCost)} | Satış: {formatCurrency(mostProfitable.sellingPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">%{mostProfitable.profitPct.toFixed(1)}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(mostProfitable.profit)}</p>
                </div>
              </div>
              <button onClick={() => onViewProduct(mostProfitable.id)}
                className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium">Detayı Gör</button>
            </div>
          )}
          {leastProfitable && products.length > 1 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">En Az Karlı Ürün</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{leastProfitable.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Maliyet: {formatCurrency(leastProfitable.totalCost)} | Satış: {formatCurrency(leastProfitable.sellingPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${leastProfitable.profit >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                    %{leastProfitable.profitPct.toFixed(1)}
                  </p>
                  <p className={`text-sm font-medium ${leastProfitable.profit >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(leastProfitable.profit)}
                  </p>
                </div>
              </div>
              <button onClick={() => onViewProduct(leastProfitable.id)}
                className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium">Detayı Gör</button>
            </div>
          )}
        </div>
      )}

      {/* All products table */}
      {productStats.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Tüm Ürünler</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Ürün</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Maliyet</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Satış</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Kar</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Kar %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {productStats.map(p => {
                  const belowTarget = targetMargin > 0 && p.profitPct < targetMargin
                  return (
                    <tr key={p.id} onClick={() => onViewProduct(p.id)}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${belowTarget ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                          {belowTarget && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(p.totalCost)}</td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(p.sellingPrice)}</td>
                      <td className={`px-5 py-3 text-right font-medium ${p.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(p.profit)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${
                          p.profit >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>%{p.profitPct.toFixed(1)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Hoş Geldiniz!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Başlamak için önce malzeme ekleyin, sonra ürünlerinizi oluşturup kar marjlarınızı takip edin.
          </p>
        </div>
      )}

      {/* Kar/Zarar Özet */}
      {productStats.length > 1 && (() => {
        const sorted = [...productStats].sort((a, b) => b.profitPct - a.profitPct)
        const maxCost = Math.max(...sorted.map(p => p.totalCost))
        const maxSelling = Math.max(...sorted.map(p => p.sellingPrice))
        const maxBar = Math.max(maxCost, maxSelling)
        const totals = sorted.reduce((acc, p) => ({
          rawCost: acc.rawCost + p.costBreakdown.rawCost,
          wasteCost: acc.wasteCost + p.costBreakdown.wasteCost,
          extraCosts: acc.extraCosts + p.costBreakdown.extraCosts,
          vat: acc.vat + p.costBreakdown.vat,
          totalCost: acc.totalCost + p.totalCost,
        }), { rawCost: 0, wasteCost: 0, extraCosts: 0, vat: 0, totalCost: 0 })

        return (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Kar/Zarar Özet</h3>
            </div>

            {/* Visual comparison */}
            <div className="p-5 space-y-4">
              {sorted.map(p => {
                const costW = maxBar > 0 ? (p.totalCost / maxBar) * 100 : 0
                const sellingW = maxBar > 0 ? (p.sellingPrice / maxBar) * 100 : 0
                return (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                      <span className={`text-xs font-bold ${p.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        %{p.profitPct.toFixed(1)} | {formatCurrency(p.profit)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-14">Maliyet</span>
                        <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 dark:bg-gray-600 rounded-full" style={{ width: `${costW}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-20 text-right">{formatCurrency(p.totalCost)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-14">Satış</span>
                        <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${sellingW}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-20 text-right">{formatCurrency(p.sellingPrice)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cost distribution */}
            {totals.totalCost > 0 && (
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Toplam Maliyet Dağılımı</h4>
                <div className="h-6 flex rounded-full overflow-hidden mb-3">
                  {totals.rawCost > 0 && <div className="bg-blue-500" style={{ width: `${(totals.rawCost / totals.totalCost) * 100}%` }} />}
                  {totals.wasteCost > 0 && <div className="bg-amber-500" style={{ width: `${(totals.wasteCost / totals.totalCost) * 100}%` }} />}
                  {totals.extraCosts > 0 && <div className="bg-purple-500" style={{ width: `${(totals.extraCosts / totals.totalCost) * 100}%` }} />}
                  {totals.vat > 0 && <div className="bg-gray-400" style={{ width: `${(totals.vat / totals.totalCost) * 100}%` }} />}
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full" />Hammadde {formatCurrency(totals.rawCost)} (%{((totals.rawCost / totals.totalCost) * 100).toFixed(0)})</span>
                  {totals.wasteCost > 0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full" />Fire {formatCurrency(totals.wasteCost)} (%{((totals.wasteCost / totals.totalCost) * 100).toFixed(0)})</span>}
                  {totals.extraCosts > 0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-full" />Ek Gider {formatCurrency(totals.extraCosts)} (%{((totals.extraCosts / totals.totalCost) * 100).toFixed(0)})</span>}
                  {totals.vat > 0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-400 rounded-full" />KDV {formatCurrency(totals.vat)} (%{((totals.vat / totals.totalCost) * 100).toFixed(0)})</span>}
                </div>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
