import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';  // Importa OrbitControls

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  @ViewChild('3dContainer', { static: true }) threeDContainer!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  clock!: THREE.Clock;
  controls!: OrbitControls; // Variabile per i controlli di rotazione
  model!: THREE.Group; // Riferimento al modello 3D

  ngOnInit() {
    this.setup3DScene();
  }


  setup3DScene() {
    // Inizializza la scena
    this.scene = new THREE.Scene();
  
    // Imposta la fotocamera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 8;
  
    // Aggiungi una luce ambientale
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
  
    // Aggiungi una luce direzionale
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  
    // Inizializza il renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.threeDContainer.nativeElement.appendChild(this.renderer.domElement);
  
    // Crea e aggiungi i controlli di orbitamento
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
  
    // Aggiungi il feed della fotocamera come sfondo
    this.addCameraFeedBackground();
  
    // Carica il modello 3D
    const loader = new GLTFLoader();
    loader.load('assets/prova6.glb', (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
  
      // Calcola il bounding box del modello
      const box = new THREE.Box3().setFromObject(this.model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
  
      // Calcola la distanza della fotocamera per adattare l'oggetto alla scena
      const maxDimension = Math.max(size.x, size.y, size.z);
      const cameraDistance = maxDimension / (2 * Math.tan(Math.PI * this.camera.fov / 360));
  
      // Aggiungi un margine per lo zoom out
      const marginFactor = 1.5;
      this.camera.position.z = cameraDistance * marginFactor;
  
      // Centra la scena sul modello
      this.controls.target.copy(center);
  
      // Rendi la scena
      this.animate();
    }, undefined, (error) => {
      console.error('Errore nel caricamento del modello:', error);
    });
  }
  
  addCameraFeedBackground() {
    // Cattura il feed della fotocamera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Crea un video element per il feed della fotocamera
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
  
        // Crea una texture dalla sorgente video
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
  
        // Imposta la texture come sfondo della scena
        this.scene.background = texture;  // Imposta direttamente la texture come sfondo della scena
      })
      .catch((err) => {
        console.error('Errore nel catturare il feed della fotocamera: ', err);
      });
  }
  
  animate() {
    // Richiama l'animazione continuamente
    requestAnimationFrame(() => this.animate());
  
    // Aggiorna i controlli
    this.controls.update();
  
    // Rendi la scena
    this.renderer.render(this.scene, this.camera);
  }
  

  

  // setup3DScene() {
  //   // Inizializza la scena
  //   this.scene = new THREE.Scene();
  
  //   // Imposta la fotocamera
  //   this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //   this.camera.position.z = 5;
  
  //   // Aggiungi una luce ambientale (luce generale che illumina tutti gli oggetti)
  //   const ambientLight = new THREE.AmbientLight(0x404040); // Luce ambientale di bassa intensità
  //   this.scene.add(ambientLight);
  
  //   // Aggiungi una luce direzionale (luce che simula una sorgente lontana come il sole)
  //   const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luce bianca, intensità 1
  //   directionalLight.position.set(5, 5, 5); // Posiziona la luce
  //   this.scene.add(directionalLight);
  
  //   // Inizializza il renderer
  //   this.renderer = new THREE.WebGLRenderer();
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);
  //   this.threeDContainer.nativeElement.appendChild(this.renderer.domElement);
  
  //   // Crea e aggiungi i controlli di orbitamento
  //   this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  //   this.controls.enableDamping = true;
  //   this.controls.dampingFactor = 0.25;
  //   this.controls.screenSpacePanning = false;
  
  //   // Carica il modello 3D
  //   const loader = new GLTFLoader();
  //   loader.load('assets/prova.glb', (gltf) => {
  //     this.model = gltf.scene;
  //     this.scene.add(this.model);
  //   }, undefined, (error) => {
  //     console.error(error);
  //   });
  
  //   // Clock per l'animazione
  //   this.clock = new THREE.Clock();
  
  //   // Avvia l'animazione
  //   this.animate();
  // }
  
  // animate() {
  //   // Richiama l'animazione continuamente
  //   requestAnimationFrame(() => this.animate());

  //   const delta = this.clock.getDelta();

  //   // Aggiorna i controlli
  //   this.controls.update();

  //   // Rendi la scena
  //   this.renderer.render(this.scene, this.camera);
  // }
}
