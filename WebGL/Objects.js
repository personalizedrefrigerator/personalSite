var object3D =
{
    "cubeVerticies":
    [
        // Face 1
        20, 20, 0,
        20, 0, 0,
        0, 0, 0,
        
        20, 20, 0,
        0, 0, 0,
        0, 20, 0,
        
        // Face 2
        20, 0, 20,
        20, 20, 20,
        0, 20, 20,
        
        20, 0, 20,
        0, 20, 20,
        0, 0, 20,
        
        
        // Face 3
        
        0, 20, 0,
        0, 0, 0,
        0, 0, 20,
                
        0, 20, 0,
        0, 0, 20,
        0, 20, 20,
        
        // Face 4
        20, 0, 0,
        20, 20, 0,
        20, 20, 20,
        
        20, 0, 0,
        20, 20, 20,
        20, 0, 20,
        
        // Face 5
        20, 20, 20,
        20, 20, 0,
        0, 20, 0,
        
        20, 20, 20,
        0, 20, 0,
        0, 20, 20,
        
        // Face 6
        20, 0, 20,
        0, 0, 20,
        0, 0, 0,
        
        20, 0, 20,
        0, 0, 0, 
        20, 0, 0
    ],
    
    "getScaledCubeVerticies": function(scale)
    {
        var result = [];
        
        for(var i = 0; i < object3D.cubeVerticies.length; i++)
        {
            result.push(object3D.cubeVerticies[i] * scale);
        }
        
        return result;
    },
    
    "getTextureLocations": function(verticiesCount)
    {
        var locations = [];
        var points = [];
        var j;
        
        var face = 0;

        for(var i = 0; i < verticiesCount / 2; i++)
        {
            face = i;
            
            points = 
            [
                [0, 0],
                [0, 1],
                [1, 1],
                [0, 0],
                [1, 1],
                [1, 0]
            ];
            
            for(j = 0; j < points.length; j++)
            {
                if(face === 0 || face === 2)
                {
                    locations.push(1 - points[j][0]);
                    locations.push(1 - points[j][1]);
                }
                else
                {
                    locations.push(points[j][0]);
                    locations.push(points[j][1]);
                }
            }
        }
        
        return locations;
    },
    
    "getNormals": function(verticies, reOrder)
    {
        if(!Vector3)
        {
            throw "Error! Please include Vector.js.";
        }
        
        const triangleCount = verticies.length / 3 / 3;
        
        var normals = [];
        var vertex1, vertex2, vertex3;
        
        var firstVector, secondVector, thirdVector;
        var otherPoint1, otherPoint2;
        var currentPoints = [];
        
        var startIndex;
        
        for(var triangleIndex = 0; triangleIndex < triangleCount; triangleIndex++)
        {
            startIndex = triangleIndex * 3 * 3;
            vertex1 = new Vector3(verticies[startIndex], verticies[startIndex + 1], verticies[startIndex + 2]);
            vertex2 = new Vector3(verticies[startIndex + 3], verticies[startIndex + 4], verticies[startIndex + 5]);
            vertex3 = new Vector3(verticies[startIndex + 6], verticies[startIndex + 7], verticies[startIndex + 8]);
            currentPoints = [vertex1, vertex2, vertex3];
            
            for(var i = 0; i < 3; i++)
            {
                otherPoint1 = currentPoints[(i + 1) % 3];
                otherPoint2 = currentPoints[(i + 2) % 3];
                firstVector = currentPoints[i].subtract(otherPoint1);
                secondVector = currentPoints[i].subtract(otherPoint2);
                
                if(!reOrder)
                {
                    thirdVector = firstVector.cross(secondVector);
                }
                else
                {
                    thirdVector = secondVector.cross(firstVector);
                }
                
                thirdVector.normalize();
                
                normals.push(thirdVector.x);
                normals.push(thirdVector.y);
                normals.push(thirdVector.z);
            }
        }
        
        return normals;
    }
};
