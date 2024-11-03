import { Component, EventEmitter, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [GeneralModule, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  @Output() closeSidenav = new EventEmitter<void>();

  constructor() { }

  onCloseSidenav() { this.closeSidenav.emit(); }

}
