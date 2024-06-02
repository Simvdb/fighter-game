// LAST updated: 2024-06-01 21:13
    // Video time: 3:51:56

// PREVIOUS updated: 2024-05-26 22:41
    // Video time: 3:35:33
// Link: https://www.youtube.com/watch?v=vyqbNFMDRGQ

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

 // Make canvas stand out from the browser background
 // Default fillRect color = black
 c.fillRect(0, 0, canvas.width, canvas.height)

 //TEST: Health & hits
 const HealthBarWidth = 430

 var enemyHits = 0
 var playerHits = 0

 const gravity = 0.7

 //// Create a backgound 'sprite' that can draw a backgound image
 // Use background image instead of fill color
 const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
 })

 //// Create a shop 'sprite' that can draw a shop image/animation
 const shop = new Sprite({
    position: {
        x: 750,
        y: 310
    },
    imageSrc: './img/shop.png',
    scale: 1.5,
    framesMax: 6,
    framesHold: 7
 })

 //// Create a Lizzy 'sprite' that can draw a Lizzy image/animation (WIN)
 const lizzyWin = new Sprite({
    position: {
        x: 4, // 13 if not nordic splash with left 'stick'
        y: 280
    },
    imageSrc: './img/lizzy_animation_nordic_splash.png',
    scale: 1.2,
    framesMax: 6,
    framesHold: 10
 })

  //// Create a Lizzy 'sprite' that can draw a Lizzy image/animation (LOSE)
  const lizzyLose = new Sprite({
    position: {
        x: 4, // 13 if not nordic splash with left 'stick'
        y: 280
    },
    imageSrc: './img/lizzy_animation_nordic_poop_splash.png',
    scale: 1.2,
    framesMax: 6,
    framesHold: 10
 })

 //// Create a Player (as an instance of the Fighter)
 const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    //framesHold: 8,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            //scale: 2.5,
            framesMax: 8,
            image: new Image()
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            //scale: 2.5,
            framesMax: 8,
            //image: new Image()
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            //scale: 2.5,
            framesMax: 2,
            //framesHold: 8,
            //image: new Image()
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            //scale: 2.5,
            framesMax: 2,
            //framesHold: 8,
            //image: new Image()
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            //scale: 2.5,
            framesMax: 6,
            //framesHold: 8,
            //image: new Image()
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            //scale: 2.5,
            framesMax: 4,
            //framesHold: 8,
            //image: new Image()
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            //scale: 2.5,
            framesMax: 6,
            //framesHold: 8,
            //image: new Image()
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
 })

 //// Create an Enemy (as an instance of the Fighter)
 const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0, // 2?
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    enemy: true,
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    framesHold: 10,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            //scale: 2.5,
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            //scale: 2.5,
            framesMax: 8,
            //image: new Image()
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            //scale: 2.5,
            framesMax: 2,
            //framesHold: 8,
            //image: new Image()
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            //scale: 2.5,
            framesMax: 2,
            //framesHold: 8,
            //image: new Image()
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            //scale: 2.5,
            framesMax: 4,
            //framesHold: 8,
            //image: new Image()
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            //scale: 2.5,
            framesMax: 3,
            //framesHold: 8,
            //image: new Image()
        },
        death: {
            imageSrc: './img/kenji/Death_2.png',
            //scale: 2.5,
            framesMax: 7,
            //framesHold: 8,
            //image: new Image()
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
 })

 /*
 // TEST: "update" the enemy 3 times, with a delay of 2 seonds every time
 const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

 enemy.draw()

 async function slowlyGrowEnemy() {
    for(let i = 1; i<= 3; i++) {
        await sleep(2000)
        enemy.update()
        //setTimeout(() => enemy.update(), 1000)
        //enemy.update()
        console.log('for loop enemy: ' + i)
        console.log('Round ${i}')
        //console.log('#${i}')
     }
 }

 slowlyGrowEnemy()
 */

 console.log(player)

 const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
    ,
    ArrowUp: {
        pressed: false
    }
 }

 //countDown()
 setTimeout(countDown(), 1000) 

 //// Animate function, creating a loop by calling on itself (will continue until stopped)
 function animate() {
    window.requestAnimationFrame(animate)
    // Counter the 'paintlike' effect, to make sure it looks like an actual Sprite movement
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // draw background & shop
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    //lizzy.update()

    // draw and "move" the 'Sprites'
    if (timer > 0) {
        //if (player.health > 0 && enemy.health > 0) {
            player.update()
            enemy.update()
        //} else if (player.health > 0 && enemy.health <= 0) {
        //    player.update()
        //} else if (player.health <= 0 && enemy.health > 0) {
        //:    enemy.update()
        //}
    }
    
    player.velocity.x = 0
    //player.velocity.y = 0
    enemy.velocity.x = 0

    // Player movement
    if (keys.q.pressed && player.lastKey == 'q') {
        player.velocity.x = -5
        player.switchSprite('run') // switch to running image (= frames)
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5
        player.switchSprite('run') // switch to running image (= frames)
    } else if (keys.z.pressed && player.lastKey == 'z') {
        player.velocity.y = -50
        //player.image = player.sprites.jump.image
    } else {
        player.switchSprite('idle') // default to idle image (= frames)
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump') // switch to jumping image (= frames)
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall') // switch to jumping image (= frames)
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run') // switch to running image (= frames)
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.image = enemy.sprites.run.image
    } else if (keys.ArrowUp.pressed && enemy.lastKey == 'ArrowUp') {
        enemy.velocity.y = -50
    } else {
        enemy.switchSprite('idle') // default to idle image (= frames)
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump') // switch to jumping image (= frames)
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall') // switch to jumping image (= frames)
    }
 
    // Detect Player hit (collision player attackbox with enemy)
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === player.framesMax - 2
    ) {
        enemy.takeHit()
        player.isAttacking = false
        //player.isAttacking = false
        //enemy.color = (enemyHits < 10 ? 'yellow' : 'blue')
        //enemy.health -= 20
        // Old way of 'updating' the health bar
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        // New way (using gsap)
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
        
        //player.switchSprite('attack1')

        //enemyHits += (enemyHits <= 9 ? 1 : 0)
        //enemyHits += 1
        //enemy.health = HealthBarWidth - (HealthBarWidth / 10) * enemyHits
        //healthbar(true, true)
    } 

    // if player misses
    if (player.isAttacking && player.framesCurrent === player.framesMax - 2) {
        player.isAttacking = false
    }

    // Detect Enemy hit (collision enemy attackbox with player)
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === enemy.framesMax - 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        //player.switchSprite('hit') // switch to hit image (= frames)
        //player.color = (playerHits < 10 ? 'yellow' : 'red')
        //player.health -= 20
         // Old way of 'updating' the health bar
        //document.querySelector('#playerHealth').style.width = player.health + '%'
        // New way (using gsap)
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
        
        //playerHits += (playerHits <= 9 ? 1 : 0)
        //enemyHits += 1
        //player.health = HealthBarWidth - (HealthBarWidth / 10) * playerHits
        //healthbar(true, true)
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === enemy.framesMax - 2) {
        enemy.isAttacking = false
    }
    
    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
 }

 //// Call the animate function containing the player update which will in term call upon the draw method
 animate()

 //// Key pressed
 // Define what happens when a certain key gets pressed
 // Mainly this will influence certain behaviour defined within the animate function
 window.addEventListener('keydown', (event) => {
    //console.log(event.key)
    // Player (if not beaten by enemy)
    if (!player.dead) {
        switch (event.key) {
            // Player
            case 'q':
                keys.q.pressed = true
                player.lastKey = 'q'
                break
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'z':
                if (player.position.y >= 300) {
                    player.velocity.y = -20
                }
                break  
            case ' ':
                player.attack()
                break
        }
    }

    //Enemy (if not beaten by player)
    if (!enemy.dead) {
        switch (event.key) {
            //Enemy    
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowUp':
                if (enemy.position.y >= 300) {
                    enemy.velocity.y = -20
                }
                break
            case 'Control':
                enemy.attack()
                break
        }
    }
 })

 //// Key released actions
 window.addEventListener('keyup', (event) => {
    //console.log(event.key)
    switch (event.key) {
        //Player
        case 'q':
            keys.q.pressed = false
            //player.image = player.sprites.idle.image
            break
        case 'd':
            keys.d.pressed = false
            //player.image = player.sprites.idle.image
            break
        case 'z':
            keys.z.pressed = false
            break

        // Enemy
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            //enemy.image = enemy.sprites.idle.image
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            //enemy.image = enemy.sprites.idle.image
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
 })