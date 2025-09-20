import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenuItem, MenuItemCommandEvent } from 'primeng/api';
import { MegaMenuModule } from 'primeng/megamenu';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PopoverModule } from 'primeng/popover';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HeaderNavComponent } from "../header-nav/header-nav.component";
import { DataViewModule } from 'primeng/dataview';
import { Router, RouterModule } from '@angular/router';
import { ServLoginService } from '../login/Services/serv-login.service';
import { Subscription } from 'rxjs';
import { ShopDrawServService } from '../shop-drawer/Services/shop-draw-serv.service';
import { MainHomeServService } from '../Home/Services/main-home-serv.service';
import { notifications } from '../Home/Models/notifications';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AboutComponent } from '../Home/about/about.component';
import { HelpComponent } from '../Home/help/help.component';
import { RfqComponent } from '../Home/rfq/rfq.component';
import { LoginCompComponent } from '../login/Components/login-comp/login-comp.component';
import { CompRegisComponent } from '../Registration/Components/comp-regis/comp-regis.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MegaMenuModule,
    AvatarGroupModule,
    AvatarModule,
    OverlayBadgeModule,
    PopoverModule,
    IconFieldModule,
    InputIconModule,
    HeaderNavComponent,
    DataViewModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  cartProductList: any[] = [];
  cartItems: any[] = [];
  items: MegaMenuItem[] | undefined;
  cartExpanded: boolean = false;
  vusrnm: string = "";
  vusrurl: string = "";
  vusnm: string = "";
  vusurl: string = "";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: string | null = null;
  vmsg: any;
  myacc: string = 'My Account';
  isMobileMenuOpen = false;
  notif: notifications[] = [];
  notificationItems: any[] = [];
  notificationExpanded: boolean = false;
  cartItem: any[] = [{id:1}, {id:2}];
  searchTerm: string = '';
  isSearchInputTooLong: boolean = false;
  private broadcastChannel: BroadcastChannel;
  isMegaMenuVisible: boolean = false;
  private subscription!: Subscription;
  private cartUpdateSubscription!: Subscription;
  typeb :any;

  mobileMenuOpen = false;
  mobileSections: Record<string, boolean> = { seller: false, rfq: false, profile: false };
  get isTypeC(): boolean { return this.typeb === '(C)'; }

  mypp: string = 'assets/user.png';

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.qty * item.price, 0);
  }

  constructor(
    private router: Router,
    private logserv: ServLoginService,
    private _cartserv: ShopDrawServService,
    private _mainserv: MainHomeServService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.broadcastChannel = new BroadcastChannel('cart_update_channel');
  }

  private dialogDefaults = {
    width: '640px',
    maxWidth: '95vw',
    maxHeight: '85vh',
    disableClose: true,
    panelClass: 'ia-dialog',
    autoFocus: false,
    restoreFocus: false,
  } as const;

  ngOnInit() {
    this.checkUserStatus();
   // if (this.typeb==='(B)') {
       this.initializeMenu();
  //  }else{
   //    this.initializeMenu2();
  //  }

    this.getCartList();
    this.getNotificationList();

    this.subscription = this.logserv.callMethodObservablenavbar.subscribe(() => {
      this.log_infonavbar();
    });

    this.cartUpdateSubscription = this._cartserv.cartUpdated$.subscribe(() => {
      console.log('Navbar: Menerima sinyal cart update! Memuat ulang data keranjang...');
      this.getCartList();
    });

     this.broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'CART_UPDATED') {
        console.log('Navbar (Tab Lain): Menerima siaran, memuat ulang keranjang...');
        this.getCartList();
      }
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(e: KeyboardEvent) {
    if (this.mobileMenuOpen) {
      this.toggleMobileMenu(false);
    }
  }

  toggleMobileMenu(open: boolean) {
    this.mobileMenuOpen = open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      this.mobileSections = { seller: false, rfq: false, profile: false };
    }
  }

  toggleSection(key: 'seller' | 'rfq' | 'profile') {
    this.mobileSections[key] = !this.mobileSections[key];
  }

  handleNavigate(menuLabel: string) {
    this.openMenuAdaptive(menuLabel);
    this.toggleMobileMenu(false);
  }

  checkUserStatus() {
    this.vusrnm = localStorage.getItem('usnm') || '';
    this.vusrurl = localStorage.getItem('usrimg') || '';
    this.typeb   = localStorage.getItem('typeb');
    this.vusrd   = localStorage.getItem('uscd');

    this.vusnm = this.vusrnm;
    this.vusurl = this.vusrurl;

    if (this.vusrd) {
      this.vusr = this.logserv.decrypt(this.vusrd);
      this.isMegaMenuVisible = true;
      this.myacc = this.vusnm;

      // ⬇️ Tambahan penting
      this.mypp = (this.vusurl && this.vusurl !== 'null' && this.vusurl.trim() !== '')
        ? this.vusurl
        : 'assets/user.png';
    } else {
      this.isMegaMenuVisible = false;
      this.myacc = 'My Account';
      // ⬇️ Tambahan penting
      this.mypp  = 'assets/user.png';
    }
  }

  onImageError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/user.png';
  }

  handleMenuClick(event: MenuItemCommandEvent, action: string, param?: any): void {
  if (event.originalEvent) {
    event.originalEvent.preventDefault();
  }

  switch (action) {
    case 'navigate':
      this.openMenuAdaptive(param);        // <— ganti ini
      if (this.mobileMenuOpen) this.toggleMobileMenu(false);
      break;
    case 'logout':
      this.logout();
      break;
  }
}


  /*initializeMenu() {
    this.items = [
      {
        label: 'Seller',
        icon: 'pi pi-box',
        items: [
          [
            {
              label: 'Request',
              items: [
                { label: 'Request List', command: (e) => this.handleMenuClick(e, 'navigate', 'requestlist') },
              ],
            },
          ],
          [
            {
              label: 'Inquiries',
              items: [
                { label: 'Custom Inquiries', command: (e) => this.handleMenuClick(e, 'navigate', 'sellerquotationmanuallist')},
                { label: 'Product Inquiries', command: (e) => this.handleMenuClick(e, 'navigate', 'sellerquotationslist')},
              ],
            },
          ],
        ],
      },
      {
        label: 'Request For Quotations',
        icon: 'pi pi-mobile',
        items: [
          [
            {
              label: '',
              items: [
                { label: 'Custom RFQ', command: (e) => this.handleMenuClick(e, 'navigate', 'quotationmanuallist')},
                { label: 'Review Offers for Custom RFQ', command: (e) => this.handleMenuClick(e, 'navigate', 'resultquotationmanuallist')},
              ],
            },
          ],
          [
            {
              label: '',
              items: [
                { label: 'RFQ from Catalog', command: (e) => this.handleMenuClick(e, 'navigate', 'quotationslist') },
                { label: 'Review Offers for Catalog RFQ', command: (e) => this.handleMenuClick(e, 'navigate', 'resultquotationslist') },
              ],
            },
          ],
        ],
      },
      {
        label: 'Profile',
        icon: 'pi pi-clock',
        items: [
          [
            {
              label: 'Customer Detail',
              items: [
                { label: 'Customer Profile', command: (e) => this.handleMenuClick(e, 'navigate', 'customerprofile') },
              ],
            },
          ],
          [
            {
              label: 'Security',
              items: [
                { label: 'Log Out', command: (e) => this.handleMenuClick(e, 'logout') },
              ]
            },
          ],
        ],
      },
    ];
  }*/

 initializeMenu() {
  const sellerInquiriesColumn =
    this.typeb === '(C)'
      ? {
          label: '',
          items: [
            {
              label: 'Inquiries',
              styleClass: 'disabled-link',
              command: () => this.showNIBMessage()
            }
          ]
        }
      : {
          label: 'Inquiries',
          items: [
            {
              label: 'Custom Inquiries',
              command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'sellerquotationmanuallist')
            },
            {
              label: 'Product Inquiries',
              command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'sellerquotationslist')
            },
          ],
        };

  const requestForQuotationsMenu: MegaMenuItem =
    this.typeb === '(C)'
      ? {
          label: 'Request For Quotations',
          icon: 'pi pi-file-edit',
          styleClass: 'disabled-link',
          command: () => this.showNIBMessage()
        }
      : {
          label: 'Request For Quotations',
          icon: 'pi pi-file-edit',
          items: [
            [{
              label: 'Custom RFQ & Review',
              items: [
                { label: 'Custom RFQ', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'quotationmanuallist')}, // Tipe ditambahkan
                { label: 'Review Offers for Custom RFQ', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'resultquotationmanuallist')}, // Tipe ditambahkan
              ],
            }],
            [{
              label: 'RFQ from Catalog & Review',
              items: [
                { label: 'RFQ from Catalog', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'quotationslist') }, // Tipe ditambahkan
                { label: 'Review Offers for Catalog RFQ', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'resultquotationslist') }, // Tipe ditambahkan
              ],
            }],
          ],
        };

  this.items = [
    {
      label: 'Seller',
      icon: 'pi pi-box',
      items: [
        [
          {
            label: 'Request',
            items: [
              { label: 'Request List', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'requestlist') }, // Tipe ditambahkan
            ],
          },
        ],
        [
          sellerInquiriesColumn
        ],
      ],
    },

    requestForQuotationsMenu,

    {
      label: 'Profile',
      icon: 'pi pi-user-edit',
      items: [
        [{
          label: 'Customer Detail',
          items: [{ label: 'Customer Profile', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'navigate', 'customerprofile') }], // Tipe ditambahkan
        }],
        [{
          label: 'Security',
          items: [{ label: 'Log Out', command: (e: MenuItemCommandEvent) => this.handleMenuClick(e, 'logout') }], // Tipe ditambahkan
        }],
      ],
    },
  ];
}

 showNIBMessage(): void {
    alert('Please complete your NIB data in your profile to use this feature or contact admin for assistance.');

  }


  getCartList() {
    this.cartItems = [];
    if (!this.vusr) {
      return;
    }
    this._cartserv.getcartList(this.vusr, 'N').subscribe((apiResponse: any[]) => {
      if (!apiResponse) {
        return;
      }
      const allProducts = apiResponse.flatMap(group => group.cartitem || []);
      this.cartItems = allProducts.map(product => {
        const images = [];
        if (product.cartProductImage1) images.push({ itemImageSrc: product.cartProductImage1 });
        if (product.cartProductImage2) images.push({ itemImageSrc: product.cartProductImage2 });
        if (product.cartProductImage3) images.push({ itemImageSrc: product.cartProductImage3 });
        if (product.cartProductImage4) images.push({ itemImageSrc: product.cartProductImage4 });

        return {
          name: product.cartProductName,
          description: product.cartProductDesc,
          price: product.cartProductPrice,
          qty: product.cartProductStock,
          images: images
        };
      });
    });
  }

  openMenuAdaptive(menuLabel: string) {
    const routes: { [key: string]: string } = {
      requestlist: '/requestlist',
      quotationslist: '/quotationManuallist',
      quotationmanuallist: '/quotationlist',
      sellerquotationslist: '/sellerquotationlist',
      sellerquotationmanuallist: '/sellerquotationManuallist',
      resultquotationslist: '/inquiry-results-list',
      resultquotationmanuallist: '/inquiry-results-manual-list',
      customerprofile: '/CustomerProfile',
    };
    const path = routes[menuLabel];
    if (!path) return;

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (isMobile) {
      // Mobile: navigasi di tab yang sama
      this.router.navigateByUrl(path);
    } else {
      // Desktop: tetap buka tab baru
      const url = this.router.serializeUrl(this.router.createUrlTree([path]));
      window.open(url, '_blank');
    }
  }

  navigateQuickLink(path: string) {
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  if (isMobile) {
    this.router.navigateByUrl(path);
    this.toggleMobileMenu(false);
  } else {
    const url = this.router.serializeUrl(this.router.createUrlTree([path]));
    window.open(url, '_blank');
  }
}

  log_infonavbar() {
    this.notif = [];
    this.cartItems = [];
    this.vusrd = localStorage.getItem('uscd');
    this.checkUserStatus();
    this.initializeMenu();
    this.getCartList();
    this.getNotificationList();
  }

  getNotificationList() {
    if (!this.vusr) {
      return;
    }
    this._mainserv.mainNotifikasi(this.vusr).subscribe((res: notifications[]) => {
      this.notif = res;
      this.notificationItems = res.map(n => ({
        id: n.ctnotifId,
        type: n.ctnotifType,
        description: n.ctnotifDesc,
        typeDescription: this.getNotificationTypeDescription(n.ctnotifType)
      }));
    });
  }

  getNotificationTypeDescription(type: string): string {
    switch (type) {
      case 'ORDER': return 'Information about your order.';
      case 'PROMO': return 'Special offers and promotions.';
      case 'SYSTEM': return 'Important system announcements.';
      default: return 'New notification.';
    }
  }

  deleteNotification(notificationToDelete: any, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const notificationId = notificationToDelete.id;
    if (!notificationId) {
      console.error("Cannot delete notification: ID is undefined.");
      return;
    }

    this._mainserv.updateNotifikasi(notificationId, this.vusr).subscribe({
      next: (res) => {
        console.log('Notification deleted successfully:', res);
        this.notificationItems = this.notificationItems.filter(item => item.id !== notificationId);
        this.notif = this.notif.filter(n => n.ctnotifId !== notificationId);
      },
      error: (err) => {
        console.error('Failed to delete notification:', err);
        alert('Sorry, the notification could not be deleted. Please try again.');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('uscd');
    localStorage.removeItem('picnm');
    localStorage.removeItem('usnm');
    localStorage.removeItem('usrimg');
    localStorage.removeItem('typeb');
    this.notificationItems = [];
    this.notif = [];
    this.cartItems = [];
    this.authService.execLogout();
    this.isMegaMenuVisible = false;
    this.callothermethodheadernalogout();
    this.vusr = null;
    this.vusrd = null;
    this.myacc = 'My Account';
    this.mypp  = 'assets/user.png';
    this.toggleMobileMenu(false);
    this.mobileSections = { seller: false, rfq: false, profile: false };
  }

  callothermethodheadernalogout() {
    this.logserv.callmethodfromothercomponentheaderbarlogout();
  }

  get isLoggedIn(): boolean {
    return !!this.vusrd;
  }

  openSearchPage(searchTerm: string): void {
    if (!searchTerm.trim()) {
      return;
    }
    const url = this.router.serializeUrl(this.router.createUrlTree(['/search'], { queryParams: { q: searchTerm } }));
    window.open(url, '_blank');
  }

  openInNewTab(routePath: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([routePath]));
    window.open(url, '_blank');
  }

  onSearchInput(): void {
    this.isSearchInputTooLong = this.searchTerm.length >= 60;
  }

  goHome(): void {
  if (this.router.url === '/mainhome' || this.router.url === '/') {
    window.location.href = '/mainhome';
  } else {
    this.router.navigateByUrl('/mainhome');
  }
}

  openAbout(ev?: Event) {
    ev?.preventDefault();
    this.dialog.open(AboutComponent, { ...this.dialogDefaults });
    this.toggleMobileMenu(false);
  }

  openRFQ(ev?: Event) {
    ev?.preventDefault();
    this.dialog.open(RfqComponent, { ...this.dialogDefaults });
    this.toggleMobileMenu(false);
  }

  openHelp(ev?: Event) {
    ev?.preventDefault();
    this.dialog.open(HelpComponent, { ...this.dialogDefaults });
    this.toggleMobileMenu(false);
  }

  openLoginMobile(ev?: Event) {
    ev?.preventDefault();
    this.toggleMobileMenu(false);
    const ref = this.dialog.open(LoginCompComponent, {
      height: 'auto',
      maxWidth: '300px',
      width: '80%',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
    ref.afterClosed().subscribe(() => {
      this.checkUserStatus();
      this.getCartList();
      this.initializeMenu();
    });
  }

  openSignupMobile(ev?: Event) {
    ev?.preventDefault();
    const ref = this.dialog.open(CompRegisComponent, {
      height: '90%',
      maxWidth: '1000px',
      width: '80%',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });
    ref.afterClosed().subscribe(() => {
      this.checkUserStatus();
    });
    ref.backdropClick().subscribe(() => ref.close());

    ref.afterClosed().subscribe(() => this.checkUserStatus());
  }

}
