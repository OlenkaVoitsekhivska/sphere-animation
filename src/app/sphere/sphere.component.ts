import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-sphere',
  templateUrl: './sphere.component.html',
  styleUrls: ['./sphere.component.scss'],
})
export class SphereComponent {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  @Input() public rotationSpeedX: number = 0;
  @Input() public rotationSpeedY: number = 0.001;
  @Input() public size: number = 200;
  @Input() public texture: string = '/assets/cracks.jpg';

  //STAGE PROPS
  @Input() public cameraZ: number = 250;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  private sphereBcg = '#cae3d1';

  //HELPER PROPS
  private camera!: THREE.PerspectiveCamera;
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.SphereGeometry(1.5, 32, 32);
  private textureThingy = this.loader.load(this.texture);
  private material = new THREE.MeshLambertMaterial({ color: this.sphereBcg });

  private sphere: THREE.Mesh = new THREE.Mesh(
    this.geometry,
    this.calculateMaterial()
  );

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private calculateMaterial() {
    if (this.material) {
      this.material.map = this.textureThingy;
    }
    return this.material;
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    //ADD TILT
    const tiltAngleX = 0;
    const tiltAngleY = THREE.MathUtils.degToRad(-30);
    const tiltAngleZ = 0;
    this.sphere.rotation.set(tiltAngleX, tiltAngleY, tiltAngleZ);
    //ADD TILT

    this.scene.add(this.sphere);

    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(0, 0, 5);
    this.scene.add(light);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube() {
    this.sphere.rotation.x += this.rotationSpeedX;
    this.sphere.rotation.y += this.rotationSpeedY;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: SphereComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    })();
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }
}
