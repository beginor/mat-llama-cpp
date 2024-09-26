import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { LlamaService } from 'llama-cpp';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
      NzButtonModule,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

    constructor(
        protected llama: LlamaService,
    ) { }

}
