var speedMult = 0.7;
// this is the friction which will slow down the map. Must be less than 1
var friction = 0.99;

window.onload = function () {
  const config = {
	  type: Phaser.AUTO,
	  parent: "phaser-example",
	  width: 480,
	  height:480,
	  scene: [ Game ]
  }

	const game = new Phaser.Game(config);
}

class Game extends Phaser.Scene {
     preload() {
          this.load.image("map", "map.png");
     }

     create() { 
					let { width, height } = this.sys.game.canvas;
					this.width = width;
					this.height = height;
 
          // the big map to scroll
          this.scrollingMap = this.add.image(0, 0, "map").setInteractive();
          // setInteractive will allow map to accept inputs
          //this.scrollingMap.inputEnabled = true;
					this.input.setDraggable(this.scrollingMap);
          // custom property: we save map position
          this.scrollingMap.savedPosition = new Phaser.Geom.Point(this.scrollingMap.x, this.scrollingMap.y);
          // custom property: the map is not being dragged at the moment
          this.scrollingMap.isBeingDragged = false; 
          // custom property: map is not moving (or is moving at no speed)
          this.scrollingMap.movingSpeed = 0; 
          
					// when the player starts dragging...
          this.scrollingMap.on('dragstart', function() {
               // set isBeingDragged property to true
               this.isBeingDragged = true;
               // set movingSpeed property to zero. This will stop moving the map
               // if the player wants to drag when it's already moving
               this.movingSpeed = 0;
          });
          // when the player stops dragging...
          this.scrollingMap.on('dragend', function() {
               // set isBeingDragged property to false
               this.isBeingDragged = false;
          });
					this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
						gameObject.x = gameObject.scene.boundX(dragX);
						gameObject.y = gameObject.scene.boundY(dragY);
					});
     }

     update() {
          // if the map is being dragged...
          if(this.scrollingMap.isBeingDragged){
               // save current map position
               this.scrollingMap.savedPosition = new Phaser.Geom.Point(this.scrollingMap.x, this.scrollingMap.y);
          }
          // if the map is NOT being dragged...
          else{
               // if the moving speed is greater than 1...
               if(this.scrollingMap.movingSpeed > 1){
                    // adjusting map x position according to moving speed and angle using trigonometry
                    var newx = this.scrollingMap.x + this.scrollingMap.movingSpeed * Math.cos(this.scrollingMap.movingangle);
                    // adjusting map y position according to moving speed and angle using trigonometry
                    var newy = this.scrollingMap.y + this.scrollingMap.movingSpeed * Math.sin(this.scrollingMap.movingangle);
                    
										//keep the map in bounds
										this.scrollingMap.x = this.boundX(newx);
										this.scrollingMap.y = this.boundY(newy);

                    // applying friction to moving speed
                    this.scrollingMap.movingSpeed *= friction;
                    // save current map position
                    this.scrollingMap.savedPosition = new Phaser.Geom.Point(this.scrollingMap.x, this.scrollingMap.y);
               }
               // if the moving speed is less than 1...
               else{
                    // checking distance between current map position and last saved position
                    // which is the position in the previous frame
                    // phaser 2 var distance = this.scrollingMap.savedPosition.distance(this.scrollingMap.position);
										var distance = Phaser.Math.Distance.Between(this.scrollingMap.savedPosition.x, this.scrollingMap.savedPosition.y, this.scrollingMap.x, this.scrollingMap.y);
                    // same thing with the angle
                    var angle = Phaser.Math.Angle.Between(this.scrollingMap.savedPosition.x, this.scrollingMap.savedPosition.y, this.scrollingMap.x, this.scrollingMap.y);

                    // if the distance is at least 4 pixels (an arbitrary value to see I am swiping)
                    if(distance > 4){
                         // set moving speed value
                         this.scrollingMap.movingSpeed = distance * speedMult;
                         // set moving angle value
                         this.scrollingMap.movingangle = angle;
                    }
               }
          }
     }

	boundX(x) {
		if(x < this.width - this.scrollingMap.width / 2) {
  		x = this.width - this.scrollingMap.width / 2;
		} else if(x > this.scrollingMap.width / 2) {
  		x = this.scrollingMap.width / 2;
		}
	
	  return x;
	}

  boundY(y) {
    // keep map within boundaries
    if(y < this.height - this.scrollingMap.height / 2) {
      y = this.height - this.scrollingMap.height / 2;
    } else if(y > this.scrollingMap.height / 2) {
      y = this.scrollingMap.height / 2;
    }

		return y;
  }
}

