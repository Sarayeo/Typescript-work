// Task.ts

import { Category } from './TaskManager.js'; // Ajustez le chemin en conséquence
// Définition de l'interface Task
export interface Task {
  // Titre de type chaîne de caractères (string)
  title: string;
  // Description de type chaîne de caractères (string)
  description: string;
  // Date d'échéance de la tâche, de type chaîne de caractères (string)
  dueDate: string;
  // Priorité de la tâche, de type union littérale ('Low' | 'Medium' | 'High')
  // Cela signifie que la priorité ne peut être que l'une des trois valeurs spécifiées on aurait pu utiliser aussi une chaîne de caractères (string)
  priority: 'Low' | 'Medium' | 'High';
   // Ajoutez la propriété 'category' à l'interface Task
   category?: string | Category;
}
