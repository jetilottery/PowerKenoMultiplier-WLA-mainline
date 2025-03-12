/**
 * @module control some game config
 * @description control the customized data of paytable&help page and other customized config
 */
define({
    style: {
        win_Text: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowAngle: Math.PI / 3, dropShadowBlur: 20, dropShadowColor: "#5f300a"},
        win_Try_Text: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowAngle: Math.PI / 3, dropShadowBlur: 20, dropShadowColor: "#5f300a"},
        win_Value_color: {dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.8, dropShadowBlur: 10, dropShadowColor: "#990200"},
        nonWin_Text: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowAngle: Math.PI / 3, dropShadowBlur: 20, dropShadowColor: "#5f300a"},
        errorText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowBlur: 10},
        warningText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowBlur: 10},
        tutorialTitleText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowBlur: 10},
        winUpToText: {dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.7, dropShadowBlur: 10, dropShadowColor: "#00deff"},
        winUpToValue: {dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.7, dropShadowBlur: 10, dropShadowColor: "#00deff"}
    },
    backgroundStyle: {
        "splashSize": "100% 100%",
        "gameSize": "100% 100%"
    },
    winMaxValuePortrait: true,
    winUpToTextFieldSpace: 10,
    textAutoFit: {
        "autoPlayText": {
            "isAutoFit": true
        },
        "autoPlayMTMText": {
            "isAutoFit": true
        },
        "buyText": {
            "isAutoFit": true
        },
        "tryText": {
            "isAutoFit": true
        },
        "quickPickText": {
            "isAutoFit": true
        },
        "clearText": {
            "isAutoFit": true
        },
        "speedText": {
            "isAutoFit": true
        },
        "warningExitText": {
            "isAutoFit": true
        },
        "warningContinueText": {
            "isAutoFit": true
        },
        "warningText": {
            "isAutoFit": true
        },
        "errorExitText": {
            "isAutoFit": true
        },
        "winBoxExitText": {
            "isAutoFit": true
        },
        "errorTitle": {
            "isAutoFit": true
        },
        "errorText": {
            "isAutoFit": false
        },
        "exitText": {
            "isAutoFit": true
        },
        "playAgainText": {
            "isAutoFit": true
        },
        "playAgainMTMText": {
            "isAutoFit": true
        },
        "MTMText": {
            "isAutoFit": true
        },
        "win_Text": {
            "isAutoFit": true
        },
        "win_Try_Text": {
            "isAutoFit": true
        },
        "win_Value": {
            "isAutoFit": true
        },
        "closeWinText": {
            "isAutoFit": true
        },
        "nonWin_Text": {
            "isAutoFit": true
        },
        "closeNonWinText": {
            "isAutoFit": true
        },
        "win_Value_color": {
            "isAutoFit": true
        },
        "ticketCostText": {
            "isAutoFit": true
        },
        "ticketCostValue": {
            "isAutoFit": true
        },
        "spotText": {
            "isAutoFit": true
        },
        "spotFrequency": {
            "isAutoFit": true
        },
        "tutorialTitleText": {
            "isAutoFit": true
        },
        "closeTutorialText": {
            "isAutoFit": true
        },
        "winUpToText": {
            "isAutoFit": true
        },
        "winUpToValue": {
            "isAutoFit": true
        },
        "multiplierText": {
            "isAutoFit": true
        },
        "prizeTableText": {
            "isAutoFit": true
        },
        "matchText": {
            "isAutoFit": true
        },
        "prizeText": {
            "isAutoFit": true
        },
        "prizeWinText": {
            "isAutoFit": true
        },
        "versionText": {
            "isAutoFit": true
        },
        "radarPickRemainText": {
            "isAutoFit": true
        }
    },
    audio: {
        "gameLoop": {
            "name": "BackgroundMusicLoop",
            "channel": "4"
        },
        "gameWin": {
            "name": "BackgroundMusicWinTerm",
            "channel": "4"
        },
        "gameNoWin": {
            "name": "BackgroundMusicNoWinTerm",
            "channel": "4"
        },
        "ButtonGeneric": {
            "name": "Button_OK",
            "channel": "0"
        },
        "ButtonSoundOn": {
            "name": "Button_SoundOn",
            "channel": "0"
        },
        "ButtonSoundOff": {
            "name": "Button_SoundOff",
            "channel": "0"
        },
        "ButtonBetMax": {
            "name": "Button_BetMax",
            "channel": "0"
        },
        "ButtonBetUp": {
            "name": "Button_BetUp",
            "channel": "0"
        },
        "ButtonBetDown": {
            "name": "Button_BetDown",
            "channel": "0"
        },
        "ButtonBuy": {
            "name": "Button_Buy",
            "channel": "0"
        },
        "ButtonHome": {
            "name": "Button_Home",
            "channel": "0"
        },
        "ButtonInfo": {
            "name": "Button_Info",
            "channel": "0"
        },
        "ButtonQuickPick": {
            "name": "Button_QuickPick",
            "channel": "0"
        },
        "ButtonClear": {
            "name": "Button_Clear",
            "channel": "0"
        },
        "ButtonGo": {
            "name": "Button_Go",
            "channel": "0"
        },
        "ButtonPlayAgain": {
            "name": "Button_PlayAgain",
            "channel": "0"
        },
        "ButtonSpeed1": {
            "name": "Button_Speed_1",
            "channel": "0"
        },
        "ButtonSpeed2": {
            "name": "Button_Speed_2",
            "channel": "0"
        },
        "ButtonSpeed3": {
            "name": "Button_Speed_3",
            "channel": "0"
        },
        "SelectUser1": {
            "name": "Select_User_01",
            "channel": "1"
        },
        "SelectUser2": {
            "name": "Select_User_02",
            "channel": "1"
        },
        "SelectUser3": {
            "name": "Select_User_03",
            "channel": "1"
        },
        "SelectUser4": {
            "name": "Select_User_04",
            "channel": "1"
        },
        "SelectUser5": {
            "name": "Select_User_05",
            "channel": "1"
        },
        "SelectUser6": {
            "name": "Select_User_06",
            "channel": "1"
        },
        "SelectUser7": {
            "name": "Select_User_07",
            "channel": "1"
        },
        "SelectUser8": {
            "name": "Select_User_08",
            "channel": "1"
        },
        "SelectUser9": {
            "name": "Select_User_09",
            "channel": "1"
        },
        "SelectUser10": {
            "name": "Select_User_10",
            "channel": "1"
        },
        "Deselect": {
            "name": "Deselect",
            "channel": "1"
        },
        "MultiplierAutoSelect": {
            "name": "MultiplierAutoSelect",
            "channel": "1"
        },
        "RevealerHoverLoopOneShot": {
            "name": "RevealerHoverLoop_OneShot",
            "channel": "1"
        },
        "RevealerHoverLoopSlow": {
            "name": "RevealerHoverLoop_Slow",
            "channel": "1"
        },
        "RevealerHoverLoopMed": {
            "name": "RevealerHoverLoop_Med",
            "channel": "1"
        },
        "RevealerHoverLoopFast": {
            "name": "RevealerHoverLoop_Fast",
            "channel": "1"
        },
        "RevealerHoverTerm": {
            "name": "RevealerHoverTerm",
            "channel": "1"
        },
        "AutoSelectNumber1": {
            "name": "AutoSelectNumber_01",
            "channel": "2"
        },
        "AutoSelectNumber2": {
            "name": "AutoSelectNumber_02",
            "channel": "2"
        },
        "AutoSelectNumber3": {
            "name": "AutoSelectNumber_03",
            "channel": "2"
        },
        "AutoSelectNumber4": {
            "name": "AutoSelectNumber_04",
            "channel": "2"
        },
        "AutoSelectNumber5": {
            "name": "AutoSelectNumber_05",
            "channel": "2"
        },
        "AutoSelectMultiplier1": {
            "name": "AutoSelectMultiplier_01",
            "channel": "2"
        },
        "AutoSelectMultiplier2": {
            "name": "AutoSelectMultiplier_02",
            "channel": "2"
        },
        "AutoSelectMultiplier3": {
            "name": "AutoSelectMultiplier_03",
            "channel": "2"
        },
        "AutoSelectMultiplier4": {
            "name": "AutoSelectMultiplier_04",
            "channel": "2"
        },
        "AutoSelectMultiplier5": {
            "name": "AutoSelectMultiplier_05",
            "channel": "2"
        },
        "AutoSelectMultiplier6": {
            "name": "AutoSelectMultiplier_06",
            "channel": "2"
        },
        "AutoSelectPrize1": {
            "name": "AutoSelectPrize_01",
            "channel": "3"
        },
        "AutoSelectPrize2": {
            "name": "AutoSelectPrize_02",
            "channel": "3"
        },
        "AutoSelectPrize3": {
            "name": "AutoSelectPrize_03",
            "channel": "3"
        },
        "AutoSelectPrize4": {
            "name": "AutoSelectPrize_04",
            "channel": "3"
        },
        "AutoSelectPrize5": {
            "name": "AutoSelectPrize_05",
            "channel": "3"
        },
        "AutoSelectPrize6": {
            "name": "AutoSelectPrize_06",
            "channel": "3"
        },
        "AutoSelectPrize7": {
            "name": "AutoSelectPrize_07",
            "channel": "3"
        },
        "AutoSelectPrize8": {
            "name": "AutoSelectPrize_08",
            "channel": "3"
        },
        "AutoSelectPrize9": {
            "name": "AutoSelectPrize_09",
            "channel": "3"
        },
        "AutoSelectPrize10": {
            "name": "AutoSelectPrize_10",
            "channel": "3"
        },
        "WinFlashTerm": {
            "name": "WinFlash_Term",
            "channel": "5"
        },
        "WinFlashLoop": {
            "name": "WinFlash_Loop",
            "channel": "5"
        },
        "PaytableOpen": {
            "name": "Button_OK",
            "channel": "0"
        },
        "PaytableClose": {
            "name": "Button_OK",
            "channel": "0"
        },
    },
    gladButtonImgName: {
        //audioController
        "buttonAudioOn": "buttonAudioOn",
        "buttonAudioOff": "buttonAudioOff",
        //buyAndTryController
        "buttonTry": "OKButton",
        "buttonBuy": "OKButton",
        //errorWarningController
        "warningContinueButton": "countineMessageCloseButton",
        "warningExitButton": "endOfGameMessageCloseButton",
        "errorExitButton": "ClearButton",
        //exitAndHomeController
        "buttonExit": "GoButton",
        "buttonHome": "homeButton",
        //playAgainController
        "buttonPlayAgain": "OKButton",
        "buttonPlayAgainMTM": "OKButton",
        //playWithMoneyController
        "buttonMTM": "OKButton",
        //resultController
        "buttonWinClose": "OKButton",
        "buttonNonWinClose": "OKButton",
        //ticketCostController
        "ticketCostPlus": "plusButton",
        "ticketCostMinus": "minusButton",
        "spotPlus": "plusButtonSpot",
        "spotMinus": "minusButtonSpot",
        //tutorialController
        "iconOff": "tutorialPageIconOff",
        "iconOn": "tutorialPageIconOn",
        "buttonCloseTutorial": "OKButton",
        //revealAllController
        "buttonAutoPlay": "AutoPlayButton",
        // "buttonAutoPlayMTM":"buttonCommon",
        "buttonQuickPick": "ClearButton",
        "buttonClear": "ClearButton"

    },
    gameParam: {
        //tutorialController
        "pageNum": 1,
        "arrowPlusSpecial": true,
        "popUpDialog": true
    },
    predefinedStyle: {
        "swirlName": "LoadingSwirl",
        "splashLogoName": "LoadLogo",
        landscape: {
            canvas: {
                width: 1440,
                height: 810
            },
            gameLogoDiv: {
                width: 1006,
                height: 486,
                y: 300
            },
            progressSwirl: {
                width: 100,
                height: 100,
                animationSpeed: 0.5,
                loop: true,
                y: 650,
                scale: {
                    x: 1.2,
                    y: 1.2
                }
            },
            brandCopyRightDiv: {
                bottom: 20,
                fontSize: 18,
                color: "#d4c5fb",
                fontFamily: '"Arial"'
            },
            progressTextDiv: {
                y: 650,
                style: {
                    fontSize: 25,
                    fill: "#ffffff",
                    fontWeight: 800,
                    fontFamily: '"Oswald"'
                }
            }
        },
        portrait: {
            canvas: {
                width: 810,
                height: 1228
            },
            gameLogoDiv: {
                width: 684,
                height: 331,
                y: 380
            },
            progressSwirl: {
                width: 100,
                height: 100,
                animationSpeed: 0.5,
                loop: true,
                y: 770,
                scale: {
                    x: 1.2,
                    y: 1.2
                }
            },
            brandCopyRightDiv: {
                bottom: 20,
                fontSize: 18,
                color: "#d4c5fb",
                fontFamily: '"Arial"'
            },
            progressTextDiv: {
                y: 770,
                style: {
                    fontSize: 25,
                    fill: "#ffffff",
                    fontWeight: 800,
                    fontFamily: '"Oswald"'
                }
            }
        }
    }

});
