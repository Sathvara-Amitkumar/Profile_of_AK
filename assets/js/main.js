/*=============== HOME SPLIT TEXT ===============*/
document
  .querySelectorAll(".home__split, .home__profession-1, .home__profession-2")
  .forEach((el, n) => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "split-char";
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.animationDelay = `${n * 0.25 + i * 0.04}s`;
      el.appendChild(s);
    });
  });

/*=============== MOVING PARTICLES ===============*/
(() => {
  const cv = document.getElementById("particles"),
    ctx = cv.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let W,
    H,
    mouse = { x: -999, y: -999 },
    pts = [];
  const hue =
    getComputedStyle(document.documentElement).getPropertyValue("--hue") || 255;
  const size = () => {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
    pts = Array.from({ length: W < 768 ? 35 : 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  };
  size();
  addEventListener("resize", size);
  cv.parentElement.addEventListener("mousemove", (e) => {
    const b = cv.getBoundingClientRect();
    mouse = { x: e.clientX - b.left, y: e.clientY - b.top };
  });
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p) => {
      const dx = p.x - mouse.x,
        dy = p.y - mouse.y,
        d = Math.hypot(dx, dy);
      if (d < 110) {
        p.x += (dx / d) * 1.5;
        p.y += (dy / d) * 1.5;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `hsla(${hue},70%,75%,.6)`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();

/*=============== PROJECT CARDS + POP-UP ===============*/
const clean = (t) => t.replace(/<br>/g, "");
const grid = document.getElementById("projects-grid"),
  modal = document.getElementById("modal"),
  body = document.getElementById("modal-body");
PROJECTS.forEach((p, i) =>
  grid.insertAdjacentHTML(
    "beforeend",
    `
  <button class="pcard" data-i="${i}"><img src="assets/img/${p.img}" alt="${clean(p.title)}">
    <div class="pcard__body"><span class="pcard__type">${p.type}</span><h3 class="pcard__title">${clean(p.title)}</h3>
    <div class="tags">${p.tech
      .slice(0, 3)
      .map((t) => `<span>${t}</span>`)
      .join("")}</div></div></button>`,
  ),
);
const closeModal = () => {
  modal.classList.remove("modal-open");
  document.body.style.overflow = "";
};
grid.addEventListener("click", (e) => {
  const c = e.target.closest(".pcard");
  if (!c) return;
  const p = PROJECTS[c.dataset.i];
  body.innerHTML = `<img src="assets/img/${p.img}" alt=""><div class="modal__body-data"><span class="pcard__type">${p.type}</span>
    <h2>${clean(p.title)}</h2><ul>${p.points.map((t) => `<li>${t}</li>`).join("")}</ul>
    <h4 class="work__subtitle">Tech stack</h4><div class="tags">${p.tech.map((t) => `<span>${t}</span>`).join("")}</div>
    <div class="projects__links">${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="button">Live Demo <i class="ri-external-link-line"></i></a>` : ""}
    ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="button">GitHub <i class="ri-github-line"></i></a>` : ""}</div></div>`;
  modal.classList.add("modal-open");
  document.body.style.overflow = "hidden";
});
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest(".modal__close")) closeModal();
});
addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

/*=============== WORK: EXPERIENCE + EDUCATION TOGGLE ===============*/
const WORK = {
  exp: [
    {
      t: "Python Developer Intern",
      s: "CandidRoot Solutions Pvt. Ltd.",
      y: "4 Months",
      d: "Engineered and customized ERP modules with Python and the Odoo framework to streamline sales and inventory workflows. Integrated and managed PostgreSQL databases with structured business datasets, strengthening backend operations and data reliability.",
    },
  ],
  edu: [
    {
      t: "B.Tech in Information Technology",
      s: "Ganpat University | U. V. Patel College of Engineering",
      y: "2026",
      d: "Graduating in 2026 with a CGPA of 7.78.",
    },
    {
      t: "HSC",
      s: "K. N. Patel Sarvoday High School, Kahoda",
      y: "2022",
      d: "Higher Secondary Certificate with 55.23%.",
    },
    {
      t: "SSC",
      s: "K. N. Patel Sarvoday High School, Kahoda",
      y: "2020",
      d: "Secondary School Certificate with 65.66%.",
    },
  ],
  cert: [
    {
      t: "Python Essentials 1",
      s: "Cisco Networking Academy",
      y: "2025",
      d: "Certification covering Python fundamentals and data handling.",
    },
    {
      t: "OCI AI Foundations Associate",
      s: "Oracle Cloud Infrastructure",
      y: "2025",
      d: "Certification focused on AI, ML and cloud-based data processing concepts.",
    },
  ],
};

const list = document.getElementById("work-list"),
  tabsEl = document.getElementById("work-tabs");
const showWork = (k) => {
  list.style.animation = "none";
  list.offsetHeight;
  list.style.animation = "";
  list.innerHTML = WORK[k]
    .map(
      (w) =>
        `<article class="work__item"><div class="work__left"><div><h3 class="work__title">${w.t}</h3><span class="work__subtitle">${w.s}</span></div><b class="work__year">${w.y}</b></div><p class="work__description">${w.d}</p></article>`,
    )
    .join("");
};
showWork("exp");
tabsEl.querySelectorAll(".work__button").forEach((b) =>
  b.addEventListener("click", () => {
    tabsEl
      .querySelectorAll(".work__button")
      .forEach((x) => x.classList.remove("work-active"));
    b.classList.add("work-active");
    tabsEl.dataset.tab = b.dataset.tab;
    showWork(b.dataset.tab);
  }),
);

/*=============== SKILLS (icons from Devicon + Remix Icon) ===============*/
const d = (n, c) => [n, `devicon-${c}`];
const SKILLS = [
  {
    t: "Programming",
    i: "ri-code-s-slash-line",
    w: "w2",
    icons: [
      d("Python", "python-plain"),
      ["SQL", "ri-database-2-line"],
      d("Java", "java-plain"),
    ],
  },
  {
    t: "Machine Learning",
    i: "ri-brain-line",
    w: "w4",
    icons: [
      d("Scikit-learn", "scikitlearn-plain"),
      d("Pandas", "pandas-plain"),
      d("NumPy", "numpy-plain"),
      d("Matplotlib", "matplotlib-plain"),
    ],
    chips: [
      "Data Preprocessing",
      "Feature Engineering",
      "EDA",
      "Model Evaluation",
    ],
  },
  {
    t: "Deep Learning",
    i: "ri-node-tree",
    w: "w4",
    icons: [d("TensorFlow", "tensorflow-original"), d("Keras", "keras-plain")],
    chips: [
      "ANN",
      "Perceptron",
      "Forward Propagation",
      "Backpropagation",
      "ReLU",
      "Sigmoid",
      "Softmax",
      "Categorical Crossentropy",
      "Gradient Descent",
      "Adam",
    ],
  },
  {
    t: "Backend & APIs",
    i: "ri-server-line",
    w: "w2",
    icons: [d("FastAPI", "fastapi-plain"), d("Flask", "flask-original")],
    chips: ["Pydantic", "REST APIs"],
  },
  {
    t: "Databases",
    i: "ri-database-line",
    w: "w2",
    icons: [d("MySQL", "mysql-original"), d("PostgreSQL", "postgresql-plain")],
  },
  {
    t: "Tools",
    i: "ri-tools-line",
    w: "w4",
    icons: [
      d("Git", "git-plain"),
      d("GitHub", "github-original"),
      d("Jupyter Notebook", "jupyter-plain"),
      d("VS Code", "vscode-plain"),
      ["Streamlit", "ri-bar-chart-box-line"],
    ],
  },
];
document.getElementById("skills-grid").innerHTML = SKILLS.map(
  (s) => `<article class="skills__card ${s.w}">
  <div class="skills__head"><i class="${s.i}"></i><h3>${s.t}</h3></div>
  <div class="skills__items">${s.icons.map(([n, c]) => `<span class="skills__icon" title="${n}" aria-label="${n}"><i class="${c}"></i></span>`).join("")}${(s.chips || []).map((c) => `<span class="skills__chip">${c}</span>`).join("")}</div></article>`,
).join("");

/*=============== CONTACT FORM -> GOOGLE SHEET ===============*/
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyhkT1JpDLb2HfedHBNxdx12mQd03saMVB0nkEmje7bK7vW1CKXFO8KIWndtuLlKecQ7g/exec";
const form = document.getElementById("contact-form"),
  statusEl = document.getElementById("form-status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector("button[type=submit]"),
    label = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = "Sending...";
  statusEl.className = "contact__status";
  statusEl.textContent = "";

  try {
    // const res = await fetch(SHEET_URL, {
    //   method: "POST",
    //   body: new URLSearchParams(new FormData(form)),
    // });

    // if ((await res.text()).trim() !== "ok") throw new Error("server");

    await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(form)) });

    form.reset();
    statusEl.textContent = "Thanks! Your message has been sent ✓";
    statusEl.classList.add("ok");
  } catch {
    statusEl.textContent =
      "Something went wrong. Please email me at sathvaraamit2005@gmail.com";
    statusEl.classList.add("err");
  }
  btn.disabled = false;
  btn.innerHTML = label;
});

/*=============== FOOTER YEAR, ACTIVE LINK, CURSOR, SCROLL REVEAL ===============*/
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("greeting").textContent =
  `Wishing you a wonderful ${new Date().toLocaleDateString("en-US", { weekday: "long" })}!`;

const secs = document.querySelectorAll("section[id]");
addEventListener("scroll", () => {
  const y = scrollY + 120;
  secs.forEach((s) => {
    const l = document.querySelector(`.nav__link[href="#${s.id}"]`);
    if (l)
      l.classList.toggle(
        "active-link",
        y >= s.offsetTop && y < s.offsetTop + s.offsetHeight,
      );
  });
  document
    .getElementById("header")
    .classList.toggle("header-blur", scrollY > 20);
});
const cursor = document.querySelector(".cursor");
addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  cursor.style.opacity = 1;
});
document.addEventListener("mouseover", (e) =>
  cursor.classList.toggle(
    "cursor-hide",
    !!e.target.closest("a, button, input, textarea"),
  ),
);
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 1800,
    delay: 150,
  });
  sr.reveal(".home__img, .about__img, .section__title");
  sr.reveal(".home__data, .about__data", { origin: "left" });
  sr.reveal(".home__info, .contact__info", { origin: "right" });
  sr.reveal(".pcard, .skills__card, .work__tabs, .contact__form", {
    interval: 100,
  });
}

// Copy Email
const cb = document.getElementById("copy-email");
cb.addEventListener("click", () =>
  navigator.clipboard.writeText("sathvaraamit2005@gmail.com").then(() => {
    cb.innerHTML = "Copied ✓";
    setTimeout(
      () => (cb.innerHTML = '<i class="ri-file-copy-line"></i>'),
      2000,
    );
  }),
);

/*=============== MOBILE MENU ===============*/
const navList = document.querySelector(".nav__list"),
  navTog = document.getElementById("nav-toggle"),
  navOv = document.getElementById("nav-overlay");
const navToggle = (s) => {
  navList.classList.toggle("show", s);
  navOv.classList.toggle("show", s);
  navTog.innerHTML = `<i class="ri-${s ? "close" : "menu"}-line"></i>`;
  document.body.style.overflow = s ? "hidden" : "";
};
navTog.onclick = () => navToggle(!navList.classList.contains("show"));
navOv.onclick = () => navToggle(false);
navList
  .querySelectorAll("a")
  .forEach((a) => (a.onclick = () => navToggle(false)));
