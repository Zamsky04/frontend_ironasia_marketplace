import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CustProfileComponent } from '../../../CustomerProfile/Forms/cust-profile/cust-profile.component';
import { CustAddressListComponent } from '../../../CustAddress/Forms/cust-address-list/cust-address-list.component';
import { ChangePasswordwebComponent } from '../../../ChangePasswordWeb/Forms/change-passwordweb/change-passwordweb.component';
import { RouterModule } from '@angular/router';
import { HeaderNavComponent } from '../../../../header-nav/header-nav.component';

@Component({
  selector: 'app-tab-cust-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    HeaderNavComponent,

    // Komponen tab yang akan ditampilkan
    CustProfileComponent,
    CustAddressListComponent,
    ChangePasswordwebComponent,

  ],
  templateUrl: './tab-cust-profile.component.html',
  styleUrls: ['./tab-cust-profile.component.css']
})
export class TabCustProfileComponent implements OnInit {

  selectedTab = 'a';

  tabs = [
    { label: 'Profile', key: 'a' },
    { label: 'Address', key: 'b' },
    { label: 'Change Password', key: 'c' }
  ];

  selectTab(tabKey: string): void {
    this.selectedTab = tabKey;
  }

  get selectedTabIndex(): number {
  return this.tabs.findIndex(t => t.key === this.selectedTab);
}


  ngOnInit(): void {
    // Optional: inisialisasi logika jika diperlukan
  }
}
