/**
 * 中文常量
 */
export const ZH_CN = 'zh-CN'

/**
 * 繁体中文常量
 */
export const ZH_TW = 'zh-TW'

/**
 * 英文常量
 */
export const EN_GB = 'en-GB'

/**
 * 韩文常量
 */
export const KO_KR = 'ko-KR'

/**
 * 存储在localStorage的语言变量KEY
 */
export const LOCAL_STORAGE_LANG = '_lang';

/**
 * 存储在localStorage的邮箱键名
 */
export const LOCAL_STORAGE_EMAIL = '_email';

/**
 * 判断是否为韩国运行环境
 */
export const isKoreaEnv = () => {
  const reg = /^kr-?.*\./i;
  return reg.test(window.location.hostname);
}

/**
 * App(IOS)(zh-CN)/1.0.1
 * App(Android)(zh-TW)/1.0.2
 * 返回是否为APP，是则返回 { app: 'IOS' | 'Android', language: String, version: String}
 */
export const getAPPInfo = () => {
  const reg = /\s+App\((.*)\)\((.*)\)\/(\d+\.\d+\.\d+)/i
  const matchs = reg.exec(navigator.userAgent)

  if (matchs) {
    return {
      app: matchs[1],
      language: matchs[2],
      version: matchs[3]
    }
  } else {
    return null
  }
}

/**
 * 取得当前语言环境
 * 如果本地设置
 */
export const getLang = () => {
  let lang = EN_GB
  let localStorageLang = localStorage.getItem(LOCAL_STORAGE_LANG)
  let appInfo = getAPPInfo()

  if (localStorageLang) {
    lang = localStorageLang
  } else if (appInfo) {
    lang = appInfo.language
  } else if (isKoreaEnv()) {
    lang = KO_KR;
  } else {
    lang = navigator.language
  }

  if (/zh-TW/i.test(lang)) {
    lang = ZH_TW;
  } else if (/zh/i.test(lang)) {
    lang = ZH_CN;
  } else if (/ko-KR/i.test(lang)) {
    lang = KO_KR;
  } else {
    lang = EN_GB;
  }

  return lang
}