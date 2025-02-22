// Switch para modo claro/oscuro
const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Cargar la biografía y la foto de perfil
document.addEventListener('DOMContentLoaded', function() {
    fetch('bio.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('profile-pic').src = data.foto;
            document.getElementById('profile-name').textContent = data.nombre;
            document.getElementById('profile-bio').textContent = data.biografia;
            document.getElementById('linkedin-link').href = data.linkedin;
            document.getElementById('github-link').href = data.github;

            const bioElement = document.getElementById('profile-bio');
            const bioLength = data.biografia.length;
            if (bioLength > 200) {
                bioElement.style.fontSize = '1rem';
            } else if (bioLength > 100) {
                bioElement.style.fontSize = '1.1rem';
            } else {
                bioElement.style.fontSize = '1.2rem';
            }
        })
        .catch(error => console.error('Error cargando la biografía:', error));
});

// Cargar los proyectos
const container = document.getElementById('container');
const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
const modalTitle = document.getElementById('projectModalLabel');
const modalDescription = document.getElementById('modal-description');
const modalUrl = document.getElementById('modal-url');
const modalDate = document.getElementById('modal-date');
const carouselInner = document.getElementById('carousel-inner');
const modalTechnologies = document.createElement('div');
modalTechnologies.className = 'technologies mb-3';

let technologyColors = {};
let allProjects = [];
let visibleProjects = 5;

// Cargar los colores de las tecnologías desde software.json
fetch('software.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(tech => {
            technologyColors[tech.tecnologia] = tech.color;
        });
    })
    .catch(error => {
        console.error('Error al cargar software.json:', error);
    });

// Función para crear un elemento de proyecto
function createItem(item) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    const card = document.createElement('div');
    card.className = 'dynamic-item p-3';

    const content = `
        <h3>${item.nombre}</h3>
        <p class="text-muted">${formatDate(item.fecha, 'MM/yyyy')}</p>
        <div class="technologies">
            ${item.tecnologias.map(tech => `
                <span style="background-color: ${technologyColors[tech] || '#e9ecef'};">
                    ${tech}
                </span>
            `).join('')}
        </div>
        <img src="${item.imagenes[0]}" alt="${item.nombre}" class="img-fluid mt-3">
    `;

    card.innerHTML = content;
    card.addEventListener('click', () => openModal(item));
    col.appendChild(card);
    return col;
}

// Función para abrir el modal con los detalles del proyecto
function openModal(item) {
    modalTitle.textContent = item.nombre;
    modalDescription.textContent = item.descripcion;
    modalUrl.href = item.url;
    modalUrl.textContent = item.url;
    modalDate.textContent = `Fecha: ${formatDate(item.fecha, 'dd/MM/yyyy')}`;

    modalTechnologies.innerHTML = item.tecnologias.map(tech => `
        <span style="background-color: ${technologyColors[tech] || '#e9ecef'};">
            ${tech}
        </span>
    `).join('');

    carouselInner.innerHTML = item.imagenes.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" class="d-block w-100" alt="${item.nombre}">
        </div>
    `).join('');

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <p>${item.descripcion}</p>
        <p><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>
        <p class="text-muted">Fecha: ${formatDate(item.fecha, 'dd/MM/yyyy')}</p>
    `;
    modalBody.appendChild(modalTechnologies);
    modalBody.appendChild(carouselInner.parentElement);
    projectModal.show();
}

// Función para formatear fechas
function formatDate(dateString, format) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year);
}

// Función para renderizar los proyectos
function renderItems(data) {
    container.innerHTML = '';
    const projectsToShow = data.slice(0, visibleProjects);
    projectsToShow.forEach(item => {
        container.appendChild(createItem(item));
    });

    if (data.length > visibleProjects) {
        document.getElementById('show-more').style.display = 'inline-block';
    } else {
        document.getElementById('show-more').style.display = 'none';
    }

    if (visibleProjects > 5) {
        document.getElementById('show-less').style.display = 'inline-block';
    } else {
        document.getElementById('show-less').style.display = 'none';
    }
}

// Cargar los proyectos desde data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allProjects = data;
        renderItems(allProjects);
    })
    .catch(error => {
        console.error('Error al cargar los proyectos:', error);
    });

// Botón para mostrar más proyectos
document.getElementById('show-more').addEventListener('click', () => {
    visibleProjects += 5;
    renderItems(allProjects);
});

// Botón para mostrar menos proyectos
document.getElementById('show-less').addEventListener('click', () => {
    visibleProjects = 5;
    renderItems(allProjects);
});