import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class NavService {

    public nodes: NavNode[] = [];

    constructor(private http: HttpClient ) { }

    public loadData(): void {
        this.http.get<NavNode[]>('/nav.json').subscribe(value => {
            this.nodes = value;
        });
    }

}

export interface NavNode {
    url: string;
    label: string;
}
