import { Component } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';
import { empty } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'kanban';
  todo: Task[] = [
    {
      title: 'Tarefa 1 - Exemplo',
      description: 'Clique em Adicionar tarefa para adicionar uma nova',
      coluna: 'coluna1',
    },
  ];
  inProgress: Task[] = [
    {
      title: 'Tarefa 2 - Exemplo',
      description: 'Arraste essa tarefa para o status de Concluído',
      coluna: 'coluna2',
    }

  ];
  done: Task[] = [
    {
      title: 'Tarefa 3 - Exemplo',
      description: 'Clique 2 vezes para Editar ou excluir essa tarefa',
      coluna: 'coluna3',
    }
  ];

  constructor(private dialog: MatDialog) {}
  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {

      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result.task.title && !result.task.description) {
          return;
        }
        result.task.coluna = 'coluna1';
        this.todo.push(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (!result) {
        return;
      }
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const cardSelecionado = event.previousContainer.data[event.previousIndex];
    const colunaDeDestino = event.container.id;
    if(colunaDeDestino == 'todo'){
      cardSelecionado.coluna = 'coluna1';
    }else if(colunaDeDestino == 'inProgress'){
      cardSelecionado.coluna = 'coluna2';
    }else{
      cardSelecionado.coluna = 'coluna3';
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
