// main.ts

// Importe les interfaces nécessaires du fichier 'tasks.js'
import { Task } from './tasks.js';
// Importe la classe TaskManager du fichier 'TaskManager.js'
import { TaskManager, Category } from './TaskManager.js';
// Crée une instance de la classe TaskManager
const taskManager = new TaskManager();

// Fonction pour créer le formulaire de tâche
function createTaskForm(taskManager: TaskManager): void {
  // Récupère les éléments du formulaire et assure leur existence
  const taskForm = document.getElementById('taskForm') as HTMLFormElement | null;
  const taskTitleInput = document.getElementById('taskTitle') as HTMLInputElement | null;
  const taskDescriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement | null;
  const taskDueDateInput = document.getElementById('taskDueDate') as HTMLInputElement | null;
  const taskPrioritySelect = document.getElementById('taskPriority') as HTMLSelectElement | null;

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
    const priority = taskPrioritySelect.value as Task['priority'];

    // Crée un nouvel objet Task avec les valeurs du formulaire
    const newTask: Task = {
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
function createCategoryForm(taskManager: TaskManager): void {
  const categoryForm = document.getElementById('categoryForm') as HTMLFormElement | null;
  const categoryNameInput = document.getElementById('categoryName') as HTMLInputElement | null;

  if (!categoryForm || !categoryNameInput) {
    console.error('Un ou plusieurs éléments du formulaire de catégorie non trouvés !');
    return;
  }

  categoryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const categoryName = categoryNameInput.value;

    const newCategory: Category = {
      name: categoryName,
    };

    taskManager.addCategory(newCategory);
    refreshCategoryList(taskManager.getCategories());
  });
}

// Fonction pour rafraîchir la liste des catégories dans l'interface utilisateur
function refreshCategoryList(categories: Category[]): void {
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
