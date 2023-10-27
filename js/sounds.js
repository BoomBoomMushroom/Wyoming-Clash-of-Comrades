function playSound(src){
	var sound = new Howl({
    src: [src],
  	html5: true,
  });
	sound.play()
}