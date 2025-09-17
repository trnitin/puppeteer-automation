const express = require('express');
const router  = express();
const AuthController = require('../controller/login')
const lotusBookController = require('../controller/lotusBook247')
const lotusController = require('../controller/lotus247');
const befairController = require('../controller/betfair');
const integratedBetfair = require('../controller/integratedBetfair');

router.get('/',AuthController.setLogin)
router.get('/betlist',AuthController.BetList)
router.post('/updatebet',AuthController.updateClickedBets)
router.get('/loginToSite',AuthController.loginToSite)
router.get('/lotusbooklogin',lotusBookController.setLotusBookLogin)
router.get('/lotusBookBetlist',lotusBookController.lotusBookBetList)
router.get('/lotuslogin',lotusController.setLotusLogin)
router.get('/lotusBetlist',lotusController.LotusBetList)
router.get('/befairlogin',befairController.getSessionToken)
router.get('/order',befairController.fullFlowOrder)
router.get('/integratedBetfairOrder',integratedBetfair.integratedLotusBookBetList)

module.exports = router