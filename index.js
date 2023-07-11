// https://github.com/chriscourses/fighting-game
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const canvasScale = 0.6
canvas.width = 1024 * canvasScale
canvas.height = 576 * canvasScale
var floor = canvas.height - (96 * canvasScale)

var debug = true
const userKeys = [
	{ // Player 1 (WASD)
  	"Right": "d",
    "Left": "a",
    "Jump": "w",
    "Shield": "s",
    "B_Attack": "q",
    "A_Attack": "e",
    "Up": "w",
    "Pause": ' ',
    "Ultimate": 'z'
  },
  { // Player 2 (UHJK)
  	"Right": "k",
    "Left": "h",
    "Jump": "u",
    "Shield": "j",
    "B_Attack": "y",
    "A_Attack": "i",
    "Up": "u",
    "Pause": ' ',
    "Ultimate": 'b'
  },
]

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}
function randomInt(min,max){
	return Math.floor(Math.random() * (max-min+1))+min
}

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7 * canvasScale

var sprites = []
var entities = []
var items = []
var damageSprites = []

let emptyAttacks = {
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
let characterBuilds = {
	"Colin": {
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

    "Ultimate": (color)=>{binaryRain(10, 3, color)},
  }
}

const background = new Sprite({
  position: {
    x: 0 * canvasScale,
    y: 0 * canvasScale
  },
  imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/background.png',
  scale: canvasScale
})
sprites.push(background)

const player = new Fighter({
	playerIndex: 0,
  characterName: "Colin",
  color: 'red',
  facingRight: true,
  attacks: characterBuilds["Colin"],
  
  position: {
    x: 0 * canvasScale,
    y: 0 * canvasScale
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: canvasScale * 2.5,
  offset: {
    x: 215 * canvasScale,
    y: 157 * canvasScale
  },
  sprites: {
    idle: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offsetRight: {
      x: 100 * canvasScale,
      y: 50 * canvasScale
    },
    offsetLeft: {
      x: -170 * canvasScale,
      y: 50 * canvasScale
    },
    width: 160 * canvasScale,
    height: 50 * canvasScale
  }
})
entities.push(player)

const enemy = new Fighter({
	playerIndex: 1,
  characterName: "Colin",
  color: 'blue',
  facingRight: false,
  attacks: emptyAttacks,
  
  position: {
    x: 400 * canvasScale,
    y: 100 * canvasScale
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -50 * canvasScale,
    y: 0 * canvasScale
  },
  imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Idle.png',
  framesMax: 4,
  scale: canvasScale * 2.5,
  offset: {
    x: 215 * canvasScale,
    y: 167 * canvasScale
  },
  sprites: {
    idle: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: 'https://raw.githubusercontent.com/chriscourses/fighting-game/main/img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offsetRight: {
      x: 100 * canvasScale,
      y: 50 * canvasScale
    },
    offsetLeft: {
      x: -170 * canvasScale,
      y: 50 * canvasScale
    },
    width: 160 * canvasScale,
    height: 50 * canvasScale
  }
})
entities.push(enemy)

const keys = {}

function animate() {
  window.requestAnimationFrame(animate)
  
  for(var i=0;i<sprites.length;i++){
  	var sprite = sprites[i]
    sprite.update()
  }
  
  for(var i=0;i<damageSprites.length;i++){
  	var entity = damageSprites[i]
    entity.entity.update()
    entity.entity.position.y += gravity * 10
    
    let e = entity.entity
    //e.delUnder.y = canvas.height
    
    if(e.position.y > e.delUnder.y && e.delUnder.do){
    	damageSprites.splice(i, 1)
    }
	}
  
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  
  for(var i=0;i<entities.length;i++){
  	var entity = entities[i]
    entity.update()
    entity.gameLoopUpdates()
  }
  
  for(var i=0;i<items.length;i++){
  	var item = items[i]
    item.update()
  }
  
  if(debug){
  	c.fillStyle = 'black'
  	c.fillRect(0, floor, canvas.width, 5)
  }
  
  updateKeys()
}

animate()

function updateKeys(){
	if(window.gamepadsModule.activated==false){return}
	let padsData = window.gamepadsModule.gamepadsData

	for(var i=0;i<padsData.length;i++){
  	let data = padsData[i]
    if(data == null){continue}
    
    let index = i
		let keybinds = userKeys[index]
    
    if(data.buttons.A){ keys[keybinds.A_Attack] = true }
    else{ keys[keybinds.A_Attack] = false }
    
    if(data.buttons.B){ keys[keybinds.B_Attack] = true }
    else{ keys[keybinds.B_Attack] = false }
    
    if(data.buttons.X){ keys[keybinds.Jump] = true }
    else{ keys[keybinds.Jump] = false }
    
    if(data.buttons.Y){ keys[keybinds.Ultimate] = true }
    else{ keys[keybinds.Ultimate] = false }
    
    if(data.buttons.Left){ keys[keybinds.Left] = true }
    else{ keys[keybinds.Left] = false }
    
    if(data.buttons.Right){ keys[keybinds.Right] = true }
    else{ keys[keybinds.Right] = false }
    
    if(data.buttons.Select || data.buttons.Start || data.buttons.Home){ keys[keybinds.Pause] = true }
    else{ keys[keybinds.Pause] = false }
    
    let THRESHOLD = 0.3
    if(data.axes.left[0] > THRESHOLD && keys[keybinds.Right] == false){
    	keys[keybinds.Right] = true
    }
    else if(data.axes.left[0] < -THRESHOLD && keys[keybinds.Left] == false){
    	keys[keybinds.Left] = true
    }
    
    THRESHOLD = 0.8
    if(data.axes.left[1] > THRESHOLD && keys[keybinds.Shield] == false){
    	keys[keybinds.Shield] = true
    }
    else if(data.axes.left[1] < -THRESHOLD && keys[keybinds.Up] == false){
    	keys[keybinds.Up] = true
    }
  }
}

window.addEventListener('keydown', (event) => {
  let key = event.key.toLowerCase()
  keys[key] = true
})

window.addEventListener('keyup', (event) => {
  let key = event.key.toLowerCase()
  keys[key] = false
})