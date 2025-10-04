import { h as createVNode, e as Fragment, _ as __astro_tag_component__ } from './astro/server_Dkd2Gmz6.mjs';
import 'clsx';

const frontmatter = {
  "title": "Keep the Feast, Dump the Yeast",
  "slug": "keep-the-feast-dump-the-yeast",
  "tags": ["Feasts", "Holiness", "Obedience"],
  "summary": "The Feast of Unleavened Bread isn't a suggestion. It's a command to remove sin from your life. No excuses, no half measures—get the yeast out.",
  "publishedAt": "2025-10-01T00:00:00.000Z",
  "readingTime": 5
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "why-unleavened-bread-matters",
    "text": "Why Unleavened Bread Matters"
  }, {
    "depth": 2,
    "slug": "the-seven-day-purge",
    "text": "The Seven-Day Purge"
  }, {
    "depth": 2,
    "slug": "modern-application",
    "text": "Modern Application"
  }, {
    "depth": 2,
    "slug": "the-challenge",
    "text": "The Challenge"
  }];
}
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    hr: "hr",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "why-unleavened-bread-matters",
      children: "Why Unleavened Bread Matters"
    }), "\n", createVNode(_components.p, {
      children: "Leaven represents sin. It puffs up. It spreads. It corrupts the whole lump (1 Corinthians 5:6)."
    }), "\n", createVNode(_components.p, {
      children: ["When YAHUAH commanded His people to eat unleavened bread for seven days, He wasn’t making suggestions. He was establishing a pattern: ", createVNode(_components.strong, {
        children: "separate yourself from sin"
      }), "."]
    }), "\n", createVNode(_components.h2, {
      id: "the-seven-day-purge",
      children: "The Seven-Day Purge"
    }), "\n", createVNode(_components.p, {
      children: "For seven days, you remove all leaven from your house. Every crumb. Every trace."
    }), "\n", createVNode(_components.p, {
      children: "This is a physical act with spiritual meaning:"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Identify the leaven"
        }), " - What sin is hiding in your life?"]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Remove it ruthlessly"
        }), " - No compromise, no “just a little”"]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Guard the house"
        }), " - Stay vigilant so it doesn’t return"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "modern-application",
      children: "Modern Application"
    }), "\n", createVNode(_components.p, {
      children: "We’re not under the law for salvation—we’re under grace. But grace doesn’t mean license to sin. It means power to overcome."
    }), "\n", createVNode(_components.p, {
      children: "The Feast of Unleavened Bread teaches us:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Holiness is intentional"
        }), " - You have to actively remove sin"]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Small compromises spread"
        }), " - A little leaven corrupts the whole"]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Obedience brings freedom"
        }), " - Living without leaven is living without burden"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "the-challenge",
      children: "The Challenge"
    }), "\n", createVNode(_components.p, {
      children: ["This year, don’t just skip Easter and call it done. ", createVNode(_components.strong, {
        children: "Observe the Feast of Unleavened Bread."
      })]
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Fast from a specific sin for seven days"
      }), "\n", createVNode(_components.li, {
        children: "Remove ungodly influences from your home (media, relationships, habits)"
      }), "\n", createVNode(_components.li, {
        children: "Meditate on YAHUSHA as the Bread of Life—pure, sinless, unleavened"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "YAHUAH didn’t give us the Feasts to burden us. He gave them to train us, refine us, and prepare us for His Kingdom."
    }), "\n", createVNode(_components.p, {
      children: "Keep the Feast. Dump the yeast. Walk in holiness."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.p, {
      children: createVNode(_components.strong, {
        children: "Scripture References:"
      })
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Exodus 12:15-20 - Command to observe Unleavened Bread"
      }), "\n", createVNode(_components.li, {
        children: "1 Corinthians 5:6-8 - Christ our Passover, purge the leaven"
      }), "\n", createVNode(_components.li, {
        children: "Galatians 5:9 - A little leaven corrupts the whole lump"
      }), "\n"]
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}

const url = "src/content/blog/keep-the-feast-dump-the-yeast.mdx";
const file = "/Users/asjames18/Development/RRG Website/src/content/blog/keep-the-feast-dump-the-yeast.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/asjames18/Development/RRG Website/src/content/blog/keep-the-feast-dump-the-yeast.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
