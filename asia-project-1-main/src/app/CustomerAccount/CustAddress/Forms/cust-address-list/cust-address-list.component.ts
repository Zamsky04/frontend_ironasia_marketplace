import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { CustAddressServService } from '../../Services/cust-address-serv.service';
import { DtoAddress } from '../../Models/DtoAddress';
import { CustAddressCUComponent } from '../cust-address-cu/cust-address-cu.component';
import { VCustAddress } from '../../Models/VCustAddress';
import { ServLoginService } from '../../../../login/Services/serv-login.service';

@Component({
  selector: 'app-cust-address-list',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatNativeDateModule, MatPaginatorModule, MatTableModule, MatToolbarModule,
    MatIconModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatDatepickerModule,
    MatSortModule, RouterModule
  ],
  templateUrl: './cust-address-list.component.html',
  styleUrls: ['./cust-address-list.component.css']
})
export class CustAddressListComponent implements OnInit {

  vmsjur: VCustAddress[] = [];
  dtparam: any = 'a' as const;
  dt: string = '';
  dtreal: string = '';
  vusrnm: any = "";
  vusrurl: any = "";
  vusnm: any = "";
  vusurl: any = "";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  custNo : any;
  today1 = new FormControl(new Date());
  isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<any>;
  vct: number = 0;
  events: string[] = [];
  month: string = "a";
  searchText: string = '';

  addressFields: string[] = [
  'vcaAddrId',
  'vcaCustNo',
  'vcaCustName',
  'vcaHandphone',
  'vcaAddr',
  'vcaRt',
  'vcaRw',
  'vcaKelCode',
  'vcaKelurahan',
  'vcaKecCode',
  'vcaKecamatan',
  'vcaCityCode',
  'vcaCity',
  'vcaProvCode',
  'vcaProvinsi',
  'vcaZipCode',
  'vcaAddrType',
  'vcaAreaName',
  'vcaLonglat'
];


  displayedColumns: string[] = [];

  constructor(
    private _mbtserv: CustAddressServService,
    private _router: Router,
    private dialog: MatDialog,
    private logserv: ServLoginService,
    //private alert: AlertServiceService
  ) { }

  ngOnInit(): void {
    this.GetUserToken();
    this.getAddressList();
    this.displayedColumns = ['nourut', ...this.addressFields, 'action'];
  }

  GetUserToken() {
    this.vusrnm=localStorage.getItem('usnm');
    this.vusrurl=localStorage.getItem('usrimg');
    this.vusrd=localStorage.getItem('uscd');
   
    this.vusnm=this.vusrnm;
    this.vusurl=this.vusrurl;    
    this.vusr=this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl);

    //this.custNo = '00034WB202505';
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events = [];
    this.events.push(`${type}: ${event.value}`);
    this.dt = JSON.stringify(this.events);
    this.dtreal = JSON.stringify(this.dt);
    this.dtparam = this.dtreal.substring(16, 27);
    sessionStorage.setItem("paramdt", this.dtparam);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.searchText = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAddressList() {
    this.vmsjur = [];
    this.vct = 0;
    this._mbtserv.getAddressListByCustNo(this.vusr, this.vtkn).subscribe({
      next: (res: VCustAddress[]) => {
        this.vmsjur = res;
        this.dataSource = new MatTableDataSource(this.vmsjur);
        this.dataSource.data.forEach(item => {
          this.vct += 1;
          item.nourut = this.vct;
        });
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error: HttpErrorResponse) => {
        // Handle error here
      }
    });
  }

  openAddAddressDialog(ptranstype: string, p_no: any, vprodcode: any) {
    const dialogRef = this.dialog.open(CustAddressCUComponent, { height: '80%', width: '55%' },);
        dialogRef.afterClosed().subscribe({
          next: (val) => {
            if (val) {
              this.getAddressList();
              //sessionStorage.setItem("dsono", this.dtparam);  
    
            }
          }
        });
    
        dialogRef.componentInstance.p_type = ptranstype;
        dialogRef.componentInstance.p_no = p_no;
        dialogRef.componentInstance.p_custno = this.vusr;
        dialogRef.componentInstance.p_provcode = vprodcode;
  }


  // ✅ Tambahan fungsi aksi
  editAddress(address: VCustAddress) {
    console.log('Edit:', address);
    // Contoh navigasi ke halaman edit
    // this._router.navigate(['/edit-address', address.ccaddrId]);
  }

  deleteAddress(address: VCustAddress) {
    console.log('Delete:', address);

    const payload: DtoAddress = {
      ccaddrId: address.vcaAddrId,
      ccaddrCustNo: address.vcaCustNo
    };

    alert('delete: ' + address.vcaAddrId + '/' + address.vcaCustNo);

    if (confirm(`Yakin ingin menghapus alamat ${address.vcaAddr}?`)) {
      this._mbtserv.DeleteAddress(payload, this.vtkn).subscribe(
        (response: string) => {
          if (response && typeof response === 'string' && response.trim().toLowerCase().includes('delete')) {
            alert('Data berhasil didelete');
          } else {
            alert('Respons tidak sesuai, data mungkin gagal didelete');
          }

          this.getAddressList(); // Refresh list setelah delete
        },
        error => {
          console.error('Terjadi kesalahan saat delete:', error);
          alert('Gagal menghapus data');
        }
      );
    }

  }

  formatPhoneWithSpaces(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/(.{4})/g, '$1 ').trim();
}



}
