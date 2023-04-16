import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class TasksController extends Controller {
  newTaskTitle = '';
  newTaskDescription = '';
  
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
    if (!this.newTaskTitle.trim()) {
      return;
    }
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
    if (!this.newTaskTitle.trim()) {
      return;
    }
    const taskToUpdate = this.model.find((task) => task.id === this.editingTaskId);
    if (taskToUpdate) {
      taskToUpdate.title = this.newTaskTitle;
      taskToUpdate.description = this.newTaskDescription;
      this.updateTasksInLocalStorage();
      this.set('editingTaskId', null);
      this.set('newTaskTitle', '');
      this.set('newTaskDescription', '');
    }
  }

  @action
  toggleTaskCompletion(task) {
    task.completed = !task.completed;
    this.updateTasksInLocalStorage();
  }

  @action
  editTask(task) {
    this.set('newTaskTitle', task.title);
    this.set('newTaskDescription', task.description);
    this.set('editingTaskId', task.id);
  }

  @action
  deleteTask(taskToDelete) {
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