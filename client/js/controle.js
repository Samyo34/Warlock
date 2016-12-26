var isPressedA = false;
var isPressedZ = false;
var isPressedE = false;
var isPressedR = false;

	// Handlers for keys:
	document.onkeydown = function(event){
		console.log(event.keyCode);
		if(event.keyCode === 65) { // key A
			if(isPressedA === false)
			{
				socket.emit('keyPress', {inputId: 'A', state: true});
				isPressedA = true;
			}
		}
		else if(event.keyCode === 90) { // key Z
			if(isPressedZ === false)
			{
				socket.emit('keyPress', {inputId: 'Z', state: true});
				isPressedZ = true;
			}
		}
		else if(event.keyCode === 69) { // key E
			if (isPressedE === false) {
				socket.emit('keyPress', {inputId: 'E', state: true});
				isPressedE = true;
			}
		}
		else if(event.keyCode === 82) { // key R
			if (isPressedR === false) {
				socket.emit('keyPress', {inputId: 'R', state: true});
				isPressedR = true;
			}
		}
	};
	document.onkeyup = function(event){
		if(event.keyCode === 65) { // key A
			socket.emit('keyPress', {inputId: 'A', state: false});
			isPressedA = false;
		}
		else if(event.keyCode === 90) { // key Z
			socket.emit('keyPress', {inputId: 'Z', state: false});
			isPressedZ = false;
		}
		else if(event.keyCode === 69) { // key E
			socket.emit('keyPress',{inputId:'E',state:false});
			isPressedE = false;
		}
		else if(event.keyCode === 82) { // key R
			socket.emit('keyPress', {inputId: 'R', state: false});
			isPressedR = false;
		}
	};

	//=================================================================
	// Mouse click handlers
	// jQuery:
	$('#ctx').mousedown(function(event) {
		click_X = camera.x+event.pageX - $(this).offset().left;
		click_Y = camera.y+event.pageY - $(this).offset().top;
		console.log(event.which);
		switch (event.which) {
			case 1:
            console.log('Left click');
            socket.emit('mouseLeftClick',{
               x:click_X,
               y:click_Y
           });
            break;
            case 2:
            console.log('Middle click');
            break;
            case 3:
            console.log('Right click : '+click_X+':'+click_Y);
            socket.emit('mouseRightClick',{
               x:click_X,
               y:click_Y
           });
            break;
            default:
            console.log("Unknown click")
        }
    });
	$("#ctx").mousemove(function( event ) {
		var parentOffset = $(this).parent().offset();
		//or $(this).offset(); if you really just want the current element's offset
		mouse_X = event.pageX - parentOffset.left;
		mouse_Y = event.pageY - parentOffset.top;
	});

	// Disable the popup triggered by the right click
	$('body').on('contextmenu', '#ctx', function(e){ return false; });