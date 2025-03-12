/**
 * @module game/winUpToController
 * @description WinUpTo control
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'game/gameUtils',
    'game/configController'
], function (msgBus, gr, loader, SKBeInstant, gameUtils, config) {

    var currentPrice;
    var currentSpots;
    var winMaxPrize = 0;
    var winUptoIndex = 0;
    var winDowntoIndex = 0;
    var oldMaxPrize = 0;
    // In portrait mode, these two textfields in one line but in lanscape mode, they're positioned in two lines. 
    function fix(index) {
        var len = gr.lib['_winUpTo_' + index]._currentStyle._width;
        var winUpToValueLeft = 0;
        if (config.winUpToTextFieldSpace) {
            gr.lib['_winUpToText_' + index].updateCurrentStyle({'_left': (len - (Number(gr.lib['_winUpToText_' + index].pixiContainer.$text.width) + Number(gr.lib['_winUpToValue_' + index].pixiContainer.$text.width + config.winUpToTextFieldSpace))) / 2});
            winUpToValueLeft = gr.lib['_winUpToText_' + index]._currentStyle._left + gr.lib['_winUpToText_' + index].pixiContainer.$text.width + config.winUpToTextFieldSpace;
        } else {
            gr.lib['_winUpToText_' + index].updateCurrentStyle({'_left': (len - (Number(gr.lib['_winUpToText_' + index].pixiContainer.$text.width) + Number(gr.lib['_winUpToValue_' + index].pixiContainer.$text.width))) / 2});
            winUpToValueLeft = gr.lib['_winUpToText_' + index]._currentStyle._left + gr.lib['_winUpToText_' + index].pixiContainer.$text.width;
        }
        gr.lib['_winUpToValue_' + index].updateCurrentStyle({'_left': winUpToValueLeft});

        var lenT = gr.lib['_winUpToT_' + index]._currentStyle._width;
        var winUpToValueLeftT = 0;
        if (config.winUpToTextFieldSpace) {
            gr.lib['_winUpToTextT_' + index].updateCurrentStyle({'_left': (lenT - (Number(gr.lib['_winUpToTextT_' + index].pixiContainer.$text.width) + Number(gr.lib['_winUpToValueT_' + index].pixiContainer.$text.width + config.winUpToTextFieldSpace))) / 2});
            winUpToValueLeftT = gr.lib['_winUpToTextT_' + index]._currentStyle._left + gr.lib['_winUpToTextT_' + index].pixiContainer.$text.width + config.winUpToTextFieldSpace;
        } else {
            gr.lib['_winUpToTextT_' + index].updateCurrentStyle({'_left': (lenT - (Number(gr.lib['_winUpToTextT_' + index].pixiContainer.$text.width) + Number(gr.lib['_winUpToValueT_' + index].pixiContainer.$text.width))) / 2});
            winUpToValueLeftT = gr.lib['_winUpToTextT_' + index]._currentStyle._left + gr.lib['_winUpToTextT_' + index].pixiContainer.$text.width;
        }
        gr.lib['_winUpToValueT_' + index].updateCurrentStyle({'_left': winUpToValueLeftT});
    }

    function onGameParametersUpdated() {
        if (config.style.winUpToText) {
            gameUtils.setTextStyle(gr.lib._winUpToText_0, config.style.winUpToText);
            gameUtils.setTextStyle(gr.lib._winUpToTextT_0, config.style.winUpToText);
            gameUtils.setTextStyle(gr.lib._winUpToText_1, config.style.winUpToText);
            gameUtils.setTextStyle(gr.lib._winUpToTextT_1, config.style.winUpToText);
            gameUtils.setTextStyle(gr.lib._winUpToText_2, config.style.winUpToText);
            gameUtils.setTextStyle(gr.lib._winUpToTextT_2, config.style.winUpToText);
        }
        if (config.textAutoFit.winUpToText) {
            gr.lib._winUpToText_0.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
            gr.lib._winUpToTextT_0.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
            gr.lib._winUpToText_1.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
            gr.lib._winUpToTextT_1.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
            gr.lib._winUpToText_2.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
            gr.lib._winUpToTextT_2.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
        }
        gr.lib._winUpToText_0.setText(loader.i18n.Game.win_up_to);
        gr.lib._winUpToTextT_0.setText(loader.i18n.Game.win_up_to);
        gr.lib._winUpToText_1.setText(loader.i18n.Game.win_up_to);
        gr.lib._winUpToTextT_1.setText(loader.i18n.Game.win_up_to);
        gr.lib._winUpToText_2.setText(loader.i18n.Game.win_up_to);
        gr.lib._winUpToTextT_2.setText(loader.i18n.Game.win_up_to);
        if (config.style.winUpToValue) {
            gameUtils.setTextStyle(gr.lib._winUpToValue_0, config.style.winUpToValue);
            gameUtils.setTextStyle(gr.lib._winUpToValueT_0, config.style.winUpToValue);
            gameUtils.setTextStyle(gr.lib._winUpToValue_1, config.style.winUpToValue);
            gameUtils.setTextStyle(gr.lib._winUpToValueT_1, config.style.winUpToValue);
            gameUtils.setTextStyle(gr.lib._winUpToValue_2, config.style.winUpToValue);
            gameUtils.setTextStyle(gr.lib._winUpToValueT_2, config.style.winUpToValue);
        }
        if (config.textAutoFit.winUpToValue) {
            gr.lib._winUpToValue_0.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
            gr.lib._winUpToValueT_0.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
            gr.lib._winUpToValue_1.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
            gr.lib._winUpToValueT_1.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
            gr.lib._winUpToValue_2.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
            gr.lib._winUpToValueT_2.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
        }
        gr.lib._winUpToValue_0.autoFontFitText = true;
        gr.lib._winUpToValueT_0.autoFontFitText = true;
        gr.lib._winUpToValue_1.autoFontFitText = true;
        gr.lib._winUpToValueT_1.autoFontFitText = true;
        gr.lib._winUpToValue_2.autoFontFitText = true;
        gr.lib._winUpToValueT_2.autoFontFitText = true;

        var dafaultPrice = SKBeInstant.config.gameConfigurationDetails.pricePointGameDefault;
        var dafaultSpot = SKBeInstant.config.gameConfigurationDetails.spotsGameDefault;
        if (dafaultSpot) {
            //
        } else {
            dafaultSpot = 10;
        }
        currentPrice = dafaultPrice;
        currentSpots = dafaultSpot;
        for (var i = 0; i < 3; i++) {
            fix(i);
        }
    }

    function showWinUpTo(index) {
        switch (index) {
            case 0:
            {
                gr.lib['_winUpTo_0'].show(true);
                gr.lib['_winUpToT_0'].show(true);
                gr.lib['_winUpTo_1'].show(false);
                gr.lib['_winUpToT_1'].show(false);
                gr.lib['_winUpTo_2'].show(false);
                gr.lib['_winUpToT_2'].show(false);
                break;
            }
            case 1:
            {
                gr.lib['_winUpTo_0'].show(false);
                gr.lib['_winUpToT_0'].show(false);
                gr.lib['_winUpTo_1'].show(true);
                gr.lib['_winUpToT_1'].show(true);
                gr.lib['_winUpTo_2'].show(false);
                gr.lib['_winUpToT_2'].show(false);
                break;
            }
            case 2:
            {
                gr.lib['_winUpTo_0'].show(false);
                gr.lib['_winUpToT_0'].show(false);
                gr.lib['_winUpTo_1'].show(false);
                gr.lib['_winUpToT_1'].show(false);
                gr.lib['_winUpTo_2'].show(true);
                gr.lib['_winUpToT_2'].show(true);
                break;
            }
        }

    }
    function onTicketCostChanged(prizePoint) {
        var oldPrice = currentPrice;
        currentPrice = prizePoint;
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        for (var i = 0; i < rc.length; i++) {
            if (Number(prizePoint) === Number(rc[i].price) && Number(currentSpots) === Number(rc[i].spots)) {
                var ps = rc[i].prizeStructure;
                var maxPrize = 0;
                for (var j = 0; j < ps.length; j++) {
                    var prize = Number(ps[j].prize);
                    if (maxPrize < prize) {
                        maxPrize = prize;
                    }
                }
                oldMaxPrize = winMaxPrize;
                winMaxPrize = maxPrize;

                if (Number(oldPrice) > Number(currentPrice)) {
                    showWinUpTo(winDowntoIndex);
                    gr.lib['_winUpToValue_' + winDowntoIndex].setText(SKBeInstant.formatCurrency(oldMaxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    gr.lib['_winUpToValueT_' + winDowntoIndex].setText(SKBeInstant.formatCurrency(maxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    fix(winDowntoIndex);
                    gr.animMap['_winUpToMinus_' + winDowntoIndex].index = winDowntoIndex;
                    gr.animMap['_winUpToMinus_' + winDowntoIndex].play();
                    if (winDowntoIndex === 2) {
                        winDowntoIndex = 0;
                    } else {
                        winDowntoIndex++;
                    }
                } else {
                    showWinUpTo(winUptoIndex);
                    gr.lib['_winUpToValue_' + winUptoIndex].setText(SKBeInstant.formatCurrency(oldMaxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    gr.lib['_winUpToValueT_' + winUptoIndex].setText(SKBeInstant.formatCurrency(maxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    fix(winUptoIndex);
                    gr.animMap['_winUpToPlus_' + winUptoIndex].index = winUptoIndex;
                    gr.animMap['_winUpToPlus_' + winUptoIndex].play();
                    if (winUptoIndex === 2) {
                        winUptoIndex = 0;
                    } else {
                        winUptoIndex++;
                    }
                }
                return;
            }
        }
    }

    function onspotsChanged(spotPoint) {
        var oldSpots = currentSpots;
        currentSpots = spotPoint;
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        for (var i = 0; i < rc.length; i++) {
            if (Number(currentPrice) === Number(rc[i].price) && Number(spotPoint) === Number(rc[i].spots)) {
                var ps = rc[i].prizeStructure;
                var maxPrize = 0;
                for (var j = 0; j < ps.length; j++) {
                    var prize = Number(ps[j].prize);
                    if (maxPrize < prize) {
                        maxPrize = prize;
                    }
                }
                oldMaxPrize = winMaxPrize;
                winMaxPrize = maxPrize;

                if (Number(oldSpots) > Number(currentSpots)) {
                    showWinUpTo(winDowntoIndex);
                    gr.lib['_winUpToValue_' + winDowntoIndex].setText(SKBeInstant.formatCurrency(oldMaxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    gr.lib['_winUpToValueT_' + winDowntoIndex].setText(SKBeInstant.formatCurrency(maxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    fix(winDowntoIndex);
                    gr.animMap['_winUpToMinus_' + winDowntoIndex].index = winDowntoIndex;
                    gr.animMap['_winUpToMinus_' + winDowntoIndex].play();
                    if (winDowntoIndex === 2) {
                        winDowntoIndex = 0;
                    } else {
                        winDowntoIndex++;
                    }
                } else {
                    showWinUpTo(winUptoIndex);
                    gr.lib['_winUpToValue_' + winUptoIndex].setText(SKBeInstant.formatCurrency(oldMaxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    gr.lib['_winUpToValueT_' + winUptoIndex].setText(SKBeInstant.formatCurrency(maxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                    fix(winUptoIndex);
                    gr.animMap['_winUpToPlus_' + winUptoIndex].index = winUptoIndex;
                    gr.animMap['_winUpToPlus_' + winUptoIndex].play();
                    if (winUptoIndex === 2) {
                        winUptoIndex = 0;
                    } else {
                        winUptoIndex++;
                    }
                }

                return;
            }
        }
    }

    msgBus.subscribe('ticketCostChanged', onTicketCostChanged);
    msgBus.subscribe('spotsChanged', onspotsChanged);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);

    return {};
});