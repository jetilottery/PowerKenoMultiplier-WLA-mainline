define([
    'skbJet/componentCRDC/splash/splashLoadController',
    'skbJet/componentCRDC/splash/splashUIController'
], function (splashLoadController, splashUIController) {
    var predefinedData = {
        "swirlName": "LoadingSwirl",
        "backgroundSize": "cover",
        landscape: {
//            slot: {
//                canvas: {
//                    width: 1040,
//                    height: 960,
//                    landscapeMargin: 440
//                },
//                gameImgDiv: {
//                    width: 1040,
//                    height: 700,
//                    top: 100
//                },
//                featureTextDiv: {
//                    //width:1040,
//                    height: 44,
//                    padding: 4,
//                    fontSize: 36
//                },
//                progressSwirl: {
//                    width: 100,
//                    height: 100,
//                    animationSpeed: 0.5,
//                    loop: true,
//                    y: 770,
//                    scale: {
//                        x: 1.2,
//                        y: 1.2
//                    }
//                },
//                progressTextDiv: {
//
//                },
//                copyRightDiv: {
//                    bottom: 20,
//                    fontSize: 28,
//                    fontFamily: 'Arial, "San serif"'
//                }
//            },
//            IW: {
            splashLogoName: "landscapeLoadLogo",
            canvas: {
                width: 1440,
                height: 810,
                landscapeMargin: 0
            },
            gameImgDiv: {
                width: 1440,
                height: 810,
                top: 0
            },
            gameLogoDiv: {
                width: 1006,
                height: 486,
                y: 300
            },
//			featureTextDiv:{
//				//width:572,
//				height:40,
//				padding:4,
//				fontSize:32
//			},
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
            progressTextDiv: {
                y: 650,
                style: {
                    fontSize: 25,
                    fill: "#ffffff",
                    fontWeight: 800,
                    fontFamily: '"Oswald"'
                }
            },
            copyRightDiv: {
                bottom: 20,
                fontSize: 20,
                color: "#d4c5fb",
                fontFamily: '"Oswald"'
            }
//            }
        },
        portrait: {

//            slot: {
//                loadDiv: {
//                    width: 1040,
//                    height: 960,
//                    landscapeMargin: 440
//                },
//                gameImgDiv: {
//                    width: 1040,
//                    height: 700,
//                    top: 100
//                },
//                featureTextDiv: {
//                    //width:1040,
//                    height: 44,
//                    padding: 4,
//                    fontSize: 36
//                },
//                progressSwirl: {
//                    width: 820,
//                    height: 16,
//                    padding: 4
//                },
//                progressTextDiv: {
//
//                },
//                copyRightDiv: {
//                    bottom: 20,
//                    fontSize: 28,
//                    fontFamily: 'Arial, "San serif"'
//                }
//            },
//            IW: {
            splashLogoName: "portraitLoadLogo",
            canvas: {
                width: 810,
                height: 1228,
                landscapeMargin: 0
            },
            gameImgDiv: {
                width: 810,
                height: 1228,
                top: 0
            },
//			featureTextDiv:{
//				//width:572,
//				height:40,
//				padding:4,
//				fontSize:32
//			},
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
            progressTextDiv: {
                y: 770,
                style: {
                    fontSize: 25,
                    fill: "#ffffff",
                    fontWeight: 800,
                    fontFamily: '"Oswald"'
                }
            },
            copyRightDiv: {
                bottom: 20,
                fontSize: 20,
                color: "#d4c5fb",
                fontFamily: '"Oswald"'
            }
        }
//        }
    };

    //WLA:do not display Name/Background/Copyright
    var softId = window.location.search.match(/&?softwareid=(\d+.\d+.\d+)?/);
    var showCopyRight = false;
    if (softId) {
        if (softId[1].split('-')[2].charAt(0) !== '0') {
            showCopyRight = true;
        }
    }
    //WLA:Display Name/Background/Copyright
    //var showCopyRight = true;
    
    function onLoadDone() {
        splashUIController.onSplashLoadDone();
        window.postMessage('splashLoaded', window.location.origin);
    }

    function init() {
        splashUIController.init({layoutType: 'IW', predefinedData: predefinedData, showCopyRight: showCopyRight});
        splashLoadController.load(onLoadDone);
    }
    init();
    return {};
});