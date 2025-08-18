import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Loader{

    setUp(e){

        this.e = e;

        this.ready=false;
        
        this.modelsLoaded=0;
        this.texturesLoaded=0;
        this.modelArray=[];
        this.textureArray=[];
        
        this.isLoaded_CUBE=false;
        this.isLoaded_3DTEXTURES=false;
        this.isLoaded_3D=false;
        this.e.reflectionTexture=null;

        this.totalSkinsLoaded = 0;

        console.log("set up loader")

    }

    loadCubeTexture(loader){
        
        console.log("CUBE TEXTURE");
        this.isLoaded_CUBE=true;
    
    }
    
    loadTexture(loader){

        loader.texturesLoaded+=1;
        console.log("TEXTURE: "+this.texturesLoaded+" / "+this.textureArray.length)

        if(this.modelsLoaded===this.modelArray.length){
            this.isLoaded_3DTEXTURES=true;
        }
        
    }
    
    managerLoad(obName){
    
        this.modelsLoaded+=1; 
        console.log("MODEL: "+obName+" / "+this.modelsLoaded+" / "+this.modelArray.length)

        if(this.modelsLoaded===this.modelArray.length){
            this.isLoaded_3D=true;
        }

    }

   load(){

        var e = this.e;

        //------------------------------------------------------------------

        var loader = new THREE.CubeTextureLoader();
        loader.name="skyboxLoaderName";

        this.e.reflectionTexture = loader.load([
        './src/images/ref/pos-x.png',
        './src/images/ref/neg-x.png',
        './src/images/ref/pos-y.png',
        './src/images/ref/neg-y.png',
        './src/images/ref/pos-z.png',
        './src/images/ref/neg-z.png',
        ],  () => this.loadCubeTexture());

        this.textureArray.push("adPictures"); this.e.adPictures = new THREE.TextureLoader().load( './src/images/adPictures.png', this.loadTexture(this));
        this.e.adPictures.wrapS = THREE.RepeatWrapping;
        this.e.adPictures.wrapT = THREE.RepeatWrapping;
        this.e.adPictures.repeat.y = -1; 
        this.textureArray.push("blackTemp"); this.e.blackTemp = new THREE.TextureLoader().load( './src/images/black.png', this.loadTexture(this));
        
        // this.e.blackTemp.anisotropy = this.e.renderer.capabilities.getMaxAnisotropy();

        // this.e.blackTemp.repeat.x = 260;
        // this.e.blackTemp.repeat.y = 260;
        // this.e.blackTemp.wrapS = this.e.blackTemp.wrapT = THREE.RepeatWrapping;

        //------------------------------------------------------------------

        this.myObject1 = "court2"; this.modelArray.push(this.myObject1);
        this.manage = new THREE.LoadingManager(); this.manage.onLoad = ((modelName) => { return () => this.managerLoad(modelName);})(this.myObject1);
        this.loader = new GLTFLoader(this.manage); this.loader.load('./src/models/'+this.myObject1+'.glb', gltf => {  
        
            gltf.scene.traverse( function( object ) {

                e.court=gltf.scene;

                if ( object.isMesh ){

                    object.castShadow=true;
                    object.receiveShadow=true;
                    object.material.side = THREE.FrontSide;

                }

            });

        }, this.loadSomething);

        //------------------------------------------------------------------

        this.myObject1 = "ball"; this.modelArray.push(this.myObject1);
        this.manage = new THREE.LoadingManager(); this.manage.onLoad = ((modelName) => { return () => this.managerLoad(modelName);})(this.myObject1);
        this.loader = new GLTFLoader(this.manage); this.loader.load('./src/models/'+this.myObject1+'.glb', gltf => {  
        
            gltf.scene.traverse( function( object ) {

                e.ball=gltf.scene;

                if ( object.isMesh ){

                    object.castShadow=true;
                    object.receiveShadow=true;
                    object.material.side = THREE.FrontSide;

                }

            });

        }, this.loadSomething);

    }

}