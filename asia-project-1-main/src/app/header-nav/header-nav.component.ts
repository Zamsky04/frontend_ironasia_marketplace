import {  Component, inject, OnInit, HostListener, ElementRef } from '@angular/core';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {   RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AvatarModule} from 'primeng/avatar'
import { ServLoginService } from '../login/Services/serv-login.service';
import { CompRegisComponent } from '../Registration/Components/comp-regis/comp-regis.component';
import { LoginCompComponent } from '../login/Components/login-comp/login-comp.component';
import { Subscription } from 'rxjs';
import { ShopDrawServService } from '../shop-drawer/Services/shop-draw-serv.service';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from '../Home/about/about.component';
import { HelpComponent } from '../Home/help/help.component';
import { RfqComponent } from '../Home/rfq/rfq.component';


@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [AvatarModule, CommonModule,MatDialogModule,  RouterModule],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.css'
})
export class HeaderNavComponent implements OnInit  {
  myacc:string="My Account";
  mypp:any="assets/user.png";
  vusrd:any ="";
  userid:any;
  errorMessage: string="gg";
  vusrnm:any="";
  vusrurl:any="";
  vusnm:any="";
  vusurl:any="";
  vtkn:any;
  vtknd:any;
  vusr:any;

  private subscription!: Subscription;
  private subscription2!: Subscription;


 ngOnInit() {
   this.subscription2 = this.logserv.callMethodObservablenavbarlogout.subscribe(() => {
      this.log_info();
    });

    this.subscription = this.logserv.callMethodObservable.subscribe(() => {
      this.log_info();
    });

     setTimeout(() => {
    this.checkInitialLoginStatus();
   }, 0);

  }

  checkInitialLoginStatus() {
  const storedUsername = localStorage.getItem('usnm');
  const storedUserImage = localStorage.getItem('usrimg');

 if (storedUsername) {
      this.myacc = storedUsername;

      // REVISI UTAMA: Validasi gambar dengan cara pre-loading
      if (storedUserImage && storedUserImage !== 'null' && storedUserImage.trim() !== '') {
        // 1. Buat objek gambar di memori browser. Ini akan memulai proses download di latar belakang.
        const imageValidator = new Image();
        console.log('Memulai validasi gambar profil:', storedUserImage);
        imageValidator.src = storedUserImage;

        // 2. Jika gambar berhasil di-download (valid), JALANKAN FUNGSI INI:
        imageValidator.onload = () => {
          // Hanya setelah validasi sukses, kita perbarui 'mypp' agar HTML me-render gambar yang benar.
          console.log('Gambar profil valid:', storedUserImage);
          this.mypp = storedUserImage;
        };

        // 3. Jika URL gambar error atau tidak bisa diakses, JALANKAN FUNGSI INI:
        imageValidator.onerror = () => {
          // Jika gagal, tetap gunakan gambar default.
          this.mypp = 'assets/user.png';
        };

      } else {
        // Jika tidak ada URL gambar di localStorage, langsung gunakan default.
        this.mypp = 'assets/user.png';
      }
    } else {
      this.myacc = "My Account";
      this.mypp = 'assets/user.png';
    }
}

  log_info(){
    this.vusrnm=localStorage.getItem('usnm');
    this.vusrurl=localStorage.getItem('usrimg');
    this.vusrd=localStorage.getItem('uscd');

    if (this.vusrnm){
        this.vusnm=this.vusrnm;
        this.vusurl=this.vusrurl;
        this.vusr=this.logserv.decrypt(this.vusrd);

        this.logserv.updatemyacc(this.vusnm);
        this.logserv.updatemyppc(this.vusurl);
      //  alert('666')
        this.myacc=this.vusnm;
        this.mypp=this.vusurl;
      }
    else{
      this.myacc="My Account";
      this.mypp="assets/user.png";
    }
  }

  log_info2(){
    //alert('header nabar.................');
    localStorage.removeItem('picnm');
    localStorage.removeItem('uscd');
    localStorage.removeItem('usnm');
    localStorage.removeItem('usrimg');
    localStorage.removeItem('typeb');

    this.myacc="My Account";
      this.mypp="assets/user.png";
  }

 login(event: Event) {
  event.preventDefault();
  const dialogRef = this.dialog.open(LoginCompComponent, {
    height: 'auto',
    maxWidth: '300px',

    width: '80%',
    disableClose: true,
    panelClass: 'custom-dialog-container'

  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getListFaktur();
        // localStorage.setItem("dsono", this.dtparam);
        this.vusrnm = localStorage.getItem('usnm');
        this.vusrurl = localStorage.getItem('usrimg');
        this.vusrd = localStorage.getItem('uscd');

        // Pastikan logserv dan metode decrypt ada dan berfungsi
        if (this.logserv && typeof this.logserv.decrypt === 'function') {
          this.vusnm = this.vusrnm;
          this.vusurl = this.vusrurl;
          this.vusr = this.logserv.decrypt(this.vusrd);

          // Pastikan metode update ada dan berfungsi
          if (typeof this.logserv.updatemyacc === 'function') {
            this.logserv.updatemyacc(this.vusnm);
          }
          if (typeof this.logserv.updatemyppc === 'function') {
            this.logserv.updatemyppc(this.vusurl);
          }
        } else {
          console.error('logserv atau metode decrypt tidak terdefinisi dengan benar.');
          // Fallback jika dekripsi tidak tersedia
          this.vusnm = this.vusrnm;
          this.vusurl = this.vusrurl;
          this.vusr = this.vusrd;
        }
      }
    }
  });
}

  registration(event: Event) {
   event.preventDefault();
   const dialogRef =this.dialog.open(CompRegisComponent,{
    height:'90%',
    maxWidth: '1000px',
    width:'80%',
    panelClass: 'custom-dialog-container'},);
      dialogRef.afterClosed().subscribe({
        next:(val) =>{
          if (val) {
           // this.getListFaktur();
            //localStorage.setItem("dsono", this.dtparam);

          }
        }
      });
  };

   testProtectedApi() {
    console.log("Mencoba memanggil API terproteksi SEKARANG...");

    // Panggil salah satu API yang sebelumnya gagal, misalnya getcartList
    // Ganti 'bbbb1' dan 'N' dengan data tes yang valid jika perlu
    this.shopDrawService.getcartList('bbbb1', 'N').subscribe({
      next: (data) => {
        console.log("SUKSES! Data diterima:", data);
        alert("BERHASIL MENGAMBIL DATA!");
      },
      error: (err) => {
        console.error("GAGAL! Error:", err);
        alert("GAGAL! Cek console browser untuk detail error.");
      }
    });
  }

  onImageError(event: Event) {
  (event.target as HTMLImageElement).src = 'assets/user.png';
}

about(event: Event) {
  event.preventDefault();
  const dialogRef = this.dialog.open(AboutComponent, {
    height: 'auto',
    maxWidth: '300px',

    width: '80%',
    disableClose: true,
    panelClass: 'custom-dialog-container'

  });
}

rfq(event: Event) {
  event.preventDefault();
  const dialogRef = this.dialog.open(RfqComponent, {
    height: 'auto',
    maxWidth: '300px',

    width: '80%',
    disableClose: true,
    panelClass: 'custom-dialog-container'

  });
}

help(event: Event) {
  event.preventDefault();
  const dialogRef = this.dialog.open(HelpComponent, {
    maxHeight: '90vh',
    maxWidth: '700px',
    width: '90%',
    disableClose: true,
    panelClass: 'custom-dialog-container',
      autoFocus: 'h2',
  });
}
isAccountOpen = false;

  constructor(
    private dialog: MatDialog,
    private logserv: ServLoginService,
    private shopDrawService: ShopDrawServService,
    private router: Router,
    private el: ElementRef
  ) {}

  // === klik di luar -> tutup dropdown
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (this.isAccountOpen && !this.el.nativeElement.contains(ev.target)) {
      this.isAccountOpen = false;
    }
  }

  onAccountClick(event: Event) {
    event.preventDefault();
    if (this.myacc === 'My Account') {
      this.login(event);
      this.isAccountOpen = false;
      return;
    }
    this.isAccountOpen = !this.isAccountOpen;
  }

  private openInNewTab(path: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([path]));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openCustomerProfile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isAccountOpen = false;
    this.openInNewTab('/CustomerProfile');
  }

  logout(event: Event) {
    event.preventDefault();
    // bersihkan storage & state
    localStorage.removeItem('picnm');
    localStorage.removeItem('uscd');
    localStorage.removeItem('usnm');
    localStorage.removeItem('usrimg');
    localStorage.removeItem('typeb');

    this.myacc = 'My Account';
    this.mypp  = 'assets/user.png';
    this.isAccountOpen = false;

    // kalau ada notifikasi logout di service-mu, panggil di sini (opsional)
    // this.logserv.notifyLoggedOut?.();

    // redirect ringan (opsional)
    this.router.navigate(['/']);
  }




}
