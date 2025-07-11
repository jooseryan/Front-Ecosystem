import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  inputFocusStates: { [key: string]: boolean } = {};

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }


  onFocus(inputName: string) {
    this.inputFocusStates[inputName] = true;
  }

  onBlur(inputName: string) {
    if ((inputName === 'username' && !this.username) || (inputName === 'password' && !this.password)) {
      this.inputFocusStates[inputName] = false;
    }
  }

  onSubmit() {
    const body = { username: this.username, password: this.password };

    this.http.post<any>('http://localhost:8080/users/login', body).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        this.redirectByRole();
      },
      error: () => {
        this.snackBar.open('Usuário ou senha inválidos', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  getPayloadFromToken(): any {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    return JSON.parse(atob(payloadBase64));
  }

  redirectByRole() {
    const payload = this.getPayloadFromToken();
    if (!payload || !payload.roles) {
      alert("Você não está autenticado!");
      return;
    }

    if (payload.roles.includes("ROLE_ADMIN")) {
      this.router.navigate(['/home/search']);
    } else if (payload.roles.includes("ROLE_USER")) {
      this.router.navigate(['/painel-usuario']);
    } else {
      alert("Perfil de usuário não reconhecido.");
    }
  }
}
