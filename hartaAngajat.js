function createMap() {

    var $map = document.getElementById("mapContainer");

    var extraWidth = 50;
    var extraHeight = 50;

    var offsetX = document.getElementById("scrollContainer").offsetLeft;
    var offsetY = document.getElementById("scrollContainer").offsetTop;


    var count = 0;

    var pixelsOnMeter = 50;
    var fontSize = 9;
    var width = document.getElementById("widthSpatiu").value * pixelsOnMeter;
    var height = document.getElementById("heightSpatiu").value * pixelsOnMeter;

    var scrollTop = 0;
    var scrollLeft = 0;

    var dragok = false;
    var startX;
    var startY;

    var zoomFract = 19 / 20;

    var deskList = [];

    ajaxGet(deskList, pixelsOnMeter);

    document.getElementById("scrollContainer").onscroll = function () {
        scrollLeft = this.scrollLeft;
        scrollTop = this.scrollTop;

    };

    var rect = function (x, y, width, height, fill, border, numeAngajat, interior, fontSize) {
        var $myBtn = document.createElement("button");
        $myBtn.setAttribute('class', 'desk');
        $myBtn.setAttribute('type', 'button');
        $myBtn.style.width = width;
        $myBtn.style.height = height;
        $myBtn.style.marginTop = y + "px";
        $myBtn.style.marginLeft = x + "px";
        $myBtn.style.position = "absolute";
        $myBtn.style.background = fill;
        $myBtn.style.borderRadius = "3px";
        $myBtn.style.border = "0.5px solid " + border;
        $myBtn.style.zIndex = "100";
        $myBtn.style.color = "#000000";
        $myBtn.style.fontSize = fontSize + "px";

        $myBtn.innerHTML = numeAngajat + "<br>" + interior;
        $map.appendChild($myBtn);
    };

    function clear() {
        $map.innerHTML = null;
    }

    function draw() {
        clear();
        $map.style.backgroundColor = "white";
        $map.style.width = width;
        $map.style.height = height;

        for (var i = 0; i < deskList.length; i++) {
            var r = deskList[i];
            if (r.angajat.length > 0) {
                if (r.interior !== null) {
                    rect(r.x, r.y, r.width, r.height, "#FF6347", "#B22222", r.angajat, r.interior, fontSize);
                }
                else {
                    rect(r.x, r.y, r.width, r.height, "#FF6347", "#B22222", r.angajat, "", fontSize)
                }
            } else {
                if (r.interior !== null) {
                    rect(r.x, r.y, r.width, r.height, "#32CD32", "#228B22", "", r.interior, fontSize);
                }
                else {
                    rect(r.x, r.y, r.width, r.height, "#32CD32", "#228B22", "", "", fontSize);
                }

            }
        }
    }

    $map.onmousedown = function (e) {
        if (e.which === 1) {
            e.preventDefault();
            e.stopPropagation();

            var mx = parseInt(e.pageX - offsetX + scrollLeft);
            var my = parseInt(e.pageY - offsetY + scrollTop);

            dragok = false;
            for (var i = 0; i < deskList.length; i++) {
                var r = deskList[i];
                if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
                    dragok = true;
                    r.isDragging = true;
                }
            }
            startX = mx;
            startY = my;
        }
    };

    document.onmouseup = function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragok = false;
        for (var i = 0; i < deskList.length; i++) {
            if (deskList[i].isDragging) {
                if (count === 0) {
                    ajaxSend(deskList[i].id, deskList[i].x, deskList[i].y);
                } else if (count > 0) {
                    ajaxSend(deskList[i].id, Math.round(deskList[i].x * Math.pow(zoomFract, count)), Math.round(deskList[i].y * Math.pow(zoomFract, count)));
                } else if (count < 0) {
                    ajaxSend(deskList[i].id, Math.round(deskList[i].x * (1 / Math.pow(zoomFract, -count))), Math.round(deskList[i].y * (1 / Math.pow(zoomFract, -count))));
                }
            }
            deskList[i].isDragging = false;
        }
        document.getElementById("custom-menu").style.display = "none";
    };

    document.onmousemove = function (e) {
        if (dragok) {
            e.preventDefault();
            e.stopPropagation();

            var mx = parseInt(e.pageX - offsetX + scrollLeft);
            var my = parseInt(e.pageY - offsetY + scrollTop);

            var dx = mx - startX;
            var dy = my - startY;

            for (var i = 0; i < deskList.length; i++) {
                var r = deskList[i];
                var tempX = r.x;
                var tempY = r.y;
                if (r.isDragging) {
                    if (e.pageX > (offsetX - extraWidth) && e.pageX < (offsetX + width + extraWidth) && e.pageY > (offsetY - extraHeight) && e.pageY < (offsetY + height + extraHeight)) {
                        if ((e.pageX > (offsetX - extraWidth) && e.pageX < offsetX) || (e.pageX < (offsetX + width + extraWidth) && e.pageX > (offsetX + width))) {
                            r.y += dy;
                            if (e.pageX < offsetX) {
                                r.x = 0;
                            } else if (e.pageX > (width + offsetX)) {
                                r.x = width - r.width;
                            }
                        } else if ((e.pageY > (offsetY - extraWidth) && e.pageY < offsetY) || (e.pageY < (offsetY + height + extraHeight) && e.pageY > (offsetY + height))) {
                            r.x += dx;
                            if (e.pageY < offsetY) {
                                r.y = 0;
                            } else if (e.pageY > (height + offsetY)) {
                                r.y = height - r.height;
                            }
                        } else {
                            r.x += dx;
                            r.y += dy;
                        }

                        if (intersectMargin(r, width, height)) {
                            r.x = tempX;
                            r.y = tempY;
                        }
                        for (var j = 0; j < deskList.length; j++) {
                            var t = deskList[j];

                            if (t !== r) {
                                if (intersectRect(r, t)) {
                                    r.x = tempX;
                                    r.y = tempY;
                                }
                            }
                        }
                    } else {
                        r.isDragging = false;
                    }

                }
            }
            draw();
            startX = mx;
            startY = my;
        }
    };

    $map.oncontextmenu = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var mx = parseInt(e.pageX - offsetX + scrollLeft);
        var my = parseInt(e.pageY - offsetY + scrollTop);

        for (var i = 0; i < deskList.length; i++) {
            var r = deskList[i];
            if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
                document.getElementById("custom-menu").style.display = "block";
                document.getElementById("custom-menu").style.top = event.pageY + "px";
                document.getElementById("custom-menu").style.left = event.pageX + "px";

                contextOption(r.id, r.idAngajat);
            }
        }
    };

    document.getElementById("close").onclick = function () {
        document.getElementById("hartaModal").style.display = "none";
    };

    document.getElementById("addDesk").onclick = function () {
        var ok = true;
        for (var i = 0; i < deskList.length; i++) {
            var r = deskList[i];
            if (r.x < (2.5 * pixelsOnMeter) && r.y < (1.25 * pixelsOnMeter)) {
                ok = false;
            }
        }
        if (ok === true) {
            document.getElementById("addDeskSubmit").click();
        } else {
            alert("Înainte de a adăugă alt post mutaţi postul din zona de inceput");
        }
    };

    document.getElementById("zoomOut").onclick = function () {
        count--;
        width = width * zoomFract;
        height = height * zoomFract;
        fontSize = fontSize * zoomFract;
        for (var i = 0; i < deskList.length; i++) {
            var r = deskList[i];
            r.x = r.x * zoomFract;
            r.y = r.y * zoomFract;
            r.width = r.width * zoomFract;
            r.height = r.height * zoomFract;
            if (count < -4) {
                r.angajat = r.codAngajat;
            }
        }
        draw();
    };

    document.getElementById("zoomIn").onclick = function () {
        count++;
        width = width * (1 / zoomFract);
        height = height * (1 / zoomFract);
        fontSize = fontSize * (1 / zoomFract);
        for (var i = 0; i < deskList.length; i++) {
            var r = deskList[i];
            r.x = r.x * (1 / zoomFract);
            r.y = r.y * (1 / zoomFract);
            r.width = r.width * (1 / zoomFract);
            r.height = r.height * (1 / zoomFract);
            if (count === -4) {
                r.angajat = r.auxAngajat;
            }
        }
        draw();
    };


    function ajaxGet(deskList, pixelsOnMeter) {
        $.ajax({
            url: '/' + window.location.pathname.split('/')[1] + '/api/rs/workplace/list/' + document.getElementById("idSpatiu").value,
            type: "GET",
            dataType: "json",
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    deskList.push({
                        id: data[i].id,
                        x: data[i].x,
                        y: data[i].y,
                        width: data[i].width * pixelsOnMeter,
                        height: data[i].height * pixelsOnMeter,
                        angajat: "",
                        auxAngajat: "",
                        codAngajat: "",
                        idAngajat: "",
                        interior: data[i].interior,
                        isDragging: false
                    });
                    if (data[i].angajat !== null) {
                        deskList[i].codAngajat = data[i].angajat.cod;
                        deskList[i].angajat = data[i].angajat.numeComplet;
                        deskList[i].auxAngajat = data[i].angajat.numeComplet;
                        deskList[i].idAngajat = data[i].angajat.id;
                    }
                }
                draw();
            }
        });
    }
}

function contextOption(id, idAngajat) {
    var allOptions = document.querySelectorAll("#custom-menu p");

        allOptions[0].onclick = function (){
            if (idAngajat !== "") {
                window.location = '/' + window.location.pathname.split('/')[1] + '/mvc/angajat/view?id=' + idAngajat;
            } else {
                alert("Postul nu este ocupat");
            }
        };

        allOptions[1].onclick = function () {
            WorkplaceModal(id);
        };

        allOptions[2].onclick = function () {
            EditWorkplaceModal(id);
        };

        allOptions[3].onclick = function () {
            jQueryDeleteModal('/' + window.location.pathname.split('/')[1] + '/mvc/workplace/delete', id);
        };

}

function ajaxSend(id, x, y) {
    $.ajax({
        url: '/' + window.location.pathname.split('/')[1] + '/mvc/spatiu/view?id=' + document.getElementById("idSpatiu").value + '&ls=1',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        data: {
            idDesk: id,
            x: x,
            y: y
        }
    });
}

var intersectRect = function (r, t) {
    return (r.x < (t.x + t.width) && (r.x + r.width) > t.x && r.y < (t.y + t.height) && (r.y + r.height) > t.y);
};

var intersectMargin = function (r, width, height) {
    return ((r.x < 0) || (r.y < 0) || (r.x > (width - r.width)) || (r.y > (height - r.height)));
};
