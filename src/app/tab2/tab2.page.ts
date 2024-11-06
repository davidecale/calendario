import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Html5QrcodeScanner } from "html5-qrcode";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  qrCodeResult: string | null = null;
  html5QrcodeScanner: Html5QrcodeScanner | null = null;

  constructor() {}


  async takePhoto() {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri, // Puoi scegliere anche 'Base64' o 'Uri'
      source: CameraSource.Camera, // Usa la fotocamera del dispositivo
    });
  
    const photoElement = document.getElementById('photo') as HTMLImageElement;
    photoElement.src = photo.webPath!;
    photoElement.style.display = 'block';
    // Elabora la foto (photo.webPath è l'URL dell'immagine scattata)
    console.log(photo.webPath);
  }


  startScan() {
    // Crea una nuova istanza di Html5QrcodeScanner
   this.html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 30,
      qrbox: 400
    }, false);
    // Avvia la scansione
    this.html5QrcodeScanner.render(
      (decodedText: string) => {
        // Quando viene scansionato un QR Code, salva il risultato
        this.qrCodeResult = decodedText;

        // Fermiamo la scansione subito dopo il primo QR code trovato
        this.html5QrcodeScanner?.clear(); // Questo ferma la scansione

        // Mostra un messaggio di conferma o esegui altre azioni
        console.log("QR Code trovato: ", decodedText);
        
      },
      (errorMessage: string) => {
      }
    );
  }


  

}
