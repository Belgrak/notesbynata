const form = document.getElementById('noteForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const categoryInput = document.getElementById('category');
const filter = document.getElementById('filter');
const notesContainer = document.getElementById('notes');

let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let editingNoteId = null;

form.addEventListener('submit', e => {
    e.preventDefault();
    const note = {
        id: editingNoteId || Date.now(),
        title: titleInput.value,
        content: contentInput.value,
        category: categoryInput.value
    };

    if (editingNoteId) {
        // Редактирование существующей
        notes = notes.map(n => n.id === editingNoteId ? note : n);
        editingNoteId = null;
    } else {
        // Новая заметка
        notes.push(note);
    }

    form.reset();
    saveAndRender();
});

filter.addEventListener('change', renderNotes);

function saveAndRender() {
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    const selected = filter.value;
    notesContainer.innerHTML = '';

    notes
        .filter(n => selected === 'all' || n.category === selected)
        .forEach(note => {
            const div = document.createElement('div');
            div.className = 'note';
            div.dataset.category = note.category;

            div.innerHTML = `
        <strong>${note.title}</strong><br>
        ${note.content}<br>
        <small>${note.category}</small><br>
        <button onclick="editNote(${note.id})">✏️</button>
        <button onclick="deleteNote(${note.id})">🗑️</button>
      `;

            notesContainer.appendChild(div);
        });
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveAndRender();
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    titleInput.value = note.title;
    contentInput.value = note.content;
    categoryInput.value = note.category;
    editingNoteId = id;
}

renderNotes();

const notesTab = document.getElementById('notesTab');
const recipesTab = document.getElementById('recipesTab');
function switchTab(tab) {
    notesTab.style.display = tab === 'notes' ? 'block' : 'none';
    recipesTab.style.display = tab === 'recipes' ? 'block' : 'none';
}

// === РЕЦЕПТЫ ===
const recipeForm = document.getElementById('recipeForm');
const recipeTitle = document.getElementById('recipeTitle');
const recipeIngredients = document.getElementById('recipeIngredients');
const recipeSteps = document.getElementById('recipeSteps');
const recipesContainer = document.getElementById('recipes');

let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
let editingRecipeId = null;

recipeForm.addEventListener('submit', e => {
    e.preventDefault();
    const recipe = {
        id: editingRecipeId || Date.now(),
        title: recipeTitle.value,
        ingredients: recipeIngredients.value,
        steps: recipeSteps.value
    };

    if (editingRecipeId) {
        recipes = recipes.map(r => r.id === editingRecipeId ? recipe : r);
        editingRecipeId = null;
    } else {
        recipes.push(recipe);
    }

    localStorage.setItem('recipes', JSON.stringify(recipes));
    renderRecipes();
    recipeForm.reset();
});

function renderRecipes() {
    recipesContainer.innerHTML = '';
    recipes.forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
      <h3>${r.title}</h3>
      <strong>Ингредиенты:</strong><br>${r.ingredients.replace(/\n/g, '<br>')}<br>
      <strong>Шаги:</strong><br>${r.steps.replace(/\n/g, '<br>')}<br>
      <button onclick="editRecipe(${r.id})">✏️</button>
      <button onclick="deleteRecipe(${r.id})">🗑️</button>
    `;
        recipesContainer.appendChild(div);
    });
}

function deleteRecipe(id) {
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    renderRecipes();
}

function editRecipe(id) {
    const r = recipes.find(r => r.id === id);
    if (!r) return;
    recipeTitle.value = r.title;
    recipeIngredients.value = r.ingredients;
    recipeSteps.value = r.steps;
    editingRecipeId = id;
}

renderRecipes();