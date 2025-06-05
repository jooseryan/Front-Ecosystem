import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from '../sidenav/sidenav';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LeftSidebarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  screenWidth = signal(window.innerWidth);
  isLeftSidebarCollapsed = signal(false);

  sizeClass = computed(() => {
    return this.isLeftSidebarCollapsed()
      ? ''
      : this.screenWidth() > 768
        ? 'body-trimmed'
        : 'body-md-screen';
  });
}
