import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false // <-- Elimina esta línea
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormGroup('',[Validators.required, Validators.email]),
    password: new FormGroup('',[Validators.required, Validators.minLength(6)])
  })

  constructor() { }

  ngOnInit() {
  }

}
