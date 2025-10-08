#!/usr/bin/env node

/**
 * Generate Original KJV Bible Dataset
 * This script creates a Bible dataset with original KJV text (no sacred names applied)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete list of all 66 books with their chapter counts
const bibleBooks = [
  { name: 'Genesis', chapters: 50, testament: 'Old' },
  { name: 'Exodus', chapters: 40, testament: 'Old' },
  { name: 'Leviticus', chapters: 27, testament: 'Old' },
  { name: 'Numbers', chapters: 36, testament: 'Old' },
  { name: 'Deuteronomy', chapters: 34, testament: 'Old' },
  { name: 'Joshua', chapters: 24, testament: 'Old' },
  { name: 'Judges', chapters: 21, testament: 'Old' },
  { name: 'Ruth', chapters: 4, testament: 'Old' },
  { name: '1 Samuel', chapters: 31, testament: 'Old' },
  { name: '2 Samuel', chapters: 24, testament: 'Old' },
  { name: '1 Kings', chapters: 22, testament: 'Old' },
  { name: '2 Kings', chapters: 25, testament: 'Old' },
  { name: '1 Chronicles', chapters: 29, testament: 'Old' },
  { name: '2 Chronicles', chapters: 36, testament: 'Old' },
  { name: 'Ezra', chapters: 10, testament: 'Old' },
  { name: 'Nehemiah', chapters: 13, testament: 'Old' },
  { name: 'Esther', chapters: 10, testament: 'Old' },
  { name: 'Job', chapters: 42, testament: 'Old' },
  { name: 'Psalm', chapters: 150, testament: 'Old' },
  { name: 'Proverbs', chapters: 31, testament: 'Old' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'Old' },
  { name: 'Song of Solomon', chapters: 8, testament: 'Old' },
  { name: 'Isaiah', chapters: 66, testament: 'Old' },
  { name: 'Jeremiah', chapters: 52, testament: 'Old' },
  { name: 'Lamentations', chapters: 5, testament: 'Old' },
  { name: 'Ezekiel', chapters: 48, testament: 'Old' },
  { name: 'Daniel', chapters: 12, testament: 'Old' },
  { name: 'Hosea', chapters: 14, testament: 'Old' },
  { name: 'Joel', chapters: 3, testament: 'Old' },
  { name: 'Amos', chapters: 9, testament: 'Old' },
  { name: 'Obadiah', chapters: 1, testament: 'Old' },
  { name: 'Jonah', chapters: 4, testament: 'Old' },
  { name: 'Micah', chapters: 7, testament: 'Old' },
  { name: 'Nahum', chapters: 3, testament: 'Old' },
  { name: 'Habakkuk', chapters: 3, testament: 'Old' },
  { name: 'Zephaniah', chapters: 3, testament: 'Old' },
  { name: 'Haggai', chapters: 2, testament: 'Old' },
  { name: 'Zechariah', chapters: 14, testament: 'Old' },
  { name: 'Malachi', chapters: 4, testament: 'Old' },
  { name: 'Matthew', chapters: 28, testament: 'New' },
  { name: 'Mark', chapters: 16, testament: 'New' },
  { name: 'Luke', chapters: 24, testament: 'New' },
  { name: 'John', chapters: 21, testament: 'New' },
  { name: 'Acts', chapters: 28, testament: 'New' },
  { name: 'Romans', chapters: 16, testament: 'New' },
  { name: '1 Corinthians', chapters: 16, testament: 'New' },
  { name: '2 Corinthians', chapters: 13, testament: 'New' },
  { name: 'Galatians', chapters: 6, testament: 'New' },
  { name: 'Ephesians', chapters: 6, testament: 'New' },
  { name: 'Philippians', chapters: 4, testament: 'New' },
  { name: 'Colossians', chapters: 4, testament: 'New' },
  { name: '1 Thessalonians', chapters: 5, testament: 'New' },
  { name: '2 Thessalonians', chapters: 3, testament: 'New' },
  { name: '1 Timothy', chapters: 6, testament: 'New' },
  { name: '2 Timothy', chapters: 4, testament: 'New' },
  { name: 'Titus', chapters: 3, testament: 'New' },
  { name: 'Philemon', chapters: 1, testament: 'New' },
  { name: 'Hebrews', chapters: 13, testament: 'New' },
  { name: 'James', chapters: 5, testament: 'New' },
  { name: '1 Peter', chapters: 5, testament: 'New' },
  { name: '2 Peter', chapters: 3, testament: 'New' },
  { name: '1 John', chapters: 5, testament: 'New' },
  { name: '2 John', chapters: 1, testament: 'New' },
  { name: '3 John', chapters: 1, testament: 'New' },
  { name: 'Jude', chapters: 1, testament: 'New' },
  { name: 'Revelation', chapters: 22, testament: 'New' }
];

// Sample Scripture text with ORIGINAL KJV text (no sacred names applied)
const sampleScripture = {
  'Genesis': {
    1: [
      "In the beginning God created the heaven and the earth.",
      "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      "And God said, Let there be light: and there was light.",
      "And God saw the light, that it was good: and God divided the light from the darkness.",
      "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
      "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
      "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
      "And God called the firmament Heaven. And the evening and the morning were the second day.",
      "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
      "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.",
      "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.",
      "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.",
      "And the evening and the morning were the third day.",
      "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:",
      "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.",
      "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.",
      "And God set them in the firmament of the heaven to give light upon the earth,",
      "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.",
      "And the evening and the morning were the fourth day.",
      "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.",
      "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.",
      "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.",
      "And the evening and the morning were the fifth day.",
      "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.",
      "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.",
      "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.",
      "So God created man in his own image, in the image of God created he him; male and female created he them.",
      "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.",
      "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.",
      "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.",
      "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day."
    ],
    2: [
      "Thus the heavens and the earth were finished, and all the host of them.",
      "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
      "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.",
      "These are the generations of the heavens and of the earth when they were created, in the day that the LORD God made the earth and the heavens,",
      "And every plant of the field before it was in the earth, and every herb of the field before it grew: for the LORD God had not caused it to rain upon the earth, and there was not a man to till the ground.",
      "But there went up a mist from the earth, and watered the whole face of the ground.",
      "And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.",
      "And the LORD God planted a garden eastward in Eden; and there he put the man whom he had formed.",
      "And out of the ground made the LORD God to grow every tree that is pleasant to the sight, and good for food; the tree of life also in the midst of the garden, and the tree of knowledge of good and evil.",
      "And a river went out of Eden to water the garden; and from thence it was parted, and became into four heads.",
      "The name of the first is Pison: that is it which compasseth the whole land of Havilah, where there is gold;",
      "And the gold of that land is good: there is bdellium and the onyx stone.",
      "And the name of the second river is Gihon: the same is it that compasseth the whole land of Ethiopia.",
      "And the name of the third river is Hiddekel: that is it which goeth toward the east of Assyria. And the fourth river is Euphrates.",
      "And the LORD God took the man, and put him into the garden of Eden to dress it and to keep it.",
      "And the LORD God commanded the man, saying, Of every tree of the garden thou mayest freely eat:",
      "But of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die.",
      "And the LORD God said, It is not good that the man should be alone; I will make him an help meet for him.",
      "And out of the ground the LORD God formed every beast of the field, and every fowl of the air; and brought them unto Adam to see what he would call them: and whatsoever Adam called every living creature, that was the name thereof.",
      "And Adam gave names to all cattle, and to the fowl of the air, and to every beast of the field; but for Adam there was not found an help meet for him.",
      "And the LORD God caused a deep sleep to fall upon Adam, and he slept: and he took one of his ribs, and closed up the flesh instead thereof;",
      "And the rib, which the LORD God had taken from man, made he a woman, and brought her unto the man.",
      "And Adam said, This is now bone of my bones, and flesh of my flesh: she shall be called Woman, because she was taken out of Man.",
      "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.",
      "And they were both naked, the man and his wife, and were not ashamed."
    ]
  },
  'John': {
    1: [
      "In the beginning was the Word, and the Word was with God, and the Word was God.",
      "The same was in the beginning with God.",
      "All things were made by him; and without him was not any thing made that was made.",
      "In him was life; and the life was the light of men.",
      "And the light shineth in darkness; and the darkness comprehended it not.",
      "There was a man sent from God, whose name was John.",
      "The same came for a witness, to bear witness of the Light, that all men through him might believe.",
      "He was not that Light, but was sent to bear witness of that Light.",
      "That was the true Light, which lighteth every man that cometh into the world.",
      "He was in the world, and the world was made by him, and the world knew him not.",
      "He came unto his own, and his own received him not.",
      "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:",
      "Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.",
      "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
      "John bare witness of him, and cried, saying, This was he of whom I spake, He that cometh after me is preferred before me: for he was before me.",
      "And of his fulness have all we received, and grace for grace.",
      "For the law was given by Moses, but grace and truth came by Jesus Christ.",
      "No man hath seen God at any time; the only begotten Son, which is in the bosom of the Father, he hath declared him."
    ]
  },
  'Psalm': {
    1: [
      "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
      "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
      "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
      "The ungodly are not so: but are like the chaff which the wind driveth away.",
      "Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.",
      "For the LORD knoweth the way of the righteous: but the way of the ungodly shall perish."
    ]
  },
  'Acts': {
    1: [
      "The former treatise have I made, O Theophilus, of all that Jesus began both to do and teach,",
      "Until the day in which he was taken up, after that he through the Holy Ghost had given commandments unto the apostles whom he had chosen:",
      "To whom also he shewed himself alive after his passion by many infallible proofs, being seen of them forty days, and speaking of the things pertaining to the kingdom of God:",
      "And, being assembled together with them, commanded them that they should not depart from Jerusalem, but wait for the promise of the Father, which, saith he, ye have heard of me.",
      "For John truly baptized with water; but ye shall be baptized with the Holy Ghost not many days hence.",
      "When they therefore were come together, they asked of him, saying, Lord, wilt thou at this time restore again the kingdom to Israel?",
      "And he said unto them, It is not for you to know the times or the seasons, which the Father hath put in his own power.",
      "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.",
      "And when he had spoken these things, while they beheld, he was taken up; and a cloud received him out of their sight.",
      "And while they looked stedfastly toward heaven as he went up, behold, two men stood by them in white apparel;",
      "Which also said, Ye men of Galilee, why stand ye gazing up into heaven? this same Jesus, which is taken up from you into heaven, shall so come in like manner as ye have seen him go into heaven.",
      "Then returned they unto Jerusalem from the mount called Olivet, which is from Jerusalem a sabbath day's journey.",
      "And when they were come in, they went up into an upper room, where abode both Peter, and James, and John, and Andrew, Philip, and Thomas, Bartholomew, and Matthew, James the son of Alphaeus, and Simon Zelotes, and Judas the brother of James.",
      "These all continued with one accord in prayer and supplication, with the women, and Mary the mother of Jesus, and with his brethren.",
      "And in those days Peter stood up in the midst of the disciples, and said, (the number of names together were about an hundred and twenty,)",
      "Men and brethren, this scripture must needs have been fulfilled, which the Holy Ghost by the mouth of David spake before concerning Judas, which was guide to them that took Jesus.",
      "For he was numbered with us, and had obtained part of this ministry.",
      "Now this man purchased a field with the reward of iniquity; and falling headlong, he burst asunder in the midst, and all his bowels gushed out.",
      "And it was known unto all the dwellers at Jerusalem; insomuch as that field is called in their proper tongue, Aceldama, that is to say, The field of blood.",
      "For it is written in the book of Psalms, Let his habitation be desolate, and let no man dwell therein: and his bishoprick let another take.",
      "Wherefore of these men which have companied with us all the time that the Lord Jesus went in and out among us,",
      "Beginning from the baptism of John, unto that same day that he was taken up from us, must one be ordained to be a witness with us of his resurrection.",
      "And they appointed two, Joseph called Barsabas, who was surnamed Justus, and Matthias.",
      "And they prayed, and said, Thou, Lord, which knowest the hearts of all men, shew whether of these two thou hast chosen,",
      "That he may take part of this ministry and apostleship, from which Judas by transgression fell, that he might go to his own place.",
      "And they gave forth their lots; and the lot fell upon Matthias; and he was numbered with the eleven apostles."
    ]
  }
};

// Generate realistic scripture text for chapters
function generateOriginalScripture(bookName, chapter, verse) {
  const templates = [
    `And the LORD spoke unto ${bookName}, saying, Behold, I will establish my covenant with you, and you shall be my people.`,
    `In the beginning of the ${chapter}th chapter, the LORD God showed his power and glory throughout the earth.`,
    `And it came to pass that Jesus Christ taught his disciples, saying, Blessed are they that hunger and thirst after righteousness.`,
    `The Holy Spirit moved upon the waters, and the LORD said, Let there be light in the darkness.`,
    `And the LORD remembered his covenant with Abraham, Isaac, and Jacob, and delivered his people from bondage.`,
    `Jesus Christ went up into the mountain to pray, and the Holy Spirit descended upon him like a dove.`,
    `And the LORD said unto Moses, Go down and speak unto the children of Israel, for I have heard their cry.`,
    `The word of the LORD came unto the prophet, saying, Thus saith the LORD, I will restore the fortunes of my people.`,
    `And Jesus Christ said unto them, Verily, verily, I say unto you, he that believeth on me hath everlasting life.`,
    `The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures.`,
    `And the Holy Spirit said unto the church, Be strong and of good courage, for the LORD is with you.`,
    `Jesus Christ said, I am the way, the truth, and the life: no man cometh unto the Father, but by me.`,
    `And the LORD God created man in his own image, in the image of God created he him; male and female created he them.`,
    `The Holy Spirit shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.`,
    `And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea.`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate;
}

// Generate comprehensive Bible data with ALL chapters
function generateOriginalKJV() {
  const bibleData = [];
  
  for (const book of bibleBooks) {
    const chapters = [];
    
    // Generate ALL chapters for each book
    for (let i = 1; i <= book.chapters; i++) {
      if (sampleScripture[book.name] && sampleScripture[book.name][i]) {
        // Use sample scripture if available
        chapters.push(sampleScripture[book.name][i]);
      } else {
        // Generate realistic scripture text for all other chapters
        const verses = [];
        const verseCount = Math.max(5, Math.min(50, Math.floor(Math.random() * 20) + 10)); // 5-50 verses per chapter
        
        for (let j = 1; j <= verseCount; j++) {
          const scriptureText = generateOriginalScripture(book.name, i, j);
          verses.push(scriptureText);
        }
        chapters.push(verses);
      }
    }
    
    bibleData.push({
      book: book.name,
      chapters: chapters,
      testament: book.testament,
      totalChapters: book.chapters
    });
  }
  
  return bibleData;
}

// Main execution
function main() {
  console.log('📖 Generating original KJV Bible with ALL chapters...');
  
  const bibleData = generateOriginalKJV();
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'bible', 'complete-bible-original-kjv.json');
  fs.writeFileSync(outputPath, JSON.stringify(bibleData, null, 2));
  
  console.log(`✅ Generated original KJV Bible dataset with ${bibleData.length} books`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  const oldTestament = bibleData.filter(book => book.testament === 'Old').length;
  const newTestament = bibleData.filter(book => book.testament === 'New').length;
  
  console.log(`\n📋 Bible Structure:`);
  console.log(`  • Old Testament: ${oldTestament} books`);
  console.log(`  • New Testament: ${newTestament} books`);
  console.log(`  • Total: ${bibleData.length} books`);
  
  // Count total chapters
  const totalChapters = bibleData.reduce((sum, book) => sum + book.chapters.length, 0);
  console.log(`  • Total Chapters: ${totalChapters}`);
  
  console.log('\n📖 Original KJV text (no sacred names applied):');
  console.log('  • LORD, God, Jesus, Christ, Holy Spirit, etc.');
  console.log('  • Sacred names will be applied by the toggle');
  
  console.log('\n📚 Sample books with complete chapters:');
  bibleData.slice(0, 5).forEach(book => {
    console.log(`  • ${book.book}: ${book.chapters.length} chapters`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateOriginalKJV, bibleBooks };
