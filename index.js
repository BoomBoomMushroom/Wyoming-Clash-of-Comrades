// https://github.com/chriscourses/fighting-game
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const canvasScale = .6
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
    "A_Attack": "e"
  },
  { // Player 2 (UHJK)
  	"Right": "k",
    "Left": "h",
    "Jump": "u",
    "Shield": "j",
    "B_Attack": "y",
    "A_Attack": "i"
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

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7 * canvasScale

var sprites = []
var entities = []
var items = []

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
  attacks: {
    "Neutral_B": null,
    "Side_B": null,
    "Up_B": null,
    "Down_B": null,

    "Neutral_A": null,
    "Side_A": null,
    "LeftSide_A_air": null,
    "RightSide_A_air": null,
    "Down_A": null,
    "Up_A": null,
  },
  
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
    offset: {
      x: 100 * canvasScale,
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
  facingRight: true,
  attacks: {
    "Neutral_B": null,
    "Side_B": null,
    "Up_B": null,
    "Down_B": null,

    "Neutral_A": null,
    "Side_A": null,
    "LeftSide_A_air": null,
    "RightSide_A_air": null,
    "Down_A": null,
    "Up_A": null,
  },
  
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
    offset: {
      x: -170 * canvasScale,
      y: 50 * canvasScale
    },
    width: 170 * canvasScale,
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
    
    if(data.buttons.A){ player.attack() }
    if(data.buttons.X){ player.jump() }
    if(data.buttons.Left){
    	keys.a = true
      player.lastKey = 'a'
    }else{ keys.a = false }
    
    if(data.buttons.Right){
    	keys.d = true
      player.lastKey = 'd'
    }
    else{keys.d = false}
    
    let THRESHOLD = 0.02
    if(data.axes.left[0] > THRESHOLD && keys.d == false){
    	keys.d = true
      player.lastKey = 'd'
    }
    else if(data.axes.left[0] < -THRESHOLD && keys.a == false){
    	keys.a = true
      player.lastKey = 'a'
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