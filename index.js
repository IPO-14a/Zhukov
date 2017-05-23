/**
* Канвас
* 
* Переменная типа канвас
*
* @var Canvas canvas
*/
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.fillStyle = 'black';

/**
* Изображение фона
* 
* Используем только класс Image
*
* @var Image imgBackground
*/
var imgBackground = new Image();
imgBackground.src = "img/background_blue.jpg";

var imgCube_first = new Image();
imgCube_first.src = "img/Cube_first.png";

var imgPlatform = new Image();
imgPlatform.src = "img/platform.png";

var imgWall = new Image();
imgWall.src = "img/wall.png";

var imgTriangle = new Image();
imgTriangle.src = "img/triangle.png";

var imgUnMute = new Image();
imgUnMute.src = "img/unMute.png";

var imgMute = new Image();
imgMute.src = "img/Mute.png";

var imgRestart = new Image();
imgRestart.src = "img/restart.png";

/**
* Фоновая музыка
* 
* Используем только класс Audio
*
* @var Audio backAudio
*/
var backAudio = document.getElementById("backAudio");

/**
 * Поле
 *
 * Класс описывает поведение,
 * поля во время игры.
 *
 * @author  Alex Zhukov
 * @version 1.0
 */
var field = {
    /**
    * Высота
    * 
    * Используем только значения
    * невыходящие за рамки типа int
    *
    * @var int height
    */
    height : 400,

    /**
    * Ширина
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int width
    */
    width : 800,

    /**
    * Проигрыш
    * 
    * Используем только логическое значение.
    *
    * @var bool isLose
    */
    isLose : false,

    /**
    * Координата x
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int x
    */
    x : 0,

    /**
    * Скорость
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int speed
    */
    speed : 8,
    
    /**
    * Работа со свойством {int $x}
    *
    * Уменьшает х на скорость движения
    * поля, если x меньше отрицательного
    * значения поля, то обнулить x.
    */
    nextX : function() {
        if (this.x <= -this.width)
            this.x = 0;
        this.x -= this.speed;
    },

    /**
    * Нарисовать поле
    *
    * Отрисовывает поле в зависимости от
    * значения x.
    */
    draw : function () {
        context.drawImage(imgBackground, field.x, 0, field.width, field.height);
        context.drawImage(imgBackground, field.x + field.width - 5, 0, field.width, field.height);
        context.drawImage(imgPlatform, field.x, 400 - 50, field.width, 50);
        context.drawImage(imgPlatform, field.x + field.width - 5, 400 - 50, field.width, 50);
    }
};

/**
 * Ячейка куб
 *
 * Класс описывает одно из
 * препятствий, куб.
 *
 * @author  Alex Zhukov
 * @version 1.0
 * @todo    Протестировать класс
 */
Cell = {
    /**
    * Координата x
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int x
    */
    x : 0,

    /**
    * Координата y
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int y
    */
    y : 300,

    /**
    * Высота
    * 
    * Используем только значения
    * невыходящие за рамки типа int
    *
    * @var int height
    */
    height : 50,

    /**
    * Ширина
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int width
    */
    width : 50,

    /**
    * Работа со свойством {int $x}
    *
    * Уменьшает х на скорость движения
    * поля.
    */
    nextX : function() {
        this.x -= field.speed;
    },

    /**
    * Нарисовать куб
    *
    * Отрисовывает куб в зависимости от
    * значения x.
    */
    draw : function() {
        context.drawImage(imgWall, this.x, this.y, this.width, this.height);
    },

    /**
    * Проверить столкновение куба с игроком
    *
    * Если было обнаружено столкновение
    * куба с игроком, то обнуляем скорость
    * поля. Если игрок запрыгнул на куб,
    * то убираем силу тяжести для него.
    * Если игрок сошел с куба, то включаем
    * силу тяжести.
    */
    checkCollision : function() {
        if (250 > this.x && 200 < this.x + this.width && user.y > this.y - this.height
            && user.y < this.y + this.height) {
            field.speed = 0;
            field.isLose = true;

        }
        else if (255 >= this.x && 205 <= this.x + this.width && user.y == this.y - this.height && !user.isJumping) {
            user.isOnPlatform = true;
        }
        else if ( 200 > this.x + this.width && 200 < this.x + this.width + 10 && this.y == user.y + 50) {
            user.isOnPlatform = false;
        }
    }
};

/**
 * Ячейка треугольник
 *
 * Класс описывает одно из
 * препятствий, шип. Оно убивает
 * игрока при любом столкновении
 * с ним.
 *
 * @author  Alex Zhukov
 * @version 1.0
 * @todo    Протестировать класс
 */
CellTriangle = {
    
    /**
    * Координата x
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int x
    */
    x : 0,

    /**
    * Координата y
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int y
    */
    y : 300,

    /**
    * Высота
    * 
    * Используем только значения
    * невыходящие за рамки типа int
    *
    * @var int height
    */

    height : 50,

    /**
    * Ширина
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int width
    */
    width : 50,

    /**
    * Работа со свойством {int $x}
    *
    * Уменьшает х на скорость движения
    * поля.
    */
    nextX : function() {
        this.x -= field.speed;
    },

    /**
    * Нарисовать треугольник
    *
    * Отрисовывает треугольник в зависимости от
    * значения x.
    */
    draw : function() {
        context.drawImage(imgTriangle, this.x, this.y, this.width, this.height);
    },

    /**
    * Проверить столкновение с треугольником
    *
    * Если было обнаружено столкновение
    * треугольника с игроком, то обнуляем 
    * скорость поля. 
    */
    checkCollision : function() {
        if (250 > this.x && 200 < this.x + this.width && 
            user.y >= this.y - this.height
            && user.y <= this.y + this.height) {
          
            field.speed = 0;
            field.isLose = true;
        }
    }
};

/**
 * Ячейка пустоты
 *
 * Класс описывает пустую ячейку.
 *
 * @author  Alex Zhukov
 * @version 1.0
 */
CellBlank = {
    x : 0,
    y : 300,
    height : 50,
    width : 50,

    nextX : function() {

    },

    draw : function() {

    },

    checkCollision : function() {

    }
};

/**
 * Ячейка пустоты
 *
 * Класс описывает логику игрока.
 *
 * @author  Alex Zhukov
 * @version 1.0
 */
var user = {

    /**
    * Координата y игрока
    * 
    * Используем только значения,
    * невыходящие за рамки типа int
    *
    * @var int y
    */
    y : 300,

    /**
    * Высота прыжка
    * 
    * Используем только значения,
    * невыходящие за рамки типа int 
    *
    * @var int heightJump
    */
    heightJump : 140,

    /**
    * Высота платформы
    * 
    * Используем только значения,
    * невыходящие за рамки типа int 
    *
    * @var int platform
    */
    platform : 300,

    /**
    * Нахождение на платформе
    * 
    * Используем логическое значение.
    *
    * @var bool isOnPlatform
    */
    isOnPlatform : true,

    /**
    * Возможность прыжка
    * 
    * Используем логическое значение.
    *
    * @var bool canJump
    */
    canJump : false,

    /**
    * Нахождение в прыжке
    * 
    * Используем логическое значение.
    *
    * @var bool canJump
    */
    isJumping : false,

    /**
    * Скорость прыжка
    * 
    * Используем только значения,
    * невыходящие за рамки типа int 
    *
    * @var int sppedJump
    */
    speedJump : 10,

    /**
    * Скорость падения
    * 
    * Используем только значения,
    * невыходящие за рамки типа int 
    *
    * @var int sppedFall
    */
    speedFall : 10,

    /**
    * Прыгнуть
    *
    * Если игрок не находится в
    * состоянии падения, то совершить
    * прыжок равный speedJump.
    */
    jump : function () {
        if (this.isOnPlatform && this.canJump) {
            this.isOnPlatform = false;
            this.isJumping = true;
            this.canJump = false;    
        }
        if (this.isJumping && this.platform < this.y + this.heightJump) {
            this.y -= this.speedJump;
        } else {
            this.isJumping = false;
        }
    },

    /**
    * Проверить силу тяжести
    *
    * Если игрок не находится на платформе,
    * то совршится его падение до любой из 
    * поверхностей.
    */
    checkGravity : function() {
        if (!this.isJumping && this.y != this.platform && !this.isOnPlatform) {
            this.y += this.y + this.speedFall < this.platform ?
             this.speedFall : this.platform - this.y;
        } else if (this.y == this.platform) {
            this.isOnPlatform = true;
        }
    },

    /**
    * Нарисовать игрока
    *
    * Отрисовывает игрока в зависимости от
    * значения y.
    */
    draw : function () {
        context.drawImage(imgCube_first, 200, user.y, 50, 50);
    }
};

/**
* Действие при загрузке окна
*
* Инициализирует игровой цикл,
* устанавливает обработчик событий
* на нажатие клавиш
*/
window.onload = function() {
    window.onkeydown = function(e) {
        if (user.isOnPlatform && e.keyCode == 32) {
            user.canJump = true;
            user.heightJump = 130 + (user.y - 300) * -1;
        }
    };
    backAudio.play();
    initMap();
    gameLoop();
};

/**
* Массив элементов поля
* 
* В данном массиве могут находится 
* значения типа CellTriangle, CellCube,
* CellBlank
*
* @var[] elements
*/
var elements = [];

/**
* Массив индексов строк
* 
* Используется значение типа int
*
* @var int[] countGenerate
*/
var countGenerate = [];

/**
* Массив расстояний
* 
* Используется значение типа int
*
* @var int[] distance
*/
var distance = [];

/**
* Пройденная дистанция
* 
* Используется значение типа int
*
* @var int countGenerate
*/
var allDistance = 0;

/**
* Карта
* 
* Используется значение типа String
*
* @var String map
*/
var map = [
            "                                                 ",
            "                                                 ",
            "                                                 ",
            "                000                000           ",
            "            00                 00 000            ",
            "       0001100            000  00 000          00",
            "00000000000000000    1000 000110001000011110   00",
        ];

map.reverse();

/**
* Работа строки {int $i}
*
* Отвечает за работу элементов, которые
* находятся на i строке карты.
*/
function workRow(i) {
    for (var j = 0; j < elements[i].length; j++) {
        elements[i][j].checkCollision();
        elements[i][j].nextX();
        elements[i][j].draw();
    }
};

/**
* Инициализация карты
*
* Инициализирует необходимые
* переменные для карты.
*/
function initMap() {
    for (var i = 0; i < map.length; i++) {
        elements.push([]);
        distance.push(0);
        countGenerate.push(0);
    }
};

/**
* Перезапуск карты
*
* Обнуляет карту и запускает
* заново.
*/
function restartMap() {
    elements.length = 0;
    distance.length = 0;
    countGenerate.length = 0;
};

/**
* Генерация карты
*
* Генерирует карту.
*/
function generateMap() {
    allDistance += field.speed;    
    for (var i = 0; i < map.length; i++) {
        generateRow(i);
        workRow(i);
    }
};


/**
* Генерировать строку {int $i}
*
* Генерирует строку карты исходя из
* переменной map.
*/
function generateRow(i) {
    if (countGenerate[i] + 1 < map[i].length) {
        if (elements[i].length > 0) {
            if (elements[i][0].x < 0) {
                elements[i].shift();
            }
        }
        distance[i] += 50;
        if (map[i][ countGenerate[i] ] == "0") {
            var cell = Object.create(Cell);
            cell.x = distance[i] + field.width;
            cell.y = cell.y - 50 * i;
            elements[i].push( cell );
        } else if (map[i][ countGenerate[i] ] == "1") {
            var cell = Object.create(CellTriangle);
            cell.x = distance[i] + field.width;
            cell.y = cell.y - 50 * i;
            elements[i].push( cell );
        } else if (map[i][ countGenerate[i] ] == " ") {
            var cell = Object.create(CellBlank);
            cell.x = distance[i] + field.width; 
            elements[i].push(cell);
        }
        countGenerate[i]++;           
    }
};

/**
* Нарисовать кнопку {Button $button}
*
* Рисует кнопку button.
*/
function drawButton(button){
    context.drawImage(button.image, button.x, button.y, button.w, button.h);
};

/**
 * Кнопка
 *
 * Класс описывает абстрактную
 * кнопку
 *
 * @author  Alex Zhukov
 * @version 1.0
 */
function Button(x, y, w, h, state, image, type) {
    /**
    * Координата x
    * 
    * Используется значение типа int
    *
    * @var int x
    */
    this.x = x;

    /**
    * Координата y
    * 
    * Используется значение типа int
    *
    * @var int y
    */
    this.y = y;

    /**
    * Ширина кнопки
    * 
    * Используется значение типа int
    *
    * @var int w
    */
    this.w = w;

    /**
    * Высота кнопки
    * 
    * Используется значение типа int
    *
    * @var int h
    */
    this.h = h;

    /**
    * Состояние кнопки
    * 
    * Используется логическое значение.
    *
    * @var bool state
    */
    this.state = state;

    /**
    * Картинка кнопки
    * 
    * Используется значение типа Image
    *
    * @var Image image
    */
    this.image = image;

    /**
    * Тип кнопки
    * 
    * Используется значение типа String
    *
    * @var String type
    */
    this.type = type;
};

var buttons = Array();
buttons.push( new Button(0, 0, 50, 50, true, imgUnMute, "volume") );
buttons.push( new Button(field.width - 50, 0, 50, 50, true, imgRestart, "restart") );

function drawButtons(){
    for (var i = 0; i < buttons.length; i++) {
        drawButton(buttons[i]);
    }
}

/**
* Игровой цикл
*
* Вызов данной функции приводит
* к вызову следующего шага игрового
* цикла.
*/
function gameLoop() {
    context.clearRect(0, 0, 800, 400);
    field.nextX();
    field.draw();
    generateMap();
    if ( !field.isLose ) {
        user.jump();
        user.checkGravity();
    } else {
        
        //user.lose();  
    } 
    user.draw(); 
    drawButtons();
    requestAnimationFrame(gameLoop);
};

/**
* Обработка нажатия кнопки Звук {Button $button}
*
* Состояние звука и кнопки переводится
* в обратное состояние.
*/
function buttonVolume(button){
     if (button.state) {
            button.state = false;
            backAudio.volume = 0;
            button.image = imgMute;
        } else {
            button.state = true;
            backAudio.volume = 1;
            button.image = imgUnMute;
        }
}; 

/**
* Обработка нажатия кнопки Рестарт {Button $button}
*
* Перезагружает карту и возвращает игрока и скорость
* в начальное положение.
*/
function buttonRestart(button){
    field.isLose = false;
    restartMap();
    initMap();
    field.speed = 8;
    user.y = 300;
}; 

/**
* Обработка нажатия мыши
*
* Если было нажатие на область экрана,
* в которой находится кнопка, то вызывается
* ее обработчик.
*/
canvas.onmousedown = function(e) {
    var mouse = console.log(e.x + " " + e.y);
    for (var i = 0; i < buttons.length; i++) {
        if (e.x > buttons[i].x && e.x < buttons[i].x + buttons[i].w &&
         e.y > buttons[i].y && e.y < buttons[i].y + buttons[i].h) {
            if (buttons[i].type === "volume")
                buttonVolume(buttons[i]);
            else if (buttons[i].type === "restart")
                buttonRestart(buttons[i]);
        }
    }
};
