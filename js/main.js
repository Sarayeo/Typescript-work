// main.ts
// Importe la classe TaskManager du fichier 'TaskManager.js'
import { TaskManager } from './TaskManager.js';
// Crée une instance de la classe TaskManager
const taskManager = new TaskManager();
// Fonction pour créer le formulaire de tâche
function createTaskForm(taskManager) {
    // Récupère les éléments du formulaire et assure leur existence
    const taskForm = document.getElementById('taskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskDueDateInput = document.getElementById('taskDueDate');
    const taskPrioritySelect = document.getElementById('taskPriority');
    // Vérifie si tous les éléments du formulaire sont présents
    if (!taskForm || !taskTitleInput || !taskDescriptionInput || !taskDueDateInput || !taskPrioritySelect) {
        console.error('Un ou plusieurs éléments du formulaire non trouvés !');
        return;
    }
    // Ajoute un écouteur d'événement à la soumission du formulaire
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Récupère les valeurs du formulaire
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;
        const dueDate = taskDueDateInput.value;
        const priority = taskPrioritySelect.value;
        // Crée un nouvel objet Task avec les valeurs du formulaire
        const newTask = {
            title,
            description,
            dueDate,
            priority,
        };
        // Ajoute la nouvelle tâche au TaskManager
        taskManager.addTask(newTask);
        // Affiche les tâches mises à jour dans la console (peut être décommenté si nécessaire)
        // console.log('Tâches mises à jour :', taskManager.getTasks());
    });
}
// Appelle la fonction pour créer le formulaire de tâche en passant l'instance de TaskManager
createTaskForm(taskManager);
// Fonction pour créer le formulaire de catégorie
function createCategoryForm(taskManager) {
    const categoryForm = document.getElementById('categoryForm');
    const categoryNameInput = document.getElementById('categoryName');
    if (!categoryForm || !categoryNameInput) {
        console.error('Un ou plusieurs éléments du formulaire de catégorie non trouvés !');
        return;
    }
    categoryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const categoryName = categoryNameInput.value;
        const newCategory = {
            name: categoryName,
        };
        taskManager.addCategory(newCategory);
        refreshCategoryList(taskManager.getCategories());
    });
}
// Fonction pour rafraîchir la liste des catégories dans l'interface utilisateur
function refreshCategoryList(categories) {
    const categoryList = document.getElementById('category-list');
    if (categoryList) {
        categoryList.innerHTML = '';
        categories.forEach((category) => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category';
            categoryContainer.innerHTML = `
        <h3>${category.name}</h3>
      `;
            categoryList.appendChild(categoryContainer);
        });
    }
}
// Appelle la fonction pour créer le formulaire de catégorie et passe l'instance du gestionnaire de tâches
createCategoryForm(taskManager);
