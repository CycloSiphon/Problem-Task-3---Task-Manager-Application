import Controller from '@ember/controller';
import { action, computed } from '@ember/object';

export default class TasksController extends Controller {
  newTaskTitle = '';
  newTaskDescription = '';
  errorMessage = '';

  @action
  handleSubmit(event) {
    event.preventDefault();
    if (this.editingTaskId) {
      this.updateTask();
    } else {
      this.addTask();
    }
  }

  @action
  addTask() {
    if (!this.newTaskTitle.trim() || !this.newTaskDescription.trim()) {
      this.set('errorMessage', 'Please enter both task title and description before adding a task.');
      return;
    }
    this.set('errorMessage', '');
    const newTask = {
      id: Date.now(),
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      completed: false,
    };
    const tasks = [...this.model, newTask];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.set('model', tasks);
    this.set('newTaskTitle', '');
    this.set('newTaskDescription', '');
  }

  @action
  updateTask() {
    if (!this.newTaskTitle.trim() || !this.newTaskDescription.trim()) {
      return;
    }
    const updatedTasks = this.model.map((task) => {
      if (task.id === this.editingTaskId) {
        return {
          ...task,
          title: this.newTaskTitle,
          description: this.newTaskDescription,
        };
      }
      return task;
    });
    this.set('model', updatedTasks);
    this.updateTasksInLocalStorage();
    this.set('editingTaskId', null);
    this.set('newTaskTitle', '');
    this.set('newTaskDescription', '');
  }


  @action
  toggleTaskCompletion(task) {
    task.completed = !task.completed;
    this.updateTasksInLocalStorage();
  }

  @computed('editingTaskId')
  get isEditing() {
    return this.editingTaskId !== null;
  }

  @action
  editTask(task) {
    this.set('newTaskTitle', task.title);
    this.set('newTaskDescription', task.description);
    this.set('editingTaskId', task.id);
  }

  @action
  deleteTask(taskToDelete) {
    if (this.isEditing) {
      this.set('errorMessage', 'Please update the task before deleting it.');
      return;
    }
    this.set('errorMessage', '');
    const tasks = this.model.filter((task) => task.id !== taskToDelete.id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.set('model', tasks);
  }

  @action
  updateNewTaskTitle(event) {
    this.set('newTaskTitle', event.target.value);
  }

  @action
  updateNewTaskDescription(event) {
    this.set('newTaskDescription', event.target.value);
  }

  updateTasksInLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.model));
  }

}
