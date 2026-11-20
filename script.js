// Portfolio loaded
console.log("Portfolio loaded!");

// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
    const pageIds = ["home", "about", "skills", "work", "contact"];
    const navLinks = document.querySelectorAll(".nav-link");
    const pageTriggers = document.querySelectorAll("[data-page]:not(.indicator-dot)");
    const pages = document.querySelectorAll(".page");
    const indicatorDots = document.querySelectorAll(".indicator-dot");
    const cornerButtons = document.querySelectorAll(".corner-nav-button");

    const activatePage = (pageName) => {
        if (!pageName) return;

        navLinks.forEach(l => l.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));
        indicatorDots.forEach(d => d.classList.remove("active"));

        const navLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        if (navLink) {
            navLink.classList.add("active");
        }

        const targetPage = document.querySelector(`#${pageName}`);
        if (targetPage) {
            targetPage.classList.add("active");
        }

        document.querySelectorAll(`[data-page="${pageName}"]`).forEach(dot => {
            if (dot.classList.contains("indicator-dot")) {
                dot.classList.add("active");
            }
        });
    };

    // Handle page navigation clicks from nav links and hero buttons
    pageTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const pageName = trigger.getAttribute("data-page");
            activatePage(pageName);
        });
    });

    // Handle page navigation arrows
    cornerButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const direction = button.getAttribute("data-direction");
            const activePage = document.querySelector(".page.active");
            const activeName = activePage?.id;
            const currentIndex = pageIds.indexOf(activeName);
            if (currentIndex === -1) return;

            const nextIndex = direction === "next"
                ? (currentIndex + 1) % pageIds.length
                : (currentIndex - 1 + pageIds.length) % pageIds.length;

            activatePage(pageIds[nextIndex]);
        });
    });

    // Handle indicator dot clicks
    indicatorDots.forEach(dot => {
        dot.addEventListener("click", () => {
            const pageName = dot.getAttribute("data-page");
            const navLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
            if (navLink) {
                navLink.click();
            }
        });
    });

    // Location card interaction
    const locationCard = document.getElementById("contact-location");
    const locationValue = locationCard?.querySelector(".contact-value");
    const savedLocation = window.localStorage.getItem("userLocation");

    if (locationValue && savedLocation) {
        locationValue.textContent = savedLocation;
    }

    const setLocation = () => {
        if (!locationValue) return;
        const currentValue = locationValue.textContent.trim();
        const newLocation = window.prompt("Enter your location:", currentValue === "India" ? "" : currentValue);
        if (newLocation === null) return;
        const trimmed = newLocation.trim();
        if (trimmed.length === 0) {
            window.alert("Please enter a valid location.");
            return;
        }
        locationValue.textContent = trimmed;
        window.localStorage.setItem("userLocation", trimmed);
    };

    if (locationCard) {
        locationCard.addEventListener("click", setLocation);
        locationCard.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setLocation();
            }
        });
    }

    // Mobile card interaction
    const mobileCard = document.getElementById("contact-mobile");
    const mobileValue = mobileCard?.querySelector(".contact-value");
    const savedMobile = window.localStorage.getItem("userMobile");

    if (mobileValue && savedMobile) {
        mobileValue.textContent = savedMobile;
    }

    const setMobile = () => {
        if (!mobileValue) return;
        const currentValue = mobileValue.textContent.trim();
        const newMobile = window.prompt("Enter your mobile number:", currentValue === "+91 12345 67890" ? "" : currentValue);
        if (newMobile === null) return;
        const trimmed = newMobile.trim();
        if (trimmed.length === 0) {
            window.alert("Please enter a valid mobile number.");
            return;
        }
        mobileValue.textContent = trimmed;
        window.localStorage.setItem("userMobile", trimmed);
    };

    if (mobileCard) {
        mobileCard.addEventListener("click", setMobile);
        mobileCard.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setMobile();
            }
        });
    }

    const skillForm = document.getElementById("skill-form");
    const skillNameInput = document.getElementById("skill-name");
    const skillLevelInput = document.getElementById("skill-level");
    const userSkillsGrid = document.getElementById("user-skills-grid");
    const userSkillsKey = "userSkills";

    const loadUserSkills = () => {
        const raw = window.localStorage.getItem(userSkillsKey);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const saveUserSkills = (skills) => {
        window.localStorage.setItem(userSkillsKey, JSON.stringify(skills));
    };

    const renderUserSkills = (skills) => {
        if (!userSkillsGrid) return;
        if (skills.length === 0) {
            userSkillsGrid.innerHTML = '<p class="skill-empty">No custom skills yet. Add one above to see it here.</p>';
            return;
        }

        userSkillsGrid.innerHTML = skills.map((skill, index) => {
            return `
                <div class="skill-card user-skill" data-index="${index}">
                    <div class="skill-meta">
                        <h3>${skill.name}</h3>
                        <span class="skill-tag">${skill.level}%</span>
                    </div>
                    <p>Custom skill saved to your browser.</p>
                    <div class="skill-bar"><div class="skill-fill" style="--fill: ${skill.level}%"></div></div>
                    <button type="button" class="delete-skill" data-index="${index}">Remove</button>
                </div>
            `;
        }).join("");
    };

    let userSkills = loadUserSkills();
    renderUserSkills(userSkills);

    const removeSkill = (index) => {
        userSkills = userSkills.filter((_, i) => i !== index);
        saveUserSkills(userSkills);
        renderUserSkills(userSkills);
    };

    if (skillForm) {
        skillForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const skillName = skillNameInput?.value.trim();
            const skillLevel = Number(skillLevelInput?.value.trim());

            if (!skillName || Number.isNaN(skillLevel) || skillLevel < 10 || skillLevel > 100) {
                window.alert("Please enter a valid skill name and proficiency between 10 and 100.");
                return;
            }

            userSkills.push({ name: skillName, level: skillLevel });
            saveUserSkills(userSkills);
            renderUserSkills(userSkills);

            if (skillNameInput) skillNameInput.value = "";
            if (skillLevelInput) skillLevelInput.value = "";
        });
    }

    if (userSkillsGrid) {
        userSkillsGrid.addEventListener("click", (event) => {
            const button = event.target.closest(".delete-skill");
            if (!button) return;
            const index = Number(button.getAttribute("data-index"));
            if (!Number.isNaN(index)) removeSkill(index);
        });
    }

    const projectForm = document.getElementById("project-form");
    const projectTitleInput = document.getElementById("project-title");
    const projectUrlInput = document.getElementById("project-url");
    const projectDescriptionInput = document.getElementById("project-description");
    const userProjectsGrid = document.getElementById("user-projects-grid");
    const userProjectsKey = "userProjects";

    const loadUserProjects = () => {
        const raw = window.localStorage.getItem(userProjectsKey);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const saveUserProjects = (projects) => {
        window.localStorage.setItem(userProjectsKey, JSON.stringify(projects));
    };

    const renderUserProjects = (projects) => {
        if (!userProjectsGrid) return;
        if (projects.length === 0) {
            userProjectsGrid.innerHTML = '<p class="user-project-empty">No projects added yet. Add one above to open it directly from your portfolio.</p>';
            return;
        }

        userProjectsGrid.innerHTML = projects.map((project, index) => {
            const safeUrl = project.url.replace(/"/g, '%22');
            return `
                <div class="project-card user-project" data-index="${index}" data-url="${safeUrl}">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    <span class="tag">${project.url}</span>
                    <button type="button" class="delete-project" data-index="${index}">Remove</button>
                </div>
            `;
        }).join("");
    };

    let userProjects = loadUserProjects();
    renderUserProjects(userProjects);

    const removeProject = (index) => {
        userProjects = userProjects.filter((_, i) => i !== index);
        saveUserProjects(userProjects);
        renderUserProjects(userProjects);
    };

    if (projectForm) {
        projectForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const title = projectTitleInput?.value?.trim() || "";
            const url = projectUrlInput?.value?.trim() || "";
            const description = projectDescriptionInput?.value?.trim() || "";

            if (!title || !url || !description) {
                window.alert("Please fill in all project fields.");
                return;
            }

            userProjects.push({ title, url, description });
            saveUserProjects(userProjects);
            renderUserProjects(userProjects);

            if (projectTitleInput) projectTitleInput.value = "";
            if (projectUrlInput) projectUrlInput.value = "";
            if (projectDescriptionInput) projectDescriptionInput.value = "";
        });
    }

    if (userProjectsGrid) {
        userProjectsGrid.addEventListener("click", (event) => {
            const button = event.target.closest(".delete-project");
            if (button) {
                const index = Number(button.getAttribute("data-index"));
                if (!Number.isNaN(index)) removeProject(index);
                return;
            }
            const card = event.target.closest(".user-project");
            if (!card) return;
            const url = card.getAttribute("data-url");
            if (!url) return;
            window.open(url, "_blank");
        });
    }
});

// Typing effect for header subtitle
document.addEventListener("DOMContentLoaded", () => {
    const subtitle = document.querySelector("header p");
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = "";
        subtitle.style.opacity = "1";
        subtitle.style.webkitTextFillColor = ""; // reset for typing
        let i = 0;
        const type = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, 60);
            }
        };
        setTimeout(type, 600);
    }
});