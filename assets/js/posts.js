/* ========== BLOG POSTS ==========
   Naya blog: 1) posts/<slug>.md file banao  2) yaha ek object add karo.
   slug = file ka naam (bina .md), date = YYYY-MM-DD */
const POSTS = [
  {
    slug: "bloom-filter",
    title: "Bloom Filters: Fast “Definitely Not” Answers in Tiny Memory",
    date: "2026-10-17",
    read: "7 min read",
    tags: ["Data Structures", "System Design"],
    cover: "assets/img/Blog-Bloom Filter_1.png",
    summary: "How a tiny array of bits can tell you an item is definitely not in a huge set, how to size one, a Python implementation, and where real systems use it."
  },
  {
    slug: "llm-distilation",
    title: "LLM Distilation: Make Smaller Models, Same Intelligence",
    date: "2026-10-18",
    read: "10 min read",
    tags: ["LLM"],
    cover: "assets/img/Blog-LLM Distillation_2.png",
    summary: "what if a small model could learn from a big one and copy its skills?"
  }
];
