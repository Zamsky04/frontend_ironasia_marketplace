import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainHomeServService } from '../Services/main-home-serv.service';

// --- Validator Functions ---

/**
 * Validator untuk memeriksa kekuatan password (harus ada huruf besar, kecil, dan angka).
 */
export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  if (!value) {
    return null; // Jangan validasi jika kosong, biarkan 'required' yang menangani.
  }
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);

  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

  return !passwordValid ? { passwordStrength: 'Password must contain uppercase, lowercase, and a number.' } : null;
}

/**
 * Validator untuk memastikan dua field password cocok.
 */
export function matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  // Jika password konfirmasi belum diisi, jangan validasi.
  if (!confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { mustMatch: 'Passwords do not match.' };
}


// --- Component Definition ---

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,         // Diperlukan untuk directive seperti [ngClass]. Jika Anda hanya pakai @if, ini tidak perlu.
    ReactiveFormsModule   // Wajib untuk Reactive Forms
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {

  token: string | null = null;
  resetForm!: FormGroup;
  submitted = false;
   isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private mainHomeService: MainHomeServService, 
    private router: Router 
  ) { }

  ngOnInit(): void {
    // Ambil token dari URL
    this.token = this.route.snapshot.paramMap.get('token');

    // Inisialisasi form dengan FormBuilder dan validators
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator // Validator kustom untuk kekuatan password
      ]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: matchPasswordValidator // Validator untuk mencocokkan password di level grup
    });
  }

  /**
   * Getter untuk akses mudah ke form control 'newPassword' di template.
   */
  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  /**
   * Getter untuk akses mudah ke form control 'confirmPassword' di template.
   */
  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  /**
   * Method yang dipanggil saat form disubmit.
   */
 resetPassword(): void {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.resetForm.invalid) {
      console.log("Form tidak valid.");
      return;
    }

    if (!this.token) {
        this.errorMessage = "Token tidak valid atau telah hilang. Tidak dapat melanjutkan.";
        return;
    }

    this.isLoading = true; 
    const newPasswordValue = this.resetForm.value.newPassword;

    this.mainHomeService.resetPassword(this.token, newPasswordValue).subscribe({
      next: (response) => {
        this.isLoading = false; 
        this.successMessage = "Kata sandi Anda telah berhasil diubah! Anda akan diarahkan ke halaman login.";
        this.resetForm.disable();         
       
        setTimeout(() => {
          this.router.navigate(['/mainhome']); 
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false; // Hentikan loading
        this.errorMessage = err.message || "Terjadi kesalahan. Silakan coba lagi.";
        console.error('Password reset failed:', err);
      }
    });
  }


}