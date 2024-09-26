import { RouterOutlet } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';

import { LlamaService } from 'llama-cpp';

import { LayoutComponent } from './components/layout/layout.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NzIconModule,
        LayoutComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {

    private handle: number;

    constructor(
        private llama: LlamaService,
        nzIconService: NzIconService,
    ) {
        nzIconService.changeAssetsSource('assets/icons/antd');
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
