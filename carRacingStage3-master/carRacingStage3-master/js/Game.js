class Game {
    constructor() {

    }

    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function(data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }

    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }

        car1 = createSprite(0, 0);
        car1.addImage("car1", car1_img);
        car2 = createSprite(0, 20);
        car2.addImage("car2", car2_img);
        car3 = createSprite(0, 40);
        car3.addImage("car3", car3_img);
        car4 = createSprite(0, 60);
        car4.addImage("car4", car4_img);
        cars = [car1, car2, car3, car4];
    }

    play() {
        form.hide();


        textSize(50);
        fill("black");
        textAlign(CENTER, CENTER);

        var time = 5 - World.seconds;
        if (time > 0) {
            text(time, 0, 200);
        } else {
            textSize(26);
            text("Go!!", 0, 200);
        }

        Player.getPlayerInfo();
        player.getCarsAtEnd();

        if (allPlayers !== undefined) {
            background(rgb(198, 135, 103));
            image(track, 200, 10, displayWidth * 5, displayHeight);

            //var display_position = 100;

            //index of the array
            var index = 0;

            //x and y position of the cars
            var x;
            var y = 100;

            for (var plr in allPlayers) {
                //add 1 to the index for every loop
                index = index + 1;

                //position the cars a little away from each other in x direction
                y = y + 120;
                //use data form the database to display the cars in y direction
                x = 150 + allPlayers[plr].distance;
                cars[index - 1].x = x;
                cars[index - 1].y = y;
                // console.log(index, player.index)


                if (index === player.index) {
                    stroke(10);
                    fill("red");
                    ellipse(x, y, 60, 60);
                    cars[index - 1].shapeColor = "red";
                    camera.position.x = cars[index - 1].x;
                    camera.position.y = displayHeight / 2;
                }

                //textSize(15);
                //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
            }

        }

        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance += 10
            player.update();
        }

        if (player.distance > 3860) {
            gameState = 2;
            player.rank += 1
            Player.updateCarsAtEnd(player.rank)
        }

        drawSprites();
    }

    end() {
        console.log("Game Ended");
        console.log(player.rank);
    }




}