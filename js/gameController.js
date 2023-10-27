/*

From this file below
<script src="https://cdn.jsdelivr.net/gh/BoomBoomMushroom/GameHub/js_modules/gameController.js"></script>


*/

window.gamepadsModule = { debug: false, activated: false }

window.addEventListener("gamepadconnected", (event) => {
  window.gamepadsModule.handleConnectDisconnect(event, true);
  if(window.gamepadsModule.activated==false){
  	window.gamepadsModule.updateGamepads()
    window.gamepadsModule.activated = true
  }
});

window.addEventListener("gamepaddisconnected", (event) => {
  window.gamepadsModule.handleConnectDisconnect(event, false);
});

window.gamepadsModule.handleConnectDisconnect = function(event, connected) {
	if(window.gamepadsModule.debug == false){return}

  const gamepad = event.gamepad;
  console.log(gamepad);

  if (connected) {
    console.log("A controller has been connected")
  } else {
    console.log("A controller has been disconnected; Please plug it back it if you wish to continue using it!")
  }
}

window.gamepadsModule.rumble = function(gamepad, delay, duration, min, max) {
  gamepad.vibrationActuator.playEffect("dual-rumble", {
    startDelay: delay,
    duration: duration,
    weakMagnitude: min,
    strongMagnitude: max,
  });
}

window.gamepadsModule.buttonMaps = [
	"A",
  "B",
  "X",
  "Y",
  "L",
  "R",
  "ZL",
  "ZR",
  "Select",
  "Start",
  "LeftStick",
  "RightStick",
  "Up",
  "Down",
  "Left",
  "Right",
  "Home"
]

window.gamepadsModule.updateGamepads = function() {
	window.gamepadsModule.pads = navigator.getGamepads()
	window.gamepadsModule.gamepadsData = []

  let gamePads = window.gamepadsModule.pads
  for(var i=0;i<gamePads.length;i++){
  	let pad = gamePads[i]
    if(pad == null){window.gamepadsModule.gamepadsData.push(null); continue}
    // get buttons
    let btn = {}
    for(var j=0;j<pad.buttons.length;j++){
    	let name = window.gamepadsModule.buttonMaps[j]
      let pressed = pad.buttons[j].pressed
    	btn[name] = pressed
      
      if(pressed && window.gamepadsModule.debug==true){
      	console.log(name+" is being pressed")
      }
    }
    let sticks = {
    	// x, y
    	"left": [ pad.axes[0], pad.axes[1] ],
    	"right": [ pad.axes[2], pad.axes[3] ],
    }
    
    let data = {
    	"buttons": btn,
      "axes": sticks,
      "id": pad.id,
    }
    
    window.gamepadsModule.gamepadsData.push(data)
    requestAnimationFrame( window.gamepadsModule.updateGamepads );
  }
}