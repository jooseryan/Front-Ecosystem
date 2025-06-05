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
    { routeLink: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { routeLink: 'register', icon: 'fas fa-address-card', label: 'Registrar' },
    { routeLink: 'update', icon: 'fas fa-pen-to-square', label: 'Atualizar' },
    { routeLink: 'delete', icon: 'fas fa-trash', label: 'Deletar' },
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
