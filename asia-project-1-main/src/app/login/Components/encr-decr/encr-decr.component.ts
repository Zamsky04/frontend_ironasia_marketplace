import { Component } from '@angular/core';

@Component({
  selector: 'app-encr-decr',
  standalone: true,
  imports: [],
  templateUrl: './encr-decr.component.html',
  styleUrl: './encr-decr.component.css'
})
export class EncrDecrComponent {
    
  secretKey: string="12!@#$%abgz123";

  encrypt(text: string): string {
      return CryptoJS.AES.encrypt(text, this.secretKey).toString();
    }
  
    decrypt(ciphertext: string): string {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
}
