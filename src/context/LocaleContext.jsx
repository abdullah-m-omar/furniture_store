import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import i18n from '../i18n'

const LocaleContext = createContext(null)
export const useLocale = () => useContext(LocaleContext)

// Bootstrap CSS swapper (LTR/RTL)
const BOOTSTRAP_LINK_ID = 'bootstrap-css-link'
const LTR_CSS = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
const RTL_CSS = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css'

function ensureBootstrapLink() {
  let link = document.getElementById(BOOTSTRAP_LINK_ID)
  if (!link) {
    link = document.createElement('link')
    link.id = BOOTSTRAP_LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  return link
}

export default function LocaleProvider({ children }) {
  const [lang, setLangState] = useState(i18n.language?.split('-')[0] || 'en')

  // Keep i18n + html attributes + bootstrap CSS in sync
  useEffect(() => {
    i18n.changeLanguage(lang)
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    localStorage.setItem('i18nextLng', lang)

    const link = ensureBootstrapLink()
    link.href = (lang === 'ar') ? RTL_CSS : LTR_CSS
  }, [lang])

  const setLang = (lng) => setLangState(lng)

  const value = useMemo(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    const currency = lang === 'ar' ? 'SAR' : 'USD' // you can make this dynamic later
    const locale = lang === 'ar' ? 'ar-SA' : 'en-US'
    return { lang, setLang, dir, currency, locale }
  }, [lang])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
