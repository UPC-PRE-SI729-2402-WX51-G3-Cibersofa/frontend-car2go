import { Component } from '@angular/core';

@Component({
  selector: 'app-technical-review',
  templateUrl: './technical-review.component.html',
  styleUrls: ['./technical-review.component.css']
})
export class TechnicalReviewComponent {
  // Método para redirigir al portal del MTC
  redirectToMTC() {
    window.location.href = 'https://portal.mtc.gob.pe/reportedgtt/form/frmconsultaplacaitv.aspx';
  }
}
