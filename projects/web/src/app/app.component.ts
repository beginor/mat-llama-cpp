import { RouterOutlet } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';

import { LlamaService } from 'llama-cpp';

import { LayoutComponent } from './components/layout/layout.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        LayoutComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {

    private handle: number;

    constructor(
        private llama: LlamaService,
    ) {
        this.checkServer();
        this.handle = setInterval(() => {
            this.checkServer();
        }, 60 * 1000);
    }

    public ngOnDestroy() {
        clearInterval(this.handle);
    }

    private checkServer(): void {
        this.llama.loadHealth();
        this.llama.loadProps();
    }
}
