//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 2100;
var gravedad = 8500;

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1480/5;
var gameVel = 5;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var contenedor;
var dino;
var textoScore;
var flashpoint;
var gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    flashpoint = document.querySelector(".flashpoint");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(parado) return;
    textoScore.innerText = Math.trunc(score);
    MoverDinosaurio();
    DecidirCrearObstaculos();
    MoverObstaculos();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        
        if (juegoEnCurso == true){
            Saltar();
        }
        else{
            reiniciar();
        }
        
    }
}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
        dino.classList.add("dino-saltando");
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    score=score+400*deltaTime;
    if(dinoPosY < sueloY){
        
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.remove("dino-saltando");
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
    terminarJuego();
      // Cuando se active la animación "dino-estrellado"
document.querySelector('.Flashpoint').classList.add('stop-background-animation');
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}


function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;

}

// Función para reiniciar la animación
function restartAnimation() {
    const element = document.querySelector('.Flashpoint');
    element.style.animation = 'none';
    void element.offsetWidth; // Reinicia la animación al forzar una reflow
    element.style.animation = null;
  }
  
  // Detecta cuando el suelo llega al final
  const ground = document.querySelector('.Flashpoint');
  ground.addEventListener('animationiteration', () => {
    restartAnimation();
  });


function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

let juegoEnCurso = true;

function iniciarJuego() {
    juegoEnCurso = true;
}

function terminarJuego() {
    juegoEnCurso = false;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Evitar comportamiento predeterminado de la barra espaciadora

        if (juegoEnCurso) {
            // Si el juego está en curso, salta
            saltar();
        } else {
            // Si el juego no está en curso, reinicia
            reiniciar();
        }
    }
});

function reiniciar() {
   // const resetButton = document.getElementById('resetButton');

            document.getElementById('btn-reiniciar').click(); // Simula un clic en el botón de reinicio
        }