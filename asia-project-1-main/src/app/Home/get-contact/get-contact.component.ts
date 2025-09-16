import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SupplierContact } from '../Models/SupplierContact';
import { map, Observable } from 'rxjs';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-get-contact',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './get-contact.component.html',
  styleUrl: './get-contact.component.css'
})
export class GetContactComponent implements OnInit {

  contact$!: Observable<SupplierContact | undefined>;

  constructor(
    private contactService: MainHomeServService,
    public dialogRef: MatDialogRef<GetContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { suppNo: string }
  ) {}

  ngOnInit(): void {
    if (this.data.suppNo) {
      this.contact$ = this.contactService.getContact(this.data.suppNo).pipe(
        map(contacts => contacts && contacts.length > 0 ? contacts[0] : undefined)
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}