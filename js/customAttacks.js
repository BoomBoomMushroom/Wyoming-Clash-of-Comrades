// Custom Attacks (assignable)
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
      imageSrc: './sprites/binary_number.png',
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
function spawnBlackhole(summonerColor, user){  
  let e = new Sprite({
    position: {
    	x: user.position.x,
      y: user.position.y,
    },
    imageSrc: './sprites/blackhole.png',
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
    life: 250, // 5 seconds?
    uses: Infinity,
  })
}
function spawnTurret(summonerColor, user){
	let usetTurretCount = 0
  for(var i=0;i<turrets.length;i++){
  	let turret = turrets[i]
    if(turret.summoner == user){ usetTurretCount += 1 }
  }
  if(usetTurretCount >= 3){ return 0 }

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
  return 30
}
function explosionCreate(summonerColor, position){
  let e = new Sprite({
    position: position,
    imageSrc: './sprites/attacks/explosion.png',
    scale: canvasScale * 7,
    framesMax: 7,
  })
  damageSprites.push({
    entity: e,
    dmg: randomInt(20, 45),
    color: summonerColor,
    uses: 1,
    life: 30,
 })
}
function dillionUpA(color, user){
	explosionCreate(color, {
  	x: user.position.x - (user.width/2),
    y: user.position.y - (user.height/2)
  })
  for(var i=0;i<turrets.length;i++){
  	if(turrets[i] == null){ continue }
		if(turrets[i].summoner != user){ return }
  	let pos = {
    	x: turrets[i].entity.position.x - (turrets[i].entity.width/2),
      y: turrets[i].entity.position.y - (turrets[i].entity.height/2)
    }
  	explosionCreate(color, pos)
    turrets.splice(i, 1)
    i -= 1
  }
  return 300
}