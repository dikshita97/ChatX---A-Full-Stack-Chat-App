const {addMsg, getAllMsgs} = require('../controller/msgController');
const router = require('express').Router();

router.post("/addMsg", addMsg);
router.post("/getAllMsgs", getAllMsgs);

module.exports = router;