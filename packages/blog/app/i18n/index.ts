import { initReactI18next } from 'react-i18next/initReactI18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { createInstance } from 'i18next'

import siteMetadata from '@/data/siteMetadata'

const { fallbackLanguage, languages } = siteMetadata

const initI18next = async (lng = fallbackLanguage, ns = 'basic') => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        return import(`./locales/${language}/${namespace}.json`)
      }),
    )
    .init({
      supportedLngs: languages,
      fallbackLng: fallbackLanguage,
      fallbackNS: 'basic',
      defaultNS: 'basic',
      lng,
      ns,
    })
  return i18nInstance
}

export async function getTranslation(lng: string, ns = 'basic') {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  }
}
