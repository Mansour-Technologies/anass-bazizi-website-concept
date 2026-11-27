/**
 * Single source of truth. Every fact here was verified on public, logged-out pages
 * (27 Nov 2026). Anything self-reported is flagged as such. See README for sources.
 */

export const site = {
  notice: 'Concept de site internet proposé par Mansour Technologies — Démonstration non officielle.',
  title: 'Anass Bazizi — Coach en musculation · Marrakech',
  description:
    'Concept de site pour Anass Bazizi, coach spécialisé en musculation : prise de muscle, perte de gras, méthode expliquée. Démonstration non officielle.',
  pagesUrl: 'https://mansour-technologies.github.io/anass-bazizi-website-concept/',
  credit: { label: 'Concept digital proposé par Mansour Technologies.', href: 'https://mansourtechnologies.com/' },
} as const;

export const identity = {
  first: 'Anass',
  last: 'Bazizi',
  handle: '@bazizi_anass',
  role: 'Coach en musculation',
  city: 'Marrakech',
  // His own bio wording (Instagram + TikTok), quoted, never paraphrased as first person.
  bioAr: 'مدرب مختص في البناء العضلي',
  bioArFr: 'coach spécialisé dans la construction musculaire',
  goalAr: 'كانعاونك تربح عضلات و تفقد ذهون',
  goalFr: 'gagner du muscle et perdre du gras',
  methodAr: 'بطرق علمية',
  methodFr: 'avec des méthodes scientifiques',
  ctaAr: 'صيفت COACHING باش نبداو رحلة التغيير',
  ctaFr: 'envoie « COACHING » et on commence le changement',
  signOffAr: 'جبآآآآآاد العزاوي',
  tagline: 'Musculation et nutrition… tout en restant BAZIC !!',
  // Self-reported claim, displayed with attribution only.
  certified: 'Certified PT',
} as const;

/** Verified official channels. WhatsApp: number NOT published here, client decides. */
export const links = {
  instagramDm: 'https://ig.me/m/bazizi_anass',
  instagram: 'https://www.instagram.com/bazizi_anass/',
  tiktok: 'https://www.tiktok.com/@anass_bazizi',
  youtube: 'https://www.youtube.com/@anassbazizi974',
  facebook: 'https://www.facebook.com/TEAMBAZIC/',
  whatsapp: null as string | null,
  email: null as string | null,
};

/** Audience as observed logged-out on a fixed date. Static, never animated. */
export const audience = {
  observed: '27 novembre 2026',
  items: [
    { label: 'Instagram', value: '131K', href: links.instagram },
    { label: 'YouTube', value: '124K', href: links.youtube },
    { label: 'TikTok', value: '94,1K', href: links.tiktok },
    { label: 'Facebook', value: '42 637', href: links.facebook },
  ],
};

export type Video = {
  id: string;
  frame: 'maxres1' | 'maxres2' | 'maxres3';
  titleAr: string;
  titleFr: string; // descriptive French gloss, not his words
  duration: string;
  year: string;
  pos?: string; // object-position for the art-directed crop
  chip?: 'left' | 'right' | 'top'; // play chip placed away from his on-frame watermark
};

export const heroVideo: Video = {
  id: '_L3waOqmWcc',
  frame: 'maxres2',
  titleAr: 'كيفاش ولى الجسم ديالي من بعد 3 سيمانات قاصحين ديال التدريب و الريجيم',
  titleFr: 'Trois semaines d’entraînement et de diète : il montre, en salle, ce qui a changé',
  duration: '15 min',
  year: '2018',
  pos: '40% 18%',
}

/** The programme video, linked as the source of the "S’entraîner" pillar. */
export const programmeVideoId = 'x1KQ1It13NA';

export const aboutVideo: Video = {
  id: 'insUKKS_yWc',
  frame: 'maxres1',
  titleAr: 'معاناتي مع مصاريف التدريب و الأكل عندما كنت مراهقا ، تعلم من خطأي',
  titleFr: 'Ses débuts d’adolescent, avec peu de moyens pour s’entraîner et manger',
  duration: '12 min',
  year: '2020',
  pos: '42% 35%',
  chip: 'top',
};

export const kitchenVideo: Video = {
  id: 'm9ICZyGzGCA',
  frame: 'maxres2',
  titleAr: 'وجباتي اليومية لزيادة الوزن بسرعة، كيفية إعدادها في المطبخ',
  titleFr: 'Ses repas de la journée pour prendre du poids, préparés en cuisine',
  duration: '15 min',
  year: '2020',
  pos: '50% 50%',
  chip: 'right',
};

/** Curated index: 6 lessons, not a library. Chapters follow his own themes. */
export const lessons: (Video & { chapter: string })[] = [
  { chapter: 'Les bases', id: 'Xg4Xy4zgJFg', frame: 'maxres2', titleAr: 'خاص بالمبتدئين: جميع الاساسيات لي خاصك تعرف على كمال الاجسام', titleFr: 'Spécial débutants : tout ce qu’il faut savoir avant de commencer', duration: '12 min', year: '2017', pos: '50% 35%' },
  { chapter: 'Les erreurs', id: 'oIN98xEjLII', frame: 'maxres1', titleAr: 'أخطاء كاديرهوم يوميا ماكايخليوكش تكبر العضلات ديالك دغيا', titleFr: 'Les erreurs du quotidien qui freinent la prise de muscle', duration: '6 min', year: '2021', pos: '35% 50%' },
  { chapter: 'La cuisine', id: 'Zxs5C17UPdo', frame: 'maxres3', titleAr: 'كل ما آكله في يوم التنشيف / وجبات سهلة بنينة و فعالة', titleFr: 'Tout ce qu’il mange un jour de sèche, en recettes simples', duration: '26 min', year: '2020', pos: '40% 40%' },
  { chapter: 'Le budget', id: 'fYJH2PSlDyA', frame: 'maxres2', titleAr: 'افضل وارخص الاطعمة لتضخيم العضلات', titleFr: 'Les aliments les plus efficaces et les moins chers pour la prise de muscle', duration: '9 min', year: '2016', pos: '50% 45%' },
  { chapter: 'La posture', id: 'A_pA-3MX-M0', frame: 'maxres1', titleAr: 'مشكل تقوس الضهر و الأكتاف - كيفية معالجته بالبيت بتمارين بسيطة', titleFr: 'Dos et épaules arrondis : des exercices simples à faire à la maison', duration: '8 min', year: '2020', pos: '50% 35%' },
  { chapter: 'Les idées reçues', id: 'NdcFAeEExy8', frame: 'maxres1', titleAr: 'LES 8 IDÉES REÇUES SUR LE FITNESS', titleFr: 'Sa toute première vidéo, en français : 8 idées reçues à oublier', duration: '11 min', year: '2016', pos: '55% 30%' },
];

/** Client transformations: render ONLY entries with written client consent. Empty by design. */
export type Transformation = { client: string; context: string; before: string; after: string; consent: true };
export const transformations: Transformation[] = [];

export const nav = [
  { id: 'coach', label: 'Le coach' },
  { id: 'bazic', label: 'BAZIC' },
  { id: 'demarrer', label: 'Démarrer' },
  { id: 'videos', label: 'Vidéos' },
  { id: 'contact', label: 'Contact' },
];
