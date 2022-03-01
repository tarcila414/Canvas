var canvas, context, actionFlag = "", algorithmFlag = "",
    canvasWidth = 0, canvasHeight = 0;
var pxSize = 4;

var mouseClicks = 0
var points = []

function initCanvas () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

function clearCanvas () {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function getPointPosition () {
    canvas.addEventListener("click", function(e) {
        mouseClicks++

        var rect = canvas.getBoundingClientRect();
        var x =  e.clientX - rect.left
        var y = e.clientY - rect.top
        console.log(x,y)
        
        points.push({x: x, y: y})
        drawPx(x,y)
        console.log("M D", mouseClicks, actionFlag)
        if(mouseClicks === 2 ) {
            if(actionFlag === "drawLine")
                drawLine()
            else if (actionFlag === "drawCircumference")
                drawCircumference()  
        }
    } )
}

function setActionFlag(value) {
    actionFlag = value
    clearCanvas()
    points = []
    mouseClicks = 0
}

function setAlgorithmFlag (value) {
    algorithmFlag = value
}

function drawPx (x,y) {
    context.fillRect(x,y,pxSize,pxSize)
}

function clearPx (x,y) {
    context.clearRect(x, y, pxSize, pxSize)
}

function drawLine() {
    if( algorithmFlag === 'DDA' ) {
        DDALine(points[0].x, points[0].y, points[1].x, points[1].y)
    } else if( algorithmFlag === 'BRESENHAM' ) {
        BresenhamLine(points[0].x, points[0].y, points[1].x, points[1].y)
    }
}

function drawCircumference() {
    dx = Math.pow((points[1].x - points[0].x), 2)
    dy = Math.pow((points[1].y - points[0].y), 2)
    
    var distance = Math.abs(Math.sqrt(dx + dy, 2))

    clearPx(points[0].x, points[0].y)
    BresenhamCircumference(points[0].x, points[0].y, distance)
}

function DDALine( x1, y1, x2, y2) {
    var deltaX = 0, deltaY = 0, loop = 0,
        xIncr = 0.0, yIncr = 0.0, xResult = 0.0, yResult = 0.0;
    deltaX = x2 - x1
    deltaY = y2 - y1
    loop = (Math.abs(deltaX) > Math.abs(deltaY)) ?
        Math.abs(deltaX)
        : Math.abs(deltaY)
    xIncr = deltaX / loop
    yIncr = deltaY / loop
    
    xResult = x1
    yResult = y1

    drawPx(Math.round(xResult), Math.round(yResult))

    for(var i = 0; i < loop; i++) {
        xResult += xIncr;
        yResult += yIncr;
        drawPx(Math.round(xResult), Math.round( yResult));
    }
    
}

function BresenhamLine( x1, y1, x2, y2) {
    var dx, dy, x, y, i, const1, const2, p, incrx = 0, incry = 0

    dx = x2 - x1
    dy = y2 - y1

    if( dx >= 0) {
        incrx = 1
    } else {
        incrx -= 1
        dx = -dx 
    }
    
    
    if( dy >= 0) {
        incry = 1
    } else {
        incry -= 1
        dy = -dy 
    }

    x = x1
    y = y1

    drawPx(x, y)
    if(dy < dx) {
        p = (2 * dy) - dx
        const1 = 2 * dy
        const2 = 2 * ( dy - dx )
        for(i = 0; i < dx; i++) {
            x += incrx
            if ( p < 0) {
                p += const1
            } else {
                y += incry
                p += const2
            }
            drawPx(x, y)
        }
    } else {
        p = 2 * dx - dy
        const1 = 2 * dx
        const2 = 2 * ( dx - dy)

        for( i = 0; i < dy; i++) {
            y += incry 
            if(p < 0) {
                p += const1
            } else {
                x += incrx
                p += const2 
            }
            drawPx(x,y)
        }
    }
}

function BresenhamCircumference(xC,yC, r) {
    var x = 0, y = r, p = 3 + 2 * r

    setSymmetricalPixels(x,y,xC,yC)

    while( x < y) {
        if( p < 0) {
            p += 4 * x + 6
        } else {
            p += 4*(x-y) + 10
            y -= 1
        }

        x += 1
        setSymmetricalPixels(x,y,xC, yC)
    }

}

function setSymmetricalPixels(x,y,xC,yC) {
    drawPx(xC + x, yC + y)
    drawPx(xC - x, yC + y)
    drawPx(xC + x, yC - y)
    drawPx(xC - x, yC - y)
    drawPx(xC + y, yC + x)
    drawPx(xC - y, yC + x)
    drawPx(xC + y, yC - x)
    drawPx(xC - y, yC - x)

}