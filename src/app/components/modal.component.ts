import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton,
} from "ngx-modal-dialog";
import { Component, ComponentRef } from "@angular/core";

@Component({
  selector: "app-modal",
  template:
    '<p style="color: red;">*A pessoa será apagada permanentemente do banco de dados!</p>',
})
export class ModalComponent implements IModalDialog {
  constructor() {}

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    // no processing needed
  }
}
