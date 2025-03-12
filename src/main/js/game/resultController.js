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
    var winClose, nonWinClose;
    var resultData = null;
    var resultPlaque = null;

    function onGameParametersUpdated() {
        var scaleType = { 'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true };
        winClose = new gladButton(gr.lib._buttonWinClose, config.gladButtonImgName.buttonWinClose, scaleType);
        nonWinClose = new gladButton(gr.lib._buttonNonWinClose, config.gladButtonImgName.buttonNonWinClose, scaleType);

        function closeResultPlaque() {
            if (config.audio && config.audio.gameWin) {
                audio.stopChannel(config.audio.gameWin.channel);
            } else if (config.audio && config.audio.gameNoWin) {
                audio.stopChannel(config.audio.gameNoWin.channel);
            }
            gr.lib._BG_dim.show(false);
            hideDialog();
            if (config.audio && config.audio.ButtonGeneric) {
                audio.play(config.audio.ButtonGeneric.name, config.audio.ButtonGeneric.channel);
            }
            if (config.audio && config.audio.WinFlashTerm) {
                audio.play(config.audio.WinFlashTerm.name, config.audio.WinFlashTerm.channel);
            }
            gr.lib._winPlaque.stopPlay();
            gr.lib._simpleWin.stopPlay();
        }

        winClose.click(closeResultPlaque);
        nonWinClose.click(closeResultPlaque);

        if (config.textAutoFit.win_Text) {
            gr.lib._win_Text.autoFontFitText = config.textAutoFit.win_Text.isAutoFit;
        }

        if (config.textAutoFit.win_Try_Text) {
            gr.lib._win_Try_Text.autoFontFitText = config.textAutoFit.win_Try_Text.isAutoFit;
        }

        if (config.textAutoFit.win_Value) {
            gr.lib._win_Value.autoFontFitText = config.textAutoFit.win_Value.isAutoFit;
        }

        if (config.textAutoFit.closeWinText) {
            gr.lib._closeWinText.autoFontFitText = config.textAutoFit.closeWinText.isAutoFit;
        }

        if (config.textAutoFit.nonWin_Text) {
            gr.lib._nonWin_Text.autoFontFitText = config.textAutoFit.nonWin_Text.isAutoFit;
        }

        if (config.textAutoFit.closeNonWinText) {
            gr.lib._closeNonWinText.autoFontFitText = config.textAutoFit.closeNonWinText.isAutoFit;
        }

        if (SKBeInstant.config.wagerType === 'TRY') {
            if (Number(SKBeInstant.config.demosB4Move2MoneyButton) === -1) {
                gr.lib._win_Try_Text.setText(loader.i18n.Game.message_anonymousTryWin);
            } else {
                gr.lib._win_Try_Text.setText(loader.i18n.Game.message_tryWin);
            }

        }

        gr.lib._win_Text.setText(loader.i18n.Game.message_buyWin);

        if (config.style.win_Text) {
            gameUtils.setTextStyle(gr.lib._win_Text, config.style.win_Text);
        }

        if (config.style.win_Try_Text) {
            gameUtils.setTextStyle(gr.lib._win_Try_Text, config.style.win_Try_Text);
        }
        if (config.style.win_Value) {
            gameUtils.setTextStyle(gr.lib._win_Value, config.style.win_Value);
        }

        if (config.style.closeWinText) {
            gameUtils.setTextStyle(gr.lib._closeWinText, config.style.closeWinText);
        }
        gr.lib._closeWinText.setText(loader.i18n.Game.message_close);

        gr.lib._nonWin_Text.setText(loader.i18n.Game.message_nonWin);

        if (config.style.nonWin_Text) {
            gameUtils.setTextStyle(gr.lib._nonWin_Text, config.style.nonWin_Text);
        }

        if (config.style.closeNonWinText) {
            gameUtils.setTextStyle(gr.lib._closeNonWinText, config.style.closeNonWinText);
        }
        gr.lib._closeNonWinText.setText(loader.i18n.Game.message_close);

        if (config.textAutoFit.win_Text) {
            gr.lib._simpleWinText.autoFontFitText = config.textAutoFit.win_Text.isAutoFit;
        }

        if (config.textAutoFit.win_Try_Text) {
            gr.lib._simpleWinTryText.autoFontFitText = config.textAutoFit.win_Try_Text.isAutoFit;
        }

        if (config.textAutoFit.win_Value) {
            gr.lib._simpleWinValue.autoFontFitText = config.textAutoFit.win_Value.isAutoFit;
        }
        if (SKBeInstant.config.wagerType === 'TRY') {
            if (Number(SKBeInstant.config.demosB4Move2MoneyButton) === -1) {
                gr.lib._simpleWinTryText.setText(loader.i18n.Game.simple_anonymousTrywin);
            } else {
                gr.lib._simpleWinTryText.setText(loader.i18n.Game.simple_trywin);
            }
        }
        gr.lib._simpleWinText.setText(loader.i18n.Game.simple_buywin);

        if (config.style.win_Text) {
            gameUtils.setTextStyle(gr.lib._simpleWinText, config.style.win_Text);
        }

        if (config.style.win_Try_Text) {
            gameUtils.setTextStyle(gr.lib._simpleWinTryText, config.style.win_Try_Text);
        }
        if (config.style.win_Value) {
            gameUtils.setTextStyle(gr.lib._simpleWinValue, config.style.win_Value);
        }

        hideDialog();

        gr.lib._win_Try_Text.show(false);
        gr.lib._win_Text.show(false);
        gr.lib._win_Value.show(false);
        gr.lib._nonWin_Text.show(false);
        gr.lib._nonWin_Try_Text.show(false);
        gr.lib._simpleWinText.show(false);
        gr.lib._simpleWinTryText.show(false);
        gr.lib._simpleWinValue.show(false);
        gr.lib._winLight.onComplete = function() {
            gr.lib._winLight.show(false);
        };

        gr.lib._winPlaque.onComplete = function() {
            gr.lib._winPlaque.gotoAndPlay('winPlaque', 0.25);
        };

        gr.lib._simpleWin.onComplete = function() {
            gr.lib._simpleWin.gotoAndPlay('simpleWin', 0.25);
        };
    }

    function hideDialog() {
        gr.lib._winPlaque.show(false);
        gr.lib._simpleWin.show(false);
        gr.lib._nonWinPlaque.show(false);
        gr.lib._win_Try_Text.show(false);
        gr.lib._win_Text.show(false);
        gr.lib._win_Value.show(false);
        gr.lib._nonWin_Text.show(false);
    }

    function showDialog() {
        gr.lib._BG_dim.show(true);
        if (resultData.playResult === 'WIN') {
            if (SKBeInstant.config.customBehavior && SKBeInstant.config.customBehavior.showResultScreen === true) {
                gr.lib._winPlaque.show(true);
                gr.lib._winLight.show(true);
                gr.lib._winPlaque.gotoAndPlay('winPlaque', 0.25);
                gr.lib._winLight.gotoAndPlay('light', 0.25);
                if (SKBeInstant.config.wagerType === 'BUY') {
                    gr.lib._win_Try_Text.show(false);
                    gr.lib._win_Text.show(true);
                } else {
                    gr.lib._win_Try_Text.show(true);
                    gr.lib._win_Text.show(false);
                }
                gr.lib._win_Value.setText(SKBeInstant.formatCurrency(resultData.prizeValue).formattedAmount);
                if (config.style.win_Value_color) {
                    gameUtils.setTextStyle(gr.lib._win_Value, config.style.win_Value_color);
                }
                gr.lib._win_Value.show(true);
                gr.animMap['_winText'].play();

                gr.lib._simpleWin.show(false);
            } else if (loader.i18n.gameConfig && loader.i18n.gameConfig.showResultScreen === true) {
                gr.lib._winPlaque.show(true);
                gr.lib._winLight.show(true);
                gr.lib._winPlaque.gotoAndPlay('winPlaque', 0.25);
                gr.lib._winLight.gotoAndPlay('light', 0.25);
                if (SKBeInstant.config.wagerType === 'BUY') {
                    gr.lib._win_Try_Text.show(false);
                    gr.lib._win_Text.show(true);
                } else {
                    gr.lib._win_Try_Text.show(true);
                    gr.lib._win_Text.show(false);
                }
                gr.lib._win_Value.setText(SKBeInstant.formatCurrency(resultData.prizeValue).formattedAmount);
                if (config.style.win_Value_color) {
                    gameUtils.setTextStyle(gr.lib._win_Value, config.style.win_Value_color);
                }
                gr.lib._win_Value.show(true);
                gr.animMap['_winText'].play();

                gr.lib._simpleWin.show(false);
            } else {
                gr.lib._BG_dim.show(false);
                gr.lib._simpleWin.show(true);
                gr.lib._simpleWinDim.show(true);
                gr.lib._simpleWin.gotoAndPlay('simpleWin', 0.25);
                if (SKBeInstant.config.wagerType === 'BUY') {
                    gr.lib._simpleWinTryText.show(false);
                    gr.lib._simpleWinText.show(true);
                } else {
                    gr.lib._simpleWinTryText.show(true);
                    gr.lib._simpleWinText.show(false);
                }
                gr.lib._simpleWinValue.setText(SKBeInstant.formatCurrency(resultData.prizeValue).formattedAmount);
                if (config.style.win_Value_color) {
                    gameUtils.setTextStyle(gr.lib._simpleWinValue, config.style.win_Value_color);
                }
                gr.lib._simpleWinValue.show(true);

                gr.lib._winPlaque.show(false);
            }
            gr.lib._nonWinPlaque.show(false);
        } else {
            if (SKBeInstant.config.customBehavior && SKBeInstant.config.customBehavior.showResultScreen === true && !loader.i18n.gameConfig.suppressNonWinResultPlaque) {
                gr.lib._nonWinPlaque.show(true);
                gr.lib._nonWinPlaque.gotoAndPlay('nowinPlaque', 0.25);
                gr.lib._nonWin_Text.show(true);
                gr.animMap['_noWinText'].play();
            } else if (loader.i18n.gameConfig && loader.i18n.gameConfig.showResultScreen === true && !loader.i18n.gameConfig.suppressNonWinResultPlaque) {
                gr.lib._nonWinPlaque.show(true);
                gr.lib._nonWinPlaque.gotoAndPlay('nowinPlaque', 0.25);
                gr.lib._nonWin_Text.show(true);
                gr.animMap['_noWinText'].play();
            } else {
                gr.lib._BG_dim.show(false);
                gr.lib._nonWinPlaque.show(false);
            }
            gr.lib._winPlaque.show(false);
            gr.lib._simpleWin.show(false);
        }
    }

    function onStartUserInteraction(data) {
        resultData = data;
        //  gr.lib._BG_dim.show(false);
        hideDialog();
    }

    function onAllRevealed() {
        msgBus.publish('jLotteryGame.ticketResultHasBeenSeen', {
            tierPrizeShown: resultData.prizeDivision,
            formattedAmountWonShown: resultData.prizeValue
        });

        msgBus.publish('disableUI');
    }

    function onEnterResultScreenState() {
        showDialog();
    }

    function onReStartUserInteraction(data) {
        onStartUserInteraction(data);
    }

    function onReInitialize() {
        hideDialog();
    }


    function onPlayerWantsPlayAgain() {
        gr.lib._BG_dim.show(false);
        hideDialog();
    }

    function onTutorialIsShown() {
        if (gr.lib._winPlaque.pixiContainer.visible || gr.lib._nonWinPlaque.pixiContainer.visible) {
            resultPlaque = gr.lib._winPlaque.pixiContainer.visible ? gr.lib._winPlaque : gr.lib._nonWinPlaque;
            hideDialog();
        } else if (gr.lib._simpleWin.pixiContainer.visible) {
            resultPlaque = gr.lib._simpleWin;
            hideDialog();
        }
        gr.lib._BG_dim.show(true);
    }

    function onTutorialIsHide() {
        if (resultPlaque) {
            resultPlaque.show(true);
            if (resultData.playResult === 'WIN') {
                if (SKBeInstant.config.customBehavior && SKBeInstant.config.customBehavior.showResultScreen === true) {
                    if (SKBeInstant.config.wagerType === 'BUY') {
                        gr.lib._win_Try_Text.show(false);
                        gr.lib._win_Text.show(true);
                    } else {
                        gr.lib._win_Try_Text.show(true);
                        gr.lib._win_Text.show(false);
                    }
                    gr.lib._win_Value.show(true);
                } else if (loader.i18n.gameConfig && loader.i18n.gameConfig.showResultScreen === true) {
                    if (SKBeInstant.config.wagerType === 'BUY') {
                        gr.lib._win_Try_Text.show(false);
                        gr.lib._win_Text.show(true);
                    } else {
                        gr.lib._win_Try_Text.show(true);
                        gr.lib._win_Text.show(false);
                    }
                    gr.lib._win_Value.show(true);
                } else {
                    gr.lib._BG_dim.show(false);
                    if (SKBeInstant.config.wagerType === 'BUY') {
                        gr.lib._simpleWinTryText.show(false);
                        gr.lib._simpleWinText.show(true);
                    } else {
                        gr.lib._simpleWinTryText.show(true);
                        gr.lib._simpleWinText.show(false);
                    }
                    gr.lib._simpleWinValue.show(true);
                }
            } else {
                if (SKBeInstant.config.customBehavior && SKBeInstant.config.customBehavior.showResultScreen === true) {
                    gr.lib._nonWin_Text.show(true);
                } else if (loader.i18n.gameConfig && loader.i18n.gameConfig.showResultScreen === true) {
                    gr.lib._nonWin_Text.show(true);
                } else {
                    gr.lib._BG_dim.show(false);
                }
            }
            resultPlaque = null;
        }
    }

    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);

    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('jLottery.enterResultScreenState', onEnterResultScreenState);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('allRevealed', onAllRevealed);
    msgBus.subscribe('playerWantsPlayAgain', onPlayerWantsPlayAgain);
    msgBus.subscribe('tutorialIsShown', onTutorialIsShown);
    msgBus.subscribe('tutorialIsHide', onTutorialIsHide);

    return {};
});