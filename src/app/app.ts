import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'solar-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styles: [],
})
export class App {
  protected readonly title = signal('solar-ui');
}
