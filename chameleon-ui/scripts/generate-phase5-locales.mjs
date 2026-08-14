/**
 * Phase 5 locale writer for the four new three-end components
 * (action-sheet / tab-bar / safe-area / sidebar). Writes all 21 catalog
 * locales per component. Idempotent; overwrites only these four slugs.
 * Mirrors the generate-phase2-locales.mjs precedent: flat key -> locale map.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsSrc = path.join(monorepoRoot, 'packages', 'components', 'src')

const LOCALES = [
  'zh-CN',
  'zh-HK',
  'ja',
  'ko',
  'ru',
  'hi',
  'en',
  'de',
  'ar',
  'ug',
  'sw',
  'ha',
  'am',
  'es',
  'fr',
  'pt',
  'bn',
  'id',
  'ur',
  'fa',
  'vi',
]

/** Flat key -> locale -> ICU-safe string */
const TRANSLATIONS = {
  'safeArea.label': {
    'zh-CN': '安全区',
    'zh-HK': '安全區',
    ja: 'セーフエリア',
    ko: '안전 영역',
    ru: 'Безопасная область',
    hi: 'सुरक्षित क्षेत्र',
    en: 'Safe area',
    de: 'Sicherer Bereich',
    ar: 'المنطقة الآمنة',
    ug: 'بىخەتەر رايون',
    sw: 'Eneo salama',
    ha: 'Yanki mai aminci',
    am: 'ደህንነቱ የተጠበቀ ቦታ',
    es: 'Área segura',
    fr: 'Zone sécurisée',
    pt: 'Área segura',
    bn: 'নিরাপদ এলাকা',
    id: 'Area aman',
    ur: 'محفوظ علاقہ',
    fa: 'ناحیه امن',
    vi: 'Vùng an toàn',
  },
  'tabBar.label': {
    'zh-CN': '标签栏',
    'zh-HK': '分頁列',
    ja: 'タブバー',
    ko: '탭 바',
    ru: 'Панель вкладок',
    hi: 'टैब बार',
    en: 'Tab bar',
    de: 'Tab-Leiste',
    ar: 'شريط علامات التبويب',
    ug: 'بەتكۈچ ستونى',
    sw: 'Upau wa tabo',
    ha: 'Sandar shafuka',
    am: 'የታብ አሞሌ',
    es: 'Barra de pestañas',
    fr: "Barre d'onglets",
    pt: 'Barra de guias',
    bn: 'ট্যাব বার',
    id: 'Bilah tab',
    ur: 'ٹیب بار',
    fa: 'نوار برگه‌ها',
    vi: 'Thanh tab',
  },
  'actionSheet.label': {
    'zh-CN': '动作面板',
    'zh-HK': '動作面板',
    ja: 'アクションシート',
    ko: '액션 시트',
    ru: 'Панель действий',
    hi: 'एक्शन शीट',
    en: 'Action sheet',
    de: 'Aktionsblatt',
    ar: 'ورقة الإجراءات',
    ug: 'ھەرىكەت تاختىسى',
    sw: 'Karatasi ya vitendo',
    ha: 'Takardar ayyuka',
    am: 'የተግባር ሉህ',
    es: 'Hoja de acciones',
    fr: "Feuille d'actions",
    pt: 'Folha de ações',
    bn: 'অ্যাকশন শিট',
    id: 'Lembar aksi',
    ur: 'ایکشن شیٹ',
    fa: 'برگه اقدامات',
    vi: 'Bảng hành động',
  },
  'actionSheet.cancel': {
    'zh-CN': '取消',
    'zh-HK': '取消',
    ja: 'キャンセル',
    ko: '취소',
    ru: 'Отмена',
    hi: 'रद्द करें',
    en: 'Cancel',
    de: 'Abbrechen',
    ar: 'إلغاء',
    ug: 'بىكار قىلىش',
    sw: 'Ghairi',
    ha: 'Soke',
    am: 'ሰርዝ',
    es: 'Cancelar',
    fr: 'Annuler',
    pt: 'Cancelar',
    bn: 'বাতিল',
    id: 'Batal',
    ur: 'منسوخ کریں',
    fa: 'لغو',
    vi: 'Hủy',
  },
  'sidebar.label': {
    'zh-CN': '侧边栏',
    'zh-HK': '側邊欄',
    ja: 'サイドバー',
    ko: '사이드바',
    ru: 'Боковая панель',
    hi: 'साइडबार',
    en: 'Sidebar',
    de: 'Seitenleiste',
    ar: 'الشريط الجانبي',
    ug: 'يان تاختا',
    sw: 'Upau wa pembeni',
    ha: 'Bangaren gefe',
    am: 'የጎን አሞሌ',
    es: 'Barra lateral',
    fr: 'Barre latérale',
    pt: 'Barra lateral',
    bn: 'সাইডবার',
    id: 'Bilah sisi',
    ur: 'سائڈبار',
    fa: 'نوار کناری',
    vi: 'Thanh bên',
  },
  'sidebar.expand': {
    'zh-CN': '展开侧边栏',
    'zh-HK': '展開側邊欄',
    ja: 'サイドバーを展開',
    ko: '사이드바 펼치기',
    ru: 'Развернуть боковую панель',
    hi: 'साइडबार फैलाएँ',
    en: 'Expand sidebar',
    de: 'Seitenleiste ausklappen',
    ar: 'توسيع الشريط الجانبي',
    ug: 'يان تاختىنى يېيىش',
    sw: 'Panua upau wa pembeni',
    ha: 'Faɗaɗa bangaren gefe',
    am: 'የጎን አሞሌን ዘርጋ',
    es: 'Expandir barra lateral',
    fr: 'Déplier la barre latérale',
    pt: 'Expandir barra lateral',
    bn: 'সাইডবার প্রসারিত করুন',
    id: 'Luaskan bilah sisi',
    ur: 'سائڈبار پھیلائیں',
    fa: 'گسترش نوار کناری',
    vi: 'Mở rộng thanh bên',
  },
  'sidebar.collapse': {
    'zh-CN': '收起侧边栏',
    'zh-HK': '收合側邊欄',
    ja: 'サイドバーを折りたたむ',
    ko: '사이드바 접기',
    ru: 'Свернуть боковую панель',
    hi: 'साइडबार समेटें',
    en: 'Collapse sidebar',
    de: 'Seitenleiste einklappen',
    ar: 'طي الشريط الجانبي',
    ug: 'يان تاختىنى يىغىش',
    sw: 'Kunja upau wa pembeni',
    ha: 'Ƙuntata bangaren gefe',
    am: 'የጎን አሞሌን ምጠን',
    es: 'Contraer barra lateral',
    fr: 'Replier la barre latérale',
    pt: 'Recolher barra lateral',
    bn: 'সাইডবার সঙ্কুচিত করুন',
    id: 'Ciutkan bilah sisi',
    ur: 'سائڈبار سمیٹیں',
    fa: 'جمع کردن نوار کناری',
    vi: 'Thu gọn thanh bên',
  },
}

/** slug -> message group name -> keys */
const COMPONENTS = {
  'action-sheet': { group: 'actionSheet', keys: ['label', 'cancel'] },
  'tab-bar': { group: 'tabBar', keys: ['label'] },
  'safe-area': { group: 'safeArea', keys: ['label'] },
  sidebar: { group: 'sidebar', keys: ['label', 'expand', 'collapse'] },
}

for (const [slug, { group, keys }] of Object.entries(COMPONENTS)) {
  const localeDir = path.join(componentsSrc, slug, 'locales')
  await mkdir(localeDir, { recursive: true })
  for (const locale of LOCALES) {
    const messages = {}
    for (const key of keys) {
      const flatKey = `${group}.${key}`
      const value = TRANSLATIONS[flatKey]?.[locale]
      if (!value) throw new Error(`missing translation for ${flatKey} in ${locale}`)
      messages[key] = value
    }
    const filePath = path.join(localeDir, `${locale}.json`)
    await writeFile(filePath, `${JSON.stringify({ [group]: messages }, null, 2)}\n`, 'utf8')
  }
  console.log(`[phase5-locales] ${slug}: wrote ${LOCALES.length} locales (${keys.length} keys)`)
}
