let cont = document.querySelector(".cont");
let parr = document.querySelector(".par");
let prev = document.querySelector(".prev");
let mode_elem = document.querySelector(".mode");
rect = cont.getBoundingClientRect();
prev_rect = prev.getBoundingClientRect();

let pressed = false;
let begx = 0,
    begy = 0;
let deltax = 0,
    deltay = 0;

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.begx = x;
        this.begy = y;
    }
    scale(m_x, m_y, plus) {
        // if (m_x > x && m_x < x + this.width && m_y > y && m_y < y + this.height)
        const left = this.x, top = this.y, right = this.x + this.width, bottom = this.y + this.height;
        const lt = new Vec(left - m_x, top - m_y);
        /** @type {Vec} */

        const coeff = plus === true ? 1.1 : 1 / 1.1;

        const nw_lt = lt.multiplyBy(coeff);
        this.x = m_x + nw_lt.x;
        this.y = m_y + nw_lt.y;
        this.width *= coeff;
        this.height *= coeff;
    }
    // scale_inside()
}

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    multiplyBy(coef) {
        return new Vec(this.x * coef, this.y * coef);
    }
    dot(arg) {
        return this.x * arg.x + this.y * arg.y;
    }
    cross_len(arg) {
        return this.x * arg.y - this.y * arg.x;
    }
}


let mode = false;
// parr.addEventListener("mousedown", e => {
//     x = e.clientX - rect.left;
//     y = e.clientY - rect.top;

//     console.log("d", x, y);
//     pressed = true;
//     begx = x;
//     begy = y;
// });

// parr.addEventListener("mouseup", e => {
//     x = e.clientX - rect.left;
//     y = e.clientY - rect.top;

//     // console.log("u", x, y);
//     pressed = false;

//     if (mode === false) {
//         trax += deltax;
//         tray += deltay;
//     }
// });

prev.addEventListener("mousedown", e => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    console.log("d", x, y);
    pressed = true;
    begx = x;
    begy = y;
    myAwesomeRect.begx = myAwesomeRect.x;
    myAwesomeRect.begy = myAwesomeRect.y;
});

prev.addEventListener("mouseup", e => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    console.log("u", x, y);
    pressed = false;

    if (mode === false) {
        myAwesomeRect.begx = myAwesomeRect.x;
        myAwesomeRect.begy = myAwesomeRect.y;
    }
});

document.addEventListener("keypress", e => {
    if (e.key == 'm') {
        mode = !mode;
        mode_elem.innerHTML = mode.toString();
    }
})

let trans = function (sc, x, y) {
    cont.style.transform = "translate(" + x + "px, " + y + "px) scale(" + sc + ")";
}

let tran_origin = function (x, y) {
    cont.style.transformOrigin = x + "px " + y + "px";
}

prev.addEventListener("mousemove", e => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    deltax = x - begx;
    deltay = y - begy;

    if (pressed) {
        // console.log("m", deltax, deltay);

        myAwesomeRect.x = myAwesomeRect.begx + deltax;
        myAwesomeRect.y = myAwesomeRect.begy + deltay;

        Draw();
    }
});

let Draw = function () {
    drawPreview();
    tran_origin(center.x, center.y);
    trans(800 / myAwesomeRect.width, 0, 0);
}


let getScale = function (num) {
    return Math.pow(1.1, scale_num);
}
let scale_num = 20;
let scale = getScale(scale_num);
let myAwesomeRect = new Rectangle(30, 20, 800 / scale, 600 / scale);

prev.addEventListener("wheel", e => {
    scale_num -= Math.sign(e.deltaY);
    scale = getScale(scale_num);
    // myAwesomeRect = new Rectangle(myAwesomeRect.x, myAwesomeRect.y, 800 / scale, 600 / scale);

    let m_x = e.clientX - prev_rect.left;
    let m_y = e.clientY - prev_rect.top;

    myAwesomeRect.scale(m_x, m_y, Math.sign(e.deltaY) > 0)
    Draw();
});

parr.addEventListener("mouseleave", e => {
    // pressed = false;
});

cont.addEventListener("dragstart", event => {
    event.preventDefault();
});

let c = document.querySelector("#myCanvas");


/** @type {CanvasRenderingContext2D} */
let ctx = c.getContext("2d");

let center = new Vec(0, 0);
let drawPreview = function () {
    ctx.clearRect(0, 0, 800, 600);
    let as = new Vec(0, 0);
    let bs = new Vec(0, 600);

    let ad = new Vec(myAwesomeRect.x - 0, myAwesomeRect.y - 0);
    let bd = new Vec(myAwesomeRect.x - 0, (myAwesomeRect.y + myAwesomeRect.height) - 600);

    let den = ad.x * bd.y - ad.y * bd.x;
    u = (as.y * bd.x + bd.y * bs.x - bs.y * bd.x - bd.y * as.x) / den;

    center = new Vec(as.x + ad.x * u, as.y + ad.y * u);

    ctx.beginPath();
    ctx.rect(0, 0, 800, 600);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.clearRect(myAwesomeRect.x, myAwesomeRect.y, myAwesomeRect.width, myAwesomeRect.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(myAwesomeRect.x, myAwesomeRect.y, myAwesomeRect.width, myAwesomeRect.height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(as.x, as.y);
    ctx.lineTo(center.x, center.y);
    ctx.moveTo(bs.x, bs.y);
    ctx.lineTo(center.x, center.y);

    ctx.moveTo(as.x + 800, as.y);
    ctx.lineTo(center.x, center.y);
    ctx.moveTo(bs.x + 800, bs.y);
    ctx.lineTo(center.x, center.y);
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([]);
}
Draw();