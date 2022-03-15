/***
 * Nome: Tárcila Fernanda
 * Disciplina: Computação Gráfica
 * Implementação de algoritmos
 */


var canvas, context, 
    actionFlag = "", algorithmFlag = "",
clearPxFlag = false,
    canvasWidth = 0, canvasHeight = 0;
var pxSize = 4;

var mouseClicks = 0
var points = []

var linesList = []
var polygonsList = []
var circumferencesList = []

function initCanvas () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

function clearCanvas () {
    context.clearRect(0, 0, canvas.width, canvas.height)
    linesList = []
    polygonsList = []
    circumferencesList = []
}

/*** Manipulação das interações do usuário */
function getPointPosition () {
    canvas.addEventListener("click", function(e) {
        mouseClicks++

        var rect = canvas.getBoundingClientRect();
        var x =  e.clientX - rect.left
        var y = e.clientY - rect.top
        
        points.push({x: x, y: y})
        drawPx(x,y)
        if(mouseClicks === 2 ) {
            if(actionFlag === "drawLine"){
                linesList.push({x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y})
                drawLine(linesList[linesList.length - 1])
                points = []
            } else if (actionFlag === "drawCircumference"){
                circumferencesList.push({x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y})
                drawCircumference(circumferencesList[circumferencesList.length - 1])  
                points = []
            }
        }
    } )
}

function setActionFlag(value) {
    actionFlag = value
    points = []
    mouseClicks = 0
}

function setAlgorithmFlag (value) {
    algorithmFlag = value
}

function submitVertices() {
    if( points.length < 3) {
        points.length === 0 ? 
            alert("Selecione a opção 'Escolher vértices' e click em pelo menos três pontos no canvas")
           : alert("Selecione pelo menos três vértices")  
    } else {
        drawPolygon(points)
        polygonsList.push({vertices: points})
        points = []
    }
}

/** Manipulacao do Pixel*/
function clearPx (x,y) {
    context.clearRect(x, y, pxSize+1, pxSize+1)
}

function drawPx (x,y) {
    context.fillRect(x,y,pxSize,pxSize)
}

/** Algoritmos de rasterização  ----------------------------------------------------------*/
function drawLine(line) {
    clearPxFlag = false
    if( algorithmFlag === 'DDA' ) {
        DDALine(line.x1, line.y1, line.x2, line.y2)
    } else if( algorithmFlag === 'BRESENHAM' ) {
        BresenhamLine(line.x1, line.y1, line.x2, line.y2)
    }
}

function drawCircumference(circumference) {
    dx = Math.pow((circumference.x2 - circumference.x1), 2)
    dy = Math.pow((circumference.y2 - circumference.y1), 2)
    
    var distance = Math.abs(Math.sqrt(dx + dy, 2))

    clearPx(circumference.x1, circumference.y1)
    BresenhamCircumference(circumference.x1, circumference.y1, distance)
}

function drawPolygon(vertices) {
    vertices.forEach((p, i) => {
        if (i+1 != vertices.length)
        BresenhamLine(p.x,p.y, vertices[i+1].x, vertices[i+1].y)
        else
        BresenhamLine(p.x,p.y, vertices[0].x, vertices[0].y)
    })
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


    clearPxFlag ? clearPx(x,y) : drawPx(x, y) 
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
            clearPxFlag ? clearPx(x,y) : drawPx(x, y) 
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
            clearPxFlag ? clearPx(x,y) : drawPx(x, y) 
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
    clearPxFlag ? clearPx(xC + x, yC + y) : drawPx(xC + x, yC + y)
    clearPxFlag ? clearPx(xC - x, yC + y) : drawPx(xC - x, yC + y)
    clearPxFlag ? clearPx(xC + x, yC - y) : drawPx(xC + x, yC - y)
    clearPxFlag ? clearPx(xC - x, yC - y) : drawPx(xC - x, yC - y)
    clearPxFlag ? clearPx(xC + y, yC + x) : drawPx(xC + y, yC + x)
    clearPxFlag ? clearPx(xC - y, yC + x) : drawPx(xC - y, yC + x)
    clearPxFlag ? clearPx(xC + y, yC - x) : drawPx(xC + y, yC - x)
    clearPxFlag ? clearPx(xC - y, yC - x) : drawPx(xC - y, yC - x)

}
/** -------------------------------------------------------------------------------------- */

/** Algoritmos de transformação  ----------------------------------------------------------*/
function translate() {
    if (linesList.length === 0 
        && polygonsList.length === 0
        && circumferencesList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    }
    var tX = document.getElementById("tX").value
    var tY = document.getElementById("tY").value
    
    var newLinesList = linesList.map((line, i) => {
        var newLineCoordP1 = translatePoint(tX, tY, line.x1, line.y1)
        var newLineCoordP2 = translatePoint(tX, tY, line.x2, line.y2)
        clearPxFlag = true
        BresenhamLine(line.x1,line.y1, line.x2, line.y2)
        clearPxFlag = false
        BresenhamLine(newLineCoordP1.x, newLineCoordP1.y, newLineCoordP2.x, newLineCoordP2.y)
        return { 
            x1: newLineCoordP1.x, 
            y1: newLineCoordP1.y, 
            x2: newLineCoordP2.x, 
            y2: newLineCoordP2.y
        }
    })
    linesList = newLinesList

    var newPolygonsList = polygonsList.map((polygon, i) => {
        points = []
        polygon.vertices.forEach((point) => {
            points.push(translatePoint(tX, tY, point.x, point.y))
        })
        clearPxFlag = true
        drawPolygon(polygon.vertices)
        clearPxFlag = false
        drawPolygon(points)
        return { vertices: points}
    })
    polygonsList = newPolygonsList

    var newCircList = circumferencesList.map((circ, i) => {
        var newCircCoordP1 = translatePoint(tX, tY, circ.x1, circ.y1)
        var newCircCoordP2 = translatePoint(tX, tY, circ.x2, circ.y2)

        clearPxFlag = true
        drawCircumference(circ)

        clearPxFlag = false
        drawCircumference({
            x1: newCircCoordP1.x, 
            y1: newCircCoordP1.y, 
            x2: newCircCoordP2.x, 
            y2: newCircCoordP2.y 
        })

        return {
            x1: newCircCoordP1.x, 
            y1: newCircCoordP1.y, 
            x2: newCircCoordP2.x, 
            y2: newCircCoordP2.y 
        }
    })
    circumferencesList = newCircList
}


function translatePoint(tx,ty,x, y) {
    var result = [0,0,0]
    var mT = [[1,0,tx], [0,1,ty], [0,0,1]]
    var vC = [x,y,1]

    for( var i = 0; i < 3; i++) {
        for( var j = 0; j < 3; j++) {
            result[i] += (mT[i][j] * vC[j])
        }
    }

    return { x: result[0], y: result[1]}
}

function rotate() {
    if (linesList.length === 0 
        && polygonsList.length === 0
        && circumferencesList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    }
    var teta = document.getElementById("teta").value

    var newLinesList = linesList.map((line, i) => {
        var tPoint = translatePoint(-line.x1, -line.y1, line.x2, line.y2)
        var rPoint = rotatePoint(teta, tPoint.x, tPoint.y)
        var tPoint2 = translatePoint(line.x1, line.y1, rPoint.x, rPoint.y) 
        clearPxFlag = true
        BresenhamLine(line.x1, line.y1, line.x2, line.y2)
        clearPxFlag = false
        BresenhamLine(line.x1, line.y1, tPoint2.x, tPoint2.y)
        return {
            x1: line.x1, 
            y1: line.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y
        }
    })
    linesList = newLinesList

    var newPolygonsList = polygonsList.map((polygon,i) => {
        points = []
        polygon.vertices.forEach((point,j) => {
            if(j === 0) {
                points.push(point)
            } else {
                var tPoint = translatePoint(-polygon.vertices[0].x, -polygon.vertices[0].y, point.x, point.y)
                var rPoint = rotatePoint(teta, tPoint.x, tPoint.y)
                var tPoint2 = translatePoint(polygon.vertices[0].x, polygon.vertices[0].y, rPoint.x, rPoint.y)
                
                points.push(tPoint2)
            }
        })
        clearPxFlag = true
        drawPolygon(polygon.vertices)
        clearPxFlag = false
        drawPolygon(points)
        return {vertices: points}
    })
    polygonsList = newPolygonsList
}

function rotatePoint(teta, x, y) {
    var result = [0,0,0]
    var mT = [[Math.cos(teta), -Math.sin(teta), 0], [Math.sin(teta), -Math.cos(teta), 0], [0,0,1]]
    var vC = [x,y,1]

    for( var i = 0; i < 3; i++) {
        for( var j = 0; j < 3; j++) {
            result[i] += (mT[i][j] * vC[j])
        }
    }

    return { x: result[0], y: result[1]}    
}

function scale() {
    if (linesList.length === 0 
        && polygonsList.length === 0
        && circumferencesList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    }
    var sX = document.getElementById("sX").value
    var sY = document.getElementById("sY").value

    linesList.forEach((line,i) => {
        var tPoint = translatePoint(-line.x1, -line.y1, line.x2, line.y2)
        var sPoint = scalePoint(sX, sY, tPoint.x, tPoint.y)
        var tPoint2 = translatePoint(line.x1, line.y1, sPoint.x, sPoint.y) 
        clearPxFlag = true
        BresenhamLine(line.x1, line.y1, line.x2, line.y2)
        clearPxFlag = false
        BresenhamLine(line.x1, line.y1, tPoint2.x, tPoint2.y)
        linesList[i] = {
            x1: line.x1, 
            y1: line.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y
        }
    })

    var newPolygonsList = polygonsList.map((polygon,i) => {
        points = []
        polygon.vertices.forEach((point,j) => {
            if(j === 0) {
                points.push(point)
            } else {
                var tPoint = translatePoint(-polygon.vertices[0].x, -polygon.vertices[0].y, point.x, point.y)
                var sPoint = scalePoint(sX, sY, tPoint.x, tPoint.y)
                var tPoint2 = translatePoint(polygon.vertices[0].x, polygon.vertices[0].y, sPoint.x, sPoint.y)
                
                points.push(tPoint2)
            }
        })
        clearPxFlag = true
        drawPolygon(polygon.vertices)
        clearPxFlag = false
        drawPolygon(points)
        return {vertices: points}
    })

    polygonsList = newPolygonsList

    var newCircList = circumferencesList.map((circ, i) => {
        var tPoint = translatePoint(-circ.x1, -circ.y1, circ.x2, circ.y2)
        var sPoint = scalePoint(sX, sY, tPoint.x, tPoint.y)
        var tPoint2 = translatePoint(circ.x1, circ.y1, sPoint.x, sPoint.y) 
        
        clearPxFlag = true
        drawCircumference(circ)
        clearPxFlag = false
        drawCircumference({
            x1: circ.x1, 
            y1: circ.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y 
        })

        return {
            x1: circ.x1, 
            y1: circ.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y 
        }
    })
    circumferencesList = newCircList
}

function scalePoint(sx,sy,x, y) {
    var result = [0,0,0]
    var mT = [[sx,0,0], [0,sy,0], [0,0,1]]
    var vC = [x,y,1]

    for( var i = 0; i < 3; i++) {
        for( var j = 0; j < 3; j++) {
            result[i] += (mT[i][j] * vC[j])
        }
    }

    return { x: result[0], y: result[1]}
}

function reflectX () {
    if (linesList.length === 0 
        && polygonsList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    }

    var newLinesList = linesList.map((line) => {
        var tPoint = translatePoint(-line.x1, -line.y1, line.x2, line.y2)
        var sPoint = reflectPoint('X', tPoint.x, tPoint.y)
        var tPoint2 = translatePoint(line.x1, line.y1, sPoint.x, sPoint.y) 
        clearPxFlag = true
        BresenhamLine(line.x1, line.y1, line.x2, line.y2)
        clearPxFlag = false
        BresenhamLine(line.x1, line.y1, tPoint2.x, tPoint2.y)
        return {
            x1: line.x1, 
            y1: line.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y
        }
    })
    linesList = newLinesList


    var newPolygonList = polygonsList.map((polygon) => {
        points = []
        polygon.vertices.forEach((point,j) => {
            if(j === 0) {
                points.push(point)
            } else {
                var tPoint = translatePoint(-polygon.vertices[0].x, -polygon.vertices[0].y, point.x, point.y)
                var sPoint = reflectPoint('X', tPoint.x, tPoint.y)
                var tPoint2 = translatePoint(polygon.vertices[0].x, polygon.vertices[0].y, sPoint.x, sPoint.y)
                
                points.push(tPoint2)
            }
        })
        clearPxFlag = true
        drawPolygon(polygon.vertices)
        clearPxFlag = false
        drawPolygon(points)
        return {vertices: points}
    })
    polygonsList = newPolygonList

}

function reflectY () {
    if (linesList.length === 0 
        && polygonsList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    }

    var newLinesList = linesList.map((line) => {
        var tPoint = translatePoint(-line.x1, -line.y1, line.x2, line.y2)
        var sPoint = reflectPoint('Y', tPoint.x, tPoint.y)
        var tPoint2 = translatePoint(line.x1, line.y1, sPoint.x, sPoint.y) 
        clearPxFlag = true
        BresenhamLine(line.x1, line.y1, line.x2, line.y2)
        clearPxFlag = false
        BresenhamLine(line.x1, line.y1, tPoint2.x, tPoint2.y)
        return {
            x1: line.x1, 
            y1: line.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y
        }
    })
    linesList = newLinesList


    var newPolygonsList = polygonsList.map((polygon) => {
        points = []
        polygon.vertices.forEach((point,j) => {
            if(j === 0) {
                points.push(point)
            } else {
                var tPoint = translatePoint(-polygon.vertices[0].x, -polygon.vertices[0].y, point.x, point.y)
                var sPoint = reflectPoint('Y', tPoint.x, tPoint.y)
                var tPoint2 = translatePoint(polygon.vertices[0].x, polygon.vertices[0].y, sPoint.x, sPoint.y)
                
                points.push(tPoint2)
            }
        })
        clearPxFlag = true
        drawPolygon(polygon.vertices)
        clearPxFlag = false
        drawPolygon(points)
        return {vertices: points}
    })
    polygonsList = newPolygonsList
}

function reflectXY () {
    if (linesList.length === 0 
        && polygonsList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    }

    var newLinesList = linesList.map((line) => {
        var tPoint = translatePoint(-line.x1, -line.y1, line.x2, line.y2)
        var sPoint = reflectPoint('XY', tPoint.x, tPoint.y)
        var tPoint2 = translatePoint(line.x1, line.y1, sPoint.x, sPoint.y) 
        clearPxFlag = true
        BresenhamLine(line.x1, line.y1, line.x2, line.y2)
        clearPxFlag = false
        BresenhamLine(line.x1, line.y1, tPoint2.x, tPoint2.y)
        return {
            x1: line.x1, 
            y1: line.y1, 
            x2: tPoint2.x, 
            y2: tPoint2.y
        }
    })
    linesList = newLinesList

    var newPolygonsList = polygonsList.map((polygon) => {
        points = []
        polygon.vertices.forEach((point,j) => {
            if(j === 0) {
                points.push(point)
            } else {
                var tPoint = translatePoint(-polygon.vertices[0].x, -polygon.vertices[0].y, point.x, point.y)
                var sPoint = reflectPoint('XY', tPoint.x, tPoint.y)
                var tPoint2 = translatePoint(polygon.vertices[0].x, polygon.vertices[0].y, sPoint.x, sPoint.y)
                
                points.push(tPoint2)
            }
        })
        clearPxFlag = true
        drawPolygon(polygon.vertices)
        clearPxFlag = false
        drawPolygon(points)
        return {vertices: points}
    })
    polygonsList = newPolygonsList
}

function reflectPoint (eixo, x, y) {
    var result = [0,0,0]
    var mT = [[1,0,0], [0,-1,0], [0,0,1]]
    var vC = [x,y,1]

    if( eixo === 'Y') {
        mT = [[-1,0,0], [0,1,0], [0,0,1]]
    } else if( eixo === 'XY'){
        mT = [[-1,0,0], [0,-1,0], [0,0,1]]
    }

    for( var i = 0; i < 3; i++) {
        for( var j = 0; j < 3; j++) {
            result[i] += (mT[i][j] * vC[j])
        }
    }

    return { x: result[0], y: result[1]}

}

/** Algoritmos de recorte  -----------------------------------------------------------------------*/
function submitPointsRec () {
    if( points.length < 2) {
        points.length === 0 ? 
            alert("Selecione a opção 'Escolher limites' e click em 2 pontos no canvas")
            : alert("Selecione 2 pontos")  
    } else {
        if(actionFlag === "recCohen"){
            recCohen(points)
            clearPx(points[0])
            clearPx(points[1])
        } else if( actionFlag === "recLiang") {
            recLiang(points)
            clearPx(points[0])
            clearPx(points[1])
        }
    }

}

function recCohen (limites) {
    if (linesList.length === 0 
        && polygonsList.length === 0
        && circumferencesList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    } else {
        var xmin = 0
        var xmax = 0
        var ymin = 0 
        var ymax = 0
        
        if(limites[0].x < limites[1].x) {
            xmin = limites[0].x
            xmax = limites[1].x
        } else {
            xmin = limites[1].x
            xmax = limites[0].x
        }

        if(limites[0].y < limites[1].y) {
            ymin = limites[0].y
            ymax = limites[1].y
        } else {
            ymin = limites[1].y
            ymax = limites[0].y
        }

        linesList.forEach((line,i) => {
            clearPxFlag = true
            BresenhamLine(line.x1, line.y1, line.x2, line.y2)
            
            CohenSutherland(line.x1, line.y1, line.x2, line.y2, xmin, ymin, xmax, ymax)
         })

    }   
}

function CohenSutherland (x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
    var aceite = false
    var feito = false
    var cFora = 0
    var xint = 0
    var yint = 0

    var c1 = regionCode((x1),(y1), xmin, ymin, xmax, ymax)
    var c2 = regionCode((x2),(y2), xmin, ymin, xmax, ymax)

    while(!feito) {
        if(c1 === 0 && c2 === 0){
            feito = true
            aceite = true
        } else if(c1 & c2) {
            feito = true
        } else {
            if(c1 !== 0) {
                cFora = c1
            } else {
                cFora = c2
            }
            if(cFora & 1) {
                xint = xmin 
                yint = y1+(y2-y1)*((xmin - x1) / (x2-x1))
            } else if(cFora & 2) {
                xint = xmax 
                yint = y1+(y2-y1)*((xmax - x1) / (x2-x1))
            } else if(cFora & 4) {
                yint = ymin 
                xint = x1+(x2-x1)*((ymin - y1) / (y2-y1))

            } else if(cFora & 8) {
                yint = ymax 
                xint = x1+(x2-x1)*((ymax - y1) / (y2-y1))
            }

            if(c1 === cFora) {
                x1 = xint
                y1 = yint

                c1 = regionCode((x1),(y1), xmin, ymin, xmax, ymax)
            } else {
                x2 = xint
                y2 = yint

                c2 = regionCode((x2),(y2), xmin, ymin, xmax, ymax)
            }

        }
    }
    if(aceite) {
        clearPxFlag = false
        BresenhamLine(Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2))
    }
}

function regionCode(x,y, xmin, ymin, xmax, ymax) {
    var codigo = 0

    if(x < xmin) {
        codigo += 1
    }

    if(x > xmax) {
        codigo += 2
    }

    if(y < ymin) {
        codigo += 4
    }

    if(y > ymax) {
        codigo += 8
    }

    return codigo
}

function recLiang (limites) {
    if (linesList.length === 0 
        && polygonsList.length === 0
        && circumferencesList.length === 0
    ) {
        alert("Não há objetos desenhados!")
    } else {
        var xmin = 0
        var xmax = 0
        var ymin = 0 
        var ymax = 0
        
        if(limites[0].x < limites[1].x) {
            xmin = limites[0].x
            xmax = limites[1].x
        } else {
            xmin = limites[1].x
            xmax = limites[0].x
        }

        if(limites[0].y < limites[1].y) {
            ymin = limites[0].y
            ymax = limites[1].y
        } else {
            ymin = limites[1].y
            ymax = limites[0].y
        }

        linesList.forEach((line,i) => {
            clearPxFlag = true
            BresenhamLine(line.x1, line.y1, line.x2, line.y2)
            
            Liang(line.x1, line.y1, line.x2, line.y2, xmin, ymin, xmax, ymax)
         })

    }   
}

var u1Obj = { u1: 0.0}
var u2Obj = { u2: 0.0 }

function Liang (x1,y1,x2,y2, xmin, ymin, xmax, ymax) {
    u1Obj.u1 = 0.0
    u2Obj.u2 = 1.0
    var dx = x2 - x1
    var dy = y2 - y1

    if(clipTest(-dx, x1-xmin, u1Obj,u2Obj)) {
        if(clipTest(dx, xmax -x1, u1Obj,u2Obj)) {
            if(clipTest(-dy, y1-ymin, u1Obj,u2Obj)) {
                if(clipTest(dy, ymax - y1, u1Obj,u2Obj)) {
                    if(u2Obj.u2 < 1) {
                        x2 = x1 + u2Obj.u2*dx
                        y2 = y1 + u2Obj.u2*dy
                    }
                    if(u1Obj.u1 > 0) {
                        x1 = x1 + u1Obj.u1*dx
                        y1 = y1 + u1Obj.u1*dy
                    }
                    clearPxFlag = false
                    BresenhamLine(x1, y1, x2, y2)
                }
            }
        }
    }
}

function clipTest(p,q,u1Obj,u2Obj) {
    var result = true
    var r = 0.0

    if(p < 0.0) {
       r = q/p
       if(r> u2Obj.u2) { result = false } 
       else if (r>u1Obj.u1) {u1Obj.u1 = r}
    } else if(p>0.0) {
        r = q/p
        if(r< u1Obj.u1){ result = false}
        else if(r < u2Obj.u2) {u2Obj.u2 = r}
    } else if( q<0.0) {
        result = false
    }
    console.log(u1Obj.u1,u2Obj.u2)
    return result
}
