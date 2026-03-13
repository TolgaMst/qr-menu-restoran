/**
 * GitHub üzerinden maliyet verilerini kaydetme/yükleme
 * Admin panelindeki data.json push mekanizmasının aynısı
 */

const GITHUB_USERNAME = 'TolgaMst'
const GITHUB_REPO = 'qr-menu-restoran'

function getGithubToken() {
  if (typeof window === 'undefined') return ''
  return process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
}

/**
 * data.json'dan maliyet verilerini yükle
 * Önce remote (data.json), sonra localStorage fallback
 */
export async function loadMaliyetData() {
  try {
    const response = await fetch('/data.json')
    if (response.ok) {
      const data = await response.json()
      if (data.maliyetData) {
        // Remote veriyi localStorage'a da yaz (cache)
        const md = data.maliyetData
        if (md.products) localStorage.setItem('maliyet_products', JSON.stringify(md.products))
        if (md.materials) localStorage.setItem('maliyet_materials', JSON.stringify(md.materials))
        if (md.categories) localStorage.setItem('maliyet_categories', JSON.stringify(md.categories))
        if (md.settings) localStorage.setItem('maliyet_settings', JSON.stringify(md.settings))
        return md
      }
    }
  } catch {
    // Remote yükleme başarısız, localStorage'dan devam
  }
  return null
}

/**
 * Maliyet verilerini GitHub'a kaydet (data.json içine)
 * Mevcut data.json'ı korur, sadece maliyetData kısmını günceller
 */
export async function saveMaliyetData({ products, materials, categories, settings }) {
  const githubToken = getGithubToken()
  if (!githubToken) {
    throw new Error('GitHub token eksik! Cloudflare\'de NEXT_PUBLIC_GITHUB_TOKEN ayarlayın.')
  }

  // Mevcut data.json'ı al
  const response = await fetch('/data.json')
  let existingData = {}
  if (response.ok) {
    existingData = await response.json()
  }

  // maliyetData kısmını güncelle, geri kalanı koru
  const publicData = {
    ...existingData,
    maliyetData: {
      products,
      materials,
      categories,
      settings,
      lastUpdated: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(publicData, null, 2)

  // GitHub'dan mevcut SHA'yı al
  const getFileResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' } }
  )

  let sha = null
  if (getFileResponse.ok) {
    const fileData = await getFileResponse.json()
    sha = fileData.sha
  }

  // GitHub'a push et
  const updateResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Maliyet verileri güncellendi - ${new Date().toLocaleString('tr-TR')}`,
        content: btoa(unescape(encodeURIComponent(dataStr))),
        sha: sha,
        branch: 'main',
      }),
    }
  )

  if (!updateResponse.ok) {
    const error = await updateResponse.json()
    throw new Error(error.message || 'GitHub kaydetme hatası')
  }

  return true
}
