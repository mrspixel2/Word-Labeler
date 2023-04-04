import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface Annotation {
  start: number;
  end: number;
  label: string;
  text: string;
}

@Component({
  selector: 'app-label-input',
  template: `
    <div class="container">
    <div class="alert alert-success" role="alert" *ngIf="successMessage"> {{successMessage}} </div>
    <div class="alert alert-danger" role="alert" *ngIf="errMessage"> {{errMessage}} </div>  
      <textarea class="input-text" [(ngModel)]="document" rows="10" cols="50"></textarea>
      <br>
      <div class="label-input">
        <input class="input-label" [(ngModel)]="label" placeholder="Enter label">
        <button class="button-label" (click)="addLabel()">Add Label</button>
      </div>
      <br>
      <div class="select-label">
        <select class="input-select" [(ngModel)]="selectedLabel">
          <option *ngFor="let label of labels" [value]="label">{{ label }}</option>
        </select>
        <button class="button-annotate" (click)="annotateSelection()">Annotate Selection</button>
      </div>
      <br>
      <button class="button-export" (click)="exportAnnotations()">Export Annotations</button>
      <br>
      <ul class="list-annotations">
        <li *ngFor="let annotation of annotations">
          {{ annotation.text }} ({{ annotation.label }})
        </li>
      </ul>
      <div *ngIf="jsonData">{{jsonData | json}}</div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .input-text {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: none;
    }
    .label-input {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .input-label {
      width: 70%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .button-label {
      padding: 10px;
      font-size: 16px;
      border: none;
      background-color: #007bff;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .select-label {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .input-select {
      width: 70%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .button-annotate {
      padding: 10px;
      font-size: 16px;
      border: none;
      background-color: #007bff;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .button-export {
      padding: 10px;
      font-size: 16px;
      border: none;
      background-color: #007bff;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .list-annotations {
      padding: 0;
      margin: 0;
    }
    .list-annotations li {
      margin-bottom: 10px;
      font-size: 16px;
    }
  `]
})
export class LabelInputComponent {
  document = '';
  label = '';
  labels: string[] = [];
  selectedLabel = '';
  annotations: Annotation[] = [];

  constructor(private http: HttpClient) { }

  addLabel() {
    if (this.label.trim() === '') {
      alert('Please enter a label name');
      return;
    }

    if (this.labels.includes(this.label)) {
      alert('Label name already exists');
      return;
    }

    this.labels.push(this.label);
    this.label = '';
  }

  annotateSelection() {

    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this.document.slice(start, end);
      if (text.length > 0) {
        this.annotations.push({
          start,
          end,
          label: this.selectedLabel,
          text
        });
      } else {
        alert('Please select more than one character to annotate.');
      }
      console.log('Start:', start);
      console.log('End:', end);
      console.log('Text:', text);
    }
  }

  successMessage: string = "" ; 
  errMessage: string = "" ; 
  jsonData : any ;

  exportAnnotations() {
    if (this.annotations.length === 0) {
      alert('There are no annotations to export');
      return;
    }

    const data = {
      document: this.document,
      annotation: this.annotations
    };

    this.http.post('http://127.0.0.1:8000/save_annotation/', data, {responseType: 'blob'}).subscribe({
      next:(value:any)=>{
        this.jsonData=value;
        this.successMessage = "success";

        const blob = new Blob([value], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        a.click();
        window.URL.revokeObjectURL(url);
        //console.log(value);
      },
      error:(err)=>{
        this.errMessage = err;
        //console.log(err);
      },
      complete:()=>{
        console.log("complete!");
      }
    })
  }
}
