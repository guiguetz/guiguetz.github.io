//Instância do jogo
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', '');

//Ao invés de usar só um laço normal, criamos um estado chamado "play", assim podemos ter outros como "menu", "creditos" etc. Bem interessante. 
game.state.add('play', {
    preload: function() {
        
        //=============================================
        // Inicialização dos sprites
        //=============================================
        
        var frame0 = [
            '33333333',
            '34444443',
            '33344333',
            '33344333',
            '33344333',
            '33344333',
            '34444443',
            '33333333'
        ];
        game.create.texture('enemyTex0', frame0, 8, 8, 0);
        
        var frame1 = [
            '33333333',
            '34444443',
            '33433433',
            '33433433',
            '33433433',
            '33433433',
            '34444443',
            '33333333'
        ];
        game.create.texture('enemyTex1', frame1, 8, 8, 0);
        
        var frame2 = [
            '33333333',
            '34444443',
            '34343433',
            '34343433',
            '34343433',
            '34343433',
            '34444443',
            '33333333'
        ];
        game.create.texture('enemyTex2', frame2, 8, 8, 0);
        
        var frame3 = [
            '33333333',
            '34444443',
            '34343343',
            '34343343',
            '34333333',
            '34334433',
            '34444443',
            '33333333'
        ];
        game.create.texture('enemyTex3', frame3, 8, 8, 0);
        
        var frame4 = [
            '33333333',
            '34444443',
            '34333343',
            '33433433',
            '33433433',
            '33344333',
            '34444443',
            '33333333'
        ];
        game.create.texture('enemyTex4', frame4, 8, 8, 0);
        
        var frame5 = [
            '88',
            '88'
        ];
        game.create.texture('coinTex1', frame5, 8, 8, 0);

        var frame6 = [
            'AABBBBBB',
            'AAABBBBB',
            'BAAABBBB',
            'BBAAABAA',
            'BBBAAAAA',
            'BBBBAAAB',
            'BBBAAAAA',
            'BBBAABAA'
        ];
        game.create.texture('upgradeTex1', frame6, 4, 4, 0);

        var frame7 =  [
            'BBBBBBAA',
            'BBBBBAAA',
            'BBBBAAAB',
            'AABAAABB',
            'AAAAABBB',
            'BAAABBBB',
            'AAAAABBB',
            'AABAABBB'
        ];
        game.create.texture('upgradeTex2', frame7, 4, 4, 0);
        
        //=============================================
        // Inicialização dos botões
        //=============================================

        // Fundo
        var upgradeBackdrop = this.game.add.bitmapData(250, 500);
        upgradeBackdrop.ctx.fillStyle = '#a3ce27';
        upgradeBackdrop.ctx.strokeStyle = '#44891a';
        upgradeBackdrop.ctx.lineWidth = 12;
        upgradeBackdrop.ctx.fillRect(0, 0, 250, 500);
        upgradeBackdrop.ctx.strokeRect(0, 0, 250, 500);
        this.game.cache.addBitmapData('upgradePanel', upgradeBackdrop);
        
        // Botão padrão
        var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = '#a3ce27';
        buttonImage.ctx.strokeStyle = '#44891a';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        this.game.cache.addBitmapData('button', buttonImage);
        
        //=============================================
        // Preload de algumas variáveis importantes
        //=============================================

        // Nível
        this.level = 1;
        // Monstros derrotados
        this.levelKills = 0;
        // Quantos monstros por nível
        this.levelKillsRequired = 10;
        
        
        
        //O nosso player.
        this.player = {
            clickDmg: 1, // Dano por clique
            gold: 0, // Ouro inicial
            dps:0 // Dano por segundo
        };
    },
    create: function() {
        //Uma var chamada state com esse state, só pra facilitar
        var state = this;
        
        game.stage.backgroundColor = '#a3ce27';

        var monsterData = [
            {name: 'Enemy 1', image: 'enemyTex0',   maxHealth: 5},
            {name: 'Enemy 2', image: 'enemyTex1',   maxHealth: 8},
            {name: 'Enemy 3', image: 'enemyTex2',   maxHealth: 13},
            {name: 'Enemy 4', image: 'enemyTex3',   maxHealth: 21},
            {name: 'Enemy 5', image: 'enemyTex4',   maxHealth: 34}
        ];

        this.monsters = this.game.add.group();

        var monster;
        monsterData.forEach(function(data) {
            monster = state.monsters.create(1000, state.game.world.centerY, data.image);
            monster.anchor.setTo(0.5);
            monster.details = data;

            // use the built in health component
            monster.health = monster.maxHealth = data.maxHealth;

            // hook into health and lifecycle events
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
        this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, this.currentMonster.health + ' HP', {
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
            // start out not existing, so we don't draw it yet
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

        this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
            font: '24px Press Start 2P',
            fill: '#44891a'
        });

        this.upgradePanel = this.game.add.image(10, 70, this.game.cache.getBitmapData('upgradePanel'));
        var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
        upgradeButtons.position.setTo(8, 8);

        var upgradeButtonsData = [
            {icon: 'upgradeTex1', name: 'Attack', level: 1, cost: 5, purchaseHandler: function(button, player) {
                player.clickDmg += 1;
            }},
            {icon: 'upgradeTex2', name: 'Auto-Attack', level: 0, cost: 25, purchaseHandler: function(button, player) {
                player.dps += 5;
            }}
        ];

        var button;
        upgradeButtonsData.forEach(function(buttonData, index) {
            button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name + ': ' + buttonData.level, {font: '16px Press Start 2P'}));
            button.details = buttonData;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px Press Start 2P'}));
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
    },
    update: function() {
    },
    render: function() {
    },
    onClickMonster: function(monster,pointer) {
        this.currentMonster.damage(this.player.clickDmg);
        this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';

        // grab a damage text from the pool to display what happened
        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = this.player.clickDmg;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }
    },
    onKilledMonster: function(monster) {
        // move the monster off screen again
        monster.position.set(1000, this.game.world.centerY);

        var coin;
        // spawn a coin on the ground
        coin = this.coins.getFirstExists(false);
        coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
        coin.goldValue = Math.round(this.level * 1.33);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

        this.levelKills++;

        if (this.levelKills >= this.levelKillsRequired) {
            this.level++;
            this.levelKills = 0;
        }

        // pick a new monster
        this.currentMonster = this.monsters.getRandom();
        // upgrade the monster based on level
        this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + ((this.level - 1) * 10.6));
        // make sure they are fully healed
        this.currentMonster.revive(this.currentMonster.maxHealth);

        this.levelText.text = 'Level: ' + this.level;
        this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;
    },
    onRevivedMonster: function(monster) {
        monster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
        // update the text display
        this.monsterNameText.text = monster.details.name;
        this.monsterHealthText.text = monster.health + 'HP';
    },
    onClickCoin: function(coin) {
        if (!coin.alive) {
            return;
        }
        // give the player gold
        this.player.gold += coin.goldValue;
        // update UI
        this.playerGoldText.text = 'Gold: ' + this.player.gold;
        // remove the coin
        coin.kill();
    },
    onUpgradeButtonClick: function(button, pointer) {
        // make this a function so that it updates after we buy
        function getAdjustedCost() {
            return Math.ceil(button.details.cost + (button.details.level * 1.46));
        }

        if (this.player.gold - getAdjustedCost() >= 0) {
            this.player.gold -= getAdjustedCost();
            this.playerGoldText.text = 'Gold: ' + this.player.gold;
            button.details.level++;
            button.text.text = button.details.name + ': ' + button.details.level;
            button.costText.text = 'Cost: ' + getAdjustedCost();
            button.details.purchaseHandler.call(this, button, this.player);
        }
    },
    onDPS: function() {
        if (this.player.dps > 0) {
            if (this.currentMonster && this.currentMonster.alive) {
                var dmg = this.player.dps / 10;
                this.currentMonster.damage(dmg);
                // update the health text
                this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
            }
        }
    }
});

game.state.start('play');