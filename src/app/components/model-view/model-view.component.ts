import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core';

// Services
import { EngineService } from '../../services/model-viewer/engine.service';

@Component({
  selector: 'app-model-view',
  templateUrl: './model-view.component.html',
  styleUrls: ['./model-view.component.scss']
})
export class ModelViewComponent implements OnInit, OnDestroy {

  @Input('filePath') 
  filePath: string;
  
  constructor(public engServ: EngineService) {
   }

  ngOnDestroy(): void {    
  }

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;  
  loading: boolean;
  radRotationY: number;
  cameraZoom: number;
  modelSide: string;
  s3BucketUrl : string;

  ngOnInit(): void {         
    
    this.addSingleModel();                                      
    this.engServ.animate();
  }
  
  private addSingleModel() {
    return new Promise(async (resolve, reject) => {
      await this.addModel(this.engServ, this.rendererCanvas, this.filePath, 0, 0, 0, true);        
      this.engServ.loading = false;     
    });
  }

  private async addModel(engineService: any, renderer: any, modelUrl: string, xPosition : number, yPosition : number, zPosition: number,
    isFirstModel: boolean) {
      console.log('filePath: ', this.filePath);
    if(isFirstModel){
      await engineService.createScene(renderer, true);
    }
    console.log('calling AddModel with url ' + modelUrl);
    await engineService.AddModel(modelUrl, isFirstModel, xPosition, yPosition, zPosition);
    console.log('AddModel completed for url ' + modelUrl);
  }  
}
