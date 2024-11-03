import { Component, EventEmitter, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [GeneralModule, RouterLink],
  templateUrl: './header.component.html', styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
  ) { }

  onToggleSidenav() { this.sidenavToggle.emit(); }

}
