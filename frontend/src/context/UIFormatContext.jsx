import React, { createContext, useContext, useState, useEffect } from 'react';

const UIFormatContext = createContext(null);

const STORAGE_KEY = 'ky_edu_ui_format_v1';

const defaultSettings = {
  viewFormat: 'grid',       // 'grid' | 'table' | 'compact' | 'timeline'
  density: 'comfortable',   // 'comfortable' | 'compact'
  language: 'bilingual',    // 'bilingual' | 'en' | 'hi'
  accent: 'orange',         // 'orange' | 'emerald' | 'blue' | 'purple' | 'slate'
};

const translations = {
  en: {
    portal_name: 'KY EDU',
    portal_subtitle: 'Indian Education & Government Exam Gateway',
    nav_home: 'Home',
    nav_exams: 'Sarkari Exams',
    nav_careers: 'Career Scopes',
    nav_eligibility: 'Eligibility Matcher',
    nav_compare: 'Compare Exams',
    nav_admin: 'Admin Portal',
    format_changer: 'UI Format Changer',
    format_changer_sub: 'Customize Layout, Density, Language & Color Style',
    layout_grid: 'Modern Cards Grid',
    layout_table: 'Sarkari Table Directory',
    layout_compact: 'Fast-Scan Compact Feed',
    layout_timeline: 'Recruitment Stage Pipeline',
    density_label: 'Display Density',
    density_comfortable: 'Spacious & Comfortable',
    density_compact: 'High Density (Sarkari Style)',
    language_label: 'Language & Terminology',
    lang_bilingual: 'Bilingual (English + हिंदी)',
    lang_en: 'English Standard',
    lang_hi: 'शुद्ध हिंदी (Hindi)',
    accent_label: 'Accent Theme Color',
    accent_orange: 'Saffron Kesari (India Orange)',
    accent_emerald: 'Tiranga Emerald (Forest Green)',
    accent_blue: 'Oceanic Blue (Royal Sky)',
    accent_purple: 'Imperial Violet (Purple)',
    accent_slate: 'Monochrome Slate (Classic Gray)',
    vacancies: 'Total Vacancies',
    salary_scale: '7th CPC Pay Scale',
    age_limit: 'Age Criteria',
    qualification: 'Educational Qualification',
    status: 'Recruitment Status',
    details: 'Details & Booklist',
    apply_update: 'Apply Update',
    search_placeholder: 'Search exams by title, body, posts (e.g. UPSC, SSC, RRB, AIIMS, Judiciary)...',
    reset_defaults: 'Reset to Defaults',
    preset_sarkari: 'Sarkari Result Table Preset',
    preset_cards: 'Modern Cards Preset',
    preset_scanner: 'Fast Scanner Preset',
  },
  bilingual: {
    portal_name: 'KY EDU',
    portal_subtitle: 'Indian Education & Govt Exam Gateway (भारतीय शिक्षा व सरकारी भर्ती मंच)',
    nav_home: 'Home (होम)',
    nav_exams: 'Sarkari Exams (सरकारी परीक्षाएं)',
    nav_careers: 'Career Scopes (करियर स्कोप्स)',
    nav_eligibility: 'Eligibility Matcher (पात्रता जांच)',
    nav_compare: 'Compare (तुलना)',
    nav_admin: 'Admin Portal (प्रशासनिक)',
    format_changer: 'UI Format Changer (UI प्रारूप परिवर्तक)',
    format_changer_sub: 'Customize Layout, Density, Language & Color Style (अपनी पसंद अनुसार लेआउट बदलें)',
    layout_grid: 'Modern Cards Grid (आधुनिक कार्ड ग्रिड)',
    layout_table: 'Sarkari Table Directory (सरकारी तालिका प्रारूप)',
    layout_compact: 'Fast-Scan Compact Feed (त्वरित स्कैनर सूची)',
    layout_timeline: 'Recruitment Stage Pipeline (भर्ती चरण टाइमलाइन)',
    density_label: 'Display Density (प्रदर्शन घनत्व)',
    density_comfortable: 'Spacious & Comfortable (सुगम व खुला)',
    density_compact: 'High Density / Sarkari Pro (सघन तालिका)',
    language_label: 'Language & Terminology (भाषा प्रारूप)',
    lang_bilingual: 'Bilingual (English + हिंदी)',
    lang_en: 'English Standard',
    lang_hi: 'हिंदी (Pure Hindi)',
    accent_label: 'Accent Theme Color (रंग थीम)',
    accent_orange: 'Saffron Kesari (केसरिया)',
    accent_emerald: 'Tiranga Emerald (हरित)',
    accent_blue: 'Oceanic Blue (नीला)',
    accent_purple: 'Imperial Violet (जामुनी)',
    accent_slate: 'Monochrome Slate (स्लेट)',
    vacancies: 'Vacancies (रिक्तियां)',
    salary_scale: '7th CPC Pay Scale (वेतनमान)',
    age_limit: 'Age Criteria (आयु सीमा)',
    qualification: 'Qualification (योग्यता)',
    status: 'Status (स्थिति)',
    details: 'Details & Books (विवरण व पुस्तकें)',
    apply_update: 'Apply Update (अपडेट जोड़ें)',
    search_placeholder: 'Search exams (e.g. UPSC, SSC CGL, RRB ALP, AIIMS, Judiciary, ITI, B.Sc Agri)...',
    reset_defaults: 'Reset to Defaults (रीसेट)',
    preset_sarkari: 'Sarkari Result Table Preset (सरकारी तालिका)',
    preset_cards: 'Modern Cards Preset (आधुनिक कार्ड)',
    preset_scanner: 'Fast Scanner Preset (फास्ट स्कैनर)',
  },
  hi: {
    portal_name: 'KY EDU',
    portal_subtitle: 'भारतीय शिक्षा प्रणाली एवं सरकारी भर्ती मार्गदर्शन पोर्टल',
    nav_home: 'मुख्य पृष्ठ',
    nav_exams: 'सरकारी परीक्षाएं',
    nav_careers: 'करियर स्कोप्स',
    nav_eligibility: 'पात्रता एवं आयु गणना',
    nav_compare: 'परीक्षा तुलना',
    nav_admin: 'प्रशासनिक पोर्टल',
    format_changer: 'UI प्रारूप परिवर्तक (Format Changer)',
    format_changer_sub: 'अपनी सुविधानुसार लेआउट, भाषा, रंग और घनत्व का चयन करें',
    layout_grid: 'आधुनिक कार्ड ग्रिड (Modern Grid)',
    layout_table: 'सरकारी भर्ती तालिका (Sarkari Table)',
    layout_compact: 'त्वरित स्कैनर सूची (Compact Feed)',
    layout_timeline: 'भर्ती चरण टाइमलाइन (Recruitment Timeline)',
    density_label: 'डेटा घनत्व (Density)',
    density_comfortable: 'सुगम एवं विस्तृत (Comfortable)',
    density_compact: 'सघन एवं तीव्र (Compact Pro)',
    language_label: 'भाषा प्रारूप (Language)',
    lang_bilingual: 'द्विभाषी (Bilingual)',
    lang_en: 'अंग्रेजी (English)',
    lang_hi: 'हिंदी (Hindi)',
    accent_label: 'रंग थीम (Accent Color)',
    accent_orange: 'केसरिया (Saffron Orange)',
    accent_emerald: 'तिरंगा हरा (Emerald Green)',
    accent_blue: 'शाही नीला (Royal Blue)',
    accent_purple: 'बैंगनी (Violet)',
    accent_slate: 'क्लासिक स्लेट (Monochrome Slate)',
    vacancies: 'कुल रिक्तियां',
    salary_scale: '7वां वेतन आयोग वेतनमान',
    age_limit: 'न्यूनतम व अधिकतम आयु',
    qualification: 'न्यूनतम शैक्षणिक योग्यता',
    status: 'भर्ती स्थिति',
    details: 'पूर्ण विवरण व पुस्तकें',
    apply_update: 'आधिकारिक सर्कुलर जोड़ें',
    search_placeholder: 'परीक्षा का नाम, आयोग, पद खोजें (जैसे UPSC, SSC, रेलवे, AIIMS, न्यायपालिका)...',
    reset_defaults: 'डिफ़ॉल्ट पर रीसेट करें',
    preset_sarkari: 'सरकारी तालिका प्रीसेट',
    preset_cards: 'आधुनिक कार्ड प्रीसेट',
    preset_scanner: 'फास्ट स्कैनर प्रीसेट',
  }
};

const accentStyles = {
  orange: {
    name: 'Saffron Kesari',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    text: 'text-orange-500 dark:text-orange-400',
    border: 'border-orange-500',
    borderLight: 'border-orange-500/30',
    bgLight: 'bg-orange-500/10 dark:bg-orange-500/15',
    gradient: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    glow: 'shadow-orange-500/25',
    activeNav: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30'
  },
  emerald: {
    name: 'Tiranga Emerald',
    primary: 'bg-emerald-500',
    primaryHover: 'hover:bg-emerald-600',
    text: 'text-emerald-500 dark:text-emerald-400',
    border: 'border-emerald-500',
    borderLight: 'border-emerald-500/30',
    bgLight: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    gradient: 'from-emerald-500 to-teal-500',
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    glow: 'shadow-emerald-500/25',
    activeNav: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  },
  blue: {
    name: 'Oceanic Blue',
    primary: 'bg-sky-500',
    primaryHover: 'hover:bg-sky-600',
    text: 'text-sky-500 dark:text-sky-400',
    border: 'border-sky-500',
    borderLight: 'border-sky-500/30',
    bgLight: 'bg-sky-500/10 dark:bg-sky-500/15',
    gradient: 'from-sky-500 to-indigo-500',
    badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    glow: 'shadow-sky-500/25',
    activeNav: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
  },
  purple: {
    name: 'Imperial Violet',
    primary: 'bg-purple-500',
    primaryHover: 'hover:bg-purple-600',
    text: 'text-purple-500 dark:text-purple-400',
    border: 'border-purple-500',
    borderLight: 'border-purple-500/30',
    bgLight: 'bg-purple-500/10 dark:bg-purple-500/15',
    gradient: 'from-purple-500 to-pink-500',
    badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    glow: 'shadow-purple-500/25',
    activeNav: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
  },
  slate: {
    name: 'Monochrome Slate',
    primary: 'bg-slate-600',
    primaryHover: 'hover:bg-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-500',
    borderLight: 'border-slate-500/30',
    bgLight: 'bg-slate-500/10 dark:bg-slate-500/15',
    gradient: 'from-slate-700 to-slate-900',
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
    glow: 'shadow-slate-500/25',
    activeNav: 'bg-slate-500/15 text-slate-700 dark:text-slate-200 border-slate-500/30'
  }
};

export function UIFormatProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not parse saved UI format settings:', e);
    }
    return defaultSettings;
  });

  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save UI format settings:', e);
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetKey) => {
    if (presetKey === 'sarkari') {
      setSettings((prev) => ({
        ...prev,
        viewFormat: 'table',
        density: 'compact',
        language: 'bilingual',
        accent: 'orange'
      }));
    } else if (presetKey === 'cards') {
      setSettings((prev) => ({
        ...prev,
        viewFormat: 'grid',
        density: 'comfortable',
        language: 'bilingual',
        accent: 'orange'
      }));
    } else if (presetKey === 'scanner') {
      setSettings((prev) => ({
        ...prev,
        viewFormat: 'compact',
        density: 'compact',
        language: 'en',
        accent: 'blue'
      }));
    } else if (presetKey === 'timeline') {
      setSettings((prev) => ({
        ...prev,
        viewFormat: 'timeline',
        density: 'comfortable',
        language: 'bilingual',
        accent: 'emerald'
      }));
    }
  };

  const resetFormat = () => {
    setSettings(defaultSettings);
  };

  const t = (key) => {
    const lang = settings.language || 'bilingual';
    const dict = translations[lang] || translations.bilingual;
    return dict[key] || translations.en[key] || key;
  };

  const currentAccent = accentStyles[settings.accent] || accentStyles.orange;

  return (
    <UIFormatContext.Provider
      value={{
        viewFormat: settings.viewFormat,
        setViewFormat: (v) => updateSetting('viewFormat', v),
        density: settings.density,
        setDensity: (v) => updateSetting('density', v),
        language: settings.language,
        setLanguage: (v) => updateSetting('language', v),
        accent: settings.accent,
        setAccent: (v) => updateSetting('accent', v),
        accentStyle: currentAccent,
        isFormatModalOpen,
        setIsFormatModalOpen,
        applyPreset,
        resetFormat,
        t
      }}
    >
      {children}
    </UIFormatContext.Provider>
  );
}

export function useUIFormat() {
  const ctx = useContext(UIFormatContext);
  if (!ctx) {
    throw new Error('useUIFormat must be used within a UIFormatProvider');
  }
  return ctx;
}
