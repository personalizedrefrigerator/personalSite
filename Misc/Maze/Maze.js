var MazeHelper = 
{
    "scrambleArray": function(array)
    {
        var temp;
        for (var i = array.length - 1; i >= array.length / 2; i--)
        {
            temp = array[i];
            var swapWith = Math.floor(Math.random() * i);
            
            array[i] = array[swapWith];
            array[swapWith] = temp;
        }
    },
    "generateMaze": function(w, h, startX, startY)
    {
        // Define helper functions,
        var getUnvisitedSurrounding = function(startX, startY, visitedList, oldFringe)
        {
            var resultArray = oldFringe || []; // An array to add to, so that the firnge is updated, rather than replaced.
    
            var offsetX = Math.floor(Math.random() * 5);
            var offsetY = Math.floor(Math.random() * 5);
    
            var gridX, gridY, xNormalized, yNormalized;
            for(var x = -1 + offsetX; x <= 1 + offsetX; x += 1)
            {
                for(var y = -1 + offsetY; y <= 1 + offsetY; y += 1)
                {
                    xNormalized = ((x + 1) % 3) - 1;
                    yNormalized = ((y + 1) % 3) - 1;
    
                    if (Math.abs(xNormalized) == Math.abs(yNormalized))
                    {
                        continue;
                    }
    
                    gridX = xNormalized + startX;
                    gridY = yNormalized + startY;
    
                    // Ensure the selected pixel is actually in the editable region.
                    if (gridX >= 0 && gridY >= 0 && gridX < visitedList.length && gridY < visitedList[gridX].length
                         && !visitedList[gridX][gridY]) // AND that it has not been visited.
                    {
                        resultArray.push([gridX, gridY, startX, startY]);
                    }
                }
            }
    
            return resultArray;
        };
    
        var mazeGrid = [];
        var visited = [];
    
        // Initialize the starting location.
        startX = startX || 0;
        startY = startY || 0;
    
        var mazeScaler = 2;
    
        // Fill the maze.
        var y, cols, col, visitedColumn, value, i, j;
        for (var x = startX; x < startX + w; x++)
        {
            cols = [];
    
            for (i = 0; i < mazeScaler; i++)
            {
                cols.push([]);
            }
    
            visitedColumn = [];
    
            for(y = startY; y < startY + h; y++)
            {
                // Fill the maze with walls, initially.
                value = 1;
    
                // Add multiple of each.
                for (i = 0; i < mazeScaler; i++)
                {
                    col = cols[i];
    
                    for(j = 0; j < mazeScaler; j++)
                    {
                        col.push(value);
                    }
                }
    
                visitedColumn.push(Math.random() > 0.9 && (x !== startX || y !== startY));
            }
    
            // Add the columns
            for (i = 0; i < mazeScaler; i++)
            {
                col = cols[i];
                mazeGrid.push(col);
            }
    
            visited.push(visitedColumn);
        }
    
        var surrounding = [];
    
        // Find the first pixel and add the
        //surrounding to the surrounding list.
        var current = mazeGrid[startX][startY];
        var currentX, currentY, parentX, parentY;
        
        surrounding = getUnvisitedSurrounding(startX, startY, visited, []);
        
        while (surrounding.length !== 0)
        {
            // Select one of the surrounding to visit.
            current = surrounding.pop();
    
            currentX = current[0];
            currentY = current[1];
    
            // So long as the pixel to be considered has not been visited or we want to join,
            if (!visited[currentX][currentY] || Math.random() < 0.1)
            {
                // Note that this pixel has been visited.
                visited[currentX][currentY] = true;
    
                // Set the pixel in the maze.
                mazeGrid[currentX * 2][currentY * 2] = 0;
        
                parentX = current[2];
                parentY = current[3];
    
                mazeGrid[parentX + currentX][parentY + currentY] = 0;
    
                // Find a new surrounding array.
                surrounding = getUnvisitedSurrounding(currentX, currentY, visited, surrounding);
            }
    
            // Update the last location.
            lastX = currentX;
            lastY = currentY;
            
            // Scramble the fringe, if necessary,
            if (Math.random() < 0.3)
            {
                MazeHelper.scrambleArray(surrounding);
            }
        }
    
        return mazeGrid;
    },
    "renderMaze2D": function(maze, ctx, startX, startY, endX, endY)
    {
        if (maze.length == 0)
        {
            return;
        }
    
        ctx.save();    
        
        startX = startX || 0;
        startY = startY || 0;
        
        endX = endX || maze.length;
        endY = endY || maze[0].length;
        
        startX = Math.floor(Math.max(startX, 0));
        startY = Math.floor(Math.max(startY, 0));
        endX = Math.floor(Math.min(endX, maze.length));
        endY = Math.floor(Math.min(endY, maze[0].length));
    
        var segmentWidth = ctx.canvas.width / maze.length;
        var segmentHeight = ctx.canvas.height / maze[0].length;
    
        var segmentDelta = segmentWidth;
        if (segmentHeight < segmentDelta)
        {
            segmentDelta = segmentHeight;
        }
    
        var dimenEndX = segmentDelta * endX;
        var dimenEndY = segmentDelta * endY;
    
        var x, y, gridValue, mazeX = startX, mazeY = 0;
        for(x = segmentDelta * startX; x < dimenEndX && mazeX < endX; x += segmentDelta)
        {
            mazeY = startY;
    
            for(y = segmentDelta * startY; y < dimenEndY && mazeY < endY; y += segmentDelta)
            {
                gridValue = maze[mazeX][mazeY];
    
                if (gridValue === 1)
                {
                    ctx.fillStyle = "gray";
                }
                else if(gridValue === 2)
                {
                    ctx.fillStyle = "#aaaa00";
                }
                else
                {
                    ctx.fillStyle = "black";
                }
    
                ctx.fillRect(x, y, segmentDelta - 1, segmentDelta - 1);
    
                mazeY ++;
            }
    
            mazeX ++;
        }
    
        ctx.restore();
    },
    "renderMaze3D": function(maze, startX, startY, endX, endY, cubeScale, debugAtX, debugAtY, noVaryHeights, heightTimeEquation)
    {
        if (maze.length === 0)
        {
            return false;
        }
    
        var width = maze.length,
            height = maze[0].length;
        
        var sx = 20, sy = 20, sz = 20;

        if (cubeScale)
        {
            sx = cubeScale;
            sy = cubeScale;
            sz = cubeScale;
        }
        
        startX = Math.floor(startX) || 0;
        startY = Math.floor(startY) || 0;
        endX = Math.floor(endX) || width;
        endY = Math.floor(endY) || height;
        
        startX = Math.floor(Math.max(startX, 0));
        startY = Math.floor(Math.max(startY, 0));
    
        var x, y;
        for(x = startX; x < endX && x < width; x++)
        {
            for(y = startY; y < endY && y < height; y++)
            {
                /*if (maze[x][y] == 0
                     && (debugAtX !== x || debugAtY !== y))
                {
                    continue;
                }*/
    
                WebGLHelper.worldMatrix.save();
    
                var debugPixel = (debugAtX === x && debugAtY === y);
    
                WebGLHelper.worldMatrix.translate(sx * x, -sy / 2, sz * y, true);
                
                
                WebGLHelper.color.x = 0.0;
                WebGLHelper.color.y = 1.0;
                WebGLHelper.color.z = 0.0;
                
                var heightBlocks = 1;

                if (debugPixel)
                {
                    WebGLHelper.worldMatrix.scale(sx, sy * 0.1, sz, true);
                    
                    WebGLHelper.color.x = 1.0;
                    WebGLHelper.color.y = 0.0;
                    WebGLHelper.color.z = 0.0;
                }
                else if (maze[x][y] == 0)
                {
                    WebGLHelper.worldMatrix.scale(sx, sy * 0.07, sz, true);
                    
                    WebGLHelper.color.x = 1.0;
                    WebGLHelper.color.y = 1.0;
                    WebGLHelper.color.z = 1.0;
                }
                else if (maze[x][y] == 2)
                {
                    WebGLHelper.worldMatrix.scale(sx, sy * 0.11, sz, true);
                    
                    WebGLHelper.color.x = 1.0;
                    WebGLHelper.color.y = Math.abs(Math.sin(x * y / 10));
                    WebGLHelper.color.z = 0.0;
                }
                else
                {
                    if (!heightTimeEquation)
                    {
                        heightBlocks = Math.abs(1 + Math.tan((x + y) / 10.0));
                    }
                    else
                    {
                        var time = (new Date()).getTime() / 1000;
                        heightBlocks = heightTimeEquation(x, y, time);
                    }
                    
                    WebGLHelper.worldMatrix.scale(sx, sy, sz, true);
                    
                    WebGLHelper.color.x = Math.min(Math.abs(1 + Math.cos((x + y) / 10.0)) / 2, 0.8);
                    WebGLHelper.color.y = Math.min(Math.abs(1 + Math.sin(x / 10.0)) / 2, 0.7);
                    WebGLHelper.color.z = Math.min(Math.abs(1 + Math.sin(x * y / 10.0)) / 2, 0.3);
                }
                
                WebGLHelper.updateColor();
                
                heightBlocks = Math.min(heightBlocks, 100);

                if (noVaryHeights)
                {
                    heightBlocks = 1;
                }
                
                heightBlocks = Math.max(0, heightBlocks);
                
                for(var i = 0; i < heightBlocks; i++)
                {
                    WebGLHelper.updateMatricies(false, true, false);
                    WebGLHelper.renderObject();
                    
                    WebGLHelper.worldMatrix.translate(0, 1 + (Math.sin(i + x * y) + 1) / 100, 0, true);
                    if (i + 2 >= heightBlocks)
                    {
                        WebGLHelper.worldMatrix.scale(1, heightBlocks - i, 1, true);
                    }
                }
                
                WebGLHelper.worldMatrix.restore();
            }
        }
    
        return true;
    },
    "MazeWorld": function(mazeWidth, mazeHeight, cameraStartGridX, cameraStartGridY, noHeightVariation, heightTimeEquation)
    {
        this.cameraX = cameraStartGridX * 2 || 0;
        this.cameraY = cameraStartGridY * 2 || 0;
        this.cameraZ = 0;
        this.cameraRotateY = 0;
        this.cameraRotateX = 0;
        this.mazeWidth = mazeWidth || 10;
        this.mazeHeight = mazeHeight || 10;
        this.viewSize = 30;
        this.heightEquation = heightTimeEquation;
        
        var mazeGreatestDimension = Math.max(this.mazeWidth, this.mazeHeight);
        
        var maze2DCanvas = document.createElement("canvas");
        maze2DCanvas.width = mazeGreatestDimension * 10;
        maze2DCanvas.height = mazeGreatestDimension * 10;
        this.maze2DCtx = maze2DCanvas.getContext("2d");

        this.cubeScale = 20;
        this.noHeightVariation = noHeightVariation || false;
        
        this.mazeGrid = MazeHelper.generateMaze(this.mazeWidth, this.mazeHeight, this.cameraX / 2, this.cameraY / 2);
        
        MazeHelper.renderMaze2D(this.mazeGrid, this.maze2DCtx);
        
        this.render = function()
        {
            var startX = this.cameraX - this.viewSize / 2, 
                startY = this.cameraY - this.viewSize / 2, 
                endX = this.cameraX + this.viewSize / 2,
                endY = this.cameraY + this.viewSize / 2;
                
                
            MazeHelper.renderMaze2D(this.mazeGrid, this.maze2DCtx, startX, startY, endX, endY);
        
            WebGLHelper.imageToTexture(this.maze2DCtx.canvas);
        
            // Render the maze
            WebGLHelper.clear();
            WebGLHelper.cameraMatrix.save();
            
            var cameraTranslateX = -this.cameraX * this.cubeScale - this.cubeScale / 2;
            var cameraTranslateY = -this.cameraZ * this.cubeScale;
            var cameraTranslateZ = -this.cameraY * this.cubeScale - this.cubeScale / 2;
            
            WebGLHelper.cameraMatrix.translate(cameraTranslateX, cameraTranslateY, cameraTranslateZ, true);
            WebGLHelper.cameraMatrix.rotateY(this.cameraRotateY);
            WebGLHelper.cameraMatrix.rotateX(this.cameraRotateX);
            
            WebGLHelper.updateMatricies(false, false, true);
            
            MazeHelper.renderMaze3D(this.mazeGrid, startX, startY, endX, endY, this.cubeScale, this.cameraX, this.cameraY, this.noHeightVariation, this.heightEquation);
            
            // Render the sky.
            WebGLHelper.worldMatrix.save();
            WebGLHelper.color.x = 0.0;
            WebGLHelper.color.y = 0.0;
            WebGLHelper.color.z = 0.0;
            WebGLHelper.updateColor();
            
            
            WebGLHelper.worldMatrix.translate(-cameraTranslateX, -cameraTranslateY, -cameraTranslateZ, true);
            var skySize = 100;
            WebGLHelper.worldMatrix.scale(-skySize * this.viewSize * this.cubeScale, -skySize * this.viewSize * this.cubeScale, -skySize * this.viewSize * this.cubeScale, true);
            WebGLHelper.worldMatrix.translate(-0.5, -0.5, -0.5, true);
            
            WebGLHelper.updateMatricies(false, true, false);
            
            WebGLHelper.renderObject();
            
            WebGLHelper.worldMatrix.restore();
            
            WebGLHelper.cameraMatrix.restore();
        };
        
        this.makeMove = function(dx, dy)
        {
            if (Math.abs(dx) > 1)
            {
                dx = 1 * dx / Math.abs(dx);
            }
            
            if (Math.abs(dy) > 1)
            {
                dy = 1 * dy / Math.abs(dy);
            }
            
            dx = Math.floor(dx);
            dy = Math.floor(dy);
                
            var newX = this.cameraX + dx,
                newY = this.cameraY + dy;
                
            // Ensure the new square is on the screen
            if (newX < 0 || newY < 0
                 || newX >= this.mazeGrid.length || newY >= this.mazeGrid[newX].length)
            {
                return false;
            }
            
            var squareContents = this.mazeGrid[newX][newY];
            
            // Ensure the current square is a wall.
            if (squareContents === 1)
            {
                return false;
            }
            
            // Update the camera's position.
            this.cameraX = newX;
            this.cameraY = newY;

            // Note that the player was here.
            this.mazeGrid[newX][newY] = 2;
            
            return true;
        };

        this.moveForward = function(multiplier)
        {
            multiplier = multiplier || 1;

            var angle = this.cameraRotateY;

            var yPart = Math.cos(angle) * multiplier,
                xPart = -Math.sin(angle) * multiplier;

            xPart = Math.round(xPart);
            yPart = Math.round(yPart);

            if (Math.abs(xPart) == Math.abs(yPart))
            {
                xPart = 0;
                yPart = 0;
            }

            console.log(angle / Math.PI + " (2): " + xPart + ", " + yPart);
            
            this.makeMove(xPart, yPart);
        };
        
        this.rotateCamera = function(deltaRotationY, deltaRotationX)
        {
            this.cameraRotateY += deltaRotationY;
            this.cameraRotateX += deltaRotationX || 0;
        };
    }
};
