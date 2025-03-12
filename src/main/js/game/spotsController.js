define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'skbJet/componentCRDC/gladRenderer/gladButton',
    'game/gameUtils',
    'game/configController'
], function(msgBus, audio, gr, loader, SKBeInstant, gladButton, gameUtils, config) {

    var plusButton, minusButton;
    var _currentSpot;
    var spotsList = [];
    var MTMReinitial = false;
    var upChannel = 0;
    var downChannel = 0;

    function registerControl() {
        var strSpotsList = [];
        for (var i = 0; i < spotsList.length; i++) {
            strSpotsList.push(spotsList[i] + '');
        }
        var spotText;
        if (SKBeInstant.isWLA()) {
            spotText = loader.i18n.MenuCommand.WLA.spot;
        } else {
            spotText = loader.i18n.MenuCommand.Commercial.spot;
        }

        msgBus.publish("jLotteryGame.registerControl", [{
            name: 'spots',
            text: spotText,
            type: 'list',
            enabled: 1,
            valueText: spotsList,
            values: strSpotsList,
            value: SKBeInstant.config.gameConfigurationDetails.spotsGameDefault
        }]);
    }

    function gameControlChanged(value) {
        msgBus.publish("jLotteryGame.onGameControlChanged", {
            name: 'spots',
            event: 'change',
            params: [value, value]
        });
    }

    function onConsoleControlChanged(data) {
        if (data.option === 'spots') {
            setSpotsValue(Number(data.value));

            msgBus.publish("jLotteryGame.onGameControlChanged", {
                name: 'spots',
                event: 'change',
                params: [data.value, data.value]
            });
        }
    }

    function onGameParametersUpdated() {
        if (config.style.spotText) {
            gameUtils.setTextStyle(gr.lib._spotText, config.style.spotText);
        }
        if (config.textAutoFit.spotText) {
            gr.lib._spotText.autoFontFitText = config.textAutoFit.spotText.isAutoFit;
        }
        gr.lib._spotText.setText(loader.i18n.Game.spot);
        if (config.style.spotFrequency) {
            gameUtils.setTextStyle(gr.lib._spotFrequency, config.style.spotFrequency);
        }
        if (config.textAutoFit.spotFrequency) {
            gr.lib._spotFrequency.autoFontFitText = config.textAutoFit.spotFrequency.isAutoFit;
        }

        try {
            var paytable = SKBeInstant.config.gameConfigurationDetails;
            // paytable.availableNumberOfSpots = [1,2,5,6];
            spotsList = paytable.availableNumberOfSpots;
            var scaleType = { 'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true };
            var arrowPlusType = { 'scaleXWhenClick': -0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true };
            if (config.gameParam.arrowPlusSpecial) {
                arrowPlusType = scaleType;
            }
            plusButton = new gladButton(gr.lib._spotPlus, config.gladButtonImgName.spotPlus, arrowPlusType);
            minusButton = new gladButton(gr.lib._spotMinus, config.gladButtonImgName.spotMinus, scaleType);
            registerControl();
            if (spotsList.length <= 1) {
                plusButton.show(false);
                minusButton.show(false);
            } else {
                plusButton.show(true);
                minusButton.show(true);

                plusButton.click(increaseSpots);
                minusButton.click(decreaseSpots);
            }
            if (SKBeInstant.config.gameType !== 'ticketReady') {
                setDefaultSpotsPoint();
            } else {
                gr.lib._ticketCost.show(false);
            }
            gameUtils.fixMeter(gr);
        } catch (e) {
            console.log(e);
        }
    }

    function setSpotsValue(spotsPoint) {
        var index = spotsList.indexOf(spotsPoint);
        if (index < 0) {
            msgBus.publish('error', 'Invalide prize point ' + spotsPoint);
            return;
        }

        plusButton.enable(true);
        minusButton.enable(true);

        if (index === 0) {
            minusButton.enable(false);
        }

        if (index === (spotsList.length - 1)) {
            plusButton.enable(false);
        }

        var valueString = spotsPoint;

        if (SKBeInstant.config.wagerType === 'BUY') {
            gr.lib._spotFrequency.setText(valueString);
        } else {
            gr.lib._spotFrequency.setText(loader.i18n.Game.demo + valueString);
        }

        _currentSpot = spotsPoint;
        msgBus.publish('spotsChanged', spotsPoint);
    }

    function setSpotsValueWithNotify(spotsPoint) {
        setSpotsValue(spotsPoint);
        gameControlChanged(spotsPoint);
    }

    function increaseSpots() {
        var index = spotsList.indexOf(_currentSpot);
        index++;
        setSpotsValueWithNotify(spotsList[index]);
        if (index === spotsList.length - 1) {
            if (config.audio && config.audio.ButtonBetMax) {
                audio.play(config.audio.ButtonBetMax.name, config.audio.ButtonBetMax.channel);
            }
        } else {
            if (config.audio && config.audio.ButtonBetUp) {
                audio.play(config.audio.ButtonBetUp.name, upChannel);
                upChannel = (upChannel + 1) % 2;
            }
        }
    }

    function decreaseSpots() {
        var index = spotsList.indexOf(_currentSpot);
        index--;
        setSpotsValueWithNotify(spotsList[index]);
        if (config.audio && config.audio.ButtonBetDown) {
            audio.play(config.audio.ButtonBetDown.name, downChannel);
            downChannel = (downChannel + 1) % 2;
        }
    }

    function setDefaultSpotsPoint() {
        var defaultSpot = SKBeInstant.config.gameConfigurationDetails.spotsGameDefault;

        if (defaultSpot) {
            //
        } else {
            defaultSpot = 10;
        }
        setSpotsValueWithNotify(defaultSpot);
    }

    function onInitialize() {
        //gr.lib._ticketCost.show(false);
    }

    function onReInitialize() {
        if (MTMReinitial) {
            enableConsole();
            setDefaultSpotsPoint();
            MTMReinitial = false;
        } else {
            onReset();
        }

    }

    function onReset() {
        enableConsole();
        if (_currentSpot) {
            setSpotsValueWithNotify(_currentSpot);
        } else {
            setDefaultSpotsPoint();
        }
    }

    function onStartUserInteraction(data) {
        disableConsole();
        if (data.spots) {
            _currentSpot = data.spots;
            setSpotsValueWithNotify(_currentSpot);
        }
        msgBus.publish('spotsChanged', _currentSpot);
    }

    function onReStartUserInteraction(data) {
        onStartUserInteraction(data);
    }

    function enableConsole() {
        msgBus.publish('toPlatform', {
            channel: "Game",
            topic: "Game.Control",
            data: { "name": "spots", "event": "enable", "params": [1] }
        });
    }

    function disableConsole() {
        msgBus.publish('toPlatform', {
            channel: "Game",
            topic: "Game.Control",
            data: { "name": "spots", "event": "enable", "params": [0] }
        });
    }

    function onPlayerWantsPlayAgain() {
        enableConsole();
        setSpotsValueWithNotify(_currentSpot);
    }

    function onDisableUI() {
        plusButton.enable(false);
        minusButton.enable(false);
    }

    function onPlayerWantsToMoveToMoneyGame() {
        MTMReinitial = true;
        onDisableUI();
    }


    msgBus.subscribe("playerWantsPlayAgain", onPlayerWantsPlayAgain);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);
    msgBus.subscribe('jLottery.initialize', onInitialize);
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('jLotterySKB.onConsoleControlChanged', onConsoleControlChanged);
    msgBus.subscribe('jLotterySKB.reset', onReset);
    msgBus.subscribe('disableUI', onDisableUI);
    msgBus.subscribe('jLotteryGame.playerWantsToMoveToMoneyGame', onPlayerWantsToMoveToMoneyGame);

    return {};
});