/**
 * Clean Bible API Library
 * Properly loads from existing Bible data structure
 */

import bibleData from '../data/bible/complete-bible-original-kjv.json';

// Types
export interface Verse {
  v: number;
  t: string;
}

export interface Chapter {
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  group: 'Canon' | 'Apocrypha' | 'Pseudepigrapha';
  chapters: Chapter[];
  aliases: string[];
  orderIndex: number;
}

interface BibleBookData {
  book: string;
  chapters: string[][];
}

// Book registry with all 66 canonical books in order
const CANONICAL_BOOKS = [
  // Old Testament (39 books)
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // New Testament (27 books)
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

// Clean book aliases mapping (no duplicates)
const BOOK_ALIASES: Record<string, string> = {
  // Old Testament
  'genesis': 'Genesis', 'gen': 'Genesis', 'gn': 'Genesis', 'ge': 'Genesis',
  'exodus': 'Exodus', 'ex': 'Exodus', 'exo': 'Exodus', 'exod': 'Exodus',
  'leviticus': 'Leviticus', 'lev': 'Leviticus', 'le': 'Leviticus', 'lv': 'Leviticus',
  'numbers': 'Numbers', 'num': 'Numbers', 'nu': 'Numbers', 'nm': 'Numbers', 'nb': 'Numbers',
  'deuteronomy': 'Deuteronomy', 'deut': 'Deuteronomy', 'de': 'Deuteronomy', 'dt': 'Deuteronomy',
  'joshua': 'Joshua', 'josh': 'Joshua', 'jos': 'Joshua', 'jsh': 'Joshua',
  'judges': 'Judges', 'judg': 'Judges', 'jdg': 'Judges', 'jg': 'Judges', 'jdgs': 'Judges',
  'ruth': 'Ruth', 'rth': 'Ruth', 'ru': 'Ruth',
  '1 samuel': '1 Samuel', '1 sam': '1 Samuel', '1sa': '1 Samuel', '1 s': '1 Samuel', 'i sam': '1 Samuel', 'i samuel': '1 Samuel',
  '2 samuel': '2 Samuel', '2 sam': '2 Samuel', '2sa': '2 Samuel', '2 s': '2 Samuel', 'ii sam': '2 Samuel', 'ii samuel': '2 Samuel',
  '1 kings': '1 Kings', '1 kgs': '1 Kings', '1ki': '1 Kings', '1 k': '1 Kings', 'i kings': '1 Kings', 'i kgs': '1 Kings',
  '2 kings': '2 Kings', '2 kgs': '2 Kings', '2ki': '2 Kings', '2 k': '2 Kings', 'ii kings': '2 Kings', 'ii kgs': '2 Kings',
  '1 chronicles': '1 Chronicles', '1 chr': '1 Chronicles', '1ch': '1 Chronicles', '1 ch': '1 Chronicles', 'i chronicles': '1 Chronicles', 'i chr': '1 Chronicles',
  '2 chronicles': '2 Chronicles', '2 chr': '2 Chronicles', '2ch': '2 Chronicles', '2 ch': '2 Chronicles', 'ii chronicles': '2 Chronicles', 'ii chr': '2 Chronicles',
  'ezra': 'Ezra', 'ezr': 'Ezra', 'ez': 'Ezra',
  'nehemiah': 'Nehemiah', 'neh': 'Nehemiah', 'ne': 'Nehemiah',
  'esther': 'Esther', 'esth': 'Esther', 'est': 'Esther', 'es': 'Esther',
  'job': 'Job', 'jb': 'Job',
  'psalms': 'Psalms', 'ps': 'Psalms', 'psalm': 'Psalms', 'psa': 'Psalms', 'psm': 'Psalms', 'pss': 'Psalms',
  'proverbs': 'Proverbs', 'prov': 'Proverbs', 'prv': 'Proverbs', 'pr': 'Proverbs', 'pro': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes', 'eccl': 'Ecclesiastes', 'ec': 'Ecclesiastes', 'ecc': 'Ecclesiastes', 'qoh': 'Ecclesiastes',
  'song of solomon': 'Song of Solomon', 'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'canticles': 'Song of Solomon', 'cant': 'Song of Solomon', 'song of songs': 'Song of Solomon', 'solomon\'s song': 'Song of Solomon',
  'isaiah': 'Isaiah', 'isa': 'Isaiah', 'is': 'Isaiah',
  'jeremiah': 'Jeremiah', 'jer': 'Jeremiah', 'je': 'Jeremiah', 'jr': 'Jeremiah',
  'lamentations': 'Lamentations', 'lam': 'Lamentations', 'la': 'Lamentations',
  'ezekiel': 'Ezekiel', 'ezek': 'Ezekiel', 'eze': 'Ezekiel', 'ezk': 'Ezekiel',
  'daniel': 'Daniel', 'dan': 'Daniel', 'da': 'Daniel', 'dn': 'Daniel',
  'hosea': 'Hosea', 'hos': 'Hosea', 'ho': 'Hosea',
  'joel': 'Joel', 'jl': 'Joel',
  'amos': 'Amos', 'am': 'Amos',
  'obadiah': 'Obadiah', 'obad': 'Obadiah', 'ob': 'Obadiah',
  'jonah': 'Jonah', 'jnh': 'Jonah', 'jon': 'Jonah',
  'micah': 'Micah', 'mic': 'Micah', 'mc': 'Micah',
  'nahum': 'Nahum', 'nah': 'Nahum', 'na': 'Nahum',
  'habakkuk': 'Habakkuk', 'hab': 'Habakkuk', 'hb': 'Habakkuk',
  'zephaniah': 'Zephaniah', 'zeph': 'Zephaniah', 'zep': 'Zephaniah', 'zp': 'Zephaniah',
  'haggai': 'Haggai', 'hag': 'Haggai', 'hg': 'Haggai',
  'zechariah': 'Zechariah', 'zech': 'Zechariah', 'zec': 'Zechariah', 'zc': 'Zechariah',
  'malachi': 'Malachi', 'mal': 'Malachi', 'ml': 'Malachi',
  
  // New Testament
  'matthew': 'Matthew', 'matt': 'Matthew', 'mt': 'Matthew', 'mat': 'Matthew',
  'mark': 'Mark', 'mk': 'Mark', 'mr': 'Mark', 'mar': 'Mark',
  'luke': 'Luke', 'lk': 'Luke', 'lu': 'Luke', 'luk': 'Luke',
  'john': 'John', 'jn': 'John', 'joh': 'John', 'jhn': 'John',
  'acts': 'Acts', 'ac': 'Acts',
  'romans': 'Romans', 'rom': 'Romans', 'ro': 'Romans', 'rm': 'Romans',
  '1 corinthians': '1 Corinthians', '1 cor': '1 Corinthians', '1co': '1 Corinthians', '1 c': '1 Corinthians', 'i corinthians': '1 Corinthians', 'i cor': '1 Corinthians',
  '2 corinthians': '2 Corinthians', '2 cor': '2 Corinthians', '2co': '2 Corinthians', '2 c': '2 Corinthians', 'ii corinthians': '2 Corinthians', 'ii cor': '2 Corinthians',
  'galatians': 'Galatians', 'gal': 'Galatians', 'ga': 'Galatians',
  'ephesians': 'Ephesians', 'eph': 'Ephesians', 'ephes': 'Ephesians',
  'philippians': 'Philippians', 'phil': 'Philippians', 'php': 'Philippians', 'pp': 'Philippians',
  'colossians': 'Colossians', 'col': 'Colossians', 'co': 'Colossians',
  '1 thessalonians': '1 Thessalonians', '1 thess': '1 Thessalonians', '1th': '1 Thessalonians', '1 th': '1 Thessalonians', 'i thessalonians': '1 Thessalonians', 'i thess': '1 Thessalonians',
  '2 thessalonians': '2 Thessalonians', '2 thess': '2 Thessalonians', '2th': '2 Thessalonians', '2 th': '2 Thessalonians', 'ii thessalonians': '2 Thessalonians', 'ii thess': '2 Thessalonians',
  '1 timothy': '1 Timothy', '1 tim': '1 Timothy', '1ti': '1 Timothy', '1 t': '1 Timothy', 'i timothy': '1 Timothy', 'i tim': '1 Timothy',
  '2 timothy': '2 Timothy', '2 tim': '2 Timothy', '2ti': '2 Timothy', '2 t': '2 Timothy', 'ii timothy': '2 Timothy', 'ii tim': '2 Timothy',
  'titus': 'Titus', 'tit': 'Titus', 'ti': 'Titus',
  'philemon': 'Philemon', 'phlm': 'Philemon', 'phm': 'Philemon', 'philem': 'Philemon',
  'hebrews': 'Hebrews', 'heb': 'Hebrews',
  'james': 'James', 'jas': 'James', 'jm': 'James',
  '1 peter': '1 Peter', '1 pet': '1 Peter', '1pe': '1 Peter', '1 p': '1 Peter', 'i peter': '1 Peter', 'i pet': '1 Peter',
  '2 peter': '2 Peter', '2 pet': '2 Peter', '2pe': '2 Peter', '2 p': '2 Peter', 'ii peter': '2 Peter', 'ii pet': '2 Peter',
  '1 john': '1 John', '1 jn': '1 John', '1jo': '1 John', '1 j': '1 John', 'i john': '1 John', 'i jn': '1 John',
  '2 john': '2 John', '2 jn': '2 John', '2jo': '2 John', '2 j': '2 John', 'ii john': '2 John', 'ii jn': '2 John',
  '3 john': '3 John', '3 jn': '3 John', '3jo': '3 John', '3 j': '3 John', 'iii john': '3 John', 'iii jn': '3 John',
  'jude': 'Jude', 'jud': 'Jude', 'jd': 'Jude',
  'revelation': 'Revelation', 'rev': 'Revelation', 're': 'Revelation', 'the revelation': 'Revelation', 'apocalypse': 'Revelation'
};

// Clean sacred names mappings (no duplicates)
const SACRED_NAMES: Record<string, string> = {
  // Core Divine Names
  'God': 'Elohim',
  'LORD': 'YAHUAH',
  'Lord': 'Adonai',
  'Jesus': 'YAHUSHA',
  'Christ': 'Messiah',
  'Jesus Christ': 'YAHUSHA Messiah',
  'Holy Spirit': 'RUACH HAQODESH',
  'Holy Ghost': 'RUACH HAQODESH',
  
  // Biblical Names
  'Moses': 'Moshe',
  'Abraham': 'Avraham',
  'Isaac': 'Yitzchak',
  'Jacob': 'Ya\'akov',
  'David': 'Dawid',
  'Solomon': 'Shlomo',
  'Samuel': 'Shmuel',
  'Daniel': 'Dani\'el',
  'Jeremiah': 'Yirmeyahu',
  'Ezekiel': 'Yechezkel',
  'Isaiah': 'Yeshayahu',
  'Joshua': 'Yehoshua',
  'Aaron': 'Aharon',
  'Miriam': 'Miriam',
  'Deborah': 'Devorah',
  'Esther': 'Hadassah',
  'Ruth': 'Rut',
  'Naomi': 'Na\'omi',
  'Boaz': 'Bo\'az',
  'Elijah': 'Eliyahu',
  'Elisha': 'Elisha',
  'Jonah': 'Yonah',
  'Job': 'Iyov',
  'Noah': 'Noach',
  'Adam': 'Adam',
  'Eve': 'Chavah',
  'Cain': 'Kayin',
  'Abel': 'Hevel',
  'Seth': 'Shet',
  'Enoch': 'Chanoch',
  'Methuselah': 'Metushelach',
  'Lamech': 'Lemech',
  'Shem': 'Shem',
  'Ham': 'Cham',
  'Japheth': 'Yefet',
  'Abram': 'Avram',
  'Sarah': 'Sarah',
  'Hagar': 'Hagar',
  'Ishmael': 'Yishma\'el',
  'Rebekah': 'Rivkah',
  'Esau': 'Esav',
  'Leah': 'Le\'ah',
  'Rachel': 'Ra\'chel',
  'Joseph': 'Yosef',
  'Benjamin': 'Binyamin',
  'Judah': 'Yehudah',
  'Levi': 'Levi',
  'Simeon': 'Shimon',
  'Reuben': 'Re\'uven',
  'Gad': 'Gad',
  'Asher': 'Asher',
  'Naphtali': 'Naftali',
  'Dan': 'Dan',
  'Zebulun': 'Zevulun',
  'Issachar': 'Yissachar',
  'Manasseh': 'Menasseh',
  'Ephraim': 'Efrayim',
  
  // Places
  'Jerusalem': 'Yerushalayim',
  'Israel': 'Yisrael',
  'Bethlehem': 'Beit Lechem',
  'Nazareth': 'Natzrat',
  'Galilee': 'Galil',
  'Judea': 'Yehudah',
  'Samaria': 'Shomron',
  'Canaan': 'Kena\'an',
  'Egypt': 'Mitzrayim',
  'Babylon': 'Bavel',
  'Assyria': 'Ashur',
  'Persia': 'Paras',
  'Greece': 'Yavan',
  'Rome': 'Romi',
  'Sinai': 'Sinai',
  'Horeb': 'Chorev',
  'Jordan': 'Yarden',
  'Red Sea': 'Yam Suf',
  'Dead Sea': 'Yam HaMelach',
  'Sea of Galilee': 'Yam Kinneret',
  'Mount Zion': 'Har Tzion',
  'Mount Moriah': 'Har Moriah',
  'Mount Sinai': 'Har Sinai',
  'Mount Carmel': 'Har Karmel',
  'Mount Tabor': 'Har Tavor',
  'Mount Hermon': 'Har Chermon',
  'Mount Nebo': 'Har Nevo',
  'Mount Ararat': 'Har Ararat',
  'Mount Gilboa': 'Har Gilboa',
  'Mount Ebal': 'Har Eval',
  'Mount Gerizim': 'Har Gerizim',
  'Mount Olivet': 'Har HaZetim',
  'Mount of Olives': 'Har HaZetim',
  'Garden of Eden': 'Gan Eden',
  'Garden of Gethsemane': 'Gat Shemanim',
  'Valley of Hinnom': 'Gei Hinnom',
  'Valley of Jehoshaphat': 'Emek Yehoshafat',
  'Valley of Achor': 'Emek Achor',
  'Valley of Elah': 'Emek Elah',
  'Valley of Rephaim': 'Emek Refaim',
  'Valley of Shaveh': 'Emek Shaveh',
  'Valley of Siddim': 'Emek Siddim',
  'Valley of Succoth': 'Emek Sukkot',
  'Valley of Zephathah': 'Emek Tzefatah',
  'Brook Kidron': 'Nachal Kidron',
  'Brook Cherith': 'Nachal Kerit',
  'Brook Besor': 'Nachal Besor',
  'Brook Eshcol': 'Nachal Eshcol',
  'Brook Sorek': 'Nachal Sorek',
  'Brook Zered': 'Nachal Zered',
  'Brook Arnon': 'Nachal Arnon',
  'Brook Jabbok': 'Nachal Yabbok',
  'Brook Kishon': 'Nachal Kishon',
  'Brook Kanah': 'Nachal Kanah',
  'Brook Shittim': 'Nachal Shittim',
  'Brook Zin': 'Nachal Tzin',
  'Brook Paran': 'Nachal Paran',
  'Brook of Egypt': 'Nachal Mitzrayim',
  'River Jordan': 'Nahar Yarden',
  'River Euphrates': 'Nahar Prat',
  'River Tigris': 'Nahar Chidekel',
  'River Nile': 'Nahar Nilus',
  'River Chebar': 'Nahar Kevar',
  'River Ulai': 'Nahar Ulai',
  'River Ahava': 'Nahar Ahava',
  'River Gozan': 'Nahar Gozan',
  'River Habor': 'Nahar Chavor',
  'River Halah': 'Nahar Chalah',
  'River Hara': 'Nahar Chara',
  'River Medes': 'Nahar Madai',
  'River Persians': 'Nahar Paras',
  'River Elamites': 'Nahar Elam',
  'River Assyrians': 'Nahar Ashur',
  'River Babylonians': 'Nahar Bavel',
  'River Chaldeans': 'Nahar Kasdim',
  'River Arameans': 'Nahar Aram',
  'River Ammonites': 'Nahar Ammon',
  'River Moabites': 'Nahar Moav',
  'River Edomites': 'Nahar Edom',
  'River Philistines': 'Nahar Plishtim',
  'River Canaanites': 'Nahar Kena\'anim',
  'River Hittites': 'Nahar Chittim',
  'River Hivites': 'Nahar Chivim',
  'River Jebusites': 'Nahar Yevusim',
  'River Amorites': 'Nahar Emorim',
  'River Girgashites': 'Nahar Girgashim',
  'River Perizzites': 'Nahar Perizim',
  
  // Common phrases
  'praise the Lord': 'hallelu-Yah',
  'amen': 'amen',
  'hallelujah': 'hallelu-Yah',
  'hosanna': 'hoshana',
  'maranatha': 'maranatha',
  'abba': 'abba',
  'rabbi': 'rabbi',
  'messiah': 'mashiach',
  'prophet': 'navi',
  'priest': 'kohen',
  'temple': 'beit ha-mikdash',
  'synagogue': 'beit knesset',
  'sabbath': 'shabbat',
  'passover': 'pesach',
  'pentecost': 'shavuot',
  'tabernacles': 'sukkot',
  'atonement': 'yom kippur',
  'trumpets': 'rosh hashana',
  'feast': 'chag',
  'offering': 'korban',
  'sacrifice': 'zevach',
  'altar': 'mizbeach',
  'ark': 'aron',
  'covenant': 'brit',
  'law': 'torah',
  'commandment': 'mitzvah',
  'blessing': 'berachah',
  'curse': 'kelalah',
  'sin': 'chet',
  'repentance': 'teshuvah',
  'forgiveness': 'selichah',
  'mercy': 'rachamim',
  'grace': 'chen',
  'love': 'ahavah',
  'peace': 'shalom',
  'joy': 'simchah',
  'hope': 'tikvah',
  'faith': 'emunah',
  'righteousness': 'tzedakah',
  'justice': 'mishpat',
  'truth': 'emet',
  'wisdom': 'chokhmah',
  'understanding': 'binah',
  'knowledge': 'da\'at',
  'fear': 'yirah',
  'reverence': 'kavod',
  'glory': 'kavod',
  'honor': 'kavod',
  'praise': 'tehillah',
  'worship': 'avodah',
  'service': 'avodah',
  'ministry': 'avodah',
  'work': 'avodah',
  'labor': 'avodah',
  'toil': 'avodah',
  'sweat': 'ze\'ah',
  'tears': 'dim\'ah',
  'sorrow': 'tza\'ar',
  'grief': 'avel',
  'mourning': 'avel',
  'lamentation': 'kinah',
  'weeping': 'bekhi',
  'crying': 'bekhi',
  'wailing': 'yelalah',
  'groaning': 'ne\'akah',
  'sighing': 'anachah',
  'moaning': 'ne\'akah',
  'crying out': 'tze\'akah',
  'shouting': 'tze\'akah',
  'calling': 'kri\'ah',
  'cry': 'tze\'akah',
  'voice': 'kol',
  'sound': 'kol',
  'noise': 'kol',
  'thunder': 'ra\'am',
  'lightning': 'baraq',
  'storm': 'se\'arah',
  'wind': 'ruach',
  'spirit': 'ruach',
  'breath': 'neshamah',
  'life': 'chayim',
  'living': 'chai',
  'alive': 'chai',
  'dead': 'met',
  'death': 'mavet',
  'die': 'mut',
  'kill': 'harag',
  'murder': 'retzach',
  'slay': 'harag',
  'destroy': 'shachat',
  'perish': 'avad',
  'lost': 'avad',
  'found': 'matza',
  'seek': 'bakesh',
  'search': 'chapes',
  'look': 'ra\'ah',
  'see': 'ra\'ah',
  'behold': 'hineh',
  'lo': 'hineh',
  'vision': 'chazon',
  'dream': 'chalom',
  'nightmare': 'chalom ra\'',
  'sleep': 'shenah',
  'rest': 'menuchah',
  'quiet': 'shat',
  'still': 'shat',
  'calm': 'shat',
  'silent': 'shat',
  'silence': 'shat',
  'peaceful': 'shalom',
  'tranquil': 'shalom',
  'serene': 'shalom',
  'gentle': 'anav',
  'meek': 'anav',
  'humble': 'anav',
  'lowly': 'anav',
  'poor': 'ani',
  'needy': 'ani',
  'destitute': 'ani',
  'afflicted': 'ani',
  'oppressed': 'ani',
  'persecuted': 'ani',
  'suffering': 'ani',
  'pain': 'ke\'ev',
  'hurt': 'ke\'ev',
  'wound': 'pe\'ah',
  'injury': 'pe\'ah',
  'bruise': 'pe\'ah',
  'cut': 'pe\'ah',
  'gash': 'pe\'ah',
  'scar': 'pe\'ah',
  'mark': 'pe\'ah',
  'sign': 'ot',
  'token': 'ot',
  'symbol': 'ot',
  'emblem': 'ot',
  'badge': 'ot',
  'seal': 'chotam',
  'stamp': 'chotam'
};

// Convert Bible data to our format
function convertBibleData(): Book[] {
  const books: Book[] = [];
  
  console.log('Converting Bible data...', bibleData.length, 'books found');
  
  for (let i = 0; i < bibleData.length; i++) {
    const bookData = bibleData[i] as BibleBookData;
    const bookName = bookData.book;
    
    console.log(`Processing book ${i + 1}: ${bookName}`);
    
    // Find the canonical book name
    const canonicalName = CANONICAL_BOOKS.find(name => 
      name.toLowerCase() === bookName.toLowerCase() ||
      name.toLowerCase().includes(bookName.toLowerCase()) ||
      bookName.toLowerCase().includes(name.toLowerCase())
    ) || bookName;
    
    // Convert chapters
    const chapters: Chapter[] = bookData.chapters.map(chapterVerses => ({
      verses: chapterVerses.map((verseText, index) => ({
        v: index + 1,
        t: verseText
      }))
    }));
    
    // Get aliases for this book
    const aliases: string[] = [];
    for (const [alias, canonical] of Object.entries(BOOK_ALIASES)) {
      if (canonical === canonicalName) {
        aliases.push(alias);
      }
    }
    
    const book: Book = {
      id: canonicalName.toLowerCase().replace(/\s+/g, '-'),
      name: canonicalName,
      group: 'Canon',
      chapters,
      aliases,
      orderIndex: CANONICAL_BOOKS.indexOf(canonicalName) + 1
    };
    
    books.push(book);
    console.log(`Added ${book.name} with ${chapters.length} chapters and ${chapters.reduce((sum, ch) => sum + ch.verses.length, 0)} verses`);
  }
  
  console.log(`Conversion complete: ${books.length} books processed`);
  return books;
}

// Cache the converted data
let cachedBooks: Book[] | null = null;

// API Functions
export function getBooks(group?: string): Book[] {
  if (!cachedBooks) {
    console.log('Loading Bible data for the first time...');
    cachedBooks = convertBibleData();
  }
  
  let books = cachedBooks;
  
  if (group && ['canon', 'apocrypha', 'pseudepigrapha'].includes(group)) {
    books = cachedBooks.filter(book => book.group.toLowerCase() === group);
  }
  
  console.log(`Returning ${books.length} books for group: ${group || 'all'}`);
  return books;
}

export function getBook(bookId: string): Book | null {
  const books = getBooks();
  
  // Try to find by ID first
  let book = books.find(b => b.id === bookId);
  
  // If not found, try to find by name or alias
  if (!book) {
    const canonicalName = BOOK_ALIASES[bookId.toLowerCase()] || bookId;
    book = books.find(b => 
      b.name === canonicalName || 
      b.aliases.includes(bookId)
    );
  }
  
  console.log(`Looking for book: ${bookId}, found: ${book?.name || 'none'}`);
  return book || null;
}

export function getChapter(bookId: string, chapterNumber: number): { book: Book; chapter: Chapter } | null {
  const book = getBook(bookId);
  if (!book) {
    console.log(`Book not found: ${bookId}`);
    return null;
  }
  
  const chapter = book.chapters[chapterNumber - 1];
  if (!chapter) {
    console.log(`Chapter ${chapterNumber} not found in ${book.name}`);
    return null;
  }
  
  console.log(`Found chapter ${chapterNumber} in ${book.name} with ${chapter.verses.length} verses`);
  return { book, chapter };
}

export function getVerse(bookId: string, chapterNumber: number, verseNumber: number): { book: Book; chapter: Chapter; verse: Verse } | null {
  const chapterData = getChapter(bookId, chapterNumber);
  if (!chapterData) {
    return null;
  }
  
  const verse = chapterData.chapter.verses.find(v => v.v === verseNumber);
  if (!verse) {
    console.log(`Verse ${verseNumber} not found in ${chapterData.book.name} ${chapterNumber}`);
    return null;
  }
  
  console.log(`Found verse ${verseNumber} in ${chapterData.book.name} ${chapterNumber}`);
  return { book: chapterData.book, chapter: chapterData.chapter, verse };
}

export function parseReference(refString: string): { book: string; chapter: number; verse: number } | null {
  if (!refString || typeof refString !== 'string') {
    return null;
  }

  const trimmed = refString.trim();
  if (!trimmed) {
    return null;
  }

  // Simple pattern: "Book Chapter:Verse"
  const match = trimmed.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (match) {
    const bookName = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);
    
    // Resolve book alias
    const canonicalBook = BOOK_ALIASES[bookName.toLowerCase()] || bookName;
    
    return {
      book: canonicalBook,
      chapter,
      verse
    };
  }

  return null;
}

export function applySacredNames(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let result = text;

  // Apply sacred name transformations in order of specificity
  const sortedEntries = Object.entries(SACRED_NAMES).sort((a, b) => b[0].length - a[0].length);

  for (const [original, sacred] of sortedEntries) {
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, (match) => {
      if (match === match.toUpperCase()) {
        return sacred.toUpperCase();
      } else if (match === match.toLowerCase()) {
        return sacred.toLowerCase();
      } else if (match[0] === match[0].toUpperCase()) {
        return sacred.charAt(0).toUpperCase() + sacred.slice(1).toLowerCase();
      }
      return sacred;
    });
  }

  return result;
}

export function searchBible(query: string, options: {
  scope?: 'all' | 'canon' | 'apocrypha' | 'pseudepigrapha';
  book?: string;
  limit?: number;
  offset?: number;
} = {}): {
  results: Array<{
    ref: string;
    snippet: string;
    book: string;
    bookId: string;
    chapter: number;
    verse: number;
    text: string;
    score: number;
  }>;
  total: number;
  limit: number;
  offset: number;
  query: string;
} {
  const { scope = 'all', book, limit = 50, offset = 0 } = options;
  
  const results: Array<{
    ref: string;
    snippet: string;
    book: string;
    bookId: string;
    chapter: number;
    verse: number;
    text: string;
    score: number;
  }> = [];
  
  // Simple search implementation
  const queryLower = query.toLowerCase();
  const books = getBooks(scope);
  
  console.log(`Searching for "${query}" in ${books.length} books`);
  
  for (const bookData of books) {
    if (book && bookData.id !== book && bookData.name !== book) {
      continue;
    }
    
    for (let chapterIndex = 0; chapterIndex < bookData.chapters.length; chapterIndex++) {
      const chapter = bookData.chapters[chapterIndex];
      const chapterNumber = chapterIndex + 1;
      
      for (const verse of chapter.verses) {
        if (verse.t.toLowerCase().includes(queryLower)) {
          const snippet = verse.t.length > 100 
            ? verse.t.substring(0, 100) + '...' 
            : verse.t;
            
          results.push({
            ref: `${bookData.name} ${chapterNumber}:${verse.v}`,
            snippet,
            book: bookData.name,
            bookId: bookData.id,
            chapter: chapterNumber,
            verse: verse.v,
            text: verse.t,
            score: 100
          });
        }
      }
    }
  }
  
  console.log(`Search completed: ${results.length} results found`);
  return {
    results: results.slice(offset, offset + limit),
    total: results.length,
    limit,
    offset,
    query
  };
}
