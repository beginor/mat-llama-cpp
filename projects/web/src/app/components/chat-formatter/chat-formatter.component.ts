import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FormatterService } from '../../services/formatter.service';

@Component({
    selector: 'app-chat-formatter',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './chat-formatter.component.html',
    styleUrl: './chat-formatter.component.css'
})
export class ChatFormatterComponent implements OnInit {

    constructor(protected vm: FormatterService) { }

    public ngOnInit(): void {
        void this.vm.getServerModel();
    }

}
