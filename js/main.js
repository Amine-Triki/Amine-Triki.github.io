let year = new Date().getFullYear();
document.getElementById("Rights").innerHTML = ` 2023 -${year} &copy Amine Triki || All Rights Reserved`;


// Projects Data

const categories = ["all", "React", "NextJs", "MERN", "Vue", "Astro"];

const spinnerWrapper = document.getElementById("spinner-wrapper");
const grid           = document.getElementById("projects-grid");
const tabsContainer  = document.getElementById("tabs-container");

// بناء أزرار التبويب
categories.forEach((category) => {
  const btn = document.createElement("button");
  btn.className = "tab-btn btn btn-sm btn-outline-primary";
  btn.dataset.category = category.toLowerCase();
  btn.textContent = category === "all" ? "All works" : category;
  tabsContainer.appendChild(btn);
});

async function loadProjects() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Amine-Triki/projects-data/main/projects.json"
    );
    const projects = await res.json();

    spinnerWrapper.style.display = "none";

    function renderProjects(filter = "all") {
      grid.innerHTML = "";
      projects
        .filter((p) => filter === "all" || p.category.toLowerCase() === filter)
        .forEach((p) => {
          const card = document.createElement("div");
          card.className = "card shadow-sm";
          card.innerHTML = `
            <img src="${p.imageSrc}" alt="${p.title}" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title text-primary">${p.title}</h5>
              <p class="card-text text-muted small">${p.description}</p>
              <div class="d-flex justify-content-around mt-2">
                ${p.github ? `<a href="${p.github}" target="_blank" class="btn btn-sm btn-danger">Github</a>` : ""}
                ${p.link   ? `<a href="${p.link}"   target="_blank" class="btn btn-sm btn-info text-white">Preview</a>` : ""}
              </div>
            </div>
          `;
          grid.appendChild(card);
        });
    }

    // عرض جميع المشاريع عند البداية
    renderProjects();

    // إضافة event listeners للـ Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const category = e.currentTarget.dataset.category;
        renderProjects(category);

        // تحديث الزر النشط
        document.querySelectorAll(".tab-btn").forEach((b) => {
          b.classList.remove("active", "btn-primary");
          b.classList.add("btn-outline-primary");
        });
        e.currentTarget.classList.add("active", "btn-primary");
        e.currentTarget.classList.remove("btn-outline-primary");
      });
    });

    // تفعيل الزر الأول افتراضيًا
    const firstBtn = document.querySelector(".tab-btn");
    firstBtn.classList.add("active", "btn-primary");
    firstBtn.classList.remove("btn-outline-primary");

  } catch (error) {
    spinnerWrapper.innerHTML = `<p class="text-danger">Failed to load projects</p>`;
    console.error(error);
  }
}

loadProjects();

const contactForm = document.querySelector("#Contact form");
const contactSubmitButton = contactForm?.querySelector("button[type='submit']");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

if (contactSubmitButton) {
  contactSubmitButton.addEventListener("click", (event) => {
    event.preventDefault();
  });
}



async function loadCvButtons() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Amine-Triki/projects-data/main/cv.json"
    );
    const cvData = await res.json();

    const container = document.getElementById("cv-buttons");

    if (!container) {
      return;
    }

    container.innerHTML = `
      <a
        href="${cvData.cv.en.download}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
        aria-label="Download my resume in PDF format"
        title="Download Resume"
      >
        📥 Download Resume
      </a>
      <a
        href="${cvData.cv.en.preview}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-outline-primary px-4 py-2 fw-semibold"
        aria-label="Preview my resume online"
        title="Preview Resume"
      >
        👁️ Preview
      </a>
    `;
  } catch (error) {
    console.error("Failed to load CV data", error);
  }
}

loadCvButtons();