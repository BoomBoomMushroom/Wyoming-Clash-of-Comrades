// Custom Attacks (assignable)

// Colin Attacks
function binaryRain(count, dmg, summonerColor){
	for(var i=0;i<count;i++){
  	let x = randomInt(0, canvas.width)
  	//let y = randomInt(-100, -1500)
    let y = randomInt(-100, -(count*150))
    
		let e = new Sprite({
      position: {
        x: x,
        y: y
      },
      imageSrc: './sprites/attacks/binary_number.png',
      scale: canvasScale * 5,
      random: true,
      framesMax: 2,
      delUnder: {y: canvas.height, do: true},
    })
    damageSprites.push({
    	entity: e,
      dmg: dmg,
      color: summonerColor,
      vel: {x:0, y:gravity*10},
      uses: 1,
      
      pullUser: false,
      life: Infinity,
   })
  }
}

// Cooper Attacks
function CooperDownA_Grenade(color, user){
  let grenadeSprite = new Sprite({
    position: user.position,
    imageSrc: './sprites/cooper_stock_photos/grenade_pull_6frames.png',
    scale: canvasScale * 1,
    framesMax: 6,
    offset: {
      "x": 0,
      "y": 0
    }
  })
  sprites.push(grenadeSprite)

  let clearingId = setInterval(()=>{
    if(grenadeSprite.framesCurrent != grenadeSprite.framesMax-1) return
    sprites.splice( sprites.indexOf(grenadeSprite), 1)
    explosionCreate(color, {
      "x": user.position.x,
      "y": user.position.y - user.height/2,
    })
    clearInterval(clearingId)
  }, 1)

  return 20000
}

function CooperMilesMorales_NeutralA(color, user){
  for(var i=0; i<entities.length; i++){
    setEntityFrozenFrameAndImageSrc(
      1000 * 3,
      "./sprites/cooper_stock_photos/miles_morales_suprised.png",
      1,
      entities[i]
    )
    // 3 Seconds
  }
}

function CooperStickyHand_SideA(color, user){
  let spriteName = user.facingRight ? "right" : "left"

  let e = new Sprite({
    position: {
      "x": user.position.x,
      "y": user.position.y,
    },
    imageSrc: './sprites/cooper_stock_photos/sticky_hand_' +spriteName+ '.png',
    scale: canvasScale * 0.5,
    framesMax: 1,
  })
  e.width = 150
  e.height = 40
  let dmgSprite = {
    entity: e,
    dmg: 4,
    color: color,
    vel: {x:10 * (user.facingRight ? 1 : -1), y:0},
    uses: 1,
    
    //pullUser: true,
    life: 9000,
  }
  damageSprites.push(dmgSprite)

  let prevPosition = null
  let startUses = dmgSprite.uses+0
  let removeId = setInterval(()=>{
    prevPosition = dmgSprite.entity.position
    let outOfBounds = false
    if(prevPosition.x < 0){outOfBounds=true}
    if(prevPosition.x+e.width > canvas.width){outOfBounds=true}
    if(dmgSprite.uses == startUses && outOfBounds==false) return
    dmgSprite.life = -1
    clearInterval(removeId)
    let toTheRight = prevPosition.x-user.position.x > 0 ? true : false
    user.velocity.x = 15 * (toTheRight ? 1 : -1)
  }, 1);

  return 4000
}

function CooperPlane_UpA(color, user){
  setEntityFrozenFrameAndImageSrc(
    Infinity,
    "./sprites/cooper_stock_photos/plane_"+(user.facingRight ? "right" : "left")+".png",
    1,
    user
  )
  user.doGravity = false

  // Create bullet to track time
  let newProj = new Sprite({
    position: {
      x: -1000,
      y: -1000,
    },
    imageSrc: "./sprites/attacks/bullet.png",
    scale: canvasScale * 1,
    framesMax: 1,
  })
  let dmgSprite = {
    entity: newProj,
    color: "",
    vel: {"x":0,"y":0},
    dmg: 0,
    uses: -1,
    life: 5000
  }
  damageSprites.push(dmgSprite)

  let removeId = setInterval(()=>{
    let plrHitbox = user.generateHitBoxes(1)[0]
    for(let i=0;i<entities.length;i++){
      if(entities[i].color == user.color) continue
      if(user.hitBoxCollision(plrHitbox, entities[i].generateHitBoxes(1)[0])){
        entities[i].takeHit(randomInt(10, 50), user.position)
        user.damage += randomInt(2, 30)
        dmgSprite.life = -10
      }
    }

    user.image.src = "./sprites/cooper_stock_photos/plane_"+(user.facingRight ? "right" : "left")+".png"
    if(dmgSprite.life>0) return
    clearInterval(removeId)
    user.frozenSprite = 0
    user.doGravity = true
  },1)

  return 20_000
}

function CooperUpAndDown_PunchStockPhotoHand(summonerColor, user, dir){
  let e = new Sprite({
    position: {
      "x": user.position.x,
      "y": user.position.y,
    },
    imageSrc: './sprites/cooper_stock_photos/hand_grab_' +dir+ '.png',
    scale: canvasScale * 0.5,
    framesMax: 1,
  })
  damageSprites.push({
    entity: e,
    dmg: 4,
    color: summonerColor,
    vel: {x:0, y:10 * (dir=="down" ? 1 : -1)},
    uses: 1,
    
    //pullUser: true,
    life: 9000,
  })

  return 2000
}

function CooperSideB_LongPunch(summonerColor, user){
  let spriteName = user.facingRight ? "right" : "left"

  let e = new Sprite({
    position: {
      "x": user.position.x,
      "y": user.position.y,
    },
    imageSrc: './sprites/cooper_stock_photos/hand_grab_' +spriteName+ '.png',
    scale: canvasScale * 0.5,
    framesMax: 1,
  })
  damageSprites.push({
    entity: e,
    dmg: 4,
    color: summonerColor,
    vel: {x:10 * (user.facingRight ? 1 : -1), y:0},
    uses: 1,
    
    //pullUser: true,
    life: 9000,
  })

  return 2000
}



// Dillion Attacks
function spawnTurret(summonerColor, user){
	let maxTurrets = 1
  let usetTurretCount = 0
  for(var i=0;i<turrets.length;i++){
  	let turret = turrets[i]
    if(turret.summoner == user){ usetTurretCount += 1 }
  }
  if(usetTurretCount >= maxTurrets){ return 0 }

	let e = new Sprite({
    position: {
    	x: user.position.x,
      y: user.position.y,
    },
    imageSrc: './sprites/dillion_turrets/turret_right.png',
    scale: canvasScale * 3,
    framesMax: 1,
  })
  turrets.push({
  	entity: e,
    color: summonerColor,
    sprites: [
      "./sprites/dillion_turrets/turret_right_-45.png",
    	"./sprites/dillion_turrets/turret_right.png",
      "./sprites/dillion_turrets/turret_right_45.png",
      
      "./sprites/dillion_turrets/turret_left_-45.png",
    	"./sprites/dillion_turrets/turret_left.png",
      "./sprites/dillion_turrets/turret_left_45.png",
    ],
    summoner: user,
    bullet: "./sprites/attacks/bullet.png",
    life: 5000,
    // 1000 ~= 13sec
    // 5000 maybe 65sec
  })
  return 7000
}

function dillionSideA_AirDash(color, user, facingRight){
  user.velocity.x = 15 * (facingRight ? 1 : -1)
  return 2000
}

function dillionDownA_GroundPound(color, user){
  user.velocity.y = 15
  return 2000
}

function dillionSideB_GrappleDirection(color, user){
  let hitboxes = user.generateHitBoxes(3) // Mid Ranged attack
  let hitboxIndex = user.facingRight ? 4 : 3
  let hitbox = hitboxes[hitboxIndex]

  for(let i=0;i<entities.length;i++){
    let entityHitbox = entities[i].generateHitBoxes(1)[0]
    if(user.hitBoxCollision(hitbox, entityHitbox) == false) continue
    
    let isRightOfPlayer = entities[i].position.x - user.position.x < 0
    
    entities[i].velocity.x = 10 * (isRightOfPlayer ? 1 : -1)
  }

  return 2000
}

function dillionUpB_RecoverUp(color, user){
  user.velocity.y = -15
  return 2000
}

function dillionUpA_DestroyTurrets(color, user){
  // Check we we have a turret
  let turretCount = 0
  for(var i=0;i<turrets.length;i++){
    if(turrets[i] == null){ continue }
    if(turrets[i].summoner != user){ continue }
    turretCount++
  }
  if(turretCount <= 0) return
  
  // Destroy all your turrets
	explosionCreate(color, {
  	x: user.position.x - (user.width/2),
    y: user.position.y - (user.height/2)
  })
  user.takeHit(randomInt(1, 10), user.position)
  
  for(var i=0;i<turrets.length;i++){
  	if(turrets[i] == null){ continue }
		if(turrets[i].summoner != user){ continue }
  	let pos = {
    	x: turrets[i].entity.position.x - (turrets[i].entity.width/2),
      y: turrets[i].entity.position.y - (turrets[i].entity.height/2)
    }
  	explosionCreate(color, pos)
    turrets.splice(i, 1)
    i -= 1
  }
  return 3500
}

function spawnBlackhole(summonerColor, user){  
  let e = new Sprite({
    position: {
    	x: user.position.x,
      y: user.position.y,
    },
    imageSrc: './sprites/attacks/blackhole.png',
    scale: canvasScale * 0,
    framesMax: 9,
  })
  damageSprites.push({
  	entity: e,
    color: summonerColor,
    vel: {x:0,y:0},
   	pullUser: true,
    
    dmgDist: 1,
    dmg: 3,
    scaleTo: 5,
    scaleFrom: 0,
    life: 5000, // 5 seconds?
    uses: Infinity,
  })
}





// Misc help functions

function explosionCreate(summonerColor, position){
  let e = new Sprite({
    position: position,
    imageSrc: './sprites/attacks/explosion.png',
    scale: canvasScale * 7,
    framesMax: 7,
  })

  e.width = 135
  e.height = 135

  damageSprites.push({
    entity: e,
    dmg: randomInt(20, 45),
    color: summonerColor,
    uses: 1,
    life: 500,
 })
}

function setEntityFrozenFrameAndImageSrc(frozenFrameCount, imageSrc, imageMaxFrames, entity){
  let tempImage = new Image()
  tempImage.src = imageSrc

  entity.frozenSprite = frozenFrameCount
  entity.image = tempImage
  entity.framesMax = imageMaxFrames
}