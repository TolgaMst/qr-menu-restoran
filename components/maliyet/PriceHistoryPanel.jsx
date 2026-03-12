'use client'
import { formatCurrency } from '@/lib/maliyet/calculations'

export default function PriceHistoryPanel({ material, onClose }) {
  const history = material.priceHistory || []

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {material.name} - Fiyat Geçmişi
        </h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Henüz fiyat değişikliği yok.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-400">Tarih</th>
                <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Fiyat</th>
                <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Değişim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {history.map((entry, i) => {
                const prev = history[i + 1]
                const change = prev ? ((entry.price - prev.price) / prev.price) * 100 : null
                return (
                  <tr key={i}>
                    <td className="py-2 text-gray-700 dark:text-gray-300">
                      {new Date(entry.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(entry.price)}
                    </td>
                    <td className="py-2 text-right">
                      {change !== null ? (
                        <span className={`text-xs font-medium ${change >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Güncel Fiyat</span>
        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(material.unitPrice)}</span>
      </div>
    </div>
  )
}
