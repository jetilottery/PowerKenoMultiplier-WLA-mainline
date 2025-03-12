/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer'
],function(msgBus, gr){
     function revealAll() {
        msgBus.publish('startReveallAll');
        msgBus.publish('disableUI');
    }

    function onOneFlipTriggered(count) {
        if (count >= 20) {
            gr.lib._buttonAutoPlay.show(false);
        }
    }
        
    msgBus.subscribe('oneFlipTriggered', onOneFlipTriggered);
    return {
        revealAll:revealAll
    };
});

