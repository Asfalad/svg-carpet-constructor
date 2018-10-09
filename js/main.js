var s = Snap('#surface');
var g = s.group();
var sel = s.group();
var viewBox = { x: 0, y: 0, width: 0, height: 0 };
function setViewBox(x, y, width, height) {
    s.attr({ viewBox: x + ',' + y + ',' + width + ',' + height });
}

function resize() {
    var width = $(window).width();

    if (width <= 1024) {
        viewBox.width = 1280;
        viewBox.height = 1024;
        setViewBox(0, 0, 1280, 1024);
    } else if (width > 1024) {
        viewBox.width = 2048;
        viewBox.height = 1536;
        setViewBox(0, 0, 2048, 1536);
    }
}
resize();

$(window).resize(resize);

var drag = false;
var select = false;
var changeColor = false;
var clearColor = false;
var changeColorData = '';
var items = 0;
var summ = 0;
var price = {
    '1': 1500,
    '3': 1500,
    '5': 1500,
    '11': 1500,
    '12': 1500,
    '14': 1500,
    '18': 1500,
    '19': 1500,
    '23': 1500,
    '25': 1500,
    '26': 1500,
    '27': 1500,
    '29': 1500,
    '30': 1500,
    '32': 1500,
    '33': 1500,
    '35': 1500,
    '44': 1500,
    '45': 1500,
    '48': 1500
}
var count = 1;

var elements = [];

Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.altDrag = function () {
        this.drag(dragMove, dragStart, dragEnd);
        return this;
    }
    var dragStart = function (x, y, ev) {
        this.data('ot', this.transform().local);
    }

    var dragMove = function (dx, dy, ev, x, y) {
        var tdx, tdy;
        var snapInvMatrix = this.transform().diffMatrix.invert();
        snapInvMatrix.e = snapInvMatrix.f = 0;
        tdx = snapInvMatrix.x(dx, dy); tdy = snapInvMatrix.y(dx, dy);
        var rotated = this.data('rotation');
        if (rotated == true) {
            var xSnap = Snap.snapTo(136, tdx, 1000000);
            var ySnap = Snap.snapTo(136, tdy, 1000000);
        } else {
            var xSnap = Snap.snapTo(136, tdx, 1000000);
            var ySnap = Snap.snapTo(136, tdy, 1000000);
        }

        this.transform("t" + [xSnap, ySnap] + this.data('ot'));
    }

    var dragEnd = function (event) {
    }
});

Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.rotateCenter = function (angle) {
        var bbox = this.getBBox();

        var matrix = new Snap.Matrix();
        matrix.rotate(angle, bbox.cx, bbox.cy);
        matrix.add(this.transform().localMatrix);

        this.transform(matrix);

        return this;
    }
});

Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.move = function (x, y) {
        var bbox = this.getBBox();

        var matrix = new Snap.Matrix();
        matrix.translate(x, y);
        matrix.add(this.transform().localMatrix);

        this.transform(matrix);

        return this;
    }
});

Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.moveRotate = function (angle, x, y) {
        var bbox = this.getBBox();

        var matrix = new Snap.Matrix();
        matrix.translate(x, y);
        matrix.rotate(angle, bbox.cx, bbox.cy);
        matrix.add(this.transform().localMatrix);

        this.transform(matrix);

        return this;
    }
});

function rotate(i) {
    var rotated = i.data('rotation');

    if (rotated == true) {
        i.moveRotate(90, -136, 0);
    }
    else {
        i.moveRotate(90, 136, 0);
    }
    i.data('rotation', !rotated);
}

function puzzleClick() {
    if (select == true) {
        this.toggleClass('selected');
    }
    if (changeColor == true && clearColor == false) {
        var pattern = s.image("img/" + changeColorData + ".jpg", 0, 0, 200, 200).pattern(0, 0, 200, 200);
        this.attr({
            fill: pattern,
            stroke: '#333'
        });
        var p = this.data('price');
        if (!p) {
            summ += price[changeColorData];
            items += 1;
            this.data('price', price[changeColorData]);
            $('#price').text(summ);
            sel.append(this);
            var box = sel.getBBox();
            calculateWidth();
        }
    }
    if (changeColor == false && clearColor == true) {
        this.attr({
            fill: 'transparent',
            stroke: '#ccc'
        })
        var p = this.data('price');
        if (p) {
            summ -= p;
            items -= 1;
            this.removeData('price');
            $('#price').text(summ);
            g.append(this);
            calculateWidth();
        }
        calculateWidth();
    }
    return false;
}

function calculateWidth() {
    var box = sel.getBBox();
    var width = box.width / 6.7;
    var height = box.height / 6.7;
    $('#size').text(width.toFixed(2) + 'см x ' + height.toFixed(2) + 'см');
    $('#count').text(items);
}

function initialize() {
    Snap.load('img/puzzle.svg', function (f) {
        var i = f.select('g');
        for (var a = 0; a < 25; a++) {
            for (var b = 0; b < 13; b++) {
                var el = i.clone();
                el.attr({ fill: 'transparent', stroke: '#ccc', strokeWidth: 1 });
                /* el.altDrag(); */
                el.data('rotation', true);
                el.data('id', count);
                el.data('bbox', el.getBBox());
                /* el.dblclick(function(){
                    rotate(this);
                }); */

                el.click(puzzleClick);
                g.append(el);

                var x = viewBox.x + (a * 136) - 680;

                var y = viewBox.y + (b * 136) - 136;

                el.move(Snap.snapTo(136, x, 1000000), Snap.snapTo(136, y, 1000000));
                if ((a % 2) == 0) {
                    el.rotateCenter(90);
                }
                if ((b % 2) == 0) {
                    el.rotateCenter(90);
                }
                count = count + 1;
                elements.push(el);
            }
        }
    });
    $('#price').text(summ);
    var box = sel.getBBox();
    calculateWidth();
}


addWheelListener(window, function (e) {
    e.preventDefault();
    viewBox.x -= e.deltaY * 10;
    viewBox.y -= e.deltaY * 10;
    viewBox.width += e.deltaY * 30;
    viewBox.height += e.deltaY * 30;

    setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    return false;
});

var objzoom = document.getElementById("surface");
var scaling = false;
var dist = 0;
var scale_factor = 1.0;
var scale_fit = 10.0;
var curr_scale = 1.0;
var max_zoom = 8.0;
var min_zoom = 0.5
/*Пишем функцию, которая определяет расстояние меж пальцами*/
function distance(p1, p2) {
    return (Math.sqrt(Math.pow((p1.clientX - p2.clientX), 2) + Math.pow((p1.clientY - p2.clientY), 2)));
}
/*Ловим начало косания*/
objzoom.addEventListener('touchstart', function (evt) {
    var tt = evt.touches;
    if (tt.length >= 2) {
        evt.preventDefault();
        dist = distance(tt[0], tt[1]);
        scaling = true;
    } else {
        scaling = false;
    }
}, false);
/*Ловим зумирование*/
objzoom.addEventListener('touchmove', function (evt) {
    evt.preventDefault();
    var tt = evt.touches;
    if (scaling) {
        /*
        last_distance > current_distance ? 
        */

        var curr_dist = distance(tt[0], tt[1]);

        var delta = dist - curr_dist;

        viewBox.x -= delta / 15;
        viewBox.y -= delta / 15;
        viewBox.width += delta / 5;
        viewBox.height += delta / 5;

        setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    }
}, false);
/*Ловим конец косания*/
objzoom.addEventListener('touchend', function (evt) {
    var tt = evt.touches;
    if (tt.length < 2) {
        scaling = false;

        var curr_dist = distance(tt[0], tt[1]);

        var delta = dist - curr_dist;

        viewBox.x -= delta;
        viewBox.y -= delta;
        viewBox.width += delta;
        viewBox.height += delta;

        setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
        
        //curr_scale = distance(tt[0], tt[1]) / dist * scale_factor;
    } else {
        scaling = true;
    }
}, false);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Control') {
        select = true;
    }
});
document.addEventListener('mousemove', function (e) {
    if (drag == true) {
        viewBox.x -= e.movementX * 2;
        viewBox.y -= e.movementY * 2;
        setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    }
});

document.addEventListener('keyup', function (e) {
    if (e.key === ' ' && drag == true) {
        drag = false;
        document.body.style.cursor = "auto";
    }
    if (e.key === 'Control') {
        select = false;
    }
});

function selectColor(color, event) {
    $('.selected-color').removeClass('selected-color');
    $(event.target).addClass('selected-color');
    if (color !== '0') {
        $('body').css({ 'cursor': 'url("img/' + color + '-cur.png"), auto' });
        changeColorData = color;
        changeColor = true;
        clearColor = false;
    }
    else {
        $('body').css({ 'cursor': 'url("img/clear-cur.png"), auto' });
        changeColor = false;
        clearColor = true;
    }
}

$(document).ready(function(){
    $('#surface').focus();
    initialize();

    jQuery.get('https://mymatto.ru/api/carpets', function(data){
        price = data.data;
    });
})