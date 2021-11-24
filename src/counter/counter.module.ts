import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

import { BasicComponent } from "./basic/basic.component";

@NgModule({
  declarations: [BasicComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule],
  exports: [BasicComponent]
})
export class CounterModule {}