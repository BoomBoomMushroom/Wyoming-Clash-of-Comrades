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
    this.color = color
    this.isAttacking = false
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.dead = false
    this.onGround = false
    this.stunFrames = 0
    
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
    
    this.hasUltimate = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw()
    this.drawPercent()
    if (!this.dead){
        this.animateFrames()
      this.immunityFrames -= 1
      this.stunFrames -= 1
      

      this.cooldowns.Neutral_B -= 1
      this.cooldowns.Side_B -= 1
      this.cooldowns.Up_B -= 1
      this.cooldowns.Down_B -= 1
      this.cooldowns.Neutral_A -= 1
      this.cooldowns.Side_A -= 1
      this.cooldowns.LeftSide_A_air -= 1
      this.cooldowns.RightSide_A_air -= 1
      this.cooldowns.Down_A -= 1
      this.cooldowns.Up_A -= 1
    }

    // attack boxes
    if(this.facingRight){
      this.attackBox.position.x = this.position.x + this.attackBox.offsetRight.x
      this.attackBox.position.y = this.position.y + this.attackBox.offsetRight.y
    }
    else{
        this.attackBox.position.x = this.position.x + this.attackBox.offsetLeft.x
      this.attackBox.position.y = this.position.y + this.attackBox.offsetLeft.y
    }

        if(debug){
        // draw the attack box
      c.fillStyle = 'rgba(255, 255, 255, 0.15)'
      if(rectangularCollision({rectangle1: player,rectangle2: enemy})){
          c.fillStyle = 'rgba(255, 0, 0, 0.15)'
      }
          c.fillRect(
          this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
                this.attackBox.heightd
        )
      
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

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    
    // gravity function
    if (this.position.y + (this.height) + this.velocity.y >= floor) {
      this.velocity.y = 0
      this.position.y = floor - (this.height)
      this.onGround = true
    } else{
        this.velocity.y += gravity
      this.onGround = false
    }
  }

    gameLoopUpdates(){
      let keybinds = userKeys[this.playerIndex]
    let drag = .5
    let velX = this.velocity.x
    if(velX != 0){
        this.velocity.x += velX > 0 ? -drag : drag
    }
    let round = 10
    this.velocity.x = Math.floor(this.velocity.x*round)/round
    this.velocity.y = Math.floor(this.velocity.y*round)/round
    
    if(this.dead==false && this.stunFrames <= 0){
      // Keys
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
      if(this.velocity.x != 0){ this.switchSprite('run') }
      else{ this.switchSprite('idle') }

      if(keys[keybinds.Jump]){
        this.jump()
      }
      if (keys[keybinds.Ultimate] && this.hasUltimate) {
          this.hasUltimate = false
        this.attacks["Ultimate"](this.color, this)
      }
      if(keys[keybinds.A_Attack]){
        if(keys[keybinds.Right] && this.onGround==true && this.cooldowns.Side_A <= 0){
          this.cooldowns.Side_A = this.attacks["Side_A"]("Right")
        }
        else if(keys[keybinds.Left] && this.onGround==true && this.cooldowns.Side_A <= 0){
          this.cooldowns.Side_A = this.attacks["Side_A"]("Left")
        }
        else if(keys[keybinds.Right] && this.onGround==false && this.cooldowns.RightSide_A_air <= 0){
          this.cooldowns.RightSide_A_air = this.attacks["RightSide_A_air"]()
        }
        else if(keys[keybinds.Left] && this.onGround==false && this.cooldowns.LeftSide_A_air <= 0){
          this.cooldowns.LeftSide_A_air = this.attacks["LeftSide_A_air"]()
        }
        else if(keys[keybinds.Jump] && this.cooldowns.Up_A <= 0){
          this.cooldowns.Up_A = this.attacks["Up_A"](this.color, this)
        }
        else if(keys[keybinds.Shield] && this.cooldowns.Down_A <= 0){
          this.cooldowns.Down_A = this.attacks["Down_A"]()
        }
        else if(this.cooldowns.Neutral_A <= 0){
          this.cooldowns.Neutral_A = this.attacks["Neutral_A"]()
        }
      }
      if(keys[keybinds.B_Attack]){
        if(keys[keybinds.Right] && this.cooldowns.Side_B <= 0){
          this.cooldowns.Side_B = this.attacks["Side_B"]("Right")
        }
        else if(keys[keybinds.Left] && this.cooldowns.Side_B <= 0){
          this.cooldowns.Side_B = this.attacks["Side_B"]("Left")
        }
        else if(keys[keybinds.Jump] && this.cooldowns.Up_B <= 0){
          this.cooldowns.Up_B = this.attacks["Up_B"]()
        }
        else if(keys[keybinds.Shield] && this.cooldowns.Down_B <= 0){
          this.cooldowns.Down_B = this.attacks["Down_B"](this.color, this)
        }
        else if( this.cooldowns.Neutral_B <= 0) {
          this.cooldowns.Neutral_B = this.attacks["Neutral_B"]()
        }
      }
    }
    
    for(var i=0;i<entities.length;i++){
        let enemy = entities[i]
      if(enemy.color == this.color){continue}
      
      let atk = this.isAttacking && this.framesCurrent === 2
      if (rectangularCollision({rectangle1: this, rectangle2: enemy}) && atk) {
        enemy.takeHit(3, this.position)
        this.isAttacking = false
      }
    }
    
      if (this.velocity.y < 0) {
      this.switchSprite('jump')
    } else if (this.velocity.y > 0) {
      this.switchSprite('fall')
    }
    
    if (this.isAttacking && this.framesCurrent === 2) {
      this.isAttacking = false
    }
    
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
        if(emblem[i-1]=="white"){emblem[i-1]="rgba(0,0,0,0)"}
        c.fillStyle = emblem[i-1]
      c.fillRect(x1,y1, pSize,pSize)
      x1 += pSize
      if(i % 7 == 0){
          y1 += pSize
        x1 -= (pSize*7)
      }
    }
    
      c.fillStyle = this.color;
      c.font = "16px PressStart2P";
    
    let percent = this.damage/300
    let move = (percent * 14) + 7
      c.fillText(this.damage+"%",this.position.x+(this.width/4)-move,this.position.y-15);
  }

  attack() {
      if(this.isAttacking){return}
    
    this.switchSprite('attack1')
    this.isAttacking = true
  }
  
  jump(){
      if(this.onGround){
        this.velocity.y = -20 * canvasScale
    }
  }

  takeHit(dmg, src) {
      if(this.immunityFrames > 0){return}
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

    if (this.damage >= Infinity) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return
    
      
      if( this.image !== this.sprites[sprite].image ){
      this.image				 = this.sprites[sprite].image
      this.framesMax		 = this.sprites[sprite].framesMax
      this.framesCurrent = 0
      
      if( this.sprites[sprite].scale != null ){
          this.scale = this.sprites[sprite].scale
      }
      if(this.sprites[sprite].offset != null){
          this.offset = this.sprites[sprite].offset
      }
    }
    
    
  }
}