import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false // <-- Elimina esta línea
})
export class AuthPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
