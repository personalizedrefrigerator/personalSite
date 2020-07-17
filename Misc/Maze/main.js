function launchMazeApplication(width, height, startX, startY, heightVariation, heightTimeEquation, startAnimationLoop, menuElement)
{
	var mainCanvas = document.createElement("canvas");
	mainCanvas.width = window.innerWidth || 100;
	mainCanvas.height = window.innerHeight || 100;
	mainCanvas.style.position = "fixed";
	mainCanvas.style.left = 0;
	mainCanvas.style.top = 0;
	mainCanvas.style.width = "100vw";
	mainCanvas.style.height = "100vh";
	mainCanvas.style.touchAction = "none";
    document.body.style.touchAction = "none";

	WebGLHelper.resizeTo(mainCanvas.width, mainCanvas.height);

	var ctx = mainCanvas.getContext("2d");
	
	width = width || 50;
	height = height || 50;
	
	startX = startX !== undefined ? startX : (Math.floor(width / 4) * 3);
	startY = startY !== undefined ? startY : (Math.floor(height / 4) * 3);
	
	if (startX >= width)
	{
	    startX = width - 1;
	}
	
	if (startY >= height)
	{
	    startY = height - 1;
	}

	var mazeObject = new MazeHelper.MazeWorld(width, height, startX, startY, !heightVariation, heightTimeEquation);
	var mazeData = mazeObject.mazeGrid;
	
	WebGLHelper.lightPosition.y = 0;
	WebGLHelper.updateLightLocation();

	WebGLHelper.setClearColorString("black");
	WebGLHelper.color.y = 1.0;
	WebGLHelper.updateColor();
	
	var stopAnimationLoop = false;
	function animate()
	{
		if ((mainCanvas.width != mainCanvas.clientWidth || mainCanvas.height != mainCanvas.clientHeight) && mainCanvas.clientWidth > 0 && mainCanvas.clientHeight > 0)
		{
			mainCanvas.width = mainCanvas.clientWidth;
			mainCanvas.height = mainCanvas.clientHeight;

			WebGLHelper.resizeTo(mainCanvas.width, mainCanvas.height);
		}

		WebGLHelper.clear();

		mazeObject.render();
		
		ctx.drawImage(WebGLHelper.getContext().canvas, 0, 0);
		
		if (startAnimationLoop && !stopAnimationLoop)
		{
		    requestAnimationFrame(animate);
		}
	}

    if (!startAnimationLoop)
    {
	    animate();
	}
	
	requestAnimationFrame(animate);

	document.body.addEventListener("keypress", function(e)
	{
		var key = e.key;
		
		if (showingMenu)
		{
		    return;
		}

		switch(key)
		{
			case 'a':
				mazeObject.rotateCamera(-Math.PI / 8);
				break;
			case 'd':
				mazeObject.rotateCamera(Math.PI / 8);
				break;
	        case 'r':
	            mazeObject.rotateCamera(0, -Math.PI / 8);
	            break;
	        case 'f':
	            mazeObject.rotateCamera(0, Math.PI / 8);
	            break;
			case 'w':
				mazeObject.moveForward();
				break;
			case 's':
				mazeObject.moveForward(-1);
				break;
			case 'i':
				mazeObject.makeMove(0, 1);
				break;
			case 'k':
				mazeObject.makeMove(0, -1);
				break;
			case 'j':
				mazeObject.makeMove(-1, 0);
				break;
			case 'l':
				mazeObject.makeMove(1, 0);
				break;
			case 'q':
			    cancelPointerLock();
			    break;
		}
		
		if (!startAnimationLoop)
		{
		    animate();
		}
	}, true);
	
	function checkToShowMenu(x, y)
	{
	    if (showingMenu)
	    {
	        menuElement.style.display = "none";
	        mainCanvas.focus();
	        showingMenu = false;
	        
	        stopAnimationLoop = false;
	        animate();
	        
	        return true;
	    }
	    else if (y < mainCanvas.clientHeight / 14 && menuElement !== undefined)
	    {
	        menuElement.style.display = "block";
	        menuElement.style.position = "absolute";
	        menuElement.style.zIndex = 2;
	        stopAnimationLoop = true;
	        showingMenu = true;
	        
	        console.log("SHOWN");
	        
	        return true;
	    }
	    
	    return false;
	}
	
	var lastTouchPos = [];
	var hadTwoTouches = false;
	document.body.addEventListener("touchstart", function(e)
	{
	    e.preventDefault();
	    
		if (showingMenu)
		{
		    return;
		}
	    
	    if (e.changedTouches.length === 0)
	    {
	        return;
	    }
	    
	    var touch = e.changedTouches[0];
	    
	    lastTouchPos = [{"x": touch.clientX, "y": touch.clientY}];
	    
	    hadTwoTouches = false;
	    
	    if (e.changedTouches.length === 2)
        {
            hadTwoTouches = true;
        }
        
        checkToShowMenu(touch.clientX, touch.clientY);
	    
	    return true;
	}, false);
	
	document.body.addEventListener("touchmove", function(e)
	{
		if (showingMenu)
		{
		    return;
		}
		
	    e.preventDefault();
	    
	    if (e.stopPropagation)
	    {
	        e.stopPropagation();
	    }
	    
	    if (e.changedTouches.length === 0)
	    {
	        return;
	    }
	    
	    try
	    {
	        var touch = e.changedTouches[0];
	        
	        var deltaX = 0, deltaY = 0;
	        var updateLastY = false,
	            updateLastX = true;
	        
	        for (var i = 0; i < e.changedTouches.length; i++)
	        {
	            var x = e.changedTouches[i].clientX,
	                y = e.changedTouches[i].clientY;
	            
	            if (i >= lastTouchPos.length)
	            {
	                lastTouchPos.push({"x": x, "y": y});
	            }
	        
	            deltaX += x - lastTouchPos[i].x,
	            deltaY += y - lastTouchPos[i].y;
	        }
	        
	        deltaX /= e.changedTouches.length;
	        deltaY /= e.changedTouches.length;
	        
	        var deltaXRotation = 0;
	        
	        if (e.changedTouches.length === 2)
	        {
	            hadTwoTouches = true;
	        }
	        
	        var deltaYRotation = deltaX / mainCanvas.clientWidth * 6.28 * 2;
	        
	        if (hadTwoTouches)
	        {
	            deltaXRotation = -deltaY / mainCanvas.clientHeight * 3.14 * 2;
	            
	            if (Math.abs(deltaXRotation) > 0.3)
	            {
	                deltaXRotation = Math.abs(deltaXRotation) / deltaXRotation * 0.3;
	            }
	            
	            if (Math.abs(deltaYRotation) > 0.3)
	            {
	                deltaYRotation = Math.abs(deltaYRotation) / deltaYRotation * 0.3;
	            }
	            
	            updateLastY = true;
	        }
	        
	        mazeObject.rotateCamera(deltaYRotation, deltaXRotation);
	        
	        if (Math.abs(deltaY) > mainCanvas.clientHeight / 21
	            && e.changedTouches.length === 1)
	        {
	            mazeObject.moveForward(-Math.max(Math.min(Math.round(deltaY / Math.abs(deltaY)), 1), -1));
	            updateLastY = true;
	        }
	        
	        for(var i = 0; i < e.changedTouches.length; i++)
	        {
	            if (updateLastX)
	            {   
	                lastTouchPos[i].x = x;
	            }
	            
	            if (updateLastY)
	            {
	                lastTouchPos[i].y = y;
	            }
	        }
	        
	        if (!startAnimationLoop)
	        {
	            animate();
	        }
	    }
	    catch(e)
	    {
            alert(e);
        }
	    
	    return true;
	}, false);
	
	document.body.addEventListener("touchend", function(e)
	{
		if (showingMenu)
		{
		    return;
		}
	    
	    e.preventDefault();
	    
	    return true;
	}, false);
	
	var showingMenu = false;
	mainCanvas.addEventListener("click", function(e)
	{
	    var x = e.clientX,
	        y = e.clientY;
	    
	    let changedMenuState = checkToShowMenu(x, y);
	    
	    if (!changedMenuState)
	    {
	        if (document.pointerLockElement !== mainCanvas)
	        {
	            mainCanvas.requestPointerLock();
            }
            else
            {
                document.exitPointerLock();
            }
	    }
	}, true);
	
	mainCanvas.addEventListener("mousemove", function(e)
	{
	    if (document.pointerLockElement !== null)
	    {
	        var dpitch = e.movementX / mainCanvas.clientWidth * 16;
	        var dyaw = e.movementY / mainCanvas.clientHeight * 16;
	        
	        mazeObject.rotateCamera(dpitch, dyaw);
	        
	        if (!startAnimationLoop)
	        {
	            animate();
	        }
	    }
	});
	
	document.body.focus();
	
	document.body.onbeforeunload = function()
	{ 
	    return "Maze will not be saved on exit."; 
	};

	document.body.appendChild(mainCanvas);
	
	return mazeObject;
}

function main()
{
    var mainMenu = document.createElement("div");
    mainMenu.setAttribute("class", "mainMenu");
    
    var menuLabel = HTMLHelper.addLabel("Menu", mainMenu, "h1");
    HTMLHelper.addHR(mainMenu);
    
    HTMLHelper.addLabel("Size: ", mainMenu);
    var widthInput = HTMLHelper.addInput("Width", "50", mainMenu, "number"),
        heightInput = HTMLHelper.addInput("Height", "50", mainMenu, "number");
        
    HTMLHelper.addLineBreak(mainMenu);
    
    HTMLHelper.addLabel("Start Location: ", mainMenu);
    var startXInput = HTMLHelper.addInput("X", "25", mainMenu, "number"),
        startYInput = HTMLHelper.addInput("Y", "25", mainMenu, "number");
    
    HTMLHelper.addLineBreak(mainMenu);
    HTMLHelper.addLabel("Camera Z (distance above maze): ", mainMenu);
    var cameraZInput = HTMLHelper.addInput("Camera Z", "0", mainMenu, "number");
    
    HTMLHelper.addLineBreak(mainMenu);
    HTMLHelper.addLabel("View Size (Cubes): ", mainMenu);
    var viewSizeInput = HTMLHelper.addInput("View Size", "15", mainMenu, "number");
    
    HTMLHelper.addLineBreak(mainMenu);
    HTMLHelper.addLabel("Cube Size (Units): ", mainMenu);
    var cubeSizeInput = HTMLHelper.addInput("Cube Size", "20", mainMenu, "number");
    
    HTMLHelper.addLineBreak(mainMenu);
    HTMLHelper.addLabel("Height Equation: ", mainMenu);
    var heightEquationInput = HTMLHelper.addInput("f(x, y, t)", "", mainMenu, "text");
    
    var heightVariation = true;
    
    HTMLHelper.addLineBreak(mainMenu);
    
    HTMLHelper.addButton("Full Screen", function(event)
    {
        var requestFullscreen = document.body.requestFullscreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen  || document.body.msRequestFullScreen;
        var exitFullscreen = document.exitFullscreen || document.documentElement.webkitExitFullScreen || document.documentElement.msExitFullscreen || document.documentElement.mozCancelFullScreen;
        if (this.innerHTML === "Full Screen")
        {
            if (document.body.requestFullscreen)
            {
                document.body.requestFullscreen();
            }
            else if (document.body.webkitRequestFullScreen)
            {
                document.body.webkitRequestFullScreen();
            }
            
            this.innerHTML = "Exit Full Screen";
        }
        else
        {
            if (document.exitFullscreen)
            {
                document.exitFullscreen();
            }
            else if (document.documentElement.webkitExitFullScreen)
            {
                document.documentElement.webkitExitFullScreen();
            }
            
            this.innerHTML = "Full Screen";
        }
    }, mainMenu, []);
    
    var heightVariationButton = HTMLHelper.addButton("Disable Height Variation", function(event)
    {
        heightVariation = !heightVariation;
        
        this.innerHTML = heightVariation ? "Disable Height Variation" : "Enable Height Variation";
    }, mainMenu, []);
    
    HTMLHelper.addLineBreak(mainMenu);
    
    var submitButton = HTMLHelper.addButton("Go", function(event)
    {
        try
        {
            var heightEquationText = heightEquationInput.value;
            var heightEquation;
            
            if (heightEquationText.length > 0)
            {
                var sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, acos = Math.acos, atan = Math.atan, pi = Math.PI, ln = Math.log, sqrt = Math.sqrt, pow = Math.pow, abs = Math.abs;
                heightEquation = eval("(function(x, y, t) { try { return " + heightEquationText + "; } catch(e) { return Math.random() * 20; } })");
            }
            
            var maze = launchMazeApplication(MathHelper.forceParseInt(widthInput.value),
                                    MathHelper.forceParseInt(heightInput.value),
                                    MathHelper.forceParseInt(startXInput.value),
                                    MathHelper.forceParseInt(startYInput.value),
                                    heightVariation, heightEquation, heightEquation ? (heightEquationText.indexOf("t") >= 0) : false, mainMenu);
                                    
            maze.cameraZ = MathHelper.forceParseInt(cameraZInput.value);
            maze.viewSize = MathHelper.forceParseInt(viewSizeInput.value);
            maze.cubeScale = MathHelper.forceParseFloat(cubeSizeInput.value);
            
            mainMenu.style.display = "none";
            document.body.focus();
            document.body.style.backgroundImage = "none";
         }
         catch(e)
         {
            menuLabel.textContent = e;
         }
    }, mainMenu, [widthInput, heightInput, startXInput, startYInput, cubeSizeInput]);
    
    document.body.appendChild(mainMenu);
}
