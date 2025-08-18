import { Howl } from 'howler';
export class Sounds {

    setUp(e) {

        this.e=e;
        this.soundArray = [ "click", "backboard", "bounce1", "catch", "hoop", "swish", "buzzer", "whistle" ];
        this.loadedSounds = [];

        for(var i=0; i<this.soundArray.length; i++){
            this.loadSounds(this.soundArray[i]);
        }
        
    }

    loadSounds(url){

        var theSound = new Howl({
            // src: ['/src/sounds/'+url+".mp3"]
            src: [require(`./sounds/${url}.mp3`)]
        });

        theSound.on('load', (event) => {
            theSound.name=url;
            this.loadedSounds.push(theSound);
            // console.log("SOUND: "+url+" - "+this.loadedSounds.length+" / "+this.soundArray.length);
        });

    }

    p(type, volume = 1.0){

        // console.log(type);

        for(var i=0; i<this.loadedSounds.length; i++){

            // console.log(type+" / "+this.loadedSounds[i].name)

            if(this.loadedSounds[i].name===type){
                // console.log("-->"+type)
                this.loadedSounds[i].volume(volume);
                this.loadedSounds[i].play();
            }
            
        }

    }
}