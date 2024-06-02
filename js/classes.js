//// Sprite definiton
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, framesHold = 7, offset = {x: 0, y: 0} }) {
        this.position = position
        //this.height = 150
        //this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameWidth = (this.image.width / this.framesMax) // image width division by amount of frames
        this.framesCurrent = 0 // could just be defined here (e.g. = 0) without passing through an argument (even with default value), but because this class is being used by the Fighter class, it has to be explicitely passed through as an argument
        this.framesElapsed = 0
        this.framesHold = framesHold // sets the 'speed' of transition to next frame (because we are using modulo division later on)
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image, 
            // image crop (simulate animation by using different 'frames')
            (this.framesCurrent * this.frameWidth), // 0 ; starting x position of the crop // this.framesMax == 1 ? 0 : (this.framesCurrent * this.frameWidth)
            0, // starting y position of the crop
            this.frameWidth, // crop width = division by amount of frames
            this.image.height, // crop height
            // end image crop
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.frameWidth) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            //this.framesMax > 1 && this.framesCurrent < this.framesMax ? this.framesCurrent++ : this.framesCurrent = 0
            if (this.framesCurrent < this.framesMax - 1) { // framesMax - 1 to counter the background (avoid x position change for crop)
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
            //console.log('Frame: ' + this.framesCurrent + ' | Max frames: ' + this.framesMax)
        }
    }
    
    update() {
        this.draw()
        console.log(this.dead)
        if (!this.dead) this.animateFrames()
    }
}

//// Fighter definiton (extending the Sprite, basically inheriting any methods defined there)
class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, 
        color = 'red', 
        health = HealthBarWidth, 
        enemy = false, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        framesHold = 7, 
        offset = {x: 0, y: 0}, 
        sprites, 
        attackBox = {offset: {}, width: undefined, height: undefined} 
    }) {
        super({ // list the properties we want to set in the parent
            position,
            imageSrc,
            scale,
            framesMax,
            framesHold,
            offset
        })

        //this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.enemy = enemy
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            //position: this.position,
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.health = 100
        this.isAttacking
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    /* OLD draw method used before using sprite images
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        // attackbox
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }
    */

    update() {
        //if (this.health > 0) {
            this.draw()
            if (!this.dead) this.animateFrames()

            // attack box
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y
            
            // draw the attack box
            //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

            //this.velocity.y += gravity
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x

            // gravity function
            if (this.position.y + this.height + this.velocity.y >= (canvas.height-73)) {
                this.velocity.y = 0
                this.position.y = 353
            } else this.velocity.y += gravity

            if (this.position.x + this.width + this.velocity.x >= canvas.width) {
                this.velocity.x = 0
            } 
        //}
    }

    attack() {
        //console.log('Player attack')
        if (this.health > 0) {
            this.switchSprite('attack1')
            this.isAttacking = true
            //setTimeout(() => {
                //this.isAttacking = false
                player.color = 'red'
                enemy.color = 'blue'
                //enemy ? player.color = 'red' : enemy.color = 'blue'
            //}, 100)
        }
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('death')
            //this.dead = true
        } else this.switchSprite('takeHit')
    }

    switchSprite(sprite) {
        //make sure the death animation can fully occur and does not get cut off (= override all other animations)
        //end game for the 'loser'
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) 
                this.dead = true
            return
        }

        //make sure the attack animation can fully occur and does not get cut off (= override all other animations)
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

        //make sure the 'take hit' animation can fully occur and does not get cut off (= override all other animations)
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.idle.framesHold
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.framesCurrent = 0
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.run.framesHold
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.jump.framesHold
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.jump.framesHold
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.attack1.framesHold
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.attack1.framesHold
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                    //this.framesHold = this.sprites.attack1.framesHold
                }
                break
        }
    }
}