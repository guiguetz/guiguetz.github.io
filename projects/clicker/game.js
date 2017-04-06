//Instância do jogo
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', '');

// O google fonts tem um loader no javascript, onde ele baixa e aplica a fonte pro canvas onde rola o jogo. Como é uma função assíncrona, tem gente que resolve botando uns delay mas se der algum ruim e chamar antes de carregar, o jogo faz caca. Usando esse método active, ele só executa depois que garantir que carregou a fonte. Como no nosso caso é só uma, é sussa.
var wfconfig = {
    active: function() { 
        game.state.start('play');
    },
    google: {
        families: ['Press Start 2P']
    }

};
WebFont.load(wfconfig);

//Ao invés de usar só um laço normal, criamos um estado chamado "play", assim podemos ter outros como "menu", "creditos" etc. Bem interessante. 
game.state.add('play', {
    preload: function() {

        //===========================//
        // Inicialização dos sprites //
        //===========================//

        var frame0 = [
            '00000000',
            '00000000',
            '00000000',
            '00000000',
            '00000000',
            '00000000',
            '00000000',
            '00000000'
        ];
        game.create.texture('enemyTex0', frame0, 8, 8, 0);

        var frame1 = [
            '11111111',
            '11111111',
            '11111111',
            '11111111',
            '11111111',
            '11111111',
            '11111111',
            '11111111'
        ];
        game.create.texture('enemyTex1', frame1, 8, 8, 0);

        var frame2 = [
            '22222222',
            '22222222',
            '22222222',
            '22222222',
            '22222222',
            '22222222',
            '22222222',
            '22222222'
        ];
        game.create.texture('enemyTex2', frame2, 8, 8, 0);

        var frame3 = [
            '33333333',
            '33333333',
            '33333333',
            '33333333',
            '33333333',
            '33333333',
            '33333333',
            '33333333'
        ];
        game.create.texture('enemyTex3', frame3, 8, 8, 0);

        var frame4 = [
            '44444444',
            '44444444',
            '44444444',
            '44444444',
            '44444444',
            '44444444',
            '44444444',
            '44444444'
        ];
        game.create.texture('enemyTex4', frame4, 8, 8, 0);

        var frame5 = [
            'FF',
            'FF'
        ];
        game.create.texture('coinTex1', frame5, 8, 8, 0);

        var frame6 = [
            '55555555',
            '55555555',
            '55555555',
            '55555555',
            '55555555',
            '55555555',
            '55555555',
            '55555555'
        ];
        game.create.texture('upgradeTex1', frame6, 4, 4, 0);

        var frame7 =  [
            '88888888',
            '88888888',
            '88888888',
            '88888888',
            '88888888',
            '88888888',
            '88888888',
            '88888888'
        ];
        game.create.texture('upgradeTex2', frame7, 4, 4, 0);

        //==========================//
        // Inicialização dos botões //
        //==========================//

        // Fundo
        /*var upgradeBackdrop = this.game.add.bitmapData(246, 500);
        upgradeBackdrop.ctx.fillStyle = '#a3ce27';
        upgradeBackdrop.ctx.strokeStyle = '#44891a';
        upgradeBackdrop.ctx.lineWidth = 3;
        upgradeBackdrop.ctx.fillRect(0, 0, 246, 500);
        upgradeBackdrop.ctx.strokeRect(0, 0, 246, 500);
        this.game.cache.addBitmapData('upgradePanel', upgradeBackdrop);*/
        game.load.image('upgradePanel','assets/ui/upgradeBackdrop.png');

        // Botão padrão
        /*var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = '#a3ce27';
        buttonImage.ctx.strokeStyle = '#44891a';
        buttonImage.ctx.lineWidth = 3;
        buttonImage.ctx.fillRect(0, 0, 230, 48);
        buttonImage.ctx.strokeRect(0, 0, 230, 48);
        this.game.cache.addBitmapData('button', buttonImage);*/
        game.load.image('button','assets/ui/upgradeButton.png');
        
        //==========================================//
        // Preload de algumas variáveis importantes //
        //==========================================//

        // Nível
        this.level = 1;
        // Monstros derrotados
        this.levelKills = 0;
        // Quantos monstros por nível
        this.levelKillsRequired = 10;

        //O nosso player.
        this.player = {
            clickDmg: 1, // Dano por clique
            gold: 999999, // Ouro inicial
            dps:0 // Dano por segundo
        };
    },
    create: function() {
        //Uma var chamada state com esse state, só pra facilitar ao invés de passar o ~this~
        var state = this;

        game.stage.backgroundColor = '#a3ce27';

        var monsterData = [
            {name: 'Enemy 1',    image: 'enemyTex0',  maxHealth: 1},
            {name: 'Enemy 2',    image: 'enemyTex1',  maxHealth: 2},
            {name: 'Enemy 3',    image: 'enemyTex2',  maxHealth: 3},
            {name: 'Enemy 4',    image: 'enemyTex3',  maxHealth: 4},
            {name: 'Enemy 5',    image: 'enemyTex4',  maxHealth: 5}
        ];

        this.monsters = this.game.add.group();

        var monster;
        monsterData.forEach(function(data) {
            monster = state.monsters.create(1000, state.game.world.centerY, data.image);
            monster.anchor.setTo(0.5);
            monster.details = data;
            monster.health = monster.maxHealth = data.maxHealth;

            monster.events.onKilled.add(state.onKilledMonster, state);
            monster.events.onRevived.add(state.onRevivedMonster, state);

            monster.inputEnabled = true;
            monster.events.onInputDown.add(state.onClickMonster, state);
        });

        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);

        this.monsterInfoUI = this.game.add.group();
        this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);

        this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
            font: '48px Press Start 2P',
            fill: '#44891a'
        }));
        this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, numeral(this.currentMonster.health).format('0a') + ' HP', {
            font: '32px Press Start 2P',
            fill: '#44891a'
        }));

        this.dmgTextPool = this.add.group();
        var dmgText;
        for (var d=0; d<50; d++) {
            dmgText = this.add.text(0, 0, '1', {
                font: '18px Press Start 2P',
                fill: '#44891a'
            });

            dmgText.exists = false;
            dmgText.tween = game.add.tween(dmgText)
                .to({
                alpha: 0,
                y: 100,
                x: this.game.rnd.integerInRange(200, 700)
            }, 1000, Phaser.Easing.Cubic.Out);

            dmgText.tween.onComplete.add(function(text, tween) {
                text.kill();
            });
            this.dmgTextPool.add(dmgText);
        }

        this.coins = this.add.group();
        this.coins.createMultiple(50, 'coinTex1', '', false);
        this.coins.setAll('inputEnabled', true);
        this.coins.setAll('goldValue', 1);
        this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);

        this.playerGoldText = this.add.text(30, 30, '$' + numeral(this.player.gold).format('0a'), {
            font: '24px Press Start 2P',
            fill: '#44891a'
        });

        this.upgradePanel = this.game.add.image(10, 70, 'upgradePanel');
        var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
        upgradeButtons.position.setTo(8, 8);

        var upgradeButtonsData = [
            {
                icon: 'upgradeTex1',
                name: 'Attack',
                level: 1,
                cost: 5,
                purchaseHandler: function(button, player) { player.clickDmg += 1; }
            },
            {
                icon: 'upgradeTex2',
                name: 'Auto-Attack',
                level: 0,
                cost: 25,
                purchaseHandler: function(button, player) { player.dps += 1; }
            }
        ];

        var button;
        upgradeButtonsData.forEach(function(buttonData, index) {
            button = state.game.add.button(0, (50 * index), 'button');
            button.icon = button.addChild(state.game.add.image(6, 7, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 9, buttonData.name + ': ' + buttonData.level, {font: '9px Press Start 2P',fill: '#44891a'}));
            button.details = buttonData;
            button.costText = button.addChild(state.game.add.text(42, 24, '$' + buttonData.cost, {font: '16px Press Start 2P',fill: '#44891a'}));
            button.events.onInputDown.add(state.onUpgradeButtonClick, state);

            upgradeButtons.addChild(button);
        });

        this.dpsTimer = this.game.time.events.loop(100, this.onDPS, this);

        // setup the world progression display
        this.levelUI = this.game.add.group();
        this.levelUI.position.setTo(this.game.world.centerX, 30);
        this.levelText = this.levelUI.addChild(this.game.add.text(0, 0, 'Level: ' + this.level, {
            font: '24px Press Start 2P',
            fill: '#44891a'
        }));
        this.levelKillsText = this.levelUI.addChild(this.game.add.text(0, 30, 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired, {
            font: '24px Press Start 2P',
            fill: '#44891a'
        }));
        console.log(this.upgradePanel);
    },
    update: function() {
    },
    render: function() {   
    },

    //====================//
    // Eventos do Monstro //
    //====================//

    onClickMonster: function(monster,pointer) {
        this.currentMonster.damage(this.player.clickDmg);
        this.monsterHealthText.text = this.currentMonster.alive ? numeral(this.currentMonster.health).format('0a') + ' HP' : 'DEAD';

        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = numeral(this.player.clickDmg).format('0a');
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }
    },
    onKilledMonster: function(monster) {
        monster.position.set(1000, this.game.world.centerY);

        var coin;
        coin = this.coins.getFirstExists(false);
        coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
        coin.goldValue = Math.round(this.level * 1.33);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

        this.levelKills++;

        if (this.levelKills >= this.levelKillsRequired) {
            this.level++;
            this.levelKills = 0;
        }

        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + ((this.level - 1) * 10.6));
        this.currentMonster.revive(this.currentMonster.maxHealth);

        this.levelText.text = 'Level: ' + this.level;
        this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;
    },
    onRevivedMonster: function(monster) {
        monster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
        this.monsterNameText.text = monster.details.name;
        this.monsterHealthText.text = monster.health + 'HP';
    },

    //==================//
    // Eventos da Moeda //
    //==================//

    onClickCoin: function(coin) {
        if (!coin.alive) {
            return;
        }
        // give the player gold
        this.player.gold += coin.goldValue;
        // update UI
        this.playerGoldText.text = '$' + numeral(this.player.gold).format('0a');
        // remove the coin
        coin.kill();
    },

    //======================//
    // Eventos dos Upgrades //
    //======================//

    onUpgradeButtonClick: function(button, pointer) {
        function getAdjustedCost() {
            return Math.ceil(button.details.cost * Math.pow(1.16,button.details.level));
        }

        if (this.player.gold - getAdjustedCost() >= 0) {
            this.player.gold -= getAdjustedCost();
            this.playerGoldText.text = '$' + numeral(this.player.gold).format('0a');
            button.details.level++;
            button.text.text = button.details.name + ': ' + button.details.level;
            button.costText.text = '$' + numeral(getAdjustedCost()).format('0a');
            button.details.purchaseHandler.call(this, button, this.player);
        }
    },

    //=============================//
    // Eventos de dano por segundo //
    //=============================//

    onDPS: function() {
        if (this.player.dps > 0) {
            if (this.currentMonster && this.currentMonster.alive) {
                var dmg = this.player.dps / 10;
                this.currentMonster.damage(dmg);
                // update the health text
                this.monsterHealthText.text = this.currentMonster.alive ? numeral(Math.round(this.currentMonster.health)).format('0a') + ' HP' : 'DEAD';
            }
        }
    }
});