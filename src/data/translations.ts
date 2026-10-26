import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  courses: string;
  readingMaterials: string;
  medTracker: string;
  liveChat: string;
  drugChecker: string;
  labInterpretation: string;
  patientHistory: string;
  guidelines: string;
  moa3D: string;
  offlineAccess: string;
  proBadge: string;
  freeAccount: string;
  login: string;
  logout: string;
  register: string;
  upgradePro: string;
  searchPlaceholder: string;
  freeCredentialsBanner: string;
  quickLogin: string;
  registrationFeeNotice: string;
  cbeAccountInfo: string;
  copyAccount: string;
  accountCopied: string;
  submitPayment: string;
  offlineModeActive: string;
  syncNow: string;
  allCoursesTitle: string;
  pharmacistOnline: string;
  askPharmacist: string;
  doseReminder: string;
  adherenceRate: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "Pharma Star App Pro",
    appTagline: "The Complete Clinical Pharmacy & Pharmaceutical Sciences Suite",
    courses: "Academic Courses",
    readingMaterials: "Reading & Pearls",
    medTracker: "Medication Tracker",
    liveChat: "Pharmacist Live Chat",
    drugChecker: "Drug Interactions",
    labInterpretation: "Lab Interpretation",
    patientHistory: "Patient Management",
    guidelines: "Live Guidelines",
    moa3D: "3D Drug MOA & Videos",
    offlineAccess: "Offline Database",
    proBadge: "PRO MEMBER",
    freeAccount: "Free Demo Account",
    login: "Log In",
    logout: "Log Out",
    register: "Register / Upgrade",
    upgradePro: "Upgrade to Pro (100 Birr / $1)",
    searchPlaceholder: "Search drugs, guidelines, courses, labs...",
    freeCredentialsBanner: "Free Access Credentials: Name: Pharmastar | Password: •••••••••••••• (Click to sign in)",
    quickLogin: "Quick Login (Free Account)",
    registrationFeeNotice: "Registration Fee: 100 Birr (Ethiopia) or $1.00 USD (Foreigners)",
    cbeAccountInfo: "Commercial Bank of Ethiopia: 1000262900367 (Dawid Aliyi)",
    copyAccount: "Copy CBE Account",
    accountCopied: "Account Number Copied!",
    submitPayment: "Confirm Payment & Activate Pro",
    offlineModeActive: "Offline Database Active (Remote Areas)",
    syncNow: "Sync Offline Data",
    allCoursesTitle: "Comprehensive Pharmacy Curriculum",
    pharmacistOnline: "Clinical Pharmacist On-Duty",
    askPharmacist: "Send inquiry to Clinical Pharmacist...",
    doseReminder: "Today's Dose Schedule",
    adherenceRate: "Adherence Score"
  },
  am: {
    appName: "ፋርማ ስታር አፕ ፕሮ (Pharma Star App Pro)",
    appTagline: "የተሟላ የክሊኒካል ፋርማሲ እና ፋርማሲዩቲካል ሳይንስ መተግበሪያ",
    courses: "የትምህርት ኮርሶች",
    readingMaterials: "የንባብ ሰነዶች እና ዕውቀቶች",
    medTracker: "የመድኃኒት ክትትል",
    liveChat: "የቀጥታ ፋርማሲስት ውይይት",
    drugChecker: "የመድኃኒት መስተጋብር መመርመሪያ",
    labInterpretation: "የላብራቶሪ ምርመራ ትንታኔ",
    patientHistory: "የታካሚዎች ታሪክ አስተዳደር",
    guidelines: "ሀገራዊ እና አለምአቀፍ መመሪያዎች",
    moa3D: "ባለ 3D የመድኃኒት አሰራር እና ቪዲዮ",
    offlineAccess: "ከኢንተርኔት ውጪ የሚሰራ ቋት",
    proBadge: "ፕሮ አባል",
    freeAccount: "ነጻ የሙከራ መለያ",
    login: "ይግቡ",
    logout: "ይውጡ",
    register: "ይመዝገቡ / ፕሮ ያድርጉ",
    upgradePro: "ወደ ፕሮ ያሳድጉ (100 ብር / $1)",
    searchPlaceholder: "መድኃኒቶችን፣ መመሪያዎችን፣ ላቦችን ይፈልጉ...",
    freeCredentialsBanner: "ነፃ የመግቢያ መረጃ፡ ስም፡ Pharmastar | የይለፍ ቃል፡ •••••••••••••• (ለመግባት እዚህ ይጫኑ)",
    quickLogin: "በነጻ መለያ በፍጥነት ይግቡ",
    registrationFeeNotice: "የምዝገባ ክፍያ፡ 100 ብር (ለኢትዮጵያውያን) ወይም 1 ዶላር (ለውጭ ሀገር)",
    cbeAccountInfo: "የኢትዮጵያ ንግድ ባንክ፡ 1000262900367 (ዳዊት አሊዪ)",
    copyAccount: "የንግድ ባንክ ቁጥር ኮፒ አድርግ",
    accountCopied: "የሂሳብ ቁጥሩ ተቀድቷል!",
    submitPayment: "ክፍያውን አረጋግጥ እና ፕሮ አግብር",
    offlineModeActive: "ከኢንተርኔት ውጪ ንቁ ነው (ለገጠር አካባቢዎች)",
    syncNow: "መረጃዎችን አሁን አውርድ",
    allCoursesTitle: "የተሟላ የፋርማሲ ትምህርት ዘርፎች",
    pharmacistOnline: "ክሊኒካል ፋርማሲስት ዝግጁ ነው",
    askPharmacist: "ለፋርማሲስቱ ጥያቄዎን ይላኩ...",
    doseReminder: "የዛሬ የመድኃኒት መርሃግብር",
    adherenceRate: "የመውሰድ ምጣኔ"
  },
  om: {
    appName: "Faarmaa Istari Appii Pro",
    appTagline: "Sirna Barnoota Saayinsii Faarmaasii fi Yaalii Guutuu",
    courses: "Koorsoota Barnootaa",
    readingMaterials: "Dubbisa fi Qabxiilee Ijoo",
    medTracker: "Hordoffii Qorichaa",
    liveChat: "Haasaa Kallattii Ogeessa Faarmaasii",
    drugChecker: "Wal-faallessaa Qorichootaa",
    labInterpretation: "Hiika Qorannoo Laabooratorii",
    patientHistory: "Seenaa Dhukkubsataa",
    guidelines: "Qajeelfamoota Biyyoolessaa fi Idil-addunyaa",
    moa3D: "Viidiyoo fi 3D Sochii Qorichaa",
    offlineAccess: "Kuusaa Interneetii Malee Dalagu",
    proBadge: "Miseensa PRO",
    freeAccount: "Akkaawuntii Bilisaa",
    login: "Seeni",
    logout: "Bahi",
    register: "Galmaa'i / Pro Ta'i",
    upgradePro: "Gara Protti Ol guddisi (Birrii 100 / $1)",
    searchPlaceholder: "Qoricha, qajeelfama, laabii barbaadi...",
    freeCredentialsBanner: "Odeeffannoo Seensaa Bilisaa: Maqaa: Pharmastar | Jecha Iccitii: •••••••••••••• (Seenuuf cuqaasaa)",
    quickLogin: "Akkaawuntii Bilisaan Dafee Seeni",
    registrationFeeNotice: "Kaffaltii Galmee: Birrii 100 (Itoophiyaa) ykn Doolaara $1.00 (Biyya Alaa)",
    cbeAccountInfo: "Baankii Daldala Itoophiyaa (CBE): 1000262900367 (Dawid Aliyi)",
    copyAccount: "Lakk. Akkaawuntii CBE Koompii Godhi",
    accountCopied: "Lakkoofsi Akkaawuntii Koompii Ta'eera!",
    submitPayment: "Kaffaltii Mirkaneessi & Pro Banadhu",
    offlineModeActive: "Interneetii Malee Ni Hojjeta (Naannolee Fagoodhaaf)",
    syncNow: "Daataa Amma Sinkii Godhi",
    allCoursesTitle: "Sirna Barnoota Faarmaasii Bal'aa",
    pharmacistOnline: "Ogeessi Faarmaasii Qophiidha",
    askPharmacist: "Gaaffii kee ogeessaaf ergi...",
    doseReminder: "Sagantaa Qorichaa Har'aa",
    adherenceRate: "Sadarkaa Qoricha Fudhatamaa"
  },
  fr: {
    appName: "Pharma Star App Pro",
    appTagline: "Suite Complète de Pharmacie Clinique et Sciences Pharmaceutiques",
    courses: "Cours Académiques",
    readingMaterials: "Supports et Perles Cliniques",
    medTracker: "Suivi des Traitements",
    liveChat: "Chat Pharmacien en Direct",
    drugChecker: "Interactions Médicamenteuses",
    labInterpretation: "Interprétation Biologique",
    patientHistory: "Dossier Patient",
    guidelines: "Recommandations en Direct",
    moa3D: "Animations 3D & Vidéos",
    offlineAccess: "Base de Données Hors-Ligne",
    proBadge: "MEMBRE PRO",
    freeAccount: "Compte Gratuit Démo",
    login: "Connexion",
    logout: "Déconnexion",
    register: "S'inscrire / Passer Pro",
    upgradePro: "Passer à Pro (100 Birr / 1 $)",
    searchPlaceholder: "Rechercher médicaments, bilans, cours...",
    freeCredentialsBanner: "Identifiants Gratuits : Nom : Pharmastar | Mot de passe : •••••••••••••• (Connexion rapide)",
    quickLogin: "Connexion Rapide Gratuite",
    registrationFeeNotice: "Frais d'inscription : 100 Birr (Éthiopie) ou 1,00 $ US (Étranger)",
    cbeAccountInfo: "Commercial Bank of Ethiopia: 1000262900367 (Dawid Aliyi)",
    copyAccount: "Copier le compte CBE",
    accountCopied: "Numéro de compte copié !",
    submitPayment: "Confirmer le paiement et Activer Pro",
    offlineModeActive: "Mode Hors-Ligne Actif (Zones Isolées)",
    syncNow: "Synchroniser Maintenant",
    allCoursesTitle: "Programme Complet de Pharmacie",
    pharmacistOnline: "Pharmacien Clinique en Ligne",
    askPharmacist: "Envoyer un message au pharmacien...",
    doseReminder: "Calendrier des Prises",
    adherenceRate: "Taux d'Observance"
  },
  ar: {
    appName: "فارما ستار برو (Pharma Star App Pro)",
    appTagline: "المجموعة الشاملة للصيدلة السريرية والعلوم الصيدلانية",
    courses: "المقررات الأكاديمية",
    readingMaterials: "المراجع والمعلومات السريرية",
    medTracker: "تتبع الأدوية",
    liveChat: "محادثة صيدلي مباشر",
    drugChecker: "فاحص التداخلات الدوائية",
    labInterpretation: "تفسير الفحوصات المخبرية",
    patientHistory: "إدارة سجل المرضى",
    guidelines: "الإرشادات السريرية المحدثة",
    moa3D: "آلية العمل ثلاثية الأبعاد والفيديو",
    offlineAccess: "قاعدة بيانات بدون إنترنت",
    proBadge: "عضوية احترافية PRO",
    freeAccount: "حساب تجريبي مجاني",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    register: "تسجيل / ترقية إلى برو",
    upgradePro: "الترقية إلى برو (100 بر / 1 دولار)",
    searchPlaceholder: "ابحث عن الأدوية، الإرشادات، التحاليل...",
    freeCredentialsBanner: "بيانات الدخول المجانية: الاسم: Pharmastar | كلمة المرور: •••••••••••••• (دخول سريع)",
    quickLogin: "دخول سريع مجاني",
    registrationFeeNotice: "رسوم التسجيل: 100 بر (إثيوبيا) أو 1.00 دولار أمريكي (دولياً)",
    cbeAccountInfo: "البنك التجاري الإثيوبي (CBE): 1000262900367 (Dawid Aliyi)",
    copyAccount: "نسخ رقم حساب البنك",
    accountCopied: "تم نسخ رقم الحساب!",
    submitPayment: "تأكيد الدفع وتفعيل النسخة الاحترافية",
    offlineModeActive: "الوضع غير المتصل نشط (للمناطق النائية)",
    syncNow: "مزامنة البيانات الآن",
    allCoursesTitle: "منهج الصيدلة المتكامل",
    pharmacistOnline: "صيدلي سريري متواجد الآن",
    askPharmacist: "أرسل استفسارك للصيدلي السريري...",
    doseReminder: "جدول جرعات اليوم",
    adherenceRate: "معدل الالتزام الدوائي"
  },
  es: {
    appName: "Pharma Star App Pro",
    appTagline: "Suite Integral de Farmacia Clínica y Ciencias Farmacéuticas",
    courses: "Cursos Académicos",
    readingMaterials: "Materiales y Perlas Clínicas",
    medTracker: "Seguimiento de Medicación",
    liveChat: "Chat Farmacéutico en Vivo",
    drugChecker: "Interacciones Farmacológicas",
    labInterpretation: "Interpretación de Laboratorio",
    patientHistory: "Gestión de Pacientes",
    guidelines: "Guías Clínicas en Directo",
    moa3D: "Mecanismos 3D y Videos",
    offlineAccess: "Base de Datos sin Conexión",
    proBadge: "MIEMBRO PRO",
    freeAccount: "Cuenta Gratuita de Prueba",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    register: "Registrarse / Pasar a Pro",
    upgradePro: "Actualizar a Pro (100 Birr / $1)",
    searchPlaceholder: "Buscar fármacos, guías, analíticas...",
    freeCredentialsBanner: "Credenciales Gratuitas: Usuario: Pharmastar | Contraseña: •••••••••••••• (Acceso Rápido)",
    quickLogin: "Acceso Rápido Gratuito",
    registrationFeeNotice: "Cuota de registro: 100 Birr (Etiopía) o $1.00 USD (Internacional)",
    cbeAccountInfo: "Commercial Bank of Ethiopia: 1000262900367 (Dawid Aliyi)",
    copyAccount: "Copiar Cuenta CBE",
    accountCopied: "¡Número de cuenta copiado!",
    submitPayment: "Confirmar Pago y Activar Pro",
    offlineModeActive: "Base de Datos Offline Activa (Zonas Remotas)",
    syncNow: "Sincronizar Datos Offline",
    allCoursesTitle: "Plan de Estudios Farmacéuticos Integral",
    pharmacistOnline: "Farmacéutico Clínico de Guardia",
    askPharmacist: "Consultar con el farmacéutico clínico...",
    doseReminder: "Horario de Medicación de Hoy",
    adherenceRate: "Índice de Adherencia"
  }
};
