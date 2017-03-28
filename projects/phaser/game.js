//Instância do jogo
var game = new Phaser.Game(832, 576, Phaser.AUTO, 'game', {create: create, update: update, render: render});

//Tamanho em pixels de um tile (os sprites são 8x8px, aumentados 8x, logo, 64x64px)
var TILE_SIZE = 64;

//Pra facilitar na hora de fazer laços for. Como o jogo não altera o tamanho do canvas, são constantes (13x9 tiles)
//Largura em tiles do mundo
var TILE_WIDTH = 13;
//Altura em tiles do mundo
var TILE_HEIGHT = 9;

//Objeto do player
var player;
//Manager do teclado
var cursors;
//Grupo de paredes
var walls;

var winText;
var winStyle;

function create() {
    var playerFrame0 = [
	'..AAAA.A',
	'..ABBA.A',
	'..ABBA.A',
	'AAAAAA.A',
	'AAAAAAA.',
	'AAAAAA..',
	'..AAAA..',
	'..A..A..'
    ];
    game.create.texture('playerTex', playerFrame0, 8, 8, 0);
    
    var wallFrame0 = [
	'ABABABAB',
	'BABABABA',
	'ABABABAB',
	'BABABABA',
	'ABABABAB',
	'BABABABA',
	'ABABABAB',
	'BABABABA'
    ];
    game.create.texture('wallTex', wallFrame0, 8, 8, 0);
    
    var bulletFrame0 = [
	'AA',
	'AA'
    ];
    game.create.texture('bulletTex', bulletFrame0, 8, 8, 0);
    
    var enemyFrame0 = [
	'BAAAAAAB',
	'AABAABAA',
	'AABAABAA',
	'AAAAAAAA',
	'AAABBAAA',
	'AABAABAA',
	'BAAAAAAB',
	'BABAABAB'
    ];
    game.create.texture('enemyTex', enemyFrame0, 8, 8, 0);
    
    weapon = game.add.weapon(30, 'bulletTex');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 600;
    weapon.fireRate = 300;
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.stage.backgroundColor = '#a3ce27';
    
    walls = game.add.group();
    enemies = game.add.group();
    
    createWalls();
    createEnemies();
    player = game.add.sprite(400, 450, 'playerTex');
    player.anchor.set(0.5);
    
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    
    weapon.trackSprite(player, 0, 0, false);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    
    winText = "Você Ganhou!"
    winStyle = {font:"Press Start 2P",fill:"#44891a",align:"center",fontSize:1000,fontStyle:"cursive"}
}

function update() {
    
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (enemies.countLiving() == 0) {
        
        return
    }
    
    game.physics.arcade.collide(player, walls);
    game.physics.arcade.overlap(weapon.bullets,enemies,hitEnemy,null,this)
    
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -200;
        player.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 200;
        player.scale.x = 1;
    }

    if (cursors.up.isDown)
    {
        player.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 200;
    }
    
    if (fireButton.isDown) {
        weapon.fire();
    }
}

function render() {
    if (enemies.countLiving() == 0) {
        game.add.text(game.world.width*0.5,game.world.height*0.5,winText, winStyle)
    }
}

function createEnemies() {
    for (i = 0; i < 4; i++) {
        var enemy = game.add.sprite((2+2*i)*70, 70, 'enemyTex');
        game.physics.arcade.enable(enemy);
        enemies.add(enemy)
    }
}

function hitEnemy(bullet,enemy) {
    enemy.kill();
    bullet.kill();
}

function createWalls() {
    for (i = 0; i < TILE_WIDTH; i++)
        for (j = 0; j < TILE_HEIGHT; j++)
            //Usamos -1 nos TILE_WIDTH e TILE_HEIGHT pq o iterador começa em 0
            if ((i == 0 || i == TILE_WIDTH-1) || (j == 0 || j == TILE_HEIGHT-1)) {
                var wall = game.add.sprite(i*TILE_SIZE, j*TILE_SIZE, 'wallTex');
                game.physics.arcade.enable(wall);
                wall.body.immovable = true;
                walls.add(wall);
                
            }
}