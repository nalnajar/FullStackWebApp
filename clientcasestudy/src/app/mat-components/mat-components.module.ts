import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// added imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
const MaterialComponents = [
 MatButtonModule,
 MatCardModule,
 MatFormFieldModule,
 MatIconModule,
 MatInputModule,
 MatListModule,
 MatMenuModule,
 MatToolbarModule,
 MatTooltipModule,
 MatTableModule,
 MatSortModule,
 MatSelectModule,
 MatExpansionModule,
 MatPaginatorModule,
 MatDialogModule
];
@NgModule({
 declarations: [],
 imports: [CommonModule, ...MaterialComponents],
 exports: [...MaterialComponents],
})
export class MatComponentsModule {}