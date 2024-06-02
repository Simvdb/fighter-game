//// Detect collision between attackbox and opponent
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
 }

 // Determine the winner of the game (also before automatic game over (= timer ran out))
 function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player Wins!'
        lizzyWin.update()
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins!'
        lizzyLose.update()
    }
 }

 //// Control the timer (= countdown to automatic game over)
 let timer = 20
 let timerId
 function countDown() {
    if (timer > 0) {
        timerId = setTimeout(countDown, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
        //document.querySelector('#timer').textContent = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId})          
    } 
 }