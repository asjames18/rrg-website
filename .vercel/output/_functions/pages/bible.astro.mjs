import { c as createComponent, b as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DCtlZR10.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CLTBcQpW.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const bibleData = [
	{
		book: "Genesis",
		chapters: [
			[
				"In the beginning God created the heaven and the earth.",
				"And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
				"And God said, Let there be light: and there was light."
			],
			[
				"Thus the heavens and the earth were finished, and all the host of them.",
				"And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made."
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
			],
			[
				"And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there:",
				"And both Jesus and his disciples were called to the marriage."
			]
		]
	},
	{
		book: "Psalm",
		chapters: [
			[
				"Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
				"But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
				"And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper."
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
			],
			[
				"And when the day of Pentecost was fully come, they were all with one accord in one place.",
				"And suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting.",
				"And there appeared unto them cloven tongues like as of fire, and it sat upon each of them.",
				"And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance."
			]
		]
	}
];

function BibleReader() {
  const [bookIndex, setBookIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [sacredNames, setSacredNames] = useState(true);
  const books = bibleData;
  const currentBook = books[bookIndex];
  const currentChapter = currentBook?.chapters[chapterIndex] || [];
  const applySacredNames = (text) => {
    if (!sacredNames) return text;
    let result = text;
    result = result.replace(/\bLORD\b/g, "YAHUAH");
    result = result.replace(/\bGOD\b/g, "YAHUAH");
    result = result.replace(/\bJesus\b/g, "YAHUSHA");
    result = result.replace(/\bHoly Ghost\b/g, "RUACH HAQODESH");
    result = result.replace(/\bHoly Spirit\b/g, "RUACH HAQODESH");
    result = result.replace(/\bSpirit of God\b/g, "RUACH of Elohim");
    result = result.replace(/\bGod\b/g, "Elohim");
    return result;
  };
  const handleBookChange = (e) => {
    setBookIndex(Number(e.target.value));
    setChapterIndex(0);
  };
  const handleChapterChange = (e) => {
    setChapterIndex(Number(e.target.value));
  };
  if (books.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-neutral-500", children: "Bible data not available" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-neutral-800", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "book-select", className: "block text-sm font-medium text-neutral-400 mb-1", children: "Book" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                id: "book-select",
                value: bookIndex,
                onChange: handleBookChange,
                className: "w-full px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
                children: books.map((book, index) => /* @__PURE__ */ jsx("option", { value: index, children: book.book }, index))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "chapter-select", className: "block text-sm font-medium text-neutral-400 mb-1", children: "Chapter" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                id: "chapter-select",
                value: chapterIndex,
                onChange: handleChapterChange,
                className: "w-full px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
                children: currentBook.chapters.map((_, index) => /* @__PURE__ */ jsxs("option", { value: index, children: [
                  "Chapter ",
                  index + 1
                ] }, index))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-6 md:pt-0", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "sacred-names-toggle",
              checked: sacredNames,
              onChange: (e) => setSacredNames(e.target.checked),
              className: "w-4 h-4 text-amber-600 bg-neutral-800 border-neutral-600 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            }
          ),
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "sacred-names-toggle",
              className: "text-sm font-medium text-neutral-300 cursor-pointer select-none",
              children: "Sacred Names"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-300", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-amber-100", children: "Note:" }),
        ' This is a sample Bible reader with limited content. Toggle "Sacred Names" to see the divine names restored: YAHUAH, YAHUSHA, RUACH HAQODESH, Elohim.'
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold mb-6 text-amber-100", children: [
        currentBook.book,
        " ",
        chapterIndex + 1
      ] }),
      /* @__PURE__ */ jsx("div", { className: "prose prose-lg prose-invert max-w-none", children: currentChapter.length > 0 ? currentChapter.map((verse, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-amber-500 flex-shrink-0 w-8 text-right", children: index + 1 }),
        /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed text-neutral-200 m-0", children: applySacredNames(verse) })
      ] }, index)) : /* @__PURE__ */ jsx("p", { className: "text-neutral-500", children: "No verses available for this chapter." }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-6 border-t border-neutral-800 flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setChapterIndex(Math.max(0, chapterIndex - 1)),
            disabled: chapterIndex === 0,
            className: "px-6 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
            "aria-label": "Previous chapter",
            children: "← Previous"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setChapterIndex(Math.min(currentBook.chapters.length - 1, chapterIndex + 1)),
            disabled: chapterIndex === currentBook.chapters.length - 1,
            className: "px-6 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900",
            "aria-label": "Next chapter",
            children: "Next →"
          }
        )
      ] })
    ] })
  ] });
}

const $$Bible = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Bible Reader" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 md:py-16"> <h1 class="text-3xl md:text-5xl font-bold mb-4 text-amber-100">Bible Reader</h1> <p class="text-lg md:text-xl text-neutral-300 mb-8 max-w-3xl">
Read Scripture with the Sacred Names restored. Toggle between standard translation and names of YAHUAH, YAHUSHA, and RUACH HAQODESH.
</p> <div class="max-w-5xl mx-auto"> ${renderComponent($$result2, "BibleReader", BibleReader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/asjames18/Development/RRG Website/src/components/BibleReader", "client:component-export": "default" })} </div>  <div class="mt-12 max-w-3xl mx-auto space-y-6"> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h2 class="text-xl font-bold mb-3 text-amber-100">About the Sacred Names</h2> <div class="text-neutral-300 space-y-3 text-sm"> <p> <strong class="text-amber-200">YAHUAH</strong> - The personal Name of the Most High God, 
            often replaced with "LORD" in most English Bibles. The tetragrammaton (YHWH) restored.
</p> <p> <strong class="text-amber-200">YAHUSHA</strong> - The true Hebrew Name of the Messiah, 
            often translated as "Jesus" but originally meaning "YAHUAH saves."
</p> <p> <strong class="text-amber-200">RUACH HAQODESH</strong> - The Holy Spirit, 
            literally "the Set-Apart Spirit" in Hebrew.
</p> <p> <strong class="text-amber-200">Elohim</strong> - The Hebrew word for God/gods, 
            used when referring to the divine nature or majesty.
</p> </div> </div> <div class="bg-amber-900/20 border border-amber-800/50 rounded-lg p-6"> <h3 class="text-amber-100 font-bold mb-2">Why This Matters</h3> <p class="text-neutral-300 text-sm">
Names have power and meaning. The Name of YAHUAH was hidden for centuries through translation. 
          When we restore the sacred Names, we honor Him as He revealed Himself to His people. 
          This is not about legalism—it's about relationship and reverence.
</p> </div> <div class="bg-neutral-900 border border-neutral-800 rounded-lg p-6"> <h3 class="text-amber-100 font-bold mb-2">Full Bible Coming Soon</h3> <p class="text-neutral-300 text-sm">
This is a sample reader with limited content. We're working on providing the complete Bible 
          with Sacred Names restoration. For now, use this to understand how the Names change the reading experience.
</p> </div> </div> </div> ` })}`;
}, "/Users/asjames18/Development/RRG Website/src/pages/bible.astro", void 0);

const $$file = "/Users/asjames18/Development/RRG Website/src/pages/bible.astro";
const $$url = "/bible";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Bible,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
