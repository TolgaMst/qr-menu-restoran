'use client'
export default function Settings({ settings, setSettings }) {
  const update = (key, value) => setSettings({ ...settings, [key]: value })
  const inputCls = "w-40 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"

  return (
    <div className="space-y-6 max-w-lg">
      {/* Kar Hedefi */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Kar Hedefi</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Minimum Kar Marjı (%)
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Bu yüzdenin altında kalan ürünler uyarı ile işaretlenir.
          </p>
          <input
            type="number"
            step="1"
            min="0"
            max="1000"
            value={settings.targetProfitMargin || ''}
            onChange={e => update('targetProfitMargin', parseFloat(e.target.value) || 0)}
            placeholder="Örn: 30"
            className={inputCls}
          />
        </div>
        {settings.targetProfitMargin > 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Kar marjı <strong>%{settings.targetProfitMargin}</strong> altında olan ürünler uyarı ile gösterilecek.
            </p>
          </div>
        )}
      </div>

      {/* Maliyet Ayarları */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Varsayılan Maliyet Ayarları</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Bu değerler tüm ürünlere uygulanır. Ürün bazında farklı değer atayabilirsiniz.
        </p>

        <div className="space-y-5">
          {/* Fire Oranı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fire Oranı (%)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              İsraf ve kayıp oranı. Hammadde maliyetine eklenir.
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.defaultWasteRate || ''}
              onChange={e => update('defaultWasteRate', parseFloat(e.target.value) || 0)}
              placeholder="Örn: 5"
              className={inputCls}
            />
          </div>

          {/* Ek Giderler */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ek Giderler (₺)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              İşçilik, enerji, ambalaj vb. sabit giderler.
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.defaultExtraCosts || ''}
              onChange={e => update('defaultExtraCosts', parseFloat(e.target.value) || 0)}
              placeholder="Örn: 10.00"
              className={inputCls}
            />
          </div>

          {/* KDV Oranı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              KDV Oranı (%)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Katma değer vergisi oranı.
            </p>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={settings.defaultVatRate || ''}
              onChange={e => update('defaultVatRate', parseFloat(e.target.value) || 0)}
              placeholder="Örn: 10"
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
