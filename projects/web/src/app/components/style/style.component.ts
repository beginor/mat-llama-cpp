import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-style',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
    ],
    templateUrl: './style.component.html',
    styleUrl: './style.component.css'
})
export class StyleComponent {

    protected setStyle(style: string): void {
        const element = document.getElementById('mat-theme') as HTMLLinkElement;
        element.href = `./${style}.css`;
    }

}
