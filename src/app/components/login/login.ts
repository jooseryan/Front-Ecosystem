import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  inputFocusStates: { [key: string]: boolean } = {}; // Para controle do foco dos inputs

  constructor(private http: HttpClient, private router: Router) {}

  // Controla o estado de foco para cada input, para aplicar/remover classes CSS
  onFocus(inputName: string) {
    this.inputFocusStates[inputName] = true;
  }

  onBlur(inputName: string) {
    // Remove foco se o input estiver vazio
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
        alert('Usuário ou senha inválidos');
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

    if (payload.roles.includes("ADMIN")) {
      this.router.navigate(['/painel-adm']);
    } else if (payload.roles.includes("USER")) {
      this.router.navigate(['/painel-usuario']);
    } else {
      alert("Perfil de usuário não reconhecido.");
    }
  }
}
