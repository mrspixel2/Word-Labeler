import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LabelerService{
    constructor(private http: HttpClient) { }

    apiKey = "http://127.0.0.1:8000/save_annotation/"

    public saveAnnotation(annotation: any){
        return this.http.post(this.apiKey, annotation,{ responseType: 'blob' });
    }
}