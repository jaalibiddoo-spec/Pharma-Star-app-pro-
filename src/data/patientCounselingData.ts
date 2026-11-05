export type SupportedCounselingLang = 'en' | 'om' | 'am' | 'fr' | 'ar' | 'es';

export interface MultilingualText {
  en: string;
  om: string;
  am: string;
  fr: string;
  ar: string;
  es: string;
}

export interface PatientMedicationCounselingProfile {
  id: string;
  genericName: string;
  brandNames: string[];
  therapeuticClass: MultilingualText;
  primaryUses: MultilingualText;
  howToTake: MultilingualText;
  timingSchedule: {
    morning: boolean;
    noon: boolean;
    evening: boolean;
    bedtime: boolean;
    frequencyNote: MultilingualText;
  };
  foodInteraction: 'with_food' | 'empty_stomach' | 'either' | 'avoid_dairy';
  foodInstruction: MultilingualText;
  criticalPrecautions: MultilingualText[];
  commonSideEffects: MultilingualText[];
  redFlagWarning: MultilingualText;
  pregnancyRisk: {
    categoryFDA: 'A' | 'B' | 'C' | 'D' | 'X';
    explanation: MultilingualText;
  };
  storageCondition: MultilingualText;
}

export const counselingMedications: PatientMedicationCounselingProfile[] = [
  {
    id: 'metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Glumet', 'Metfor'],
    therapeuticClass: {
      en: 'Oral Antidiabetic (Biguanide)',
      om: 'Qoricha Sukkaaraa Afaaniin Fudhatamu (Biguanide)',
      am: 'የስኳር በሽታ መቆጣጠሪያ መድኃኒት (ቢጓናይድ)',
      fr: 'Antidiabétique oral (Biguanide)',
      ar: 'مضاد السكري الفموي (بيغوانيد)',
      es: 'Antidiabético oral (Biguanida)'
    },
    primaryUses: {
      en: 'Controls high blood sugar in Type 2 Diabetes by improving insulin sensitivity and reducing liver glucose production.',
      om: 'Dhibee sukkaaraa gosa 2ffaaf dhiiga keessatti hamma sukkaaraa to’achuuf oola.',
      am: 'የሁለተኛ ዓይነት የስኳር በሽታ ያለባቸው ሰዎች በደም ውስጥ ያለውን የስኳር መጠን እንዲቆጣጠሩ ይረዳል::',
      fr: 'Contrôle la glycémie dans le diabète de type 2 en améliorant la sensibilité à l’insuline.',
      ar: 'يتحكم في نسبة السكر في الدم لدى مرضى السكري من النوع الثاني.',
      es: 'Controla el azúcar en sangre en la diabetes tipo 2 al mejorar la sensibilidad a la insulina.'
    },
    howToTake: {
      en: 'Swallow whole with a full glass of water. Take with or immediately after meals to reduce stomach upset. Do NOT crush or chew extended-release (XR) tablets.',
      om: 'Bishaan guutuudhaan liqimsaa. Nyaata wajjin yookaan nyaata booda yeruma sana fudhadhaa. Kiniinii hin caccabsinaa.',
      am: 'ከምግብ ጋር ወይም ከምግብ በኋላ ወዲያውኑ በበቂ ውኃ ይውጡ:: የሆድ ሕመምን ይቀንሳል:: ኪኒኑን አያኝኩ ወይም አይሰባብሩ::',
      fr: 'Avalez entier avec un grand verre d’eau au milieu ou à la fin d’un repas.',
      ar: 'ابلع القرص كاملًا مع كوب ماء مع الوجبات أو بعدها مباشرة لتجنب اضطراب المعدة.',
      es: 'Trague entero con un vaso de agua con las comidas para reducir el malestar estomacal.'
    },
    timingSchedule: {
      morning: true,
      noon: false,
      evening: true,
      bedtime: false,
      frequencyNote: {
        en: 'Twice daily with breakfast and dinner.',
        om: 'Guyyaatti yeroo lama, ciree fi laaqana booda.',
        am: 'በቀን ሁለት ጊዜ ከቁርስ እና ከእራት ጋር::',
        fr: 'Deux fois par jour avec le petit-déjeuner et le dîner.',
        ar: 'مرتين يوميًا مع وجبتي الإفطار والعشاء.',
        es: 'Dos veces al día con el desayuno y la cena.'
      }
    },
    foodInteraction: 'with_food',
    foodInstruction: {
      en: 'Always take with food to minimize nausea, diarrhea, and abdominal cramping.',
      om: 'Balaqamaa fi garaa kaasaa ittisuuf yeroo hunda nyaata wajjin fudhadhaa.',
      am: 'የማቅለሽለሽ እና የተቅማጥ ስሜትን ለመቀነስ ሁልጊዜ ከምግብ ጋር ይውሰዱት::',
      fr: 'Prendre impérativement avec de la nourriture.',
      ar: 'يؤخذ دائمًا مع الطعام لتقليل الغثيان والإسهال.',
      es: 'Tomar siempre con alimentos para evitar náuseas o diarrea.'
    },
    criticalPrecautions: [
      {
        en: 'Avoid excessive alcohol consumption as it multiplies the risk of lactic acidosis.',
        om: 'Dhugaatii alkoolii irraa fagaadhaa; balaa dhiiga asidii taasisanii dabala.',
        am: 'አልኮል መጠጣትን ያስወግዱ; አደገኛ የሆነውን የላክቲክ አሲዶሲስ አደጋ ይጨምራል::',
        fr: 'Évitez la consommation excessive d’alcool.',
        ar: 'تجنب تناول الكحول نهائيًا لتجنب الحماض اللبني الخطير.',
        es: 'Evite el consumo excesivo de alcohol.'
      },
      {
        en: 'Inform your doctor/radiologist before undergoing CT scans with IV iodinated contrast dye.',
        om: 'Qorannoo CT Scan qoricha dhangala’aa wajjin gochuu keessan dura ogeessa yaalaa keessanitti himaa.',
        am: 'የሲቲ ስካን (CT scan) ምርመራ ከማድረግዎ በፊት ለሐኪምዎ ይናገሩ::',
        fr: 'Signalez la prise de metformine avant tout examen radiologique avec produit de contraste iodé.',
        ar: 'أخبر طبيبك قبل إجراء أي تصوير بالأشعة المقطعية مع صبغة اليود.',
        es: 'Informe a su médico antes de someterse a tomografías con contraste yodado.'
      }
    ],
    commonSideEffects: [
      {
        en: 'Nausea, metallic taste in mouth, loose stools, gas (usually improves after 1-2 weeks).',
        om: 'Balaqqama, mi’aawa dhabuu afaanii, garaa kaasaa (torbee 1-2 booda fooyya’a).',
        am: 'ማቅለሽለሽ፣ በአፍ ውስጥ የብረት ጣዕም መሰማት፣ ጋዝ (ብዙውን ጊዜ ከ1-2 ሳምንታት በኋላ ይሻሻላል)::',
        fr: 'Nausées, goût métallique, selles molles, ballonnements.',
        ar: 'غثيان، طعم معدني في الفم، إسهال خفيف، انتفاخ.',
        es: 'Náuseas, sabor metálico, diarrea leve, gases.'
      }
    ],
    redFlagWarning: {
      en: 'SEEK EMERGENCY CARE IMMEDIATELY if you experience extreme fatigue, severe muscle pain, rapid shallow breathing, slow heartbeat, or severe stomach pain (Lactic Acidosis).',
      om: 'Dadhabbiin cimaan, maashaalee dhukkubsuun, hafuura baafachuu dadhabuun yoo jiraate yeruma sana gara kilinikaatti deemaa!',
      am: 'ከፍተኛ ድካም፣ የጡንቻ ሕመም፣ የመተንፈስ መቆራረጥ ወይም ከባድ የሆድ ሕመም ከተሰማዎት ወዲያውኑ ድንገተኛ ሕክምና ያግኙ!',
      fr: 'CONSULTEZ D’URGENCE en cas de fatigue extrême, douleurs musculaires intenses ou difficultés respiratoires.',
      ar: 'اطلب العناية الطارئة فورًا إذا شعرت بإرهاق شديد، ألم عضلي حاد، أو صعوبة في التنفس.',
      es: 'ACUDA A URGENCIAS INMEDIATAMENTE si presenta fatiga extrema, dolor muscular severo o dificultad para respirar.'
    },
    pregnancyRisk: {
      categoryFDA: 'B',
      explanation: {
        en: 'Generally considered safe under specialist medical supervision during gestational diabetes.',
        om: 'Yeroo ulfaa to’annoo ogeessa fayyaa jala jiraachuun fudhatamuu ni danda’a.',
        am: 'በእርግዝና ወቅት በሐኪም ክትትል ስር ሊወሰድ ይችላል::',
        fr: 'Généralement considéré comme sûr sous surveillance médicale.',
        ar: 'يعتبر آمنًا بوجه عام تحت إشراف طبي أثناء سكري الحمل.',
        es: 'Generalmente seguro bajo supervisión médica especializada.'
      }
    },
    storageCondition: {
      en: 'Store below 25°C in a dry place away from direct sunlight and moisture. Keep out of reach of children.',
      om: 'Iddoo qabbanaawaa fi aduu irraa fagaatetti kuusaa. Ijoollee irraa fageessaa.',
      am: 'ከፀሐይ ብርሃን እና እርጥበት ርቆ ከ25 ዲግሪ ሴንቲግሬድ በታች በደረቅ ቦታ ያስቀምጡ:: ከሕፃናት እጅ ያርቁ::',
      fr: 'Conserver en dessous de 25°C à l’abri de l’humidité.',
      ar: 'يحفظ في درجة حرارة أقل من 25 درجة مئوية بعيدًا عن الرطوبة وأشعة الشمس.',
      es: 'Conservar a menos de 25°C en lugar seco protegido de la luz solar.'
    }
  },
  {
    id: 'enalapril',
    genericName: 'Enalapril Maleate',
    brandNames: ['Vasotec', 'Enapharm', 'Enalapril'],
    therapeuticClass: {
      en: 'Antihypertensive (ACE Inhibitor)',
      om: 'Qoricha Dhiibbaa Dhiigaa (ACE Inhibitor)',
      am: 'የደም ግፊት መቆጣጠሪያ መድኃኒት (ኤሲኢ ኢንሂቢተር)',
      fr: 'Antihypertenseur (Inhibiteur de l’ECA)',
      ar: 'خافض لضغط الدم (مثبط الإنزيم المحول للأنجيوتنسين)',
      es: 'Antihipertensivo (Inhibidor de la ECA)'
    },
    primaryUses: {
      en: 'Lowers high blood pressure, protects kidney function in diabetes, and treats heart failure.',
      om: 'Dhiibbaa dhiigaa hir’isuu, kalee eeguu fi dhukkuba onneetiif gargaara.',
      am: 'የደም ግፊትን ይቀንሳል፣ የኩላሊት ጤናን ይጠብቃል፣ እንዲሁም የልብ ድካምን ያክማል::',
      fr: 'Réduit la pression artérielle et protège les reins dans l’insuffisance cardiaque.',
      ar: 'يخفض ضغط الدم المرتفع ويحمي وظائف الكلى لدى مرضى السكري وضعف عضلة القلب.',
      es: 'Disminuye la presión arterial alta y protege los riñones en la diabetes.'
    },
    howToTake: {
      en: 'Take with or without food at the same time each day. Drink plenty of fluids.',
      om: 'Guyyaa guyyaan sa’aatii walfakkaatatti nyaata wajjin yookaan osoo hin nyaatin fudhadhaa.',
      am: 'በየቀኑ በተመሳሳይ ሰዓት ከምግብ ጋር ወይም ያለ ምግብ መውሰድ ይችላሉ::',
      fr: 'À prendre chaque jour à la même heure, avec ou sans nourriture.',
      ar: 'تناول الدواء في نفس الوقت يوميًا مع الطعام أو بدونه.',
      es: 'Tómelo a la misma hora todos los días con o sin alimentos.'
    },
    timingSchedule: {
      morning: true,
      noon: false,
      evening: false,
      bedtime: false,
      frequencyNote: {
        en: 'Once or twice daily as prescribed.',
        om: 'Guyyaatti yeroo tokko ganama.',
        am: 'በቀን አንድ ጊዜ በጠዋት::',
        fr: 'Une à deux fois par jour selon prescription.',
        ar: 'مرة أو مرتين يوميًا حسب تعليمات الطبيب.',
        es: 'Una o dos veces al día según prescripción médica.'
      }
    },
    foodInteraction: 'either',
    foodInstruction: {
      en: 'Can be taken with or without food. Avoid potassium-rich salt substitutes.',
      om: 'Nyaata wajjin yookaan malee fudhatamuu danda’a. Soogidda potaasiyeemii qabu irraa fagaadhaa.',
      am: 'ከምግብ ጋርም ሆነ ያለ ምግብ መውሰድ ይቻላል:: የፖታስየም ጨው ምትኮችን ያስወግዱ::',
      fr: 'Peut être pris avec ou sans repas. Évitez les sels de régime riches en potassium.',
      ar: 'يمكن تناوله مع الطعام أو بدونه. تجنب بدائل الملح الغنية بالبوتاسيوم.',
      es: 'Puede tomarse con o sin alimentos. Evite sustitutos de sal ricos en potasio.'
    },
    criticalPrecautions: [
      {
        en: 'Stand up slowly from sitting or lying down to prevent dizziness or fainting (Orthostatic hypotension).',
        om: 'Yeroo ciistan yookaan teessan suuta jedhaa ka’aa; dhukkubni mataa fi gaggabduun akka isin hin qabneef.',
        am: 'ሲቀመጡ ወይም ሲተኙ ቀስ ብለው ይነሱ; ራስ ማዞርን ለመከላከል ይረዳል::',
        fr: 'Levez-vous lentement pour éviter les étourdissements.',
        ar: 'انهض ببطء لتجنب الدوخة أو الإغماء نتيجة هبوط الضغط.',
        es: 'Levántese lentamente para evitar mareos o desmayos.'
      },
      {
        en: 'Strictly prohibited in pregnancy: causes fetal death or severe birth defects.',
        om: 'Haadholii ulfaatiif gonkumaa dhorkadha; mucaa garaa keessaa ajjeesuu danda’a.',
        am: 'ለነፍሰ ጡር ሴቶች ፈፅሞ የተከለከለ ነው; በማህፀን ውስጥ ያለን ፅንስ ይጎዳል ወይም ይገድላል::',
        fr: 'CONTRE-INDIQUÉ pendant toute la grossesse (toxicité fœtale grave).',
        ar: 'ممنوع تمامًا أثناء الحمل لتسببه في تشوهات أو وفاة الجنين.',
        es: 'Estrictamente contraindicado en el embarazo.'
      }
    ],
    commonSideEffects: [
      {
        en: 'Persistent dry tickling cough (present in 10-15% patients; does not respond to cough syrup; notify doctor to switch to ARB like Losartan).',
        om: 'Qufaa gogaa walirraa hin cinne (ogeessa fayyaatti himaa qorichi biraa akka jijjiiramuuf).',
        am: 'የማያቋርጥ ደረቅ ሳል (በሳል ሽሮፕ አይጠፋም; ሐኪምዎን በማማከር ወደ ሎሳርታን መቀየር ይችላሉ)::',
        fr: 'Toux sèche persistante (prévenir le médecin).',
        ar: 'سعال جاف ومستمر (أخبر طبيبك لاستبداله بدواء بديل).',
        es: 'Tos seca persistente (consulte al médico para cambiar de medicamento).'
      }
    ],
    redFlagWarning: {
      en: 'GO TO THE NEAREST HOSPITAL IMMEDIATELY if your lips, tongue, face, or throat swell, or if you have difficulty breathing (Angioedema emergency).',
      om: 'Hidhiin, arrabni, yookaan fuulli keessan yoo dhiita’e yeruma sana gara hospitaalaatti fiigaa!',
      am: 'ከንፈርዎ፣ ምላስዎ ወይም ጉሮሮዎ ካበጠ ወይም ለመተንፈስ ከተቸገሩ ወዲያውኑ ወደ ድንገተኛ ሕክምና ይሂዱ!',
      fr: 'URGENCE IMMÉDIATE en cas de gonflement du visage, des lèvres, de la langue ou de la gorge (Angio-œdème).',
      ar: 'توجه إلى الطوارئ فورًا إذا تورمت شفتاك أو لسانك أو حنجرتك أو شعرت بضيق التنفس.',
      es: 'ACUDA A URGENCIAS INMEDIATAMENTE si se hinchan los labios, lengua o garganta.'
    },
    pregnancyRisk: {
      categoryFDA: 'D',
      explanation: {
        en: 'BLACK BOX WARNING: Absolute contraindication in pregnancy (fetotoxic).',
        om: 'Balaadha: Ulfa keessatti gonkumaa hin fudhatinaa.',
        am: 'ጥቁር ማስጠንቀቂያ፡ በእርግዝና ወቅት ፈጽሞ የተከለከለ ነው::',
        fr: 'Avertissement majeur : Contre-indication absolue.',
        ar: 'تحذير شديد: محظور تمامًا أثناء الحمل.',
        es: 'Contraindicación absoluta durante el embarazo.'
      }
    },
    storageCondition: {
      en: 'Keep tightly closed in original bottle below 25°C. Protect from moisture.',
      om: 'Qaruuraa isaa keessatti qabbanaatti qabaa.',
      am: 'በመጀመሪያው እቃው ውስጥ ከ25 ዲግሪ ሴንቲግሬድ በታች በደረቅ ቦታ ያስቀምጡ::',
      fr: 'Conserver dans l’emballage d’origine en dessous de 25°C.',
      ar: 'يحفظ في عبوته الأصلية محكمة الإغلاق تحت 25 درجة مئوية.',
      es: 'Conservar en su envase original a menos de 25°C.'
    }
  },
  {
    id: 'coartem',
    genericName: 'Artemether + Lumefantrine',
    brandNames: ['Coartem', 'Lonart', 'Riamet'],
    therapeuticClass: {
      en: 'Antimalarial (Artemisinin-based Combination Therapy - ACT)',
      om: 'Qoricha Busaa (ACT)',
      am: 'የወባ በሽታ ማከሚያ መድኃኒት (ኤሲቲ)',
      fr: 'Antipaludéen (Association à base d’artémisinine)',
      ar: 'مضاد للملاريا (علاج تركيبي قائم على مادة الأرتيميسينين)',
      es: 'Antipalúdico (Terapia combinada con artemisinina)'
    },
    primaryUses: {
      en: 'First-line national treatment for uncomplicated Plasmodium falciparum malaria.',
      om: 'Wallaansa dhibee busaa isa jalqabaa fi murteessaadha.',
      am: 'ለፕላስሞዲየም ፋልሲፓረም የወባ በሽታ የመጀመሪያ ደረጃ ፈዋሽ መድኃኒት ነው::',
      fr: 'Traitement de première ligne du paludisme non compliqué à P. falciparum.',
      ar: 'علاج الخط الأول للملاريا غير المعقدة المتسببة عن المتصورة المنجلية.',
      es: 'Tratamiento de primera línea para la malaria por P. falciparum.'
    },
    howToTake: {
      en: 'Complete the full 3-day (6-dose) regimen exactly on schedule! MUST BE TAKEN WITH FATTY FOOD OR MILK to ensure adequate gut absorption of Lumefantrine. If vomiting occurs within 1 hour, take a replacement dose.',
      om: 'Guyyoota 3 guutuu qoricha 6 hunda dhumatti fudhadhaa! Qorichi kun akka qaama keessatti sirriitti hojjetuuf NYAATA COOMA QABU yookaan AANAN wajjin fudhatamuu qaba. Yoo sa’aatii 1 keessatti diddigan deebisaa fudhadhaa.',
      am: 'ሙሉውን የ3 ቀን (6 መጠን) ሕክምና ሳያቋርጡ ይጨርሱ! መድኃኒቱ በሰውነት ውስጥ በሚገባ እንዲሰራ በቅባት የበለፀገ ምግብ ወይም ወተት ጋር መወሰድ አለበት:: በአንድ ሰዓት ውስጥ ቢያስመልስዎት ተጨማሪ አንድ መጠን ይውሰዱ::',
      fr: 'Prendre la totalité des 6 doses sur 3 jours impérativement avec un repas gras ou du lait.',
      ar: 'أكمل الجرعات الست المقررة على مدار 3 أيام مع وجبة دسمة أو حليب لضمان امتصاص الدواء.',
      es: 'Complete las 6 dosis en 3 días estrictamente con alimentos grasos o leche.'
    },
    timingSchedule: {
      morning: true,
      noon: false,
      evening: true,
      bedtime: false,
      frequencyNote: {
        en: 'Hour 0 (initial), Hour 8, then twice daily on Day 2 and Day 3.',
        om: 'Sa’aatii 0, sa’aatii 8 booda, itti aansuun guyyaa 2ffaa fi 3ffaa ganamaa fi galgala.',
        am: 'መጀመሪያ 0 ሰዓት፣ ከ8 ሰዓት በኋላ፣ ከዚያም በ2ኛ እና 3ኛ ቀን ጠዋት እና ማታ::',
        fr: 'Heure 0, Heure 8, puis 2 fois par jour les jours 2 et 3.',
        ar: 'الجرعة الأولى فورًا، الثانية بعد 8 ساعات، ثم مرتين يوميًا في اليومين 2 و3.',
        es: 'Hora 0, Hora 8, luego dos veces al día en los días 2 y 3.'
      }
    },
    foodInteraction: 'with_food',
    foodInstruction: {
      en: 'CRITICAL: Must be taken with fatty food, milk, or breastfeeding. Absorption increases up to 16-fold with fatty meal.',
      om: 'MURTEESSAADHA: Nyaata cooma qabu yookaan aannan wajjin fudhadhaa.',
      am: 'ወሳኝ፡ በቅባት የበለፀገ ምግብ ወይም ወተት ጋር መወሰድ አለበት:: የመድኃኒቱ አሰራር በ16 እጥፍ ይጨምራል::',
      fr: 'Prendre impérativement avec du lait ou un repas gras.',
      ar: 'هام جدًا: يجب تناوله مع طعام دسم أو حليب كامل الدسم لضمان الفاعلية.',
      es: 'IMPORTANTE: Tomar con leche o alimentos grasos para maximizar la absorción.'
    },
    criticalPrecautions: [
      {
        en: 'Do not stop taking when fever drops; malaria parasites will survive and recur if the 6 doses are not completed.',
        om: 'Ho’i qaamaa yoo hir’ate illee qoricha hin dhaabinaa; busaan deebi’ee akka hin kaaneef hunda fixaa.',
        am: 'ትኩሳቱ ቢቀንስም እንኳ መድኃኒቱን አያቋርጡ; ጥገኛ ተውሳኩ ተመልሶ እንዳያገረሽ ሙሉውን ይጨርሱ::',
        fr: 'Ne jamais interrompre le traitement avant la fin des 3 jours.',
        ar: 'لا تتوقف عن تناول الدواء حتى لو زالت الحمى لضمان القضاء التام على الطفيليات.',
        es: 'No interrumpa el tratamiento aunque desaparezca la fiebre.'
      }
    ],
    commonSideEffects: [
      {
        en: 'Headache, dizziness, loss of appetite, mild abdominal pain, palpitations.',
        om: 'Bowwoo mataa, maree mataa, fedhii nyaataa dhabuu.',
        am: 'የራስ ምታት፣ ማዞር፣ የምግብ ፍላጎት ማጣት፣ የሆድ ሕመም::',
        fr: 'Céphalées, vertiges, perte d’appétit, nausées.',
        ar: 'صداع، دوخة، فقدان الشهية، خفقان خفيف.',
        es: 'Dolor de cabeza, mareos, pérdida de apetito.'
      }
    ],
    redFlagWarning: {
      en: 'RUSH TO HOSPITAL IMMEDIATELY if vomiting prevents retaining medication, if dark tea-colored urine appears, or if confusion/extreme weakness develops (Severe Malaria signs).',
      om: 'Diddigiin yoo isin dhowwe, fincaan keessan yoo akka shaayii gurraachaaye, yookaan sammuun keessan yoo boora’e hatattamaan gara hospitaalaa deemaa!',
      am: 'ማስመለሱ መድኃኒት መውሰድ ካልፈቀደልዎ፣ የሽንትዎ ቀለም እንደ ሻይ ከጠቆረ ወይም የሰውነት ድካም ከተሰማዎት በአስቸኳይ ወደ ሆስፒታል ይሂዱ!',
      fr: 'URGENCE si vomissements répétés, urines noires ou troubles de la conscience.',
      ar: 'توجه إلى المستشفى فورًا إذا لم تستطع إبقاء الدواء في معدتك أو ظهر بول داكن بلون الشاي.',
      es: 'ACUDA AL HOSPITAL si vomita repetidamente o nota orina oscura.'
    },
    pregnancyRisk: {
      categoryFDA: 'C',
      explanation: {
        en: 'Recommended in 2nd and 3rd trimesters. In 1st trimester, Oral Quinine + Clindamycin is preferred by WHO unless Coartem is the only therapy available.',
        om: 'Ji’a 4ffaa kaasee kennamuu ni danda’a. Ji’a 3n jalqabaatti ogeessa mariisisaa.',
        am: 'ከ4ኛው ወር ጀምሮ ሊሰጥ ይችላል:: በመጀመሪያዎቹ 3 ወራት ውስጥ ሐኪምዎን ያማክሩ::',
        fr: 'Utilisable aux 2ème et 3ème trimestres. Consulter pour le 1er trimestre.',
        ar: 'يوصى به في الثلثين الثاني والثالث من الحمل. استشر الطبيب للثلث الأول.',
        es: 'Recomendado en el 2º y 3º trimestre bajo criterio médico.'
      }
    },
    storageCondition: {
      en: 'Store below 30°C in blister packaging. Protect from extreme heat and moisture.',
      om: 'Adduu fi ho’a irraa eegaa.',
      am: 'ከሙቀት እና ከእርጥበት ርቆ ከ30 ዲግሪ ሴንቲግሬድ በታች ይቀመጥ::',
      fr: 'Conserver à moins de 30°C dans son emballage.',
      ar: 'يحفظ في درجة حرارة لا تتعدى 30 درجة مئوية بعيدًا عن الحرارة.',
      es: 'Conservar a menos de 30°C en su blíster original.'
    }
  }
];
