/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['skbJet/component/gladPixiRenderer/Sprite',
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'game/gameUtils',
    'skbJet/componentCRDC/gladRenderer/gladButton',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'game/configController',
    'skbJet/componentCRDC/gladRenderer/Tween',
    'skbJet/component/SKBeInstant/SKBeInstant'
], function (Sprite, msgBus, audio, gr, SKBeInstant, gameUtils, gladButton, loader, config, tw, SKBeInstant) {
    var json_rds;
    var ticketId = null;
    var buttonQuickPick;
    var buttonClear;
    var buttonRadar;

    var revealDataExist = false;

    var spots = 0; //define spot value
    var multipliers = 6; //define multiplier value
    var matchSpots = 0; //define the spot's num of win
    var matchMultipliers = 0;//define the multiplier's num of win
    var matchSpotsCount = 0; //define the spot's num of win which have completed the animation
    var matchMultipliersCount = 0; //define the multiplier's num of win which have completed the animation
    var arrSpots = []; //the spot's array of user selected or quick pick
    var arrMultipliers = [];//the array of multiplier
    var prizeTableValue = [];

    var radarLightIndex = 0;
    var radarLightSpeed = 0.35;
    var radarEmitNumCount = 0;//count the number emitted by radar
    var radarControlSpeed = 2;//the speed of radar 1：1"，2：2"，3：3"
    var radarCircleMoveTime = 200; //the time of radar move 1"：200ms,2"：100ms,3"：50ms
    var symbolWinSpeed = 0.9; //the time of animation play of the selected number 1"：0.8，2"：0.85，3"：0.9
    var windowShakeSpeed = 30;
    var currentPrice;
    var currentSpots;

    var autoClick = true;
    /*
     arrAllNumInfo JSON array object：
     "index": "0", //（1-20） 
     "num": "0", //（1-80）
     "type": "0", //0:spot,1:multiplier,2:common
     "state": "0" //0:nowin,1:win
     */
    var arrAllNumInfo = [];
    var symbol = [];
    //var revealAll = false; //true:reveal all number false:reaveal number one by one
    var hasRevealAll = false;//if have revealled all numbers 
    var quickPickCount = 0; //count the quick pick number,conctrol the state of quick pick button
    var multiplierPickCount = 0;
    var symbolLightFinishCount = 0;
    var winW, winH;
    var starInfo = [];//the star info of background

    var autoPlayEnable = false;
    var buttonLight = 0; //0:quickpick button  1:clear button  2: autoPlay button
    var revealAllSpeedEmit = false;

    var playAgainRequest = false;
    var isRevealing = false;

    var winValue = 0;
    var prizeValue = 0;
    var errorOn = false;
    var prizeValueList = [];

    //add mouse over event for gray symbol
    function addMouseState(spriteContainer) {
        var name = spriteContainer.name;
        name = name.split('_');
        var index;
        if (Number(name[2]) === 0) {
            index = (Number(name[3]) + 1);
        } else if (Number(name[3]) === 9) {
            index = (Number(name[2]) + 1) + '0';
        } else {
            index = name[2] + (Number(name[3]) + 1);
        }
        var selectSymbol = gr.lib['_symbolLight_' + name[2] + '_' + name[3]];
        if (selectSymbol.gridStateChange === 0 || selectSymbol.gridStateChange === 4) {
            gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage('OverNumber_' + index);
        }
    }

    // add mouse out event for gray symbol
    function delMouseState(spriteContainer) {
        var name = spriteContainer.name;
        name = name.split('_');
        var index;
        if (Number(name[2]) === 0) {
            index = (Number(name[3]) + 1);
        } else if (Number(name[3]) === 9) {
            index = (Number(name[2]) + 1) + '0';
        } else {
            index = name[2] + (Number(name[3]) + 1);
        }
        var selectSymbol = gr.lib['_symbolLight_' + name[2] + '_' + name[3]];
        if (selectSymbol.gridStateChange === 0 || selectSymbol.gridStateChange === 4) {
            gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage('GrayNumber_' + index);
        }
    }

    function setRadarInit() {
        gr.lib._radarLine_0.show(false);
        gr.lib._radarLine_1.show(false);

        gr.lib._radarCircle_0.show(false);
        gr.lib._radarCircle_1.show(false);
        gr.lib._radarCircleAnim.show(false);

        for (var i = 0; i < 12; i++) {
            gr.lib['_radarLightAnim_' + i].show(false);
        }

        gr.lib['_radarDigital'].show(false);
        gr.lib['_radarPickRemaining'].show(false);
        gr.lib['_radarsymbolsNumble'].show(false);
        //function move:move around the center
        //line0 only need move top,so we should keep the left the same
        var curentLeft = gr.lib._radarLine_0._currentStyle._left;
        var line0Anim = tw.move(gr.lib._radarLine_0, gr.lib['_symbols_0_0'], 500);
        gr.animMap[line0Anim.animData._name].animData._keyFrames[1]._SPRITES[0]._style._left = curentLeft;
        //function move:move around the center
        //line1 only need move left,so we should keep the top the same
        var curentTop = gr.lib._radarLine_1._currentStyle._top;
        var line1Anim = tw.move(gr.lib._radarLine_1, gr.lib['_symbols_0_0'], 500);
        gr.animMap[line1Anim.animData._name].animData._keyFrames[1]._SPRITES[0]._style._top = curentTop;
        tw.move(gr.lib._radarCircle_0, gr.lib['_symbols_0_0'], 500);
        tw.move(gr.lib._radarCircle_1, gr.lib['_symbols_0_0'], 500);
        tw.move(gr.lib._radarCircleAnim, gr.lib['_symbols_0_0'], 500);
        gr.animMap['_radarScanAnim_0'].updateStyleToTime(1);
        gr.animMap['_radarScanAnim_1'].updateStyleToTime(1);
        gr.animMap['_radarScanAnim_2'].updateStyleToTime(1);
    }

    function setRadarScanInit() {
        radarLightIndex = 0;
        radarLightSpeed = 0.35;
        radarControlSpeed = 2;
        symbolWinSpeed = 0.9;
        windowShakeSpeed = 30;
        gr.lib._radarBG.show(true);
        gr.lib._radarButtonSet.show(true);

        gr.lib._radarScan.show(false);

        gr.lib._radarSpeed_0.show(false);
        gr.lib._radarSpeed_1.show(false);
        gr.lib._radarSpeed_2.show(false);

        gr.lib._radarLight.show(false);
        gr.lib._radarButtonLight.show(false);

        gr.lib['_radarSpeed'].setImage('radarSpeedInactive');

        buttonRadar.show(true);
        buttonRadar.enable(false);
        gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
    }

    function setGridSymbolInit() {
        if (playAgainRequest) {

        } else {
            arrSpots = [];
        }
        symbol = [];
        var num = 1;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.lib['_symbols_' + i + '_' + j].setImage('GrayNumber_' + num);
                gr.lib['_symbols_' + i + '_' + j].gridIndex = num;
                gr.lib['_symbols_' + i + '_' + j].gridState = false;
                gr.lib['_symbols_' + i + '_' + j].flag = 0;
                symbol.push(gr.lib['_symbols_' + i + '_' + j]);
                num++;
            }
        }
    }

    function bindGridSymbolEvent() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                gr.lib['_symbols_' + i + '_' + j].on('click', function () {
                    if (this.buttonMode) {
                        gridSymbolChangeState(this);
                    }
                });
                gr.lib['_symbols_' + i + '_' + j].on('mouseover', function () {
                    if (this.buttonMode) {
                        addMouseState(this);
                    }
                });
                gr.lib['_symbols_' + i + '_' + j].on('mouseout', function () {
                    if (this.buttonMode) {
                        delMouseState(this);
                    }
                });
            }
        }
    }

    function addGridSymbolLight() {
        var style = {
            "_id": "_1m7abc",
            "_name": "_symbolLight_",
            "_SPRITES": [],
            "_style": {
                "_width": 150,
                "_height": 150,
                "_left": 0,
                "_top": 0,
                "_background": {
                    "_imagePlate": "lightPanel_0000"
                }
            }
        };
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                var spData = JSON.parse(JSON.stringify(style));
                spData._id = style._id + i + j;
                spData._name = spData._name + i + '_' + j;
                spData._style._left = gr.lib['_symbols_' + i + '_' + j].data._style._left - (150 - gr.lib['_symbols_' + i + '_' + j].data._style._width) / 2;
                spData._style._top = gr.lib['_symbols_' + i + '_' + j].data._style._top - (150 - gr.lib['_symbols_' + i + '_' + j].data._style._height) / 2;
                var sprite = new Sprite(spData);
                gr.lib._reelsBGLayer.pixiContainer.addChild(sprite.pixiContainer);
            }
        }
    }

    function setGridSymbolLightInit() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.lib['_symbolLight_' + i + '_' + j].gridStateChange = 0;
                gr.lib['_symbolLight_' + i + '_' + j].lightIndex = 0;
                gr.lib['_symbolLight_' + i + '_' + j].show(false);
            }
        }
    }

    function setMultiplierOriginTable() {
        var multiplierText;
        if (SKBeInstant.isWLA()) {
            multiplierText = loader.i18n.MenuCommand.WLA.multiplierTable;
        } else {
            multiplierText = loader.i18n.MenuCommand.Commercial.multiplierTable;
        }
        if (config.textAutoFit.multiplierText) {
            gr.lib._multiplierText.autoFontFitText = config.textAutoFit.multiplierText.isAutoFit;
        }
        gr.lib._multiplierText.setText(multiplierText);
        gr.lib._multiplierText.show(true);
        for (var i = 0; i < 6; i++) {
            var multiplier = '-';
            switch (i) {
                case 0:
                {
                    multiplier = '10X';
                    break;
                }
                case 1:
                {
                    multiplier = '5X';
                    break;
                }
                case 2:
                {
                    multiplier = '4X';
                    break;
                }
                case 3:
                {
                    multiplier = '3X';
                    break;
                }
                case 4:
                {
                    multiplier = '2X';
                    break;
                }
                case 5:
                {
                    multiplier = '-';
                    break;
                }
            }

            gr.lib['_multiplierLine' + i].show(true);
            gr.lib['_multiplierText_' + i].setText(multiplier);
            gr.lib['_multiplierWinLine' + i].show(false);
            gr.lib['_multiplierWinText_' + i].setText(multiplier);
            gr.lib['_multiplierWinBox' + i].show(false);
            gr.lib['_multiplierWinBox' + i].onComplete = function () {
                var name = this.getName();
                name = name.split('x');
                gr.lib['_multiplierWinBox' + name[1]].setImage('winBox_0007');
            };
        }
    }

    function setPrizeOriginTable() {
        var prizeTableText;
        if (SKBeInstant.isWLA()) {
            prizeTableText = loader.i18n.MenuCommand.WLA.prizeTable;
        } else {
            prizeTableText = loader.i18n.MenuCommand.Commercial.prizeTable;
        }
        if (config.textAutoFit.prizeTableText) {
            gr.lib._prizeTableText.autoFontFitText = config.textAutoFit.prizeTableText.isAutoFit;
        }
        gr.lib._prizeTableText.setText(prizeTableText);
        gr.lib._prizeTableText.show(true);

        if (config.textAutoFit.matchText) {
            gr.lib._matchText0.autoFontFitText = config.textAutoFit.matchText.isAutoFit;
        }
        gr.lib._matchText0.setText(loader.i18n.Game.tableMatchText);
        gr.lib._matchText0.show(true);

        if (config.textAutoFit.prizeText) {
            for (var i = 0; i < 11; i++) {
                gr.lib['_prizeText' + i].autoFontFitText = config.textAutoFit.prizeText.isAutoFit;
            }
        }
        if (config.textAutoFit.prizeWinText) {
            for (var i = 0; i < 11; i++) {
                gr.lib['_prizeWinText' + i].autoFontFitText = config.textAutoFit.prizeWinText.isAutoFit;
            }
        }
        gr.lib._prizeText0.setText(loader.i18n.Game.tablePrizeText);
        gr.lib._prizeText0.show(true);

        var defaultPrice = SKBeInstant.config.gameConfigurationDetails.pricePointGameDefault;
        var defaultSpot = SKBeInstant.config.gameConfigurationDetails.spotsGameDefault;
        if (defaultSpot) {
            //
        } else {
            defaultSpot = 10;
        }
        currentPrice = defaultPrice;
        currentSpots = defaultSpot;
        prizeTableValue = [];
        prizeValueList = [];
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        var tableLengh = 0;
        for (var i = 0; i < rc.length; i++) {
            if (Number(defaultPrice) === Number(rc[i].price) && Number(defaultSpot) === Number(rc[i].spots)) {
                tableLengh = rc[i].prizeTable.length;
                for (var j = 0; j < tableLengh; j++) {
                    var tableItem = {};
                    //var description = rc[i].prizeTable[j].description;
                    //tableItem.matchNum = description.split('m')[1];
                    tableItem.matchPrize = rc[i].prizeTable[j].prize;
                    prizeTableValue.push(tableItem);
                }
                break;
            }
        }

        var matchCount = 0;
        for (var i = 1; i < 11; i++) {
            gr.lib['_matchText' + i].setText(11 - i);
            gr.lib['_matchWinText' + i].setText(11 - i);

            if (i < 11 - Number(currentSpots) || matchCount >= tableLengh) {
                gr.lib['_prizeText' + i].setText('-');
                gr.lib['_prizeWinText' + i].setText('-');
                prizeValueList.push(0);
            } else {
                gr.lib['_prizeText' + i].setText(SKBeInstant.formatCurrency(prizeTableValue[matchCount].matchPrize).formattedAmount);
                gr.lib['_prizeWinText' + i].setText(SKBeInstant.formatCurrency(prizeTableValue[matchCount].matchPrize).formattedAmount);
                prizeValueList.push(prizeTableValue[matchCount].matchPrize);
                matchCount++;
            }
        }

        for (var i = 0; i < 11; i++) {
            if (i < 10) {
                gr.lib['_prizeWinBox' + i].show(false);
                gr.lib['_prizeWinBox' + i].onComplete = function () {
                    var name = this.getName();
                    name = name.split('x');
                    gr.lib['_prizeWinBox' + name[1]].setImage('winBox_0007');
                };
            }
            gr.lib['_prizeTableLine' + i].show(true);
            gr.lib['_prizeTableWinLine' + i].show(false);
        }
    }

    function setComplete() {
        gr.animMap['_screenAnim']._onComplete = function () {
            gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = false;
            buttonQuickPick.show(true);
            buttonQuickPick.enable(true);
            gr.lib['_quickPikcAnim'].show(true);
            gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

            buttonClear.show(true);
            buttonClear.enable(false);
            gr.lib['_ClearAnim'].show(false);
            gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});

            gr.lib._buttonAutoPlay.show(true);
            msgBus.publish('enableChanged', false);
            autoPlayEnable = false;

            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 10; j++) {
                    gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = true;
                }
            }
            gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = true;
        };

        gr.animMap['_radarSpeedAnim_0']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarSpeedAnim_1']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarSpeedAnim_2']._onComplete = function () {
            this.play();
        };

        gr.animMap['_radarScanAnim_0']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarScanAnim_1']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarScanAnim_2']._onComplete = function () {
            this.play();
        };

        gr.animMap['_radarRingAnim_0']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarRingAnim_1']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarRingAnim_2']._onComplete = function () {
            this.play();
        };

        gr.animMap['_radarButtonLightAnim_0']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarButtonLightAnim_1']._onComplete = function () {
            this.play();
        };
        gr.animMap['_radarButtonLightAnim_2']._onComplete = function () {
            this.play();
        };

        for (var i = 0; i < 12; i++) {
            gr.lib['_radarLightAnim_' + i].onComplete = function () {
                var name = this.getName();
                name = name.split('_');
                gr.lib['_radarLightAnim_' + name[2]].gotoAndPlay('radarLightAnim', radarLightSpeed);
            };
        }

        gr.animMap['_radarLineAnim_0']._onComplete = function () {
            this.play();
        };

        gr.animMap['_radarLineAnim_1']._onComplete = function () {
            this.play();
        };

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                if (i === 0 && j === 0) {
                    //_symbolsWinAnim0_0_0 animation already exists,no need for cloning 
                } else {
                    gr.animMap['_symbolsWinAnim0_0_0'].clone(['_symbols_' + i + '_' + j], '_symbolsWinAnim0_' + i + '_' + j);
                    gr.animMap['_symbolsWinAnim1_0_0'].clone(['_symbols_' + i + '_' + j], '_symbolsWinAnim1_' + i + '_' + j);
                }

                gr.animMap['_symbolsWinAnim0_' + i + '_' + j].xIndex = i;
                gr.animMap['_symbolsWinAnim0_' + i + '_' + j].yIndex = j;
                gr.animMap['_symbolsWinAnim1_' + i + '_' + j].xIndex = i;
                gr.animMap['_symbolsWinAnim1_' + i + '_' + j].yIndex = j;
                gr.animMap['_symbolsWinAnim1_' + i + '_' + j].gridStateChange = 0;

                gr.animMap['_symbolsWinAnim0_' + i + '_' + j]._onComplete = function () {
                    if (errorOn) {
                        return;
                    }
                    gr.lib['_symbolLight_' + this.xIndex + '_' + this.yIndex].show(true);
                    gr.lib['_symbolLight_' + this.xIndex + '_' + this.yIndex].gotoAndPlay('lightPanel', symbolWinSpeed);
                };

                gr.animMap['_symbolsWinAnim1_' + i + '_' + j]._onComplete = function () {
                    if (errorOn) {
                        return;
                    }
                    if (this.gridStateChange === 1 && !revealDataExist && !autoClick) {
                        quickPickCount++;
                    } else if (this.gridStateChange === 5) {
                        radarEmitNumCount++;
                        matchSpotsCount++;
                        for (var j = 1; j < 11; j++) {
                            if (j === matchSpotsCount) {
                                if (config.audio && config.audio['AutoSelectPrize' + matchSpotsCount]) {
                                    audio.play(config.audio['AutoSelectPrize' + matchSpotsCount].name, config.audio['AutoSelectPrize' + matchSpotsCount].channel);
                                }
                                gr.lib['_prizeWinBox' + (10 - j)].gotoAndPlay('winBox', 0.5);
                                gr.lib['_prizeWinBox' + (10 - j)].show(true);
                                gr.lib['_prizeTableLine' + (10 - j + 1)].show(false);
                                gr.lib['_prizeTableWinLine' + (10 - j + 1)].show(true);
                                if (matchMultipliersCount === 0) {
                                    winValue = Number(prizeValueList[Number(prizeValueList.length - matchSpotsCount)]);
                                } else if (matchMultipliersCount === 6) {
                                    winValue = Number(prizeValueList[Number(prizeValueList.length - matchSpotsCount)]) * 10;
                                } else {
                                    winValue = Number(prizeValueList[Number(prizeValueList.length - matchSpotsCount)]) * matchMultipliersCount;
                                }
                                if (winValue > prizeValue) {
                                    msgBus.publish('winboxError', {errorCode: '29000'});
                                    return;
                                }
                                gr.lib._winsValue.setText(SKBeInstant.formatCurrency(winValue).formattedAmount);
                                gameUtils.fixMeter(gr);
                            } else {
                                gr.lib['_prizeWinBox' + (10 - j)].show(false);
                                gr.lib['_prizeTableLine' + (10 - j + 1)].show(true);
                                gr.lib['_prizeTableWinLine' + (10 - j + 1)].show(false);
                            }
                        }
                        gr.lib['_radarLightAnim_' + radarLightIndex].stopPlay();
                        gr.lib['_radarLightAnim_' + radarLightIndex].show(false);
                        if (radarControlSpeed === 3 && revealAllSpeedEmit) {
                            gr.lib._radarButtonLight.show(false);
                            buttonRadar.enable(false);
                            gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
                            allGridSymbolWin();
                        } else if (radarControlSpeed !== 3) {
                            gridSymbolWin(radarControlSpeed, radarLightSpeed, radarCircleMoveTime);
                        }
                    } else if (this.gridStateChange === 6) {
                        radarEmitNumCount++;
                        matchMultipliersCount++;
                        for (var j = 1; j < 7; j++) {
                            if (j === matchMultipliersCount) {
                                gr.lib['_multiplierWinBox' + (6 - j)].gotoAndPlay('winBox', 0.5);
                                gr.lib['_multiplierWinBox' + (6 - j)].show(true);
                                gr.lib['_multiplierLine' + (6 - j)].show(false);
                                gr.lib['_multiplierWinLine' + (6 - j)].show(true);
                                if (matchSpotsCount === 0) {
                                    winValue = 0;
                                } else {
                                    if (matchMultipliersCount === 0) {
                                        winValue = Number(prizeValueList[Number(prizeValueList.length - matchSpotsCount)]);
                                    } else if (matchMultipliersCount === 6) {
                                        winValue = Number(prizeValueList[Number(prizeValueList.length - matchSpotsCount)]) * 10;
                                    } else {
                                        winValue = Number(prizeValueList[Number(prizeValueList.length - matchSpotsCount)]) * matchMultipliersCount;
                                    }
                                    if (winValue > prizeValue) {
                                        msgBus.publish('winboxError', {errorCode: '29000'});
                                        return;
                                    }
                                }
                                gr.lib._winsValue.setText(SKBeInstant.formatCurrency(winValue).formattedAmount);
                                gameUtils.fixMeter(gr);
                            } else {
                                gr.lib['_multiplierWinBox' + (6 - j)].show(false);
                                gr.lib['_multiplierLine' + (6 - j)].show(true);
                                gr.lib['_multiplierWinLine' + (6 - j)].show(false);
                            }
                        }
                        gr.lib['_radarLightAnim_' + radarLightIndex].stopPlay();
                        gr.lib['_radarLightAnim_' + radarLightIndex].show(false);
                        if (radarControlSpeed === 3 && revealAllSpeedEmit) {
                            gr.lib._radarButtonLight.show(false);
                            buttonRadar.enable(false);
                            gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
                            allGridSymbolWin();
                        } else if (radarControlSpeed !== 3) {
                            gridSymbolWin(radarControlSpeed, radarLightSpeed, radarCircleMoveTime);
                        }
                    } else if (this.gridStateChange === 3) {
                        radarEmitNumCount++;
                        gr.lib['_radarLightAnim_' + radarLightIndex].stopPlay();
                        gr.lib['_radarLightAnim_' + radarLightIndex].show(false);
                        //reveal symbol one by one
                        if (radarControlSpeed === 3 && revealAllSpeedEmit) {
                            gr.lib._radarButtonLight.show(false);
                            buttonRadar.enable(false);
                            gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
                            allGridSymbolWin();
                        } else if (radarControlSpeed !== 3) {
                            gridSymbolWin(radarControlSpeed, radarLightSpeed, radarCircleMoveTime);
                        }
                    }
                    if (autoClick) {
                        gr.lib['_symbols_' + this.xIndex + '_' + this.yIndex].flag = 0;
                        gr.lib['_symbols_' + this.xIndex + '_' + this.yIndex].pixiContainer.buttonMode = true;
                    }
                    if (!autoClick && Number(spots) !== 0 && Number(quickPickCount) === Number(spots) && symbolLightFinishCount === Number(quickPickCount) && !playAgainRequest) {
                        buttonQuickPick.enable(true);
                        gr.lib['_quickPikcAnim'].show(true);
                        gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

                        buttonClear.enable(true);
                        gr.lib['_ClearAnim'].show(true);
                        gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

                        msgBus.publish('enableChanged', true);
                        autoPlayEnable = true;

                        gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = true;
                    }
                };

                gr.lib['_symbolLight_' + i + '_' + j].onComplete = function () {
                    if (errorOn) {
                        return;
                    }
                    var name = this.getName();
                    name = name.split('_');
                    var index;
                    if (Number(name[2]) === 0) {
                        index = (Number(name[3]) + 1);
                    } else if (Number(name[3]) === 9) {
                        index = (Number(name[2]) + 1) + '0';
                    } else {
                        index = name[2] + (Number(name[3]) + 1);
                    }

                    if (this.lightIndex === 0) {
                        switch (this.gridStateChange) {
                            case 1:
                            {//from grey to green
                                gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage("GreenNumber_" + index);
                                break;
                            }
                            case 2:
                            {//from grey to purple
                                gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage("VioletNumber");
                                break;
                            }
                            case 3:
                            {//from grey to white
                                gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage("WhiteNumber_" + index);
                                break;
                            }
                            case 4:
                            {//from green to grey
                                gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage("GrayNumber_" + index);
                                break;
                            }
                            case 5:
                            {//from green to yellow
                                gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage("YellowNumber_" + index);
                                break;
                            }
                            case 6:
                            {//from purple to yellow
                                gr.lib['_symbols_' + name[2] + '_' + name[3]].setImage("YellowWinStar");
                                break;
                            }
                            default:
                            {
                                break;
                            }
                        }
                        gr.animMap['_symbolsWinAnim1_' + name[2] + '_' + name[3]].gridStateChange = this.gridStateChange;

                        this.lightIndex = 1;
                        gr.lib['_symbolLight_' + name[2] + '_' + name[3]].gotoAndPlay('lightExplosion', symbolWinSpeed);
                        gr.animMap['_symbolsWinAnim1_' + name[2] + '_' + name[3]].play();
                    } else {
                        this.lightIndex = 0;
                        gr.lib['_symbolLight_' + name[2] + '_' + name[3]].show(false);
                        if (this.gridStateChange === 1 && !revealDataExist && !autoClick) {
                            symbolLightFinishCount++;
                        }
                        if (!autoClick && Number(spots) !== 0 && Number(quickPickCount) === Number(spots) && symbolLightFinishCount === Number(quickPickCount) && !playAgainRequest) {
                            buttonQuickPick.enable(true);
                            gr.lib['_quickPikcAnim'].show(true);
                            gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

                            buttonClear.enable(true);
                            gr.lib['_ClearAnim'].show(true);
                            gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

                            msgBus.publish('enableChanged', true);
                            autoPlayEnable = true;

                            gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = true;
                        }

                        if (this.gridStateChange === 2) {
                            multiplierPickCount++;
                            if (multiplierPickCount === Number(multipliers)) {
                                if (radarControlSpeed === 3 && revealAllSpeedEmit) {
                                    gr.lib._radarButtonLight.show(false);
                                    buttonRadar.enable(false);
                                    gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
                                    //reveal all one time
                                    allGridSymbolWin();
                                } else {
                                    if (config.audio && config.audio.RevealerHoverLoopOneShot) {
                                        audio.play(config.audio.RevealerHoverLoopOneShot.name, config.audio.RevealerHoverLoopOneShot.channel);
                                    }
                                    gr.lib['_radarLight'].show(true);
                                    gr.lib._radarLine_0.show(true);
                                    gr.lib._radarLine_1.show(true);
                                    //reveal one by one
                                    gridSymbolWin(radarControlSpeed, radarLightSpeed, radarCircleMoveTime);
                                }
                            }
                        }
                    }
                };
            }
        }

        gr.lib['_gameLogo'].onComplete = function () {
            gr.getTimer().setTimeout(function () {
                if (hasRevealAll) {
                    gr.lib['_gameLogo'].stopPlay();
                } else {
                    gr.lib['_gameLogo'].gotoAndPlay('logo', 0.25);
                }
            }, 3000);
        };

        for (var i = 1; i < 5; i++) {
            gr.animMap['_nabulaAnim_' + i]._onComplete = function () {
                this.play();
            };
        }

        for (var i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                {
                    for (var j = 0; j < 4; j++) {
                        gr.lib['_star' + i + '_' + j].onComplete = function () {
                            var name = this.getName();
                            name = name.split('_');
                            var index = name[1].split('r');
                            gr.lib['_star' + index[1] + '_' + name[2]].show(false);
                            var starIndex = computeStarIndex();
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].show(true);
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].gotoAndPlay('star' + starIndex.indexOne, 0.75);
                        };
                    }
                    break;
                }
                case 1:
                {
                    for (var j = 0; j < 5; j++) {
                        gr.lib['_star' + i + '_' + j].onComplete = function () {
                            var name = this.getName();
                            name = name.split('_');
                            var index = name[1].split('r');
                            gr.lib['_star' + index[1] + '_' + name[2]].show(false);
                            var starIndex = computeStarIndex();
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].show(true);
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].gotoAndPlay('star' + starIndex.indexOne, 0.75);
                        };
                    }
                    break;
                }
                case 2:
                {
                    for (var j = 0; j < 21; j++) {
                        gr.lib['_star' + i + '_' + j].onComplete = function () {
                            var name = this.getName();
                            name = name.split('_');
                            var index = name[1].split('r');
                            gr.lib['_star' + index[1] + '_' + name[2]].show(false);
                            var starIndex = computeStarIndex();
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].show(true);
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].gotoAndPlay('star' + starIndex.indexOne, 0.75);
                        };
                    }
                    break;
                }
                case 3:
                {
                    for (var j = 0; j < 3; j++) {
                        gr.lib['_star' + i + '_' + j].onComplete = function () {
                            var name = this.getName();
                            name = name.split('_');
                            var index = name[1].split('r');
                            gr.lib['_star' + index[1] + '_' + name[2]].show(false);
                            var starIndex = computeStarIndex();
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].show(true);
                            gr.lib['_star' + starIndex.indexOne + '_' + starIndex.indexTwo].gotoAndPlay('star' + starIndex.indexOne, 0.75);
                        };
                    }
                    break;
                }
            }
        }

        gr.lib['_shootingStar_0' ].onComplete = function () {
            gr.lib['_shootingStar_0' ].show(false);
        };
        gr.lib['_shootingStar_1' ].onComplete = function () {
            gr.lib['_shootingStar_1' ].show(false);
        };
    }

    function getWindowSize() {
        winW = gr.lib._BG_dim._currentStyle._width;
        winH = gr.lib._BG_dim._currentStyle._height;
    }

    function setLaserAnimation() {
        gr.lib['_shootingStar_0'].show(false);
        gr.lib['_shootingStar_1'].show(false);
        getWindowSize();
        gr.getTimer().setInterval(function () {
            var index = Math.floor(Math.random() * 2);
            var left = Math.floor(Math.random() * (winW - gr.lib['_shootingStar_' + index]._currentStyle._width));
            var top = Math.floor(Math.random() * (winH - gr.lib['_shootingStar_' + index]._currentStyle._height));
            gr.lib['_shootingStar_' + index].updateCurrentStyle({'_left': left, '_top': top});
            gr.lib['_shootingStar_' + index].show(true);
            gr.lib['_shootingStar_' + index].gotoAndPlay('shootingStar' + index, 0.45);
        }, 5000);
    }

    function computeStarIndex() {
        var indexOne = Math.floor(Math.random() * 4);
        var indexTwo = 0;
        switch (indexOne) {
            case 0:
            {
                indexTwo = Math.floor(Math.random() * 4);
                break;
            }
            case 1:
            {
                indexTwo = Math.floor(Math.random() * 5);
                break;
            }
            case 2:
            {
                indexTwo = Math.floor(Math.random() * 21);
                break;
            }
            case 3:
            {
                indexTwo = Math.floor(Math.random() * 3);
                break;
            }
        }
        var starIndex = {};
        starIndex.indexOne = indexOne;
        starIndex.indexTwo = indexTwo;
        return starIndex;
    }

    function getStarAnimation() {
        starInfo = [];
        for (var i = 0; i < 20; i++) {
            var info = {};
            info = computeStarIndex();
            starInfo.push(info);
        }
    }

    function setStarAnimation() {
        //star init
        for (var i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                {
                    for (var j = 0; j < 4; j++) {
                        gr.lib['_star' + i + '_' + j].show(false);
                    }
                    break;
                }
                case 1:
                {
                    for (var j = 0; j < 5; j++) {
                        gr.lib['_star' + i + '_' + j].show(false);
                    }
                    break;
                }
                case 2:
                {
                    for (var j = 0; j < 21; j++) {
                        gr.lib['_star' + i + '_' + j].show(false);
                    }
                    break;
                }
                case 3:
                {
                    for (var j = 0; j < 3; j++) {
                        gr.lib['_star' + i + '_' + j].show(false);
                    }
                    break;
                }
            }
        }

        getStarAnimation();

        for (var i = 0; i < starInfo.length; i++) {
            gr.lib['_star' + starInfo[i].indexOne + '_' + starInfo[i].indexTwo].show(true);
            gr.lib['_star' + starInfo[i].indexOne + '_' + starInfo[i].indexTwo].gotoAndPlay('star' + starInfo[i].indexOne, 0.75);
        }
    }

    function setBkAnimationInit() {
        setLaserAnimation();
        setStarAnimation();
        for (var i = 0; i < 4; i++) {
            gr.lib['_nabula_' + i].show(true);
            gr.animMap['_nabulaAnim_' + (i + 1)].play();
        }
    }

    //quick pick : calculate the array of Spots
    function gridSymbolQuickPick() {
        gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = false;
        playAgainRequest = false;
        //gr.lib['_radarDigital'].show(false);
        //gr.lib['_radarPickRemaining'].show(false);
        gr.lib['_radarDigital'].show(true);
        gr.lib['_radarDigital'].setImage('radarDigital_0');
        gr.lib['_radarPickRemaining'].show(true);
        gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);

        buttonQuickPick.enable(false);
        gr.lib['_quickPikcAnim'].show(false);
        gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
        buttonClear.enable(false);
        gr.lib['_ClearAnim'].show(false);
        gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
        msgBus.publish('enableChanged', false);
        autoPlayEnable = false;
        var num = 1;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.animMap['_symbolsWinAnim0_' + i + '_' + j].stop();
                gr.lib['_symbolLight_' + i + '_' + j].stopPlay();
                gr.animMap['_symbolsWinAnim1_' + i + '_' + j].stop();
                gr.lib['_symbolLight_' + i + '_' + j].gridStateChange = 0;
                gr.lib['_symbolLight_' + i + '_' + j].lightIndex = 0;
                gr.lib['_symbolLight_' + i + '_' + j].show(false);
                gr.lib['_symbols_' + i + '_' + j].setImage('GrayNumber_' + num);
                gr.lib['_symbols_' + i + '_' + j].updateCurrentStyle({'_opacity': 1});
                gr.lib['_symbols_' + i + '_' + j].gridState = false;
                gr.lib['_symbols_' + i + '_' + j].flag = 0;
                gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                num++;
            }
        }

        quickPickCount = 0;
        symbolLightFinishCount = 0;
        autoClick = false;
        arrSpots = [];

        for (var i = 0; i < spots; ) {
            var number = Math.floor(Math.random() * 80) + 1;
            if (!arrSpots.find(function (parameter) {
                return parameter.num === number;
            })) {
                var spot = {};
                spot["num"] = number;
                arrSpots.push(spot);
                var xIndex;
                var yIndex;
                if ((number % 10) === 0) {
                    xIndex = number / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (number - number % 10) / 10;
                    yIndex = number % 10 - 1;
                }
                gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 1;
                gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();

                gr.lib['_symbols_' + xIndex + '_' + yIndex].gridState = true;
                gr.lib['_symbols_' + xIndex + '_' + yIndex].pixiContainer.buttonMode = true;

                i++;
            }
        }

        if (Number(arrSpots.length) === Number(spots)) {
            //msgBus.publish('enableChanged', true);
            //autoPlayEnable = true;
        }
    }

    function onGameParametersUpdated() {
        json_rds = {
            revealDataSave: {},
            wagerDataSave: {},
            spots: 0,
            amount: 0
        };

        var scaleType = {'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true};

        if (config.textAutoFit.quickPickText) {
            gr.lib._quickPickText.autoFontFitText = config.textAutoFit.quickPickText.isAutoFit;
        }
        gr.lib._quickPickText.setText(loader.i18n.Game.button_quickPick);
        gr.lib._quickPickText.show(true);

        buttonQuickPick = new gladButton(gr.lib._buttonQuickPick, config.gladButtonImgName.buttonQuickPick, scaleType);
        buttonQuickPick.show(false);
        buttonQuickPick.click(function () {
            if (config.audio && config.audio.ButtonQuickPick) {
                audio.play(config.audio.ButtonQuickPick.name, config.audio.ButtonQuickPick.channel);
            }
            gridSymbolQuickPick();
        });

        if (config.textAutoFit.clearText) {
            gr.lib._clearText.autoFontFitText = config.textAutoFit.clearText.isAutoFit;
        }
        gr.lib._clearText.setText(loader.i18n.Game.button_clear);
        gr.lib._clearText.show(true);

        buttonClear = new gladButton(gr.lib._buttonClear, config.gladButtonImgName.buttonClear, scaleType);
        buttonClear.show(false);
        buttonClear.click(function () {
            if (config.audio && config.audio.Deselect) {
                audio.play(config.audio.Deselect.name, config.audio.Deselect.channel);
            }
            gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = false;
            playAgainRequest = false;
            quickPickCount = 0;
            symbolLightFinishCount = 0;
            buttonQuickPick.enable(false);
            gr.lib['_quickPikcAnim'].show(false);
            gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});

            buttonClear.enable(false);
            gr.lib['_ClearAnim'].show(false);
            gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});

            msgBus.publish('enableChanged', false);
            autoPlayEnable = false;

            if (config.audio && config.audio.ButtonClear) {
                audio.play(config.audio.ButtonClear.name, config.audio.ButtonClear.channel);
            }
            setGridSymbolInit();
            setGridSymbolLightInit();
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 10; j++) {
                    gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                }
            }
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 10; j++) {
                    gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = true;
                }
            }

            buttonQuickPick.enable(true);
            gr.lib['_quickPikcAnim'].show(true);
            gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

            gr.lib['_radarDigital'].show(true);
            gr.lib['_radarDigital'].setImage('radarDigital_' + spots);
            gr.lib['_radarPickRemaining'].show(true);
            gr.animMap['_radarDigitalAnim'].play();

            if (spots > 1) {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);
            } else {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
            }
            gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = true;
        });

        if (config.textAutoFit.speedText) {
            gr.lib._radarText.autoFontFitText = config.textAutoFit.speedText.isAutoFit;
        }
        gr.lib._radarText.setText(loader.i18n.Game.button_radar);
        gr.lib._radarText.show(true);

        var scaleType = {'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true};
        buttonRadar = new gladButton(gr.lib._radarButton, "radarButton", scaleType);
        buttonRadar.click(function () {
            if (radarControlSpeed === 3) {
                radarControlSpeed = 1;
            } else {
                radarControlSpeed += 1;
            }

            if (radarControlSpeed === 1) {
                if (config.audio && config.audio.ButtonSpeed3) {
                    audio.play(config.audio.ButtonSpeed3.name, config.audio.ButtonSpeed3.channel);
                }
            } else if (radarControlSpeed === 2) {
                if (config.audio && config.audio.ButtonSpeed2) {
                    audio.play(config.audio.ButtonSpeed2.name, config.audio.ButtonSpeed2.channel);
                }
            } else if (radarControlSpeed === 3) {
                if (config.audio && config.audio.ButtonSpeed1) {
                    audio.play(config.audio.ButtonSpeed1.name, config.audio.ButtonSpeed1.channel);
                }
            }

            radarSpeedControl();
        });

        if (config.textAutoFit.radarPickRemainText) {
            gr.lib._radarPickRemaining.autoFontFitText = config.textAutoFit.radarPickRemainText.isAutoFit;
        }
        gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);

        //quickpick button/clear button/autoplay button show the light randomly 
        gr.getTimer().setInterval(function () {
            if (buttonQuickPick.getEnabled() && buttonClear.getEnabled() && autoPlayEnable) {
                buttonLight = Math.floor(Math.random() * 3);
                switch (buttonLight) {
                    case 0:
                    {
                        gr.lib['_quickPikcAnim'].gotoAndPlay('ClearButton', 0.25);
                        break;
                    }
                    case 1:
                    {
                        gr.lib['_ClearAnim'].gotoAndPlay('ClearButton', 0.25);
                        break;
                    }
                    case 2:
                    {
                        msgBus.publish('showAutoPlayButtonLight');
                        break;
                    }
                }
            } else if (buttonQuickPick.getEnabled() && buttonClear.getEnabled()) {
                buttonLight = Math.floor(Math.random() * 2);
                switch (buttonLight) {
                    case 0:
                    {
                        gr.lib['_quickPikcAnim'].gotoAndPlay('ClearButton', 0.25);
                        break;
                    }
                    case 1:
                    {
                        gr.lib['_ClearAnim'].gotoAndPlay('ClearButton', 0.25);
                        break;
                    }
                }
            } else if (buttonQuickPick.getEnabled()) {
                gr.lib['_quickPikcAnim'].gotoAndPlay('ClearButton', 0.25);
            } else if (autoPlayEnable) {
                msgBus.publish('showAutoPlayButtonLight');
            }
        }, 3000);

        gr.lib._buttonQuickPick.on('mouseover', function () {
            if (buttonQuickPick.getEnabled()) {
                gr.lib['_quickPikcAnim'].show(false);
            }
        });
        gr.lib._buttonQuickPick.on('mouseout', function () {
            if (buttonQuickPick.getEnabled()) {
                gr.lib['_quickPikcAnim'].show(true);
            }
        });

        gr.lib._buttonClear.on('mouseover', function () {
            if (buttonClear.getEnabled()) {
                gr.lib['_ClearAnim'].show(false);
            }
        });
        gr.lib._buttonClear.on('mouseout', function () {
            if (buttonClear.getEnabled()) {
                gr.lib['_ClearAnim'].show(true);
            }
        });

        setRadarScanInit();
        setRadarInit();
        setGridSymbolInit();
        bindGridSymbolEvent();
        addGridSymbolLight();
        setGridSymbolLightInit();
        setMultiplierOriginTable();
        setPrizeOriginTable();
        setComplete();
        setBkAnimationInit();
    }

    function radarSpeedControl() {
        switch (radarControlSpeed) {
            case 1:
            {
                gr.lib._radarSpeed_0.show(true);
                gr.lib._radarSpeed_1.show(false);
                gr.lib._radarSpeed_2.show(false);
                gr.animMap['_radarButtonLightAnim_0'].play();
                gr.animMap['_radarButtonLightAnim_1'].stop();
                gr.animMap['_radarButtonLightAnim_2'].stop();
                gr.animMap['_radarSpeedAnim_0'].play();
                gr.animMap['_radarSpeedAnim_1'].stop();
                gr.animMap['_radarSpeedAnim_2'].stop();
                gr.animMap['_radarScanAnim_0'].play();
                gr.animMap['_radarScanAnim_1'].stop();
                gr.animMap['_radarScanAnim_2'].stop();
                gr.animMap['_radarRingAnim_0'].play();
                gr.animMap['_radarRingAnim_1'].stop();
                gr.animMap['_radarRingAnim_2'].stop();
                radarCircleMoveTime = 200;
                symbolWinSpeed = 0.9;
                radarLightSpeed = 0.35;
                windowShakeSpeed = 30;
                revealAllSpeedEmit = false;
                break;
            }
            case 2:
            {
                gr.lib._radarSpeed_0.show(false);
                gr.lib._radarSpeed_1.show(true);
                gr.lib._radarSpeed_2.show(false);
                gr.animMap['_radarButtonLightAnim_0'].stop();
                gr.animMap['_radarButtonLightAnim_1'].play();
                gr.animMap['_radarButtonLightAnim_2'].stop();
                gr.animMap['_radarSpeedAnim_0'].stop();
                gr.animMap['_radarSpeedAnim_1'].play();
                gr.animMap['_radarSpeedAnim_2'].stop();
                gr.animMap['_radarScanAnim_0'].stop();
                gr.animMap['_radarScanAnim_1'].play();
                gr.animMap['_radarScanAnim_2'].stop();
                gr.animMap['_radarRingAnim_0'].stop();
                gr.animMap['_radarRingAnim_1'].play();
                gr.animMap['_radarRingAnim_2'].stop();
                radarCircleMoveTime = 100;
                symbolWinSpeed = 0.95;
                radarLightSpeed = 0.45;
                windowShakeSpeed = 25;
                revealAllSpeedEmit = false;
                break;
            }
            case 3:
            {
                if (isRevealing) {
                    gr.lib._radarButtonLight.show(false);
                    buttonRadar.enable(false);
                    gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
                }
                gr.lib._radarSpeed_0.show(false);
                gr.lib._radarSpeed_1.show(false);
                gr.lib._radarSpeed_2.show(true);
                gr.animMap['_radarButtonLightAnim_0'].stop();
                gr.animMap['_radarButtonLightAnim_1'].stop();
                gr.animMap['_radarButtonLightAnim_2'].play();
                gr.animMap['_radarSpeedAnim_0'].stop();
                gr.animMap['_radarSpeedAnim_1'].stop();
                gr.animMap['_radarSpeedAnim_2'].play();
                gr.animMap['_radarScanAnim_0'].stop();
                gr.animMap['_radarScanAnim_1'].stop();
                gr.animMap['_radarScanAnim_2'].play();
                gr.animMap['_radarRingAnim_0'].stop();
                gr.animMap['_radarRingAnim_1'].stop();
                gr.animMap['_radarRingAnim_2'].play();
                radarCircleMoveTime = 50;
                symbolWinSpeed = 0.95;
                radarLightSpeed = 0.55;
                windowShakeSpeed = 20;
                revealAllSpeedEmit = true;
                break;
            }
        }
    }

    function onStartUserInteraction(data) {
        if (!data.scenario) {
            return;
        }

        currentPrice = data.price;
        var splitArray = data.scenario.split('|');
        spots = Number(splitArray[0]);
        matchSpots = Number(splitArray[1].split('m')[0]);
        matchMultipliers = Number(splitArray[1].split('m')[1]);
        winValue = 0;
        if (data.playResult === "WIN") {
            prizeValue = data.prizeValue;
        } else {
            prizeValue = 0;
        }
        json_rds = {
            revealDataSave: {},
            wagerDataSave: {},
            spots: 0,
            amount: 0
        };

        if (SKBeInstant.config.wagerType === 'TRY') {
            revealDataExist = false;
            gr.lib['_radarDigital'].show(true);
            gr.lib['_radarDigital'].setImage('radarDigital_' + spots);
            gr.lib['_radarPickRemaining'].show(true);
            if (spots > 1) {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);
            } else {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
            }
            gr.animMap['_radarDigitalAnim'].play();
            gr.animMap['_screenAnim'].play();
        } else {
            if (SKBeInstant.isSKB()) {
                ticketId = data.ticketId;
            } else {
                ticketId = data.scenario;
            }

            var targetData = getRevealDataFromResponse(data);
            if (targetData) {
                //json_rds.revealDataSave = targetData;
            } else {
                targetData = {};
            }

            if (SKBeInstant.config.gameType === 'normal' || !targetData[ticketId]) {
                revealDataExist = false;
                setEmptyRevealDataSave(data);
                gr.lib['_radarDigital'].show(true);
                gr.lib['_radarDigital'].setImage('radarDigital_' + spots);
                gr.lib['_radarPickRemaining'].show(true);
                if (spots > 1) {
                    gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);
                } else {
                    gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
                }
                gr.animMap['_radarDigitalAnim'].play();
                gr.animMap['_screenAnim'].play();
            } else {
                revealDataExist = true;
                json_rds.revealDataSave[ticketId] = targetData[ticketId];
                handleData(targetData[ticketId]);

                if (arrSpots.length > 0) {
                    gr.lib['_radarDigital'].show(false);
                    gr.lib['_radarPickRemaining'].show(false);

                    buttonQuickPick.show(true);
                    buttonQuickPick.enable(false);
                    gr.lib['_quickPikcAnim'].show(false);
                    gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});

                    buttonClear.show(true);
                    buttonClear.enable(false);
                    gr.lib['_ClearAnim'].show(false);
                    gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});

                    gr.lib._buttonAutoPlay.show(true);
                    msgBus.publish('enableChanged', true);
                    autoPlayEnable = true;
                } else {
                    revealDataExist = false;
                    gr.lib['_radarDigital'].show(true);
                    gr.lib['_radarDigital'].setImage('radarDigital_' + spots);
                    gr.lib['_radarPickRemaining'].show(true);
                    if (spots > 1) {
                        gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);
                    } else {
                        gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
                    }
                    gr.animMap['_radarDigitalAnim'].play();

                    gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = false;
                    buttonQuickPick.show(true);
                    buttonQuickPick.enable(true);
                    gr.lib['_quickPikcAnim'].show(true);
                    gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

                    buttonClear.show(true);
                    buttonClear.enable(false);
                    gr.lib['_ClearAnim'].show(false);
                    gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});

                    gr.lib._buttonAutoPlay.show(true);
                    msgBus.publish('enableChanged', false);
                    autoPlayEnable = false;

                    for (var i = 0; i < 8; i++) {
                        for (var j = 0; j < 10; j++) {
                            gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = true;
                        }
                    }
                    gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = true;
                }
            }
        }

        gr.lib['_radarSpeed'].setImage('radarSpeed');
        buttonRadar.enable(true);
        gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': 'ff9f00', '_color': 'ffffff'}});
        gr.lib._radarButtonLight.show(true);
        gr.animMap['_radarButtonLightAnim_0'].play();
        gr.animMap['_radarSpeedAnim_0'].play();
        gr.lib._radarScan.show(true);
        gr.animMap['_radarScanAnim_0'].play();
        gr.animMap['_radarRingAnim_0'].play();
        gr.animMap['_radarLineAnim_0'].play();
        gr.animMap['_radarLineAnim_1'].play();
        gr.lib['_gameLogo'].gotoAndPlay('logo', 0.25);
        radarSpeedControl();
        hasRevealAll = false;
    }

    function setEmptyRevealDataSave(data) {
        json_rds.revealDataSave = {};
        json_rds.revealDataSave[ticketId] = {};
        json_rds.revealDataSave[ticketId].price = data.price;
        json_rds.revealDataSave[ticketId].spot = data.spots;
        json_rds.revealDataSave[ticketId].spots = '';
        json_rds.revealDataSave[ticketId].multipliers = '';
        json_rds.revealDataSave[ticketId].radarNum = '';
        publishMSG();
    }

    function handleData(revealdata) {
        autoClick = false;
        arrSpots = [];
        arrMultipliers = [];
        arrAllNumInfo = [];

        if (revealdata.price) {
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 10; j++) {
                    gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                }
            }

            var strSpots = revealdata.spots;
            var strMultipliers = revealdata.multipliers;
            var strRadarNum = revealdata.radarNum;
            if (strSpots) {
                if (revealdata.spot > 1) {
                    strSpots = strSpots.split(',');
                    for (var i = 0; i < strSpots.length; i++) {
                        var temp = {};
                        temp.num = Number(strSpots[i]);
                        arrSpots.push(temp);
                    }
                } else {
                    var temp = {};
                    temp.num = Number(strSpots);
                    arrSpots.push(temp);
                }

                //show spots animation
                for (var i = 0; i < arrSpots.length; i++) {
                    var xIndex;
                    var yIndex;
                    if ((arrSpots[i].num % 10) === 0) {
                        xIndex = arrSpots[i].num / 10 - 1;
                        yIndex = 9;
                    } else {
                        xIndex = (arrSpots[i].num - arrSpots[i].num % 10) / 10;
                        yIndex = arrSpots[i].num % 10 - 1;
                    }
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 1;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                }
            }

            if (strMultipliers) {
                strMultipliers = strMultipliers.split(',');
                for (var i = 0; i < strMultipliers.length; i++) {
                    var temp = {};
                    temp.num = Number(strMultipliers[i]);
                    arrMultipliers.push(temp);
                }
            }

            if (strRadarNum) {
                strRadarNum = strRadarNum.split(',');
                for (var i = 0; i < strRadarNum.length; i++) {
                    var temp = {};
                    temp.index = i;
                    temp.num = Number(strRadarNum[i]);
                    if (arrSpots.find(function (parameter) {
                        return parameter.num === Number(strRadarNum[i]);
                    })) {
                        temp.type = 0;
                        temp.state = 1;
                    } else if (arrMultipliers.find(function (parameter) {
                        return parameter.num === Number(strRadarNum[i]);
                    })) {
                        temp.type = 1;
                        temp.state = 1;
                    } else {
                        temp.type = 2;
                        temp.state = 0;
                    }
                    arrAllNumInfo.push(temp);
                }
            }
            msgBus.publish('ticketCostChanged', revealdata.price);
            msgBus.publish('spotsChanged', revealdata.spot);
        }
    }

    function getRevealDataFromResponse(data) {
        var targetData;
        if (!data.revealData || data.revealData === "null") //jLottery MTM will return "null" revealData WFTIW-108
        {
            return;
        }
        if (SKBeInstant.isSKB()) {
            targetData = data.revealData;
        } else {
            var responseRevealData = data.revealData.replace(/\\/g, '');
            responseRevealData = JSON.parse(responseRevealData);
            targetData = responseRevealData;
        }
        return targetData;
    }

    //calculate muitipliers
    function getGridSymbolMultiplier() {
        arrMultipliers = [];
        for (var i = 0; i < 6; ) {
            var number = Math.floor(Math.random() * 80) + 1;
            //can't get duplicate number
            if (!arrSpots.find(function (parameter) {
                return parameter.num === number;
            }) && !arrMultipliers.find(function (parameter) {
                return parameter.num === number;
            })) {
                var muitiplier = {};
                muitiplier["num"] = number;
                arrMultipliers.push(muitiplier);
                i++;
            }
        }
    }

    function getRadarGridSymbol() {
        arrAllNumInfo = [];
        // calculate the array of MatchSpots
        var arrMatchSpotsIndex = [];
        //get the index of winning numbers in the array of spots randomly
        for (var i = 0; i < matchSpots; ) {
            var index = Math.floor(Math.random() * spots);
            if (!arrMatchSpotsIndex.find(function (parameter) {
                return parameter.index === index;
            })) {
                var matchIndex = {};
                matchIndex["index"] = index;
                arrMatchSpotsIndex.push(matchIndex);
                i++;
            }
        }

        //calculate the array of MatchMuitipliers
        var arrMatchMultipliersIndex = [];
        //get the index of winning numbers in the array of multipliers randomly
        for (var i = 0; i < matchMultipliers; ) {
            var index = Math.floor(Math.random() * multipliers);
            if (!arrMatchMultipliersIndex.find(function (parameter) {
                return parameter.index === index;
            })) {
                var matchIndex = {};
                matchIndex["index"] = index;
                arrMatchMultipliersIndex.push(matchIndex);
                i++;
            }
        }

        //get the winning number in the spots according to the index 
        //calculate the index of winning spots in the array of numbers which was emitted by radar
        //save the winning numbers to the array 
        for (var j = 0; j < arrMatchSpotsIndex.length; j++) {
            var arrMatchSpot = {};
            arrMatchSpot["num"] = arrSpots[arrMatchSpotsIndex[j].index].num;
            var index = Math.floor(Math.random() * 20);
            while (arrAllNumInfo.find(function (parameter) {
                return parameter.index === index;
            })) {
                index = Math.floor(Math.random() * 20);
            }
            arrMatchSpot["index"] = index;
            arrMatchSpot["type"] = 0;
            arrMatchSpot["state"] = 1;
            arrAllNumInfo.push(arrMatchSpot);
        }

        //get the winning number in the multipliers according to the index 
        //calculate the index of winning multipliers in the array of numbers which was emitted by radar
        //save the winning numbers to the array 
        for (var j = 0; j < arrMatchMultipliersIndex.length; j++) {
            var arrMatchMultiplier = {};
            arrMatchMultiplier["num"] = arrMultipliers[arrMatchMultipliersIndex[j].index].num;
            var index = Math.floor(Math.random() * 20);
            while (arrAllNumInfo.find(function (parameter) {
                return parameter.index === index;
            })) {
                index = Math.floor(Math.random() * 20);
            }
            arrMatchMultiplier["index"] = index;
            arrMatchMultiplier["type"] = 1;
            arrMatchMultiplier["state"] = 1;
            arrAllNumInfo.push(arrMatchMultiplier);
        }

        //calculate the numbers of nowin
        var noWinNum = 20 - matchSpots - matchMultipliers;
        var index = 0;
        var arrNoWinInfo = [];
        for (var i = 0; i < noWinNum; i++) {
            var noWinInfo = {};
            var num = Math.floor(Math.random() * 80) + 1;
            while (arrSpots.find(function (parameter) {
                return parameter.num === num;
            }) || arrMultipliers.find(function (parameter) {
                return parameter.num === num;
            }) || arrNoWinInfo.find(function (parameter) {
                return parameter.num === num;
            })) {
                num = Math.floor(Math.random() * 80) + 1;
            }
            noWinInfo["num"] = num;
            //get the index of no-winning numbers
            for (; index < 20; ) {
                if (arrAllNumInfo.find(function (parameter) {
                    return parameter.index === index;
                })) {
                    index++;
                    continue;
                } else {
                    noWinInfo["index"] = index;
                    index++;
                    break;
                }
            }
            noWinInfo["type"] = 2;
            noWinInfo["state"] = 0;
            arrNoWinInfo.push(noWinInfo);
            arrAllNumInfo.push(noWinInfo);
        }

        function sortId(a, b) {
            return a.index - b.index;
        }

        //sort the arrAllNumInfo
        arrAllNumInfo.sort(sortId);
    }

    function gridSymbolWin(speed, lightSpeed, circleMoveTime) {
        if (radarEmitNumCount < arrAllNumInfo.length) {
            var radarEmitNumCurrent = radarEmitNumCount;
            gr.lib['_radarsymbolsNumble'].setImage("SymbolsDigital_" + (arrAllNumInfo.length - radarEmitNumCurrent));
            //radar emit numbers
            var xIndex;
            var yIndex;
            if ((arrAllNumInfo[radarEmitNumCurrent].num % 10) === 0) {
                xIndex = arrAllNumInfo[radarEmitNumCurrent].num / 10 - 1;
                yIndex = 9;
            } else {
                xIndex = (arrAllNumInfo[radarEmitNumCurrent].num - arrAllNumInfo[radarEmitNumCurrent].num % 10) / 10;
                yIndex = arrAllNumInfo[radarEmitNumCurrent].num % 10 - 1;
            }
            //Determine the location and display of the red spot in the radar scan
            if (xIndex < 4 && yIndex < 5) {//the red spot show in the second quadrant
                var index = Math.floor(Math.random() * 3);
                gr.lib['_radarLightAnim_' + index].show(true);
                gr.lib['_radarLightAnim_' + index].gotoAndPlay("radarLightAnim", lightSpeed);
                radarLightIndex = index;
            } else if (xIndex >= 4 && yIndex < 5) {//the red spot show in the third quadrant
                var index = Math.floor(Math.random() * 3) + 3;
                gr.lib['_radarLightAnim_' + index].show(true);
                gr.lib['_radarLightAnim_' + index].gotoAndPlay("radarLightAnim", lightSpeed);
                radarLightIndex = index;
            } else if (xIndex >= 4 && yIndex >= 5) {//the red spot show in the forth quadrant
                var index = Math.floor(Math.random() * 3) + 6;
                gr.lib['_radarLightAnim_' + index].show(true);
                gr.lib['_radarLightAnim_' + index].gotoAndPlay("radarLightAnim", lightSpeed);
                radarLightIndex = index;
            } else {//the red spot show in the first quadrant
                var index = Math.floor(Math.random() * 3) + 9;
                gr.lib['_radarLightAnim_' + index].show(true);
                gr.lib['_radarLightAnim_' + index].gotoAndPlay("radarLightAnim", lightSpeed);
                radarLightIndex = index;
            }

            //radar move to the next symbol
            gr.lib._radarCircle_0.show(true);
            gr.lib._radarCircle_1.show(true);
            gr.lib['_radarCircleAnim'].show(false);
            switch (speed) {
                case 1:
                {
                    if (config.audio && config.audio.RevealerHoverLoopMed) {
                        audio.play(config.audio.RevealerHoverLoopSlow.name, config.audio.RevealerHoverLoopSlow.channel);
                    }
                    break;
                }
                case 2:
                {
                    if (config.audio && config.audio.RevealerHoverLoopFast) {
                        audio.play(config.audio.RevealerHoverLoopMed.name, config.audio.RevealerHoverLoopMed.channel);
                    }
                    break;
                }
            }
            var destination = gr.lib['_symbols_' + xIndex + '_' + yIndex];

            gr.lib._radarLine_0.show(true);
            gr.lib._radarLine_1.show(true);
            gr.animMap['_radarCircleAnim_' + (speed - 1)].play();

            //function move:move around the center
            //line0 only need move top,so we should keep the left the same
            var curentLeft = gr.lib._radarLine_0._currentStyle._left;
            var line0Anim = tw.move(gr.lib._radarLine_0, destination, circleMoveTime);
            gr.animMap[line0Anim.animData._name].animData._keyFrames[1]._SPRITES[0]._style._left = curentLeft;
            //function move:move around the center
            //line1 only need move left,so we should keep the top the same
            var curentTop = gr.lib._radarLine_1._currentStyle._top;
            var line1Anim = tw.move(gr.lib._radarLine_1, destination, circleMoveTime);
            gr.animMap[line1Anim.animData._name].animData._keyFrames[1]._SPRITES[0]._style._top = curentTop;
            tw.move(gr.lib._radarCircle_0, destination, circleMoveTime);
            tw.move(gr.lib._radarCircle_1, destination, circleMoveTime);
            tw.move(gr.lib._radarCircleAnim, destination, circleMoveTime, {alpha: 1}, {_onComplete: function () {
                    if (config.audio && config.audio.RevealerHoverTerm) {
                        audio.play(config.audio.RevealerHoverTerm.name, config.audio.RevealerHoverTerm.channel);
                    }
                    gr.lib._radarCircle_0.show(false);
                    gr.lib._radarCircle_1.show(false);
                    gr.lib['_radarCircleAnim'].show(true);
                    gr.animMap["_radarCircleAnimExpand_" + (speed - 1)].play();

                    if (arrAllNumInfo[radarEmitNumCurrent].type === 0 && arrAllNumInfo[radarEmitNumCurrent].state === 1) {
                        msgBus.publish('gameScenceShake', windowShakeSpeed);
                        var audioIndex = Math.floor(matchSpotsCount / 2);
                        if (config.audio && config.audio['AutoSelectNumber' + (audioIndex + 1)]) {
                            audio.play(config.audio['AutoSelectNumber' + (audioIndex + 1)].name, config.audio['AutoSelectNumber' + (audioIndex + 1)].channel);
                        }
                        gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 5;
                        gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                    } else if (arrAllNumInfo[radarEmitNumCurrent].type === 1 && arrAllNumInfo[radarEmitNumCurrent].state === 1) {
                        msgBus.publish('gameScenceShake', windowShakeSpeed);
                        if (config.audio && config.audio['AutoSelectMultiplier' + (matchMultipliersCount + 1)]) {
                            audio.play(config.audio['AutoSelectMultiplier' + (matchMultipliersCount + 1)].name, config.audio['AutoSelectMultiplier' + (matchMultipliersCount + 1)].channel);
                        }
                        gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 6;
                        gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                    } else if (arrAllNumInfo[radarEmitNumCurrent].type === 2) {
                        gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 3;
                        gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                    }
                }});
        } else {//radar have emitted all the numbers
            if (winValue !== prizeValue) {
                msgBus.publish('winboxError', {errorCode: '29000'});
                return;
            }
            msgBus.publish('allRevealed');
            buttonRadar.enable(false);
            hasRevealAll = true;
            gr.lib['_radarsymbolsNumble'].show(false);
            gr.animMap['_radarSpeedAnim_0'].stop();
            gr.animMap['_radarSpeedAnim_1'].stop();
            gr.animMap['_radarSpeedAnim_2'].stop();
            gr.animMap['_radarScanAnim_0'].stop();
            gr.animMap['_radarScanAnim_1'].stop();
            gr.animMap['_radarScanAnim_2'].stop();
            gr.animMap['_radarRingAnim_0'].stop();
            gr.animMap['_radarRingAnim_1'].stop();
            gr.animMap['_radarRingAnim_2'].stop();
            gr.animMap['_radarLineAnim_0'].stop();
            gr.animMap['_radarLineAnim_1'].stop();
            gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
            gr.lib._radarButtonLight.show(false);
            gr.animMap['_radarButtonLightAnim_0'].stop();
            gr.animMap['_radarButtonLightAnim_1'].stop();
            gr.animMap['_radarButtonLightAnim_2'].stop();
            gr.lib['_gameLogo'].stopPlay();
            return;
        }
    }

    function allGridSymbolWin() {
        gr.lib._radarButtonLight.show(false);
        buttonRadar.enable(false);
        gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
        gr.lib._radarLine_0.show(false);
        gr.lib._radarLine_1.show(false);
        gr.lib._radarCircle_0.show(false);
        gr.lib._radarCircle_1.show(false);
        gr.lib['_radarCircleAnim'].show(false);
        revealAllSpeedEmit = false;

        var matchSpotsCountTemp = matchSpotsCount;
        var matchMultipliersCountTemp = matchMultipliersCount;
        var i = radarEmitNumCount;
        var u = setInterval(function () {
            if (i >= arrAllNumInfo.length) {
                clearInterval(u);
                gr.lib['_radarsymbolsNumble'].show(false);
                var allRevealInterval = setInterval(function () {
                    if (radarEmitNumCount >= arrAllNumInfo.length) {
                        clearInterval(allRevealInterval);
                        if (winValue !== prizeValue) {
                            msgBus.publish('winboxError', {errorCode: '29000'});
                            return;
                        }
                        //radar have emitted all the numbers
                        msgBus.publish('allRevealed');
                        hasRevealAll = true;
                        gr.animMap['_radarSpeedAnim_0'].stop();
                        gr.animMap['_radarSpeedAnim_1'].stop();
                        gr.animMap['_radarSpeedAnim_2'].stop();
                        gr.animMap['_radarScanAnim_0'].stop();
                        gr.animMap['_radarScanAnim_1'].stop();
                        gr.animMap['_radarScanAnim_2'].stop();
                        gr.animMap['_radarRingAnim_0'].stop();
                        gr.animMap['_radarRingAnim_1'].stop();
                        gr.animMap['_radarRingAnim_2'].stop();
                        gr.animMap['_radarLineAnim_0'].stop();
                        gr.animMap['_radarLineAnim_1'].stop();

                        gr.animMap['_radarButtonLightAnim_0'].stop();
                        gr.animMap['_radarButtonLightAnim_1'].stop();
                        gr.animMap['_radarButtonLightAnim_2'].stop();
                        gr.lib['_gameLogo'].stopPlay();
                        return;
                    }
                }, 100);
            } else {
                gr.lib['_radarsymbolsNumble'].setImage("SymbolsDigital_" + (arrAllNumInfo.length - i));
                var xIndex;
                var yIndex;
                if ((arrAllNumInfo[i].num % 10) === 0) {
                    xIndex = arrAllNumInfo[i].num / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (arrAllNumInfo[i].num - arrAllNumInfo[i].num % 10) / 10;
                    yIndex = arrAllNumInfo[i].num % 10 - 1;
                }
                if (arrAllNumInfo[i].type === 0 && arrAllNumInfo[i].state === 1) {
                    var audioIndex = Math.floor(matchSpotsCountTemp / 2);
                    if (config.audio && config.audio['AutoSelectNumber' + (audioIndex + 1)]) {
                        audio.play(config.audio['AutoSelectNumber' + (audioIndex + 1)].name, config.audio['AutoSelectNumber' + (audioIndex + 1)].channel);
                    }
                    matchSpotsCountTemp++;
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 5;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                } else if (arrAllNumInfo[i].type === 1 && arrAllNumInfo[i].state === 1) {
                    matchMultipliersCountTemp++;
                    if (config.audio && config.audio['AutoSelectMultiplier' + matchMultipliersCountTemp]) {
                        audio.play(config.audio['AutoSelectMultiplier' + matchMultipliersCountTemp].name, config.audio['AutoSelectMultiplier' + matchMultipliersCountTemp].channel);
                    }
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 6;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                } else if (arrAllNumInfo[i].type === 2) {
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 3;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                }
            }
            i++;
        }, 100);
    }

    function escapeCharacter(rdsData) {
        return {revealDataSave: JSON.stringify(rdsData.revealDataSave), wagerDataSave: JSON.stringify(rdsData.wagerDataSave), spots: 0, amount: 0};
    }

    function publishMSG() {
        if (SKBeInstant.config.wagerType !== 'TRY') {
            if (SKBeInstant.isSKB()) {
                msgBus.publish('jLotteryGame.revealDataSave', json_rds);
            } else {
                msgBus.publish('jLotteryGame.revealDataSave', escapeCharacter(json_rds));
            }
        }
        console.log(json_rds);
        console.log(escapeCharacter(json_rds));
    }

    //show the game which was not completed last time
    function showInprogressScence() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
            }
        }
        matchSpotsCount = 0;
        matchMultipliersCount = 0;
        radarEmitNumCount = 0;

        buttonQuickPick.show(false);
        buttonClear.show(false);
        gr.lib._buttonAutoPlay.show(false);

        if (arrAllNumInfo.length > 0) {
            //show multipliers animation
            if (config.audio && config.audio.MultiplierAutoSelect) {
                audio.play(config.audio.MultiplierAutoSelect.name, config.audio.MultiplierAutoSelect.channel);
            }
            for (var i = 0; i < arrMultipliers.length; i++) {
                var xIndex;
                var yIndex;
                if ((arrMultipliers[i].num % 10) === 0) {
                    xIndex = arrMultipliers[i].num / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (arrMultipliers[i].num - arrMultipliers[i].num % 10) / 10;
                    yIndex = arrMultipliers[i].num % 10 - 1;
                }
                gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 2;
                gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
            }
            if (errorOn) {
                return;
            }
            publishMSG();
        } else if (arrMultipliers.length > 0) {
            //show multipliers animation
            if (config.audio && config.audio.MultiplierAutoSelect) {
                audio.play(config.audio.MultiplierAutoSelect.name, config.audio.MultiplierAutoSelect.channel);
            }
            for (var i = 0; i < arrMultipliers.length; i++) {
                var xIndex;
                var yIndex;
                if ((arrMultipliers[i].num % 10) === 0) {
                    xIndex = arrMultipliers[i].num / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (arrMultipliers[i].num - arrMultipliers[i].num % 10) / 10;
                    yIndex = arrMultipliers[i].num % 10 - 1;
                }
                gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 2;
                gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
            }

            //calculate the number of radar launches
            getRadarGridSymbol();
            //revealDataSave:save the data of all number
            var arr2 = '';
            for (var i = 0; i < arrAllNumInfo.length; i++) {
                if (i === (arrAllNumInfo.length - 1)) {
                    arr2 = arr2 + arrAllNumInfo[i].num;
                } else {
                    arr2 = arr2 + arrAllNumInfo[i].num + ',';
                }
            }
            json_rds.revealDataSave[ticketId].radarNum = arr2;
            if (errorOn) {
                return;
            }
            publishMSG();
        } else if (arrSpots.length > 0) {
            //calculate the number of multiplier 
            getGridSymbolMultiplier();
            //revealdatasave: save the data of multipliers
            var arr1 = '';
            for (var i = 0; i < arrMultipliers.length; i++) {
                if (i === (arrMultipliers.length - 1)) {
                    arr1 = arr1 + arrMultipliers[i].num;
                } else {
                    arr1 = arr1 + arrMultipliers[i].num + ',';
                }
            }
            json_rds.revealDataSave[ticketId].multipliers = arr1;
            if (errorOn) {
                return;
            }
            publishMSG();
            //show multipliers animation
            if (config.audio && config.audio.MultiplierAutoSelect) {
                audio.play(config.audio.MultiplierAutoSelect.name, config.audio.MultiplierAutoSelect.channel);
            }
            for (var i = 0; i < arrMultipliers.length; i++) {
                var xIndex;
                var yIndex;
                if ((arrMultipliers[i].num % 10) === 0) {
                    xIndex = arrMultipliers[i].num / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (arrMultipliers[i].num - arrMultipliers[i].num % 10) / 10;
                    yIndex = arrMultipliers[i].num % 10 - 1;
                }
                gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 2;
                gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
            }

            //calculate the number of radar launches
            getRadarGridSymbol();
            //revealdatasave:save the data of all number
            var arr2 = '';
            for (var i = 0; i < arrAllNumInfo.length; i++) {
                if (i === (arrAllNumInfo.length - 1)) {
                    arr2 = arr2 + arrAllNumInfo[i].num;
                } else {
                    arr2 = arr2 + arrAllNumInfo[i].num + ',';
                }
            }
            json_rds.revealDataSave[ticketId].radarNum = arr2;
            if (errorOn) {
                return;
            }
            publishMSG();
        }
    }

    //change the state of symbol when clicked
    function gridSymbolChangeState(spriteContainer) {
        //disable the click event of symbol
        gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = false;
        autoClick = true;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
            }
        }
        //change the state of symbol which was clicked
        for (var i = 0; i < symbol.length; i++) {
            if (symbol[i].data._name === spriteContainer.name) {
                symbol[i].flag = 1;
                var xIndex, yIndex;
                if ((symbol[i].gridIndex % 10) === 0) {
                    xIndex = symbol[i].gridIndex / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (symbol[i].gridIndex - symbol[i].gridIndex % 10) / 10;
                    yIndex = symbol[i].gridIndex % 10 - 1;
                }

                if (symbol[i].gridState) {// selected->not selected
                    if (config.audio && config.audio.Deselect) {
                        audio.play(config.audio.Deselect.name, config.audio.Deselect.channel);
                    }
                    symbol[i].gridState = false;
                    symbol[i].setImage('GrayNumber_' + symbol[i].gridIndex);
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 0;
                    symbol[i].flag = 0;
                    for (var j = 0; j < arrSpots.length; j++) {
                        if (arrSpots[j].num === symbol[i].gridIndex) {
                            arrSpots.splice(j, 1);
                            break;
                        }
                    }
                } else {// not selected->selected
                    symbol[i].gridState = true;
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 1;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                    var spotInfo = {};
                    spotInfo.num = symbol[i].gridIndex;
                    arrSpots.push(spotInfo);

                    if (config.audio && config.audio['SelectUser' + arrSpots.length]) {
                        audio.play(config.audio['SelectUser' + arrSpots.length].name, config.audio['SelectUser' + arrSpots.length].channel);
                    }
                }
                break;
            }
        }

        //if the count of selected symbol reaches the set spot value, only the selected symbol can change state, at the same time, set the go button to be available
        //if the count of selected symbol don't reach the set spot value, all symbol can change state, at the same time, set the go button to be unavailable
        if (Number(arrSpots.length) === Number(spots)) {
            for (var i = 0; i < arrSpots.length; i++) {
                var xIndex;
                var yIndex;
                if ((arrSpots[i].num % 10) === 0) {
                    xIndex = arrSpots[i].num / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (arrSpots[i].num - arrSpots[i].num % 10) / 10;
                    yIndex = arrSpots[i].num % 10 - 1;
                }
                if (gr.lib['_symbols_' + xIndex + '_' + yIndex].flag === 0) {
                    gr.lib['_symbols_' + xIndex + '_' + yIndex].pixiContainer.buttonMode = true;
                }
            }
            msgBus.publish('enableChanged', true);
            autoPlayEnable = true;
            //gr.lib['_radarDigital'].show(false);
            gr.lib['_radarDigital'].show(true);
            gr.lib['_radarDigital'].setImage('radarDigital_0');
            gr.lib['_radarPickRemaining'].show(true);
            gr.animMap['_radarDigitalAnim'].play();
            gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
        } else {
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 10; j++) {
                    if (gr.lib['_symbols_' + i + '_' + j].flag === 0) {
                        gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = true;
                    }
                }
            }
            msgBus.publish('enableChanged', false);
            autoPlayEnable = false;
            gr.lib['_radarDigital'].show(true);
            gr.lib['_radarDigital'].setImage('radarDigital_' + (spots - arrSpots.length));
            gr.lib['_radarPickRemaining'].show(true);
            if (Number(spots) - Number(arrSpots.length) > 1) {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);
            } else {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
            }
            gr.animMap['_radarDigitalAnim'].play();
        }
        if (arrSpots.length > 0) {
            buttonClear.enable(true);
            gr.lib['_ClearAnim'].show(true);
            gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});
        } else {
            buttonClear.enable(false);
            gr.lib['_ClearAnim'].show(false);
            gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
        }
        gr.lib._reelsBGLayer.pixiContainer.interactiveChildren = true;
    }

    function onPlayerWantsPlayAgain() {
        playAgainRequest = true;
        isRevealing = false;
        setRadarInit();
        setGridSymbolInit();
        setGridSymbolLightInit();
        for (var i = 0; i < 6; i++) {
            gr.lib['_multiplierLine' + i].show(true);
            gr.lib['_multiplierWinLine' + i].show(false);
            gr.lib['_multiplierWinBox' + i].show(false);
        }
        for (var i = 0; i < 10; i++) {
            gr.lib['_prizeTableLine' + (i + 1)].show(true);
            gr.lib['_prizeTableWinLine' + (i + 1)].show(false);
            gr.lib['_prizeWinBox' + i].show(false);
        }

        var num = 1;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 10; j++) {
                gr.animMap['_symbolsWinAnim0_' + i + '_' + j].stop();
                gr.lib['_symbolLight_' + i + '_' + j].stopPlay();
                gr.animMap['_symbolsWinAnim1_' + i + '_' + j].stop();
                gr.lib['_symbolLight_' + i + '_' + j].gridStateChange = 0;
                gr.lib['_symbolLight_' + i + '_' + j].lightIndex = 0;
                gr.lib['_symbolLight_' + i + '_' + j].show(false);
                gr.lib['_symbols_' + i + '_' + j].setImage('GrayNumber_' + num);
                gr.lib['_symbols_' + i + '_' + j].updateCurrentStyle({'_opacity': 1});
                gr.lib['_symbols_' + i + '_' + j].gridState = false;
                gr.lib['_symbols_' + i + '_' + j].flag = 0;
                gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                num++;
            }
        }

        quickPickCount = 0;
        symbolLightFinishCount = 0;
        autoClick = false;

        for (var i = 0; i < arrSpots.length; i++) {
            var xIndex;
            var yIndex;
            if ((arrSpots[i].num % 10) === 0) {
                xIndex = arrSpots[i].num / 10 - 1;
                yIndex = 9;
            } else {
                xIndex = (arrSpots[i].num - arrSpots[i].num % 10) / 10;
                yIndex = arrSpots[i].num % 10 - 1;
            }
            gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 1;
            gr.lib['_symbols_' + xIndex + '_' + yIndex].setImage("GreenNumber_" + arrSpots[i].num);
        }
    }

    function onReInitialize() {
        playAgainRequest = false;
        isRevealing = false;
        setRadarInit();
        setRadarScanInit();
        setGridSymbolInit();
        setGridSymbolLightInit();
        setMultiplierOriginTable();
        setPrizeOriginTable();
        autoClick = true;
        quickPickCount = 0;
        symbolLightFinishCount = 0;
    }

    function onReStartUserInteraction(data) {
        //onStartUserInteraction(data);
        if (!data.scenario) {
            return;
        }
        currentPrice = data.price;
        var splitArray = data.scenario.split('|');
        spots = Number(splitArray[0]);
        matchSpots = Number(splitArray[1].split('m')[0]);
        matchMultipliers = Number(splitArray[1].split('m')[1]);
        winValue = 0;
        if (data.playResult === "WIN") {
            prizeValue = data.prizeValue;
        } else {
            prizeValue = 0;
        }

        json_rds = {
            revealDataSave: {},
            wagerDataSave: {},
            spots: 0,
            amount: 0
        };

        revealDataExist = false;

        if (SKBeInstant.config.wagerType !== 'TRY') {
            if (SKBeInstant.isSKB()) {
                ticketId = data.ticketId;
            } else {
                ticketId = data.scenario;
            }
            setEmptyRevealDataSave(data);
        }

        if (playAgainRequest) {
            gr.lib['_radarDigital'].show(true);
            gr.lib['_radarDigital'].setImage('radarDigital_0');
            gr.lib['_radarPickRemaining'].show(true);
            gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);

            buttonQuickPick.show(true);
            buttonQuickPick.enable(true);
            gr.lib['_quickPikcAnim'].show(true);
            gr.lib['_quickPickText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

            buttonClear.show(true);
            buttonClear.enable(true);
            gr.lib['_ClearAnim'].show(true);
            gr.lib['_clearText'].updateCurrentStyle({'_text': {'_strokeColor': '0095fd', '_color': 'ffffff'}});

            gr.lib._buttonAutoPlay.show(true);
            msgBus.publish('enableChanged', true);
            autoPlayEnable = true;

            for (var i = 0; i < arrSpots.length; i++) {
                var xIndex;
                var yIndex;
                if ((arrSpots[i].num % 10) === 0) {
                    xIndex = arrSpots[i].num / 10 - 1;
                    yIndex = 9;
                } else {
                    xIndex = (arrSpots[i].num - arrSpots[i].num % 10) / 10;
                    yIndex = arrSpots[i].num % 10 - 1;
                }

                gr.lib['_symbols_' + xIndex + '_' + yIndex].gridState = true;
                gr.lib['_symbols_' + xIndex + '_' + yIndex].pixiContainer.buttonMode = true;
            }
        } else {
            gr.lib['_radarDigital'].show(true);
            gr.lib['_radarDigital'].setImage('radarDigital_' + spots);
            gr.lib['_radarPickRemaining'].show(true);
            if (spots > 1) {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.picks_remain);
            } else {
                gr.lib['_radarPickRemaining'].setText(loader.i18n.Game.pick_remain);
            }
            gr.animMap['_radarDigitalAnim'].play();

            gr.animMap['_screenAnim'].play();
            gr.lib['_radarSpeed'].setImage('radarSpeed');
        }

        buttonRadar.enable(true);
        gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': 'ff9f00', '_color': 'ffffff'}});
        gr.lib._radarButtonLight.show(true);
        gr.animMap['_radarButtonLightAnim_0'].play();
        gr.animMap['_radarSpeedAnim_0'].play();
        gr.lib._radarScan.show(true);
        gr.animMap['_radarScanAnim_0'].play();
        gr.animMap['_radarRingAnim_0'].play();
        gr.animMap['_radarLineAnim_0'].play();
        gr.animMap['_radarLineAnim_1'].play();
        gr.lib['_gameLogo'].gotoAndPlay('logo', 0.25);
        radarSpeedControl();
        hasRevealAll = false;
    }

    function onTicketCostChanged(prizePoint) {
        prizeTableValue = [];
        prizeValueList = [];
        currentPrice = prizePoint;
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        var tableLengh = 0;
        for (var i = 0; i < rc.length; i++) {
            if (Number(prizePoint) === Number(rc[i].price) && Number(currentSpots) === Number(rc[i].spots)) {
                tableLengh = rc[i].prizeTable.length;
                for (var j = 0; j < tableLengh; j++) {
                    var tableItem = {};
                    //var description = rc[i].prizeTable[j].description;
                    //tableItem.matchNum = description.split('m')[1];
                    tableItem.matchPrize = rc[i].prizeTable[j].prize;
                    prizeTableValue.push(tableItem);
                }
                break;
            }
        }
        var matchCount = 0;
        for (var i = 1; i < 11; i++) {
            if (i < 11 - Number(currentSpots) || matchCount >= tableLengh) {
                gr.lib['_prizeText' + i].setText('-');
                gr.lib['_prizeWinText' + i].setText('-');
                prizeValueList.push("0");
            } else {
                gr.lib['_prizeText' + i].setText(SKBeInstant.formatCurrency(prizeTableValue[matchCount].matchPrize).formattedAmount);
                gr.lib['_prizeWinText' + i].setText(SKBeInstant.formatCurrency(prizeTableValue[matchCount].matchPrize).formattedAmount);
                prizeValueList.push(prizeTableValue[matchCount].matchPrize);
                matchCount++;
            }
        }
    }

    function onspotsChanged(spotPoint) {
        if (playAgainRequest && Number(spotPoint) !== Number(currentSpots)) {
            playAgainRequest = false;
            arrSpots = [];
            autoClick = true;
            quickPickCount = 0;
            symbolLightFinishCount = 0;
            //setRadarInit();
            setGridSymbolInit();
            setGridSymbolLightInit();
        }

        prizeTableValue = [];
        prizeValueList = [];
        currentSpots = spotPoint;
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        var tableLengh = 0;
        for (var i = 0; i < rc.length; i++) {
            if (Number(currentPrice) === Number(rc[i].price) && Number(spotPoint) === Number(rc[i].spots)) {
                tableLengh = rc[i].prizeTable.length;
                for (var j = 0; j < tableLengh; j++) {
                    var tableItem = {};
                    //var description = rc[i].prizeTable[j].description;
                    //tableItem.matchNum = description.split('m')[1];
                    tableItem.matchPrize = rc[i].prizeTable[j].prize;
                    prizeTableValue.push(tableItem);
                }
                break;
            }
        }
        var matchCount = 0;
        for (var i = 1; i < 11; i++) {
            if (i < 11 - Number(spotPoint) || matchCount >= tableLengh) {
                gr.lib['_prizeText' + i].setText('-');
                gr.lib['_prizeWinText' + i].setText('-');
                prizeValueList.push("0");
            } else {
                gr.lib['_prizeText' + i].setText(SKBeInstant.formatCurrency(prizeTableValue[matchCount].matchPrize).formattedAmount);
                gr.lib['_prizeWinText' + i].setText(SKBeInstant.formatCurrency(prizeTableValue[matchCount].matchPrize).formattedAmount);
                prizeValueList.push(prizeTableValue[matchCount].matchPrize);
                matchCount++;
            }
        }
    }

    function onStartRevealAll() {
        isRevealing = true;
        if (radarControlSpeed === 3) {
            gr.lib._radarButtonLight.show(false);
            buttonRadar.enable(false);
            gr.lib['_radarText'].updateCurrentStyle({'_text': {'_strokeColor': '616161', '_color': 'd5d5d5'}});
        }
        gr.lib['_radarDigital'].show(false);
        gr.lib['_radarPickRemaining'].show(false);
        gr.lib['_radarsymbolsNumble'].show(true);
        gr.lib['_radarsymbolsNumble'].setImage('SymbolsDigital_20');
        quickPickCount = 0;
        multiplierPickCount = 0;
        symbolLightFinishCount = 0;
        autoClick = false;
        if (errorOn) {
            return;
        }
        if (revealDataExist) {
            showInprogressScence();
        } else {
            if (SKBeInstant.config.wagerType === 'TRY') {
                buttonQuickPick.show(false);
                buttonClear.show(false);
                gr.lib._buttonAutoPlay.show(false);
                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 10; j++) {
                        gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                    }
                }
                arrAllNumInfo = [];

                //calculate the number of multiplier 
                getGridSymbolMultiplier();

                //show the animation of multipliers
                if (config.audio && config.audio.MultiplierAutoSelect) {
                    audio.play(config.audio.MultiplierAutoSelect.name, config.audio.MultiplierAutoSelect.channel);
                }
                for (var i = 0; i < arrMultipliers.length; i++)
                {
                    var xIndex;
                    var yIndex;
                    if ((arrMultipliers[i].num % 10) === 0) {
                        xIndex = arrMultipliers[i].num / 10 - 1;
                        yIndex = 9;
                    } else {
                        xIndex = (arrMultipliers[i].num - arrMultipliers[i].num % 10) / 10;
                        yIndex = arrMultipliers[i].num % 10 - 1;
                    }
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 2;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                }

                //calculate the numbers of radar emitted
                getRadarGridSymbol();

                matchSpotsCount = 0;
                matchMultipliersCount = 0;
                radarEmitNumCount = 0;
            } else {
                //revealdatasave:save the data of selected symbol
                var arr = '';
                for (var i = 0; i < arrSpots.length; i++) {
                    if (i === (arrSpots.length - 1)) {
                        arr = arr + arrSpots[i].num;
                    } else {
                        arr = arr + arrSpots[i].num + ',';
                    }
                }
                json_rds.revealDataSave[ticketId].spots = arr;
                if (errorOn) {
                    return;
                }
                publishMSG();

                buttonQuickPick.show(false);
                buttonClear.show(false);
                gr.lib._buttonAutoPlay.show(false);
                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 10; j++) {
                        gr.lib['_symbols_' + i + '_' + j].pixiContainer.buttonMode = false;
                    }
                }
                arrAllNumInfo = [];

                //calculate the number of multiplier 
                getGridSymbolMultiplier();
                //revealdatasave:save the data of multipliers
                var arr1 = '';
                for (var i = 0; i < arrMultipliers.length; i++) {
                    if (i === (arrMultipliers.length - 1)) {
                        arr1 = arr1 + arrMultipliers[i].num;
                    } else {
                        arr1 = arr1 + arrMultipliers[i].num + ',';
                    }
                }
                json_rds.revealDataSave[ticketId].multipliers = arr1;
                if (errorOn) {
                    return;
                }
                publishMSG();
                //show the animation of multipliers
                if (config.audio && config.audio.MultiplierAutoSelect) {
                    audio.play(config.audio.MultiplierAutoSelect.name, config.audio.MultiplierAutoSelect.channel);
                }
                for (var i = 0; i < arrMultipliers.length; i++)
                {
                    var xIndex;
                    var yIndex;
                    if ((arrMultipliers[i].num % 10) === 0) {
                        xIndex = arrMultipliers[i].num / 10 - 1;
                        yIndex = 9;
                    } else {
                        xIndex = (arrMultipliers[i].num - arrMultipliers[i].num % 10) / 10;
                        yIndex = arrMultipliers[i].num % 10 - 1;
                    }
                    gr.lib['_symbolLight_' + xIndex + '_' + yIndex].gridStateChange = 2;
                    gr.animMap['_symbolsWinAnim0_' + xIndex + '_' + yIndex].play();
                }

                //calculate the numbers of radar emitted
                getRadarGridSymbol();
                //revealdatasave:save all numbers
                var arr2 = '';
                for (var i = 0; i < arrAllNumInfo.length; i++) {
                    if (i === (arrAllNumInfo.length - 1)) {
                        arr2 = arr2 + arrAllNumInfo[i].num;
                    } else {
                        arr2 = arr2 + arrAllNumInfo[i].num + ',';
                    }
                }
                json_rds.revealDataSave[ticketId].radarNum = arr2;
                if (errorOn) {
                    return;
                }
                publishMSG();

                matchSpotsCount = 0;
                matchMultipliersCount = 0;
                radarEmitNumCount = 0;
            }
        }
    }

    function onEnterResultScreenState() {
        gr.lib._radarCircle_0.show(false);
        gr.lib._radarCircle_1.show(false);
        gr.lib._radarCircleAnim.show(false);
        gr.lib._radarLine_0.show(false);
        gr.lib._radarLine_1.show(false);
    }

    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('playerWantsPlayAgain', onPlayerWantsPlayAgain);
    msgBus.subscribe('ticketCostChanged', onTicketCostChanged);
    msgBus.subscribe('spotsChanged', onspotsChanged);
    msgBus.subscribe('startReveallAll', onStartRevealAll);
    msgBus.subscribe('jLottery.enterResultScreenState', onEnterResultScreenState);
    msgBus.subscribe('jLottery.error', function () {
        errorOn = true;
    });
});

