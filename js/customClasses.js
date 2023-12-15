class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    size = {},
    random = false,
    delUnder = {do: false, y: 1000}
  }) {
    this.position = position
    this.image = new Image()
    this.image.src = imageSrc
    this.width = 50
    this.height = 150
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
    
    this.random = random
    this.delUnder = delUnder
  }
  
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
      this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
        if(this.random){
        this.framesHold = randomInt(5, 50)
      }
    
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Item extends Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    name,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    })
    
    this.width = 50
    this.height = 150
    this.lastKey
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    
    this.pickedUp = false
        this.name = name || "Coin"

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw()

        if(debug){
      for(var i=0;i<entities.length;i++){
        var entity = entities[i]
        //if(rectangularCollision({rectangle1: this,rectangle2: entity}) && entity.isPlayer){
              // idk destroy
          //}
      }
      
      // draw hitbox
      c.fillStyle = 'rgba(0, 255, 0, 0.15)'
      
      c.beginPath();
      c.moveTo(this.position.x, this.position.y);
      c.lineTo(this.position.x + this.width, this.position.y);
      c.lineTo(this.position.x + this.width, this.position.y+this.height);
      c.lineTo(this.position.x, this.position.y+this.height);
      c.lineTo(this.position.x, this.position.y);
      c.stroke();
    }
    
    // gravity function
    if (this.position.y + (this.height * canvasScale) + gravity >= floor) {
      this.position.y = floor - (this.height * canvasScale)
      this.onGround = true
    } else{
        this.position.y += gravity
      this.onGround = false
    }
  }
}

class Fighter extends Sprite {
  constructor({
    playerIndex = 0,
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
        offsetRight: {
        x: 100 * canvasScale,
        y: 50 * canvasScale
      },
      offsetLeft: {
        x: -170 * canvasScale,
        y: 50 * canvasScale
      },
      width: undefined,
      height: undefined
    },
    
    facingRight = true,
    characterName = "Player",
    attacks = {
      "Neutral_B": ()=>{},
      "Side_B": ()=>{},
      "Up_B": ()=>{},
      "Down_B": ()=>{},

      "Neutral_A": ()=>{},
      "Side_A": ()=>{},
      "LeftSide_A_air": ()=>{},
      "RightSide_A_air": ()=>{},
      "Down_A": ()=>{},
      "Up_A": ()=>{},
      
      "Ultimate": ()=>{},
    }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })

    this.playerIndex = playerIndex
    
    this.velocity = velocity
    this.width = 50
    this.height = 90
    /* Attack Box - if I need it later?
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offsetRight: attackBox.offsetRight,
      offsetLeft: attackBox.offsetLeft,
      width: attackBox.width,
      height: attackBox.height
    }
    */
    this.color = color
    this.isAttacking = false
    this.attackRunTime = 0
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.dead = false
    this.onGround = false
    this.stunFrames = 0
    this.frozenSprite = 0
    
    this.doGravity = true

    this.critChance = 0.01 // <-- 1% chance
    this.attackDamage = 1

    this.facingRight = facingRight
    this.damage = 0
    this.immunityFrames = 0
    this.character = characterName
    this.attacks = attacks
    this.cooldowns = {
      "Neutral_B": 0,
      "Side_B": 0,
      "Up_B": 0,
      "Down_B": 0,

      "Neutral_A": 0,
      "Side_A": 0,
      "LeftSide_A_air": 0,
      "RightSide_A_air": 0,
      "Down_A": 0,
      "Up_A": 0,
      
      "Ultimate": 0,
    }
    
    this.ultimateCharge = 0
    this.lastMove = ""    
    /*
      last moves can be:
      neutral_b
      side_b
      up_b
      down_b

      neutral_a
      side_a
      LeftSide_A_air
      RightSide_A_air
      down_a
      up_a

      ultimate
    */

    /*
    Short range is 1
    Mid range is 1.5
    Long range is 2
    */

    for (const sprite in this.sprites) {

      if(sprites[sprite].imageSrc != null){
        sprites[sprite].image = new Image()
        sprites[sprite].image.src = sprites[sprite].imageSrc
        continue
      }
      
      if(typeof(sprites[sprite].right) == "object") continue

      let rightSrc = sprites[sprite].right + ""
      sprites[sprite].right = new Image()
      sprites[sprite].right.src = rightSrc

      let leftSrc = sprites[sprite].left + ""
      sprites[sprite].left = new Image()
      sprites[sprite].left.src = leftSrc
    }
  }

  update(deltaTimeMS) {
    if(this.dead) return

    this.draw()
    this.drawPercent()
    if (!this.dead){
      this.animateFrames()
      this.immunityFrames -= 1
      this.stunFrames -= 1
      this.frozenSprite -= deltaTimeMS
      
      this.attackRunTime -= deltaTimeMS / 1000
      this.isAttacking = this.attackRunTime > 0

      let attkCooldownKeys = Object.keys(this.cooldowns)
      for(let i=0;i<attkCooldownKeys.length;i++){
        this.cooldowns[attkCooldownKeys[i]] -= deltaTimeMS
        if(isNaN(this.cooldowns[attkCooldownKeys[i]])) this.cooldowns[attkCooldownKeys[i]] = 0
      }
    }


    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    
    // This threshold won't allow players to fly out of the world
    // unless their are damaged beyond this threshold
    const damageThreshhold = 110

    if(this.damage <= damageThreshhold){
      
      if(this.position.y < 0){ this.velocity.y *= -1 }
      if(this.position.x < 0){
        this.velocity.x = 5
        if(this.velocity.x <= 0) this.velocity.x = 10
      }

      if(this.position.x > canvas.width-this.width){
        this.velocity.x = -1 * Math.abs(this.velocity.x)
        if(this.velocity.x <= 0) this.velocity.x = -10
      }
    }

    // gravity function
    if (this.position.y + (this.height) + this.velocity.y >= floor) {
      this.velocity.y = 0
      this.position.y = floor - (this.height)
      this.onGround = true
    } else if(this.doGravity){
      this.velocity.y += gravity
      // let's only set this to false when we do jump
      //this.onGround = false
    }


    // Only debug from here and on!
    if(debug == false) return
    
    //this.rotationDegrees = this.damage

    // draw the attack box

    let [ hitbox, hitboxUp, hitboxDown, hitboxLeft, hitboxRight ] = this.generateHitBoxes(1)

    let bodyHitBoxColor = this.isAttacking
      ? 'rgba(255, 0, 0, 0.5)'
      : 'rgba(255, 255, 255, 0.15)'

    this.drawHitbox(hitbox, bodyHitBoxColor)
    this.drawHitbox(hitboxUp, 'rgba(0, 255, 0, 0.15)')
    this.drawHitbox(hitboxDown, 'rgba(255, 255, 0, 0.15)')
    this.drawHitbox(hitboxLeft, 'rgba(255, 0, 0, 0.15)')
    this.drawHitbox(hitboxRight, 'rgba(0, 0, 255, 0.15)')

    /* Old Hitbox Drawing method
    this.drawHitbox(this.attackBox, 'rgba(255, 255, 255, 0.15)')
    */
    
    // draw player's hitbox
    c.fillStyle = 'rgba(0, 255, 0, 0.15)'
    
    c.beginPath();
    c.moveTo(this.position.x, this.position.y);
    c.lineTo(this.position.x + this.width, this.position.y);
    c.lineTo(this.position.x + this.width, this.position.y+this.height);
    c.lineTo(this.position.x, this.position.y+this.height);
    c.lineTo(this.position.x, this.position.y);
    c.stroke();
  }

  gameLoopUpdates(entities){

    this.handleVelocity()
    if(this.dead || this.stunFrames > 0) return
    
    if(this.isAttacking == false){
      let keybinds = userKeys[this.playerIndex]
      this.handleInputMovement(keybinds)
      this.handleInputs(keybinds)
    }
    else{
      this.handleAttack(entities)
    }

    if(this.frozenSprite < 0) this.determineAndUpdateSprite()
    
  }

  handleVelocity(){
    let drag = .5
    let velX = this.velocity.x
    let velY = this.velocity.y
    if(velX != 0){
      this.velocity.x += velX > 0 ? -drag : drag
    }
    if(velY != 0 && this.doGravity==false){
      this.velocity.y += velY > 0 ? -drag : drag
    }

    let round = 10
    this.velocity.x = Math.floor(this.velocity.x*round)/round
    this.velocity.y = Math.floor(this.velocity.y*round)/round
  }

  drawPercent(){
    let emblem = [
        "black", "black", 	 "black", 		"black", 		"black",		 "black",    "black",
      "black", this.color, this.color,  this.color, this.color,  this.color, "black",
      "white", "black",    this.color,  this.color, this.color,  "black",		 "white",
      "white", "black",    this.color,  this.color, this.color,  "black",		 "white",
      "white", "white",    "black",     this.color, "black",     "white",		 "white",
            "white", "white",    "white",     "black",    "white",     "white",		 "white",
    ]
      
    let x1 = this.position.x+(this.width/4)
    let y1 = this.position.y-10
    let pSize = 2.5
    for(let i=1;i<emblem.length+1;i++){
      if(emblem[i-1]=="white") emblem[i-1]="rgba(0,0,0,0)"
      c.fillStyle = emblem[i-1]
      c.fillRect(x1,y1, pSize,pSize)
      x1 += pSize
      if(i % 7 == 0){
        y1 += pSize
        x1 -= (pSize*7)
      }
    }
    
    //c.fillStyle = this.color;
    //c.font = "16px PressStart2P";
    
    let percent = this.damage/300
    let move = (percent * 14) + 7
    //c.fillText(this.damage+"%",this.position.x+(this.width/4)-move,this.position.y-15);
    this.drawText(this.color, "16px PressStart2P", this.damage+"%", {"x": this.position.x+(this.width/4)-move, "y":this.position.y-15})
  }

  drawText(color, font, text, position){
    c.fillStyle = color
    c.font = font
    c.fillText(text, position.x, position.y)
  }

  drawHitbox(hitboxData, color) {
    c.fillStyle = color
    /*
    if(rectangularCollision({rectangle1: player,rectangle2: enemy})){
      c.fillStyle = 'rgba(255, 0, 0, 0.15)'
    }
    */
    c.fillRect(
      hitboxData.position.x,
      hitboxData.position.y,
      hitboxData.width,
      hitboxData.height
    )
  }

  generateHitBoxes(range) {
    if(range == null) range = 1

    let hitbox = {
      "position": {
        "x": this.position.x,
        "y": this.position.y,
      },
      "width": this.width,
      "height": this.height,
    }
    let hitboxUp = {
      "position": {
        "x": this.position.x,
        "y": this.position.y - (this.height * range),
      },
      "width": this.width,
      "height": this.height * range,
    }
    let hitboxDown = {
      "position": {
        "x": this.position.x,
        "y": this.position.y + this.height,
      },
      "width": this.width,
      "height": this.height * range,
    }
    let hitboxLeft = {
      "position": {
        "x": this.position.x - (this.width * range),
        "y": this.position.y,
      },
      "width": this.width * range,
      "height": this.height,
    }
    let hitboxRight = {
      "position": {
        "x": this.position.x + this.width,
        "y": this.position.y,
      },
      "width": this.width * range,
      "height": this.height,
    }

    return [hitbox, hitboxUp, hitboxDown, hitboxLeft, hitboxRight]
  }

  getAttackHitbox(range) {
    if(range == null){range = 1}

    let underscoreSplit = this.lastMove.split("_")

    let [ hitbox, hitboxUp, hitboxDown, hitboxLeft, hitboxRight ] = this.generateHitBoxes(range)

    if(underscoreSplit[0] == "neutral" || underscoreSplit[0] == "side"){
      return this.facingRight ? hitboxRight : hitboxLeft
    }
    else if(underscoreSplit[0] == "up" || underscoreSplit[0] == "down"){
      return underscoreSplit[0] == "up" ? hitboxUp : hitboxDown
    }
    else if(underscoreSplit[0] == "LeftSide"){
      return hitboxLeft
    }
    else if(underscoreSplit[0] == "RightSide"){
      return hitboxRight
    }
    return null
  }

  hitBoxCollision(rect1, rect2) {
    // mainly copied from `https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection`
    return (
      rect1.position.x < rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width      > rect2.position.x &&
      rect1.position.y < rect2.position.y + rect2.height &&
      rect1.position.y + rect1.height     > rect2.position.y
    )
  }

  handleAttack(entities) {
    if(this.isAttacking == false) return
    let attackingHitbox = this.getAttackHitbox(1)

    for(var i=0; i<entities.length; i++){
      let entityHitbox = entities[i].generateHitBoxes()[0]
      let collision = this.hitBoxCollision(attackingHitbox, entityHitbox)
      if(collision == false) continue

      this.ultimateCharge += this.attackDamage
      document.getElementById("consoleEmpty").innerText = this.ultimateCharge
      entities[i].takeHit(this.attackDamage, this.position)
      console.log(collision, "Collision!")
    }
    this.isAttacking = false

    //console.log(attackDirection)
  }
  
  jump(){
    if(this.onGround == false) return
    this.velocity.y = -20 * canvasScale
    this.onGround = false
  }

  deathAnimation() {
    if(this.dead) return

    let position = {
      x: canvasCenter.x - 40,
      y: canvas.height * 0.1,
    }

    let plrSprite = new Sprite({
      position: position,
      imageSrc: this.image.src,
      scale: this.scale,
      framesMax: this.maxFrames,
      offset: this.offset,
    })
    sprites.push(plrSprite)

    let xSprite = new Sprite({
      position: position,
      imageSrc: './sprites/general_sprites/x_elimination.png',
      scale: canvasScale * 1,
      framesMax: 30,
      offset: {
        "x": 15,
        "y": -15
      }
    })
    sprites.push(xSprite)

    let clearingId = setInterval(()=>{
      if(xSprite.framesCurrent != xSprite.framesMax-1) return
      
      let indexA = sprites.indexOf(xSprite)
      let indexB = sprites.indexOf(plrSprite)
      sprites.splice(indexA, 1)
      sprites.splice(indexB, 1)

      clearInterval(clearingId)
    }, 1)
  }

  killPlayer(reason){
    this.deathAnimation()
    this.dead = true
    this.deathReason = reason
  }

  takeHit(dmg, src) {
    if(this.immunityFrames > 0) return
    if(Math.random() <= this.critChance) dmg += randomInt(1, 10)
    
    this.damage += dmg
    this.immunityFrames = 5
    
    let dampen = 4.25
    if(this.position.x > src.x){
      this.velocity.x += (this.damage/dampen)
      this.velocity.y -= 3
    }
    else{
      this.velocity.x -= (this.damage/dampen)
      this.velocity.y -= 3
    }
  }

  handleInputMovement(keybinds){
    let hasMoved = false
    let speed = 5 * canvasScale
    
    if (keys[keybinds.Left] && this.velocity.x > -speed) {
      this.velocity.x += -speed
      hasMoved = true
      this.facingRight = false
    }
    if (keys[keybinds.Right] && this.velocity.x < speed ) {
      this.velocity.x += speed
      hasMoved = true
      this.facingRight = true
    }

    if(keys[keybinds.Jump]){
      if(this.doGravity) this.jump()
      else{ this.velocity.y -= speed/3 }
    }
    if(keys[keybinds.Shield] && this.doGravity==false){
      this.velocity.y += speed/3
    }
  }

  setCooldown(attack, attackData){
    if(attackData == null) attackData = 400
    console.log(attackData, attack)
    
    this.cooldowns[attack] = attackData
  }

  handleInputs(keybinds){
    let didAttack = false
    
    if (keys[keybinds.Ultimate] && this.ultimateCharge>=100) {
      this.ultimateCharge = 0
      this.attacks["Ultimate"](this.color, this)
      this.lastMove = "ultimate"
      didAttack = true
    }
    if(keys[keybinds.A_Attack]){
      if(keys[keybinds.Right] && this.onGround==true && this.cooldowns.Side_A <= 0){
        this.setCooldown("Side_A", this.attacks["Side_A"](this.color, this))
        this.lastMove = "side_a"
        didAttack = true
      }
      else if(keys[keybinds.Left] && this.onGround==true && this.cooldowns.Side_A <= 0){
        this.setCooldown("Side_A", this.attacks["Side_A"](this.color, this))
        this.lastMove = "side_a"
        didAttack = true
      }
      else if(keys[keybinds.Right] && this.onGround==false && this.cooldowns.RightSide_A_air <= 0){
        this.setCooldown("RightSide_A_air", this.attacks["RightSide_A_air"](this.color, this))
        this.lastMove = "RightSide_A_air"
        didAttack = true
      }
      else if(keys[keybinds.Left] && this.onGround==false && this.cooldowns.LeftSide_A_air <= 0){
        this.setCooldown("LeftSide_A_air", this.attacks["LeftSide_A_air"](this.color, this))
        this.lastMove = "LeftSide_A_air"
        didAttack = true
      }
      else if(keys[keybinds.Jump] && this.cooldowns.Up_A <= 0){
        this.setCooldown("Up_A", this.attacks["Up_A"](this.color, this))
        this.lastMove = "up_a"
        didAttack = true
      }
      else if(keys[keybinds.Shield] && this.cooldowns.Down_A <= 0){
        this.setCooldown("Down_A", this.attacks["Down_A"](this.color, this))
        this.lastMove = "down_a"
        didAttack = true
      }
      else if(this.cooldowns.Neutral_A <= 0){
        this.setCooldown("Neutral_A", this.attacks["Neutral_A"](this.color, this))
        this.lastMove = "neutral_a"
        didAttack = true
      }
    }
    if(keys[keybinds.B_Attack]){
      if(keys[keybinds.Right] && this.cooldowns.Side_B <= 0){
        this.setCooldown("Side_B", this.attacks["Side_B"](this.color, this))
        this.lastMove = "side_b"
        didAttack = true
      }
      else if(keys[keybinds.Left] && this.cooldowns.Side_B <= 0){
        this.setCooldown("Side_B", this.attacks["Side_B"](this.color, this))
        this.lastMove = "side_b"
        didAttack = true
      }
      else if(keys[keybinds.Jump] && this.cooldowns.Up_B <= 0){
        this.setCooldown("Up_B", this.attacks["Up_B"](this.color, this))
        this.lastMove = "up_b"
        didAttack = true
      }
      else if(keys[keybinds.Shield] && this.cooldowns.Down_B <= 0){
        this.setCooldown("Down_B", this.attacks["Down_B"](this.color, this))
        this.lastMove = "down_b"
        didAttack = true
      }
      else if( this.cooldowns.Neutral_B <= 0) {
        this.setCooldown("Neutral_B", this.attacks["Neutral_B"](this.color, this))
        this.lastMove = "neutral_b"
        didAttack = true
      }
    }

    if(didAttack == false) return
    this.isAttacking = true
    this.attackRunTime = 0.05
  }

  determineAndUpdateSprite(){
    let attacking = this.isAttacking
    let facing = this.facingRight ? "right" : "left"
    let maxFramesFacing = this.facingRight ? "framesMaxRight" : "framesMaxLeft"
    
    if(this.dead) return this.setSprite(this.sprites['death'][facing], this.sprites['death'][maxFramesFacing])
    
    if(attacking == false){
      if(this.velocity.y != 0){ this.setSprite(this.sprites['jump'][facing], this.sprites['jump'][maxFramesFacing]) }
      else if(this.velocity.x != 0){ this.setSprite(this.sprites['walk'][facing], this.sprites['walk'][maxFramesFacing]) }
      else{ this.setSprite(this.sprites['idle'][facing], this.sprites['idle'][maxFramesFacing]) }
      return
    }

    this.setSprite(this.sprites[this.lastMove][facing], this.sprites[this.lastMove][maxFramesFacing])
  }

  setSprite(spriteImage, maxFrames){
    if(this.image == spriteImage) return

    this.image = spriteImage
    this.framesMax = maxFrames
    this.framesCurrent = 0
  }

}