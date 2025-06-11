import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  items = [
    { routeLink: 'home', icon: 'fas fa-home', label: 'Home'},
    { routeLink: 'seach', icon: 'fas fa-magnifying-glass', label: 'Pesquisar'},
    { routeLink: 'register', icon: 'fas fa-plus', label: 'Cadastrar' },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  get isExpanded(): boolean {
    return !this.isLeftSidebarCollapsed();
  }
}
