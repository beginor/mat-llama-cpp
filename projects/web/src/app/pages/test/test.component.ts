import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { LlamaService } from 'llama-cpp';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
      MatButtonModule,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

    constructor(
        protected llama: LlamaService,
    ) { }

}
