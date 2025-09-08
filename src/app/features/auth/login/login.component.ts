import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = false;
    errorMessage = '';

    onSubmit() {
        if (this.loginForm.invalid) {
            this.errorMessage = 'Veuillez remplir tous les champs correctement.';
            return;
        }

        const { email, password } = this.loginForm.value;

        this.loading = true;
        this.errorMessage = '';

        if (!email || !password) {
            this.errorMessage = 'Email et mot de passe sont requis.';
            return;
        }

        this.auth.login({ email, password }).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/guides']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Échec de la connexion';
            }
        });
    }
}
