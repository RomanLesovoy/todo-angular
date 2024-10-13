import { Component, Inject } from '@angular/core';
import { NavigationEnd, ResolveEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public routerUrl: string;

  constructor(@Inject(Router) private readonly router: Router) {
    this.routerUrl = this.router.url;
    router.events.subscribe((val) => {
      if ((val instanceof ResolveEnd || val instanceof NavigationEnd) && (this.routerUrl !== val.url)) {
        this.routerUrl = val.url;
      }
    });
  }
}
