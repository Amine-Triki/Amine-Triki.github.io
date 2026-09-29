let year = new Date().getFullYear();
document.getElementById("Rights").innerHTML = ` 2023 -${year} &copy Amine Triki || All Rights Reserved`;


// Projects data

const spinnerWrapper = document.getElementById("spinner-wrapper");
const featuredProjects = document.getElementById("featured-projects");
const allProjects = document.getElementById("all-projects");
const categoryFilters = document.getElementById("category-filters");

function externalLink(url, className, label, icon = "") {
  return `<a href="${url}" target="_blank" rel="noreferrer" class="${className}">${icon}${label}</a>`;
}

function renderProjectCard(project, featured = false) {
  const technologies = project.technologies?.length
    ? `<div class="d-flex flex-wrap gap-2 mb-3">${project.technologies
        .map((technology) => `<span class="badge bg-secondary">${technology}</span>`)
        .join("")}</div>`
    : "";

  const variants = project.variants?.length
    ? `<div class="d-flex flex-wrap gap-2 mb-3">${project.variants
        .map(
          (variant) =>
            `${externalLink(variant.link, "btn btn-outline-primary btn-sm", variant.stack)}${
              variant.github
                ? externalLink(
                    variant.github,
                    "btn btn-outline-dark btn-sm",
                    "",
                    '<i class="fa-brands fa-github" aria-hidden="true"></i><span class="visually-hidden">GitHub</span>'
                  )
                : ""
            }`
        )
        .join("")}</div>`
    : "";

  const actions = project.variants
    ? ""
    : `<div class="d-flex flex-wrap gap-2 mt-auto">
        ${project.link ? externalLink(project.link, "btn btn-primary", "Live Preview") : ""}
        ${project.github ? externalLink(project.github, "btn btn-outline-dark", "GitHub") : ""}
        ${
          project.screenshots?.length
            ? `<button type="button" class="btn btn-outline-primary screenshots-button" data-screenshots='${JSON.stringify(project.screenshots)}'>View Screenshots</button>`
            : ""
        }
      </div>`;

  return `<div class="col-sm-6 col-md-4">
    <article class="card h-100 shadow-sm ${featured ? "featured-project" : ""}">
      <div class="position-relative">
        <img src="${project.imageSrc}" alt="${project.title}" class="card-img-top" />
        <span class="badge bg-light text-dark project-category">${project.category}</span>
      </div>
      <div class="card-body d-flex flex-column ${featured ? "p-lg-4" : ""}">
        <h3 class="card-title text-primary h5">${project.title}</h3>
        <p class="card-text text-muted ${featured ? "" : "small"}">${project.description}</p>
        ${technologies}${variants}${actions}
      </div>
    </article>
  </div>`;
}

function renderProjects(projects, container, featured = false) {
  container.innerHTML = projects.length
    ? projects.map((project) => renderProjectCard(project, featured)).join("")
    : '<p class="text-muted">No projects found.</p>';
}

function setupScreenshotButtons() {
  document.querySelectorAll(".screenshots-button").forEach((button) => {
    button.addEventListener("click", () => {
      const screenshots = JSON.parse(button.dataset.screenshots);
      const mainImage = document.getElementById("modalMainImage");
      const thumbnails = document.getElementById("modalThumbnails");
      mainImage.src = screenshots[0];
      thumbnails.innerHTML = screenshots
        .map(
          (screenshot, index) =>
            `<button type="button" class="screenshot-thumbnail ${index === 0 ? "active" : ""}" data-image="${screenshot}">
              <img src="${screenshot}" alt="Screenshot ${index + 1}" />
            </button>`
        )
        .join("");

      thumbnails.querySelectorAll(".screenshot-thumbnail").forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
          mainImage.src = thumbnail.dataset.image;
          thumbnails.querySelectorAll(".screenshot-thumbnail").forEach((item) => item.classList.remove("active"));
          thumbnail.classList.add("active");
        });
      });

      new bootstrap.Modal(document.getElementById("screenshotsModal")).show();
    });
  });
}

async function loadProjects() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Amine-Triki/projects-data/main/projects.json"
    );
    const projects = await res.json();

    spinnerWrapper.style.display = "none";

    renderProjects(projects.filter((project) => project.featured === true), featuredProjects, true);

    const categories = ["All", ...new Set(projects.map((project) => project.category))];
    categoryFilters.innerHTML = categories
      .map((category, index) => `<button type="button" class="btn btn-sm btn-outline-primary category-filter ${index === 0 ? "active" : ""}" data-category="${category}">${category}</button>`)
      .join("");

    const renderAllProjects = (category = "All") => {
      const nonFeatured = projects.filter((project) => project.featured !== true);
      renderProjects(
        category === "All" ? nonFeatured : nonFeatured.filter((project) => project.category === category),
        allProjects
      );
      setupScreenshotButtons();
    };

    renderAllProjects();
    categoryFilters.querySelectorAll(".category-filter").forEach((button) => {
      button.addEventListener("click", () => {
        categoryFilters.querySelectorAll(".category-filter").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderAllProjects(button.dataset.category);
      });
    });
    setupScreenshotButtons();

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