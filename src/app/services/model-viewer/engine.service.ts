import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Matrix4, Mesh } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Material, TextGeometry } from 'three';
import {ObjectControls} from 'threejs-object-controls';


@Injectable({
  providedIn: 'root'
})

export class EngineService implements OnDestroy {
  public controls: OrbitControls;
  public firstModelControls : ObjectControls;
  public secondModelControls : ObjectControls;
  public stats: Stats;
  public canvasColor: THREE.Color;
  public firstModelMesh: THREE.Mesh;
  public secondModelMesh: THREE.Mesh;

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.OrthographicCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private frameId: number = null;
  private measurementScene: THREE.Scene;
  private renderedMeasurements: string[];
  private dracoLoader: DRACOLoader;
  private plyLoader: PLYLoader;
  public loading: boolean;

  constructor(private ngZone: NgZone) {
    this.renderedMeasurements = [];
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>, isDualView: boolean): void {
    console.log('createScene was called');
    this.canvas = canvas.nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.measurementScene = new THREE.Scene();
    this.canvasColor = new THREE.Color('#0f0c29');
    this.scene.background = this.canvasColor;

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2,
                                                window.innerWidth / 2,
                                                window.innerHeight / 2,
                                                window.innerHeight / - 2,
                                                -300, 1000 );
    this.setCameraPosition();
    this.scene.add(this.camera);
    console.log('camera was added to scene');
    this.light = new THREE.AmbientLight( 0xffffff, 2 );
    this.scene.add(this.light);
    this.controls = new OrbitControls( this.camera, this.renderer.domElement ); 
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minPolarAngle = 0;
    this.controls.minAzimuthAngle = 0; 
    this.controls.maxAzimuthAngle = 0;  
    this.controls.enableZoom = true;  
    this.controls.minZoom = 1;
    this.controls.maxZoom = 10;
    console.log('controls added successfully');
  }

  AddTitle(text: string): void{
    this.showText(text, 0, 0, 0, this.scene, 7, 'white');
  }
  
  public async AddModel(modelUrl: string,  isFirstModel: boolean, xPosition: number, yPosition: number, zPosition: number, alignNumbers?: number[] ): Promise<any> {
    console.log('AddModel was called with url: ' + modelUrl);
    let geometry;        
    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors} );
    if (modelUrl.endsWith('.ply')) {
      geometry = await this.loadPlyModel(this.scene, isFirstModel, modelUrl, material, xPosition, yPosition, zPosition, false, null, null, 0, 0);
    } else {      
      geometry = await this.loadDracoModel(this.scene, isFirstModel, modelUrl, xPosition, yPosition, zPosition, material, false, null, null, 0, 0);
    } 
    if(isFirstModel) {
      this.setFirstModel(geometry, material, xPosition, yPosition, zPosition, this.scene);     
    }           
  }

  public loadPlyModel(scene: THREE.Scene, isFirstModel: boolean, visualModel: string, material: Material,  xPosition: number,
                      yPosition: number, zPosition: number, isMeasurement: boolean, measurementsValuesUrl: string,
                      colorMapName: string, minMapValue: number, maxMapValue: number, text?: string,
                      textShiftX?: string, textShiftY?: string, textShiftZ?: string): any {    
    return new Promise<THREE.BufferGeometry>(async (resolve, reject) => {
      console.log( 'LoadPlyModel was called' );    
      this.loading = true;
      this.plyLoader = new PLYLoader();
      this.plyLoader.load(visualModel, (geometry) => {
      console.log( 'PLYLoader was called' )      
      geometry.computeVertexNormals();  
      return resolve(geometry);
      },
      ( xhr ) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded model ' + visualModel);      
      });
    });
}

public loadDracoModel(scene: THREE.Scene, isFirstModel: boolean, visualModel : string, xPosition : number, yPosition : number, zPosition : number, 
  material : Material, isMeasurement : boolean, measurementsValuesUrl : string, colorMapName : string, minMapValue : number, maxMapValue : number,
  text? : string, textShiftX? : string, textShiftY? : string, textShiftZ? : string) {  
  return new Promise<THREE.BufferGeometry>(async (resolve, reject) => {
    this.loading = true;
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath( '../../assets/' );
    this.dracoLoader.setDecoderConfig( { type: 'js' } );
    this.dracoLoader.load(visualModel, ( geometry ) => {
    geometry.computeVertexNormals();
    this.dracoLoader.dispose();    
    return resolve(geometry);
    },
    ( xhr ) => {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded model ' + visualModel);
    });  
  });
}

private setFirstModel(geometry: THREE.BufferGeometry, material: THREE.Material, xPosition: number, yPosition: number, zPosition: number, scene: THREE.Scene, alignNumbers?: number[]) {
  this.firstModelMesh = this.createMesh(this.firstModelMesh, geometry, material, xPosition, yPosition, zPosition);
  scene.add(this.firstModelMesh);
  this.firstModelControls = new ObjectControls(this.camera, this.renderer.domElement, this.firstModelMesh);     
}

private createMesh(mesh: any, geometry: THREE.BufferGeometry, material: Material, xPosition: number,
                   yPosition: number, zPosition: number): THREE.Mesh {
  if (!material){
    material = new THREE.MeshBasicMaterial({ } );
  }
  if (!geometry){
    return;
  }
  mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(2, 2, 2);
  mesh.position.set(xPosition, yPosition, zPosition);
  return mesh;
}

public showText(text: string, textXPosition: number, textYPosition: number, textZPosition: number, scene: THREE.Scene,
                fontSize: number, color: string): void {
  console.log('handleText was called with text: ' + text + ' and position: ' + textXPosition + ', ' + textYPosition + ' , ' +
    textZPosition);
  if (text) {
    const loader = new THREE.FontLoader();
    loader.load('../../assets/fonts/measurement-font.json', (font) => {
    let xMid;
    const shapes = font.generateShapes(text, fontSize, 0);
    const textShape = new THREE.BufferGeometry();
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const textMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    textShape.fromGeometry(geometry);
    let textMesh;
    textMesh = this.createMesh(textMesh, textShape, textMaterial, textXPosition, textYPosition, textZPosition);
    scene.add(textMesh);
    });
  }
}  
  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

  public setCameraPosition( x: number = 2, y: number = 1, z: number = 5): void {
    console.log('setCameraPosition was called');
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
    this.camera.updateProjectionMatrix();
  }
  
  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      this.render();
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }
}
