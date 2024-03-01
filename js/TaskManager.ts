// TaskManager.ts

import { Task } from './tasks.js';

export interface Category {
  name: string;
  // tasks: Task[]; // je n'est pas la possibilité d'assigner des taches aux catégories 
  // et ça risquais de me prendre plus de temps donc je me suis arretée là je peux juste créer les catégories 
}

export class TaskManager {
  private tasks: Task[] = [];
  private categories: Category[] = [];

  constructor() {
    // Chargement des tâches depuis le local storage et affiche les tâches
    this.loadTasksFromLocalStorage();
    this.loadCategoriesFromLocalStorage();
    this.displayTasks();
    // Ajout de déclancheur d'événements au bouton de filtre 
    let applyFilterButton = document.getElementById('applyFilter');
    if (applyFilterButton) {
      applyFilterButton.addEventListener('click', () => this.applyFilter());
    }
    // Ajout de déclancheur d'événements au bouton de recherche
    let applySearch = document.getElementById('searchButton');
    if (applySearch) {
      applySearch.addEventListener('click', () => this.search());
    }
  }

  // Chargement des tâches depuis le local storage
  private loadTasksFromLocalStorage(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  // Load categories from local storage
  private loadCategoriesFromLocalStorage(): void {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    }
  }
  // Met à jour le stockage local avec les tâches actuelles
  private updateLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
  private updateCategoriesLocalStorage(): void {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }
  // Ajoute une tâche, met à jour le stockage local puis reaffiche les tâches mises à jour 
  addTask(task: Task, categoryName?: string): void {
    // If a category name is provided, assign the task to that category
    if (categoryName) {
      // Check if the category exists
      const category = this.categories.find((c) => c.name === categoryName);
  
      if (category) {
        // If the category exists, assign the task to it
        task.category = category;
      } else {
        // If the category doesn't exist, you might want to handle this case
        console.error(`Category "${categoryName}" does not exist!`);
        return;
      }
    }
  
    // Add the task to the tasks array
    this.tasks.push(task);
    
    // Update local storage
    this.updateLocalStorage();
    
    // Display tasks
    this.displayTasks();
  }
  // Add a category
  addCategory(category: Category): void {
    this.categories.push(category);
    this.updateCategoriesLocalStorage();
  }

  // Get the list of categories
  getCategories(): Category[] {
    return this.categories;
  }
  addTaskToCategory(task: Task, categoryName: string): void {
    const category = this.categories.find((c) => c.name === categoryName);
    if (!category) {
      console.error('Category does not exist!');
      return;
    }
    task.category = category;
    this.addTask(task);
  }

  // Affiche les tâches dans  HTML à partir de la récupération de l'ID task-list
  private displayTasks(): void {
    const tasksList = document.getElementById('task-list');

    if (tasksList) {
      tasksList.innerHTML = '';

      // Itèration des tâches et création des éléments pour les afficher
      this.tasks.forEach((task, index) => {
        const taskContainer = document.createElement('div');
        taskContainer.className = `task ${task.priority}`;

        // nouvelle tache dans son affichage html
        taskContainer.innerHTML = `
          <h3>${task.title}<span>– ${task.priority}</span></h3>
          <p>Date d'échéance: ${task.dueDate}</p>
          <p>${task.description}</p>
          <button type="button" class="delete-btn" data-index="${index}">Supprimer</button>
          <button class="edit-btn" data-index="${index}">Modifier</button>
        `;

        tasksList.appendChild(taskContainer);
      });

      // Ajout de déclancheur d'événements aux boutons de suppression
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index') || '0', 10);
          this.deleteTask(index);
        });
      });
      // Ajout de déclancheur d'événements aux boutons de modification
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index') || '0', 10);
          this.editTask(index);
        });
      });
    }
  }

  // Édition d'une tâche sélectionnée
  private editTask(index: number): void {
    const taskToEdit = this.tasks[index];

    // récupération des éléments du formulaire de modification
    const modal = document.getElementById('editModal')!;
    const titleInput = document.getElementById('editTitle') as HTMLInputElement;
    const descriptionInput = document.getElementById('editDescription') as HTMLTextAreaElement;
    const dueDateInput = document.getElementById('editDueDate') as HTMLInputElement;
    const prioritySelect = document.getElementById('editPriority') as HTMLSelectElement;

    // Vérifie si les autres éléments sont également présents
    if (titleInput && descriptionInput && dueDateInput && prioritySelect) {
      // Remplit les champs du formulaire avec les données de la tâche existante
      titleInput.value = taskToEdit.title;
      descriptionInput.value = taskToEdit.description;
      dueDateInput.value = taskToEdit.dueDate;
      prioritySelect.value = taskToEdit.priority;

      // Affiche le formulaire de modification
      modal.style.display = 'flex';

      // Gestion de la soumission du formulaire de modification
      const editForm = document.getElementById('editForm') as HTMLFormElement;
      editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Met à jour la tâche avec les nouvelles données
        const editedTask: Task = {
          title: titleInput.value,
          description: descriptionInput.value,
          dueDate: dueDateInput.value,
          priority: prioritySelect.value as Task['priority'],
        };

        this.tasks[index] = editedTask;
        this.updateLocalStorage();
        this.displayTasks();

        // Masque le formulaire après la modification
        modal.style.display = 'none';
      });
    }
  }

  // Applique le filtre sur les tâches en fonction des critères sélectionnés
  private applyFilter(): void {
    const filterPrioritySelect = document.getElementById('filterPriority') as HTMLSelectElement;
    const filterDateInput = document.getElementById('filterDate') as HTMLInputElement;

    const filterPriority = filterPrioritySelect.value;
    const filterDate = filterDateInput.value;

    let filteredTasks = this.tasks;

    // Filtre en fonction de la priorité sélectionnée
    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.priority === filterPriority);
    }

    // Filtre en fonction de la date sélectionnée
    if (filterDate) {
      filteredTasks = filteredTasks.filter((task) => task.dueDate === filterDate);
    }

    // Affichage des tâches filtrées
    this.displayFilteredTasks(filteredTasks);
  }

  // Recherche des tâches en fonction du terme du nom de la tâche 
  //" début du titre entre une ou deux lettres ou meme tout le titre de la tâche ainsi que la description"
  private search(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const searchTerm = searchInput.value.trim().toLowerCase();

    let searchedTasks: Task[] = [];

    // Filtre les tâches en fonction du la recherche
    if (searchTerm) {
      searchedTasks = this.tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    } else {
      // Si le terme de recherche est vide, affiche toutes les tâches avec les trois points 
      searchedTasks = [...this.tasks];
    }

    // Afficher les tâches recherchées
    this.displaySearchedTasks(searchedTasks);
  }

  // Affichage des tâches filtrées
  private displayFilteredTasks(filteredTasks: Task[]): void {
    const tasksList = document.getElementById('task-list');

    if (tasksList) {
      tasksList.innerHTML = '';

      // Itèration à travers les tâches filtrées et création des éléments pour les afficher une fois de plus
      filteredTasks.forEach((task, index) => {
        const taskContainer = document.createElement('div');
        taskContainer.className = `task ${task.priority}`;

        taskContainer.innerHTML = `
          <h3>${task.title}<span>– ${task.priority}</span></h3>
          <p>Date d'échéance: ${task.dueDate}</p>
          <p>${task.description}</p>
          <button type="button" class="delete-btn" data-index="${index}">Supprimer</button>
          <button class="edit-btn" data-index="${index}">Modifier</button>
        `;

        tasksList.appendChild(taskContainer);
      });

      // Ajout des déclenchers d'événements aux boutons de suppression (similaire au code plus haut)
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index') || '0', 10);
          this.deleteTask(index);
        });
      });

      // Ajout des déclenchers d'événements aux boutons de modification (similaire au code plus haut)
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index') || '0', 10);
          this.editTask(index);
        });
      });
    }
  }
  // Affichage des tâches recherchées
  private displaySearchedTasks(searchedTasks: Task[]): void {
    const tasksList = document.getElementById('task-list');

    if (tasksList) {
      tasksList.innerHTML = '';

      // Itèration à travers les tâches recherchées et création des éléments pour les afficher
      searchedTasks.forEach((task, index) => {
        const taskContainer = document.createElement('div');
        taskContainer.className = `task ${task.priority}`;

        taskContainer.innerHTML = `
          <h3>${task.title}<span>– ${task.priority}</span></h3>
          <p>Date d'échéance: ${task.dueDate}</p>
          <p>${task.description}</p>
          <button type="button" class="delete-btn" data-index="${index}">Supprimer</button>
          <button class="edit-btn" data-index="${index}">Modifier</button>
        `;

        tasksList.appendChild(taskContainer);
      });

      // Ajout des déclencheurs d'événements aux boutons de suppression (similaire au code  un peu plus haut une fois de plus juste pour le recherche cette fois ci)
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index') || '0', 10);
          this.deleteTask(index);
        });
      });

      // Ajoute des écouteurs d'événements aux boutons de modification (similaire au code  un peu plus haut une fois de plus juste pour le recherche cette fois ci)
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index') || '0', 10);
          this.editTask(index);
        });
      });
    }
  }

  // Suppression de tâche
  private deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.updateLocalStorage();
    this.displayTasks();
  }
}
