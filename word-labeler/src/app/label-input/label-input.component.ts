import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LabelerService } from '../Services/labeler.service';

interface Annotation {
  start: number;
  end: number;
  label: string;
  text: string;
}

@Component({
  selector: 'app-label-input',
  templateUrl: './label-input.component.html',
  styleUrls: ['./label-input.component.css']
})
export class LabelInputComponent implements OnInit {

  ngOnInit(): void {
  }
  constructor(private http: HttpClient , private labelerService : LabelerService) { }
  document = '';
  label = '';
  labels: string[] = [];
  selectedLabel = '';
  annotations: Annotation[] = [];

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

  successMessage: string = "";
  errMessage: string = "";
  jsonData: any;

  exportAnnotations() {
    if (this.annotations.length === 0) {
      alert('There are no annotations to export');
      return;
    }

    const data = {
      document: this.document,
      annotation: this.annotations
    };

    this.labelerService.saveAnnotation(data).subscribe({
      next: (value: any) => {
        this.successMessage = "success";
        this.jsonData= data ; 

        const blob = new Blob([value], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        a.click();
        window.URL.revokeObjectURL(url);
        console.log(value);
      },
      error: (err) => {
        this.errMessage = err;
        //console.log(err);
      },
      complete: () => {
        console.log("complete!");
      }
    })
  }
}
