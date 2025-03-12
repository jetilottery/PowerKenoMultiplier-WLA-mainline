/**
 * @module game/revealAllButton
 * @description reveal all button control
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer',
    'skbJet/componentCRDC/gladRenderer/gladButton',
    'game/gameUtils',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'game/configController',
    'game/revealAllFunc'
], function (msgBus, gr, loader, audio, gladButton, gameUtils, SKBeInstant, config, revealAllFunc) {

    var autoPlay;
    var autoPlayText;
    //var autoPlayInterval = null;
    function onGameParametersUpdated() {
        var scaleType = {'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch': true};
        autoPlay = new gladButton(gr.lib._buttonAutoPlay, config.gladButtonImgName.buttonAutoPlay, scaleType);
        autoPlay.click(revealClick);
        if (config.style.autoPlayText) {
            gameUtils.setTextStyle(gr.lib._autoPlayText, config.style.autoPlayText);
        }
        if (config.textAutoFit.autoPlayText) {
            gr.lib._autoPlayText.autoFontFitText = config.textAutoFit.autoPlayText.isAutoFit;
        }
        if (SKBeInstant.isWLA()) {
            autoPlayText = loader.i18n.MenuCommand.WLA.button_autoPlay;
        } else {
            autoPlayText = loader.i18n.MenuCommand.Commercial.button_autoPlay;
        }
        gr.lib._autoPlayText.setText(autoPlayText);
        gr.lib._buttonAutoPlay.show(false);

        gr.lib._buttonAutoPlay.on('mouseover', function () {
            if (autoPlay.getEnabled()) {
                gr.lib['_autoPlayAnim'].show(false);
            }
        });
        gr.lib._buttonAutoPlay.on('mouseout', function () {
            if (autoPlay.getEnabled()) {
                gr.lib['_autoPlayAnim'].show(true);
            }
        });
    }

    function revealClick() {
        audio.play(config.audio.ButtonGo.name, config.audio.ButtonGo.channel);
        //gr.lib._buttonAutoPlay.show(false);
        revealAllFunc.revealAll();
    }

    function onStartUserInteraction(data) {
        var enable = SKBeInstant.config.autoRevealEnabled === false ? false : true;
        if (enable) {
            if (data.scenario) {
                //gr.lib._buttonAutoPlay.show(true);
                //gr.lib._buttonAutoPlay.show(false);
            }
        } else {
            //gr.lib._buttonAutoPlay.show(false);
        }
    }

    function onReStartUserInteraction(data) {
        onStartUserInteraction(data);
    }

    function onReInitialize() {
        //gr.lib._buttonAutoPlay.show(false);
    }

    function onReset() {
        onReInitialize();
    }

    function onAllRevealed() {
        //gr.lib._buttonAutoPlay.show(false);
    }

    function onChangeEnable(enableFlag) {
        gr.lib['_autoPlayAnim'].show(enableFlag);
        autoPlay.enable(enableFlag);
        if(enableFlag){
            gr.lib['_autoPlayText'].updateCurrentStyle({'_text':{'_strokeColor':'ff9f00', '_color':'ffffff'}});
        }else{
            gr.lib['_autoPlayText'].updateCurrentStyle({'_text':{'_strokeColor':'616161', '_color':'d5d5d5'}});
        }
    }

    function onShowAutoPlayButtonLight(){
        gr.lib['_autoPlayAnim'].gotoAndPlay('TryButton', 0.25);
    }
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.reStartUserInteraction', onReStartUserInteraction);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('reset', onReset);
    msgBus.subscribe('allRevealed', onAllRevealed);
    msgBus.subscribe('enableChanged', onChangeEnable);
    msgBus.subscribe('showAutoPlayButtonLight', onShowAutoPlayButtonLight);
    return {};
});