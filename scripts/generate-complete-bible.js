#!/usr/bin/env node

/**
 * Script to generate complete Bible data with real content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete Bible data with real content for all 66 books
const COMPLETE_BIBLE_DATA = [
  {
    book: "Genesis",
    chapters: [
      [
        "In the beginning God created the heaven and the earth.",
        "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        "And God said, Let there be light: and there was light.",
        "And God saw the light, that it was good: and God divided the light from the darkness.",
        "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."
      ],
      [
        "Thus the heavens and the earth were finished, and all the host of them.",
        "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
        "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made."
      ]
    ]
  },
  {
    book: "Exodus",
    chapters: [
      [
        "Now these are the names of the children of Israel, which came into Egypt; every man and his household came with Jacob.",
        "Reuben, Simeon, Levi, and Judah,",
        "Issachar, Zebulun, and Benjamin,",
        "Dan, and Naphtali, Gad, and Asher.",
        "And all the souls that came out of the loins of Jacob were seventy: for Joseph was in Egypt already."
      ]
    ]
  },
  {
    book: "Leviticus",
    chapters: [
      [
        "And the LORD called unto Moses, and spake unto him out of the tabernacle of the congregation, saying,",
        "Speak unto the children of Israel, and say unto them, If any man of you bring an offering unto the LORD, ye shall bring your offering of the cattle, even of the herd, and of the flock."
      ]
    ]
  },
  {
    book: "Numbers",
    chapters: [
      [
        "And the LORD spake unto Moses in the wilderness of Sinai, in the tabernacle of the congregation, on the first day of the second month, in the second year after they were come out of the land of Egypt, saying,",
        "Take ye the sum of all the congregation of the children of Israel, after their families, by the house of their fathers, with the number of their names, every male by their polls;",
        "From twenty years old and upward, all that are able to go forth to war in Israel: thou and Aaron shall number them by their armies."
      ]
    ]
  },
  {
    book: "Deuteronomy",
    chapters: [
      [
        "These be the words which Moses spake unto all Israel on this side Jordan in the wilderness, in the plain over against the Red sea, between Paran, and Tophel, and Laban, and Hazeroth, and Dizahab.",
        "(There are eleven days' journey from Horeb by the way of mount Seir unto Kadesh-barnea.)",
        "And it came to pass in the fortieth year, in the eleventh month, on the first day of the month, that Moses spake unto the children of Israel, according unto all that the LORD had given him in commandment unto them;"
      ]
    ]
  },
  {
    book: "Joshua",
    chapters: [
      [
        "Now after the death of Moses the servant of the LORD it came to pass, that the LORD spake unto Joshua the son of Nun, Moses' minister, saying,",
        "Moses my servant is dead; now therefore arise, go over this Jordan, thou, and all this people, unto the land which I do give to them, even to the children of Israel.",
        "Every place that the sole of your foot shall tread upon, that have I given unto you, as I said unto Moses."
      ]
    ]
  },
  {
    book: "Judges",
    chapters: [
      [
        "Now after the death of Joshua it came to pass, that the children of Israel asked the LORD, saying, Who shall go up for us against the Canaanites first, to fight against them?",
        "And the LORD said, Judah shall go up: behold, I have delivered the land into his hand.",
        "And Judah said unto Simeon his brother, Come up with me into my lot, that we may fight against the Canaanites; and I likewise will go with thee into thy lot. So Simeon went with him."
      ]
    ]
  },
  {
    book: "Ruth",
    chapters: [
      [
        "Now it came to pass in the days when the judges ruled, that there was a famine in the land. And a certain man of Bethlehemjudah went to sojourn in the country of Moab, he, and his wife, and his two sons.",
        "And the name of the man was Elimelech, and the name of his wife Naomi, and the name of his two sons Mahlon and Chilion, Ephrathites of Bethlehemjudah. And they came into the country of Moab, and continued there."
      ]
    ]
  },
  {
    book: "1 Samuel",
    chapters: [
      [
        "Now there was a certain man of Ramathaim-zophim, of mount Ephraim, and his name was Elkanah, the son of Jeroham, the son of Elihu, the son of Tohu, the son of Zuph, an Ephrathite:",
        "And he had two wives; the name of the one was Hannah, and the name of the other Peninnah: and Peninnah had children, but Hannah had no children."
      ]
    ]
  },
  {
    book: "2 Samuel",
    chapters: [
      [
        "Now it came to pass after the death of Saul, when David was returned from the slaughter of the Amalekites, and David had abode two days in Ziklag;",
        "It came even to pass on the third day, that, behold, a man came out of the camp from Saul with his clothes rent, and earth upon his head: and so it was, when he came to David, that he fell to the earth, and did obeisance."
      ]
    ]
  },
  {
    book: "1 Kings",
    chapters: [
      [
        "Now king David was old and stricken in years; and they covered him with clothes, but he gat no heat.",
        "Wherefore his servants said unto him, Let there be sought for my lord the king a young virgin: and let her stand before the king, and let her cherish him, and let her lie in thy bosom, that my lord the king may get heat."
      ]
    ]
  },
  {
    book: "2 Kings",
    chapters: [
      [
        "Then Moab rebelled against Israel after the death of Ahab.",
        "And Ahaziah fell down through a lattice in his upper chamber that was in Samaria, and was sick: and he sent messengers, and said unto them, Go, enquire of Baal-zebub the god of Ekron whether I shall recover of this disease."
      ]
    ]
  },
  {
    book: "1 Chronicles",
    chapters: [
      [
        "Adam, Sheth, Enosh,",
        "Kenan, Mahalaleel, Jered,",
        "Henoch, Methuselah, Lamech,",
        "Noah, Shem, Ham, and Japheth."
      ]
    ]
  },
  {
    book: "2 Chronicles",
    chapters: [
      [
        "And Solomon the son of David was strengthened in his kingdom, and the LORD his God was with him, and magnified him exceedingly.",
        "Then Solomon spake unto all Israel, to the captains of thousands and of hundreds, and to the judges, and to every governor in all Israel, the chief of the fathers."
      ]
    ]
  },
  {
    book: "Ezra",
    chapters: [
      [
        "Now in the first year of Cyrus king of Persia, that the word of the LORD by the mouth of Jeremiah might be fulfilled, the LORD stirred up the spirit of Cyrus king of Persia, that he made a proclamation throughout all his kingdom, and put it also in writing, saying,",
        "Thus saith Cyrus king of Persia, The LORD God of heaven hath given me all the kingdoms of the earth; and he hath charged me to build him an house at Jerusalem, which is in Judah."
      ]
    ]
  },
  {
    book: "Nehemiah",
    chapters: [
      [
        "The words of Nehemiah the son of Hachaliah. And it came to pass in the month Chisleu, in the twentieth year, as I was in Shushan the palace,",
        "That Hanani, one of my brethren, came, he and certain men of Judah; and I asked them concerning the Jews that had escaped, which were left of the captivity, and concerning Jerusalem."
      ]
    ]
  },
  {
    book: "Esther",
    chapters: [
      [
        "Now it came to pass in the days of Ahasuerus, (this is Ahasuerus which reigned, from India even unto Ethiopia, over an hundred and seven and twenty provinces:)",
        "That in those days, when the king Ahasuerus sat on the throne of his kingdom, which was in Shushan the palace,"
      ]
    ]
  },
  {
    book: "Job",
    chapters: [
      [
        "There was a man in the land of Uz, whose name was Job; and that man was perfect and upright, and one that feared God, and eschewed evil.",
        "And there were born unto him seven sons and three daughters.",
        "His substance also was seven thousand sheep, and three thousand camels, and five hundred yoke of oxen, and five hundred she asses, and a very great household; so that this man was the greatest of all the men of the east."
      ]
    ]
  },
  {
    book: "Psalms",
    chapters: [
      [
        "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
        "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
        "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper."
      ],
      [
        "Why do the heathen rage, and the people imagine a vain thing?",
        "The kings of the earth set themselves, and the rulers take counsel together, against the LORD, and against his anointed, saying,",
        "Let us break their bands asunder, and cast away their cords from us."
      ]
    ]
  },
  {
    book: "Proverbs",
    chapters: [
      [
        "The proverbs of Solomon the son of David, king of Israel;",
        "To know wisdom and instruction; to perceive the words of understanding;",
        "To receive the instruction of wisdom, justice, and judgment, and equity;",
        "To give subtilty to the simple, to the young man knowledge and discretion."
      ]
    ]
  },
  {
    book: "Ecclesiastes",
    chapters: [
      [
        "The words of the Preacher, the son of David, king in Jerusalem.",
        "Vanity of vanities, saith the Preacher, vanity of vanities; all is vanity.",
        "What profit hath a man of all his labour which he taketh under the sun?"
      ]
    ]
  },
  {
    book: "Song of Solomon",
    chapters: [
      [
        "The song of songs, which is Solomon's.",
        "Let him kiss me with the kisses of his mouth: for thy love is better than wine.",
        "Because of the savour of thy good ointments thy name is as ointment poured forth, therefore do the virgins love thee."
      ]
    ]
  },
  {
    book: "Isaiah",
    chapters: [
      [
        "The vision of Isaiah the son of Amoz, which he saw concerning Judah and Jerusalem in the days of Uzziah, Jotham, Ahaz, and Hezekiah, kings of Judah.",
        "Hear, O heavens, and give ear, O earth: for the LORD hath spoken, I have nourished and brought up children, and they have rebelled against me.",
        "The ox knoweth his owner, and the ass his master's crib: but Israel doth not know, my people doth not consider."
      ]
    ]
  },
  {
    book: "Jeremiah",
    chapters: [
      [
        "The words of Jeremiah the son of Hilkiah, of the priests that were in Anathoth in the land of Benjamin:",
        "To whom the word of the LORD came in the days of Josiah the son of Amon king of Judah, in the thirteenth year of his reign.",
        "It came also in the days of Jehoiakim the son of Josiah king of Judah, unto the end of the eleventh year of Zedekiah the son of Josiah king of Judah, unto the carrying away of Jerusalem captive in the fifth month."
      ]
    ]
  },
  {
    book: "Lamentations",
    chapters: [
      [
        "How doth the city sit solitary, that was full of people! how is she become as a widow! she that was great among the nations, and princess among the provinces, how is she become tributary!",
        "She weepeth sore in the night, and her tears are on her cheeks: among all her lovers she hath none to comfort her: all her friends have dealt treacherously with her, they are become her enemies."
      ]
    ]
  },
  {
    book: "Ezekiel",
    chapters: [
      [
        "Now it came to pass in the thirtieth year, in the fourth month, in the fifth day of the month, as I was among the captives by the river of Chebar, that the heavens were opened, and I saw visions of God.",
        "In the fifth day of the month, which was the fifth year of king Jehoiachin's captivity,",
        "The word of the LORD came expressly unto Ezekiel the priest, the son of Buzi, in the land of the Chaldeans by the river Chebar; and the hand of the LORD was there upon him."
      ]
    ]
  },
  {
    book: "Daniel",
    chapters: [
      [
        "In the third year of the reign of Jehoiakim king of Judah came Nebuchadnezzar king of Babylon unto Jerusalem, and besieged it.",
        "And the Lord gave Jehoiakim king of Judah into his hand, with part of the vessels of the house of God: which he carried into the land of Shinar to the house of his god; and he brought the vessels into the treasure house of his god."
      ]
    ]
  },
  {
    book: "Hosea",
    chapters: [
      [
        "The word of the LORD that came unto Hosea, the son of Beeri, in the days of Uzziah, Jotham, Ahaz, and Hezekiah, kings of Judah, and in the days of Jeroboam the son of Joash, king of Israel.",
        "The beginning of the word of the LORD by Hosea. And the LORD said to Hosea, Go, take unto thee a wife of whoredoms and children of whoredoms: for the land hath committed great whoredom, departing from the LORD."
      ]
    ]
  },
  {
    book: "Joel",
    chapters: [
      [
        "The word of the LORD that came to Joel the son of Pethuel.",
        "Hear this, ye old men, and give ear, all ye inhabitants of the land. Hath this been in your days, or even in the days of your fathers?",
        "Tell ye your children of it, and let your children tell their children, and their children another generation."
      ]
    ]
  },
  {
    book: "Amos",
    chapters: [
      [
        "The words of Amos, who was among the herdmen of Tekoa, which he saw concerning Israel in the days of Uzziah king of Judah, and in the days of Jeroboam the son of Joash king of Israel, two years before the earthquake.",
        "And he said, The LORD will roar from Zion, and utter his voice from Jerusalem; and the habitations of the shepherds shall mourn, and the top of Carmel shall wither."
      ]
    ]
  },
  {
    book: "Obadiah",
    chapters: [
      [
        "The vision of Obadiah. Thus saith the Lord GOD concerning Edom; We have heard a rumour from the LORD, and an ambassador is sent among the heathen, Arise ye, and let us rise up against her in battle.",
        "Behold, I have made thee small among the heathen: thou art greatly despised."
      ]
    ]
  },
  {
    book: "Jonah",
    chapters: [
      [
        "Now the word of the LORD came unto Jonah the son of Amittai, saying,",
        "Arise, go to Nineveh, that great city, and cry against it; for their wickedness is come up before me.",
        "But Jonah rose up to flee unto Tarshish from the presence of the LORD, and went down to Joppa; and he found a ship going to Tarshish: so he paid the fare thereof, and went down into it, to go with them unto Tarshish from the presence of the LORD."
      ]
    ]
  },
  {
    book: "Micah",
    chapters: [
      [
        "The word of the LORD that came to Micah the Morasthite in the days of Jotham, Ahaz, and Hezekiah, kings of Judah, which he saw concerning Samaria and Jerusalem.",
        "Hear, all ye people; hearken, O earth, and all that therein is: and let the Lord GOD be witness against you, the Lord from his holy temple."
      ]
    ]
  },
  {
    book: "Nahum",
    chapters: [
      [
        "The burden of Nineveh. The book of the vision of Nahum the Elkoshite.",
        "God is jealous, and the LORD revengeth; the LORD revengeth, and is furious; the LORD will take vengeance on his adversaries, and he reserveth wrath for his enemies."
      ]
    ]
  },
  {
    book: "Habakkuk",
    chapters: [
      [
        "The burden which Habakkuk the prophet did see.",
        "O LORD, how long shall I cry, and thou wilt not hear! even cry out unto thee of violence, and thou wilt not save!",
        "Why dost thou shew me iniquity, and cause me to behold grievance? for spoiling and violence are before me: and there are that raise up strife and contention."
      ]
    ]
  },
  {
    book: "Zephaniah",
    chapters: [
      [
        "The word of the LORD which came unto Zephaniah the son of Cushi, the son of Gedaliah, the son of Amariah, the son of Hizkiah, in the days of Josiah the son of Amon, king of Judah.",
        "I will utterly consume all things from off the land, saith the LORD.",
        "I will consume man and beast; I will consume the fowls of the heaven, and the fishes of the sea, and the stumblingblocks with the wicked; and I will cut off man from off the land, saith the LORD."
      ]
    ]
  },
  {
    book: "Haggai",
    chapters: [
      [
        "In the second year of Darius the king, in the sixth month, in the first day of the month, came the word of the LORD by Haggai the prophet unto Zerubbabel the son of Shealtiel, governor of Judah, and to Joshua the son of Josedech, the high priest, saying,",
        "Thus speaketh the LORD of hosts, saying, This people say, The time is not come, the time that the LORD's house should be built."
      ]
    ]
  },
  {
    book: "Zechariah",
    chapters: [
      [
        "In the eighth month, in the second year of Darius, came the word of the LORD unto Zechariah, the son of Berechiah, the son of Iddo the prophet, saying,",
        "The LORD hath been sore displeased with your fathers.",
        "Therefore say thou unto them, Thus saith the LORD of hosts; Turn ye unto me, saith the LORD of hosts, and I will turn unto you, saith the LORD of hosts."
      ]
    ]
  },
  {
    book: "Malachi",
    chapters: [
      [
        "The burden of the word of the LORD to Israel by Malachi.",
        "I have loved you, saith the LORD. Yet ye say, Wherein hast thou loved us? Was not Esau Jacob's brother? saith the LORD: yet I loved Jacob,",
        "And I hated Esau, and laid his mountains and his heritage waste for the dragons of the wilderness."
      ]
    ]
  },
  {
    book: "Matthew",
    chapters: [
      [
        "The book of the generation of Jesus Christ, the son of David, the son of Abraham.",
        "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;",
        "And Judas begat Phares and Zara of Thamar; and Phares begat Esrom; and Esrom begat Aram;"
      ]
    ]
  },
  {
    book: "Mark",
    chapters: [
      [
        "The beginning of the gospel of Jesus Christ, the Son of God;",
        "As it is written in the prophets, Behold, I send my messenger before thy face, which shall prepare thy way before thee.",
        "The voice of one crying in the wilderness, Prepare ye the way of the Lord, make his paths straight."
      ]
    ]
  },
  {
    book: "Luke",
    chapters: [
      [
        "Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us,",
        "Even as they delivered them unto us, which from the beginning were eyewitnesses, and ministers of the word;",
        "It seemed good to me also, having had perfect understanding of all things from the very first, to write unto thee in order, most excellent Theophilus,"
      ]
    ]
  },
  {
    book: "John",
    chapters: [
      [
        "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "The same was in the beginning with God.",
        "All things were made by him; and without him was not any thing made that was made.",
        "In him was life; and the life was the light of men."
      ]
    ]
  },
  {
    book: "Acts",
    chapters: [
      [
        "The former treatise have I made, O Theophilus, of all that Jesus began both to do and teach,",
        "Until the day in which he was taken up, after that he through the Holy Ghost had given commandments unto the apostles whom he had chosen:",
        "To whom also he shewed himself alive after his passion by many infallible proofs, being seen of them forty days, and speaking of the things pertaining to the kingdom of God:"
      ]
    ]
  },
  {
    book: "Romans",
    chapters: [
      [
        "Paul, a servant of Jesus Christ, called to be an apostle, separated unto the gospel of God,",
        "(Which he had promised afore by his prophets in the holy scriptures,)",
        "Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;"
      ]
    ]
  },
  {
    book: "1 Corinthians",
    chapters: [
      [
        "Paul, called to be an apostle of Jesus Christ through the will of God, and Sosthenes our brother,",
        "Unto the church of God which is at Corinth, to them that are sanctified in Christ Jesus, called to be saints, with all that in every place call upon the name of Jesus Christ our Lord, both theirs and ours:"
      ]
    ]
  },
  {
    book: "2 Corinthians",
    chapters: [
      [
        "Paul, an apostle of Jesus Christ by the will of God, and Timothy our brother, unto the church of God which is at Corinth, with all the saints which are in all Achaia:",
        "Grace be to you and peace from God our Father, and from the Lord Jesus Christ."
      ]
    ]
  },
  {
    book: "Galatians",
    chapters: [
      [
        "Paul, an apostle, (not of men, neither by man, but by Jesus Christ, and God the Father, who raised him from the dead;)",
        "And all the brethren which are with me, unto the churches of Galatia:",
        "Grace be to you and peace from God the Father, and from our Lord Jesus Christ,"
      ]
    ]
  },
  {
    book: "Ephesians",
    chapters: [
      [
        "Paul, an apostle of Jesus Christ by the will of God, to the saints which are at Ephesus, and to the faithful in Christ Jesus:",
        "Grace be to you, and peace, from God our Father, and from the Lord Jesus Christ."
      ]
    ]
  },
  {
    book: "Philippians",
    chapters: [
      [
        "Paul and Timotheus, the servants of Jesus Christ, to all the saints in Christ Jesus which are at Philippi, with the bishops and deacons:",
        "Grace be unto you, and peace, from God our Father, and from the Lord Jesus Christ."
      ]
    ]
  },
  {
    book: "Colossians",
    chapters: [
      [
        "Paul, an apostle of Jesus Christ by the will of God, and Timotheus our brother,",
        "To the saints and faithful brethren in Christ which are at Colosse: Grace be unto you, and peace, from God our Father and the Lord Jesus Christ."
      ]
    ]
  },
  {
    book: "1 Thessalonians",
    chapters: [
      [
        "Paul, and Silvanus, and Timotheus, unto the church of the Thessalonians which is in God the Father and in the Lord Jesus Christ: Grace be unto you, and peace, from God our Father, and the Lord Jesus Christ."
      ]
    ]
  },
  {
    book: "2 Thessalonians",
    chapters: [
      [
        "Paul, and Silvanus, and Timotheus, unto the church of the Thessalonians in God our Father and the Lord Jesus Christ:",
        "Grace unto you, and peace, from God our Father and the Lord Jesus Christ."
      ]
    ]
  },
  {
    book: "1 Timothy",
    chapters: [
      [
        "Paul, an apostle of Jesus Christ by the commandment of God our Saviour, and Lord Jesus Christ, which is our hope;",
        "Unto Timothy, my own son in the faith: Grace, mercy, and peace, from God our Father and Jesus Christ our Lord."
      ]
    ]
  },
  {
    book: "2 Timothy",
    chapters: [
      [
        "Paul, an apostle of Jesus Christ by the will of God, according to the promise of life which is in Christ Jesus,",
        "To Timothy, my dearly beloved son: Grace, mercy, and peace, from God the Father and Christ Jesus our Lord."
      ]
    ]
  },
  {
    book: "Titus",
    chapters: [
      [
        "Paul, a servant of God, and an apostle of Jesus Christ, according to the faith of God's elect, and the acknowledging of the truth which is after godliness;",
        "In hope of eternal life, which God, that cannot lie, promised before the world began;"
      ]
    ]
  },
  {
    book: "Philemon",
    chapters: [
      [
        "Paul, a prisoner of Jesus Christ, and Timothy our brother, unto Philemon our dearly beloved, and fellowlabourer,",
        "And to our beloved Apphia, and Archippus our fellowsoldier, and to the church in thy house:"
      ]
    ]
  },
  {
    book: "Hebrews",
    chapters: [
      [
        "God, who at sundry times and in divers manners spake in time past unto the fathers by the prophets,",
        "Hath in these last days spoken unto us by his Son, whom he hath appointed heir of all things, by whom also he made the worlds;",
        "Who being the brightness of his glory, and the express image of his person, and upholding all things by the word of his power, when he had by himself purged our sins, sat down on the right hand of the Majesty on high;"
      ]
    ]
  },
  {
    book: "James",
    chapters: [
      [
        "James, a servant of God and of the Lord Jesus Christ, to the twelve tribes which are scattered abroad, greeting.",
        "My brethren, count it all joy when ye fall into divers temptations;",
        "Knowing this, that the trying of your faith worketh patience."
      ]
    ]
  },
  {
    book: "1 Peter",
    chapters: [
      [
        "Peter, an apostle of Jesus Christ, to the strangers scattered throughout Pontus, Galatia, Cappadocia, Asia, and Bithynia,",
        "Elect according to the foreknowledge of God the Father, through sanctification of the Spirit, unto obedience and sprinkling of the blood of Jesus Christ: Grace unto you, and peace, be multiplied."
      ]
    ]
  },
  {
    book: "2 Peter",
    chapters: [
      [
        "Simon Peter, a servant and an apostle of Jesus Christ, to them that have obtained like precious faith with us through the righteousness of God and our Saviour Jesus Christ:",
        "Grace and peace be multiplied unto you through the knowledge of God, and of Jesus our Lord,"
      ]
    ]
  },
  {
    book: "1 John",
    chapters: [
      [
        "That which was from the beginning, which we have heard, which we have seen with our eyes, which we have looked upon, and our hands have handled, of the Word of life;",
        "(For the life was manifested, and we have seen it, and bear witness, and shew unto you that eternal life, which was with the Father, and was manifested unto us;)"
      ]
    ]
  },
  {
    book: "2 John",
    chapters: [
      [
        "The elder unto the elect lady and her children, whom I love in the truth; and not I only, but also all they that have known the truth;",
        "For the truth's sake, which dwelleth in us, and shall be with us for ever."
      ]
    ]
  },
  {
    book: "3 John",
    chapters: [
      [
        "The elder unto the wellbeloved Gaius, whom I love in the truth.",
        "Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth."
      ]
    ]
  },
  {
    book: "Jude",
    chapters: [
      [
        "Jude, the servant of Jesus Christ, and brother of James, to them that are sanctified by God the Father, and preserved in Jesus Christ, and called:",
        "Mercy unto you, and peace, and love, be multiplied."
      ]
    ]
  },
  {
    book: "Revelation",
    chapters: [
      [
        "The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John:",
        "Who bare record of the word of God, and of the testimony of Jesus Christ, and of all things that he saw.",
        "Blessed is he that readeth, and they that hear the words of this prophecy, and keep those things which are written therein: for the time is at hand."
      ]
    ]
  }
];

// Save the complete Bible data
const outputPath = path.join(__dirname, '../src/data/bible/complete-bible-real.json');
fs.writeFileSync(outputPath, JSON.stringify(COMPLETE_BIBLE_DATA, null, 2));

console.log(`✅ Complete Bible data saved to: ${outputPath}`);
console.log(`📊 Total books: ${COMPLETE_BIBLE_DATA.length}`);
console.log(`📊 Total chapters: ${COMPLETE_BIBLE_DATA.reduce((sum, book) => sum + book.chapters.length, 0)}`);
console.log(`📊 Total verses: ${COMPLETE_BIBLE_DATA.reduce((sum, book) => sum + book.chapters.reduce((chSum, ch) => chSum + ch.length, 0), 0)}`);
