/*

    Se introduce el concepto llamados "herpenet"(¿? no sé si esta bien escrito), estos no pertenecen al scope
(del objeto) pero nos ayuda a realizar ciertas cosas.

*/


//Pizarrón - Board
(function(){

    self.Board = function(width, height){

        this.width = width;
        this.height = height;
        this.playing = false; //si se está jugando
        this.game_over = false; //Cunado alguien gana
        this.bars = [];
        this.ball = null;
    };

    //Modificar el prototipo de la clase para colocar los métodos de la misma
    self.Board.prototype = {

        //Para retornar todos los elementos que hay en el tablero
        get elements(){

            var elements = this.bars.map(function(bar){return bar;});
             elements.push(this.ball); // Se agrega la pelota al juego

            return elements;

        }

    };

})();
//dibujando bola
(function(){

    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x= 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;
        board.ball = this;
        this.kind = "circle";
    }
        self.Ball.prototype = {
            //mover bolla;
            move: function(){
                this.x += (this.speed_x * this.direction);
                this.y += (this.speed_y);
            },
            collision: function(bar){
                //Reacciona a la colisión con una barra que recibe como parámetro
			var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

			var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

			this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
			console.log(this.bounce_angle);
			this.speed_y = this.speed * -Math.sin(this.bounce_angle);
			this.speed_x = this.speed * Math.cos(this.bounce_angle);

			if(this.x > (this.board.width / 2)) this.direction = -1;
			else this.direction = 1;
             },
            get width(){
            return this.radius * 2;
             },
            get height(){
                return this.radius * 2;
                }
        }

        
})();

//Se dibujan las barras y lo siguiente se auto ejecuta
(function(){

    self.Bar = function(x,y,width,height,board){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this); //Se agrega un nuevo elemento al board para uqe haya otra barra
        //Para dibujar la barra
        this.kind = "rectangle"; //Se indica que es un rectángulo
        this.speed = 15;


    };

    //Se modifica el prototype de la función de arriba para mover el objeto, esto sirve para separar las cosas
    self.Bar.prototype = {

        //Mover hacia abajo
        down: function(){

            this.y += this.speed;
        },

        //Mover hacia arriba
        up: function(){
            this.y -= this.speed;

        },
        toString: function(){
            return "x: "+this.x +"Y: "+this.y;
        }

    };

})();

//Creamos una clase que se encarga de dibujar todo el tablero.
(function(){

    // Esto dibujará todos los elementos de la vista
    self.BoardView = function(canvas,board){

        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;

        //Se dibuja un contexto con el cual se dibuja en javascriot
        this.ctx = canvas.getContext("2d");

    };

    //Se añade un elemento al protorype del BoardView
    //Dibuja los elementos que hay en el board en un ciclo
    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw: function(){
            for(var i = this.board.elements.length -1; i >= 0; i-- ){
                var el = this.board.elements[i];
                draw(this.ctx,el);
            }
        },
        check_collisions: function(){
            for (var i = this.board.bars.length - 1; i>=0; i--) {
                var bar = this.board.bars[i];
               if(hit(bar, this.board.ball)){

					this.board.ball.collision(bar);
				}
            };
        },
        play: function(){
            if(this.board.playing){
            this.clean();
            this.draw();
            this.check_collisions();
            this.board.ball.move();
            }
        }

     
    }
   function hit(a,b){
            //Revisa si a colisiona con b
		var hit = false;
		//Colsiones horizontales
		if(b.x + b.width >= a.x && b.x < a.x + a.width)
		{
			//Colisiones verticales
			if(b.y + b.height >= a.y && b.y < a.y + a.height)
				hit = true;
		}
		//Colisión de a con b
		if(b.x <= a.x && b.x + b.width >= a.x + a.width)
		{
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
				hit = true;
		}
		//Colisión b con a
		if(a.x <= b.x && a.x + a.width >= b.x + b.width)
		{
			if(a.y <= b.y && a.y + a.height >= b.y + b.height)
				hit = true;
		}
		
		return hit;
    }

    //Se dibujan elementos en pantalla (las barras)
    function draw(ctx,element){
            //Depende el tipo que sea el objeto, se dibuja de cierta manera
            switch(element.kind){

                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case "circle":
                    ctx.beginPath();
                    ctx.arc(element.x,element.y,element.radius,0,7);
                    ctx.fill();
                    ctx.closePath();
                break;


            }

        }


})();
//creacion de elementos
    var board = new Board(800,400);
    var bar_1 = new Bar(20, 100, 30, 20, board);
    var bar_2 = new Bar(735, 100, 30, 20, board);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);
    var ball = new Ball(350,100,10,board);
//envento para mover barra

document.addEventListener("keydown", function(ev){

    if(ev.keyCode == 38){
        ev.preventDefault();
        bar_2.up();
    }
    else if(ev.keyCode == 40){
        ev.preventDefault();
        bar_2.down();
    }
    else if(ev.keyCode == 87){
        ev.preventDefault();
         bar_1.up();
    }
    else if(ev.keyCode == 83){
        ev.preventDefault();
         bar_1.down();      
    }else if(ev.keyCode == 32){
        ev.preventDefault();
        board.playing = !board.playing;
       
    }
      
});
board_view.draw();
    window.requestAnimationFrame(controller);

//Función que va a ejecutar todos los elementos
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);

}