const router = require("express").Router();
const lojaValidation  = require("../../../controllers/validacoes/lojaValidation");
const auth = require("../../auth");
const LojaController = require("../../../controllers/LojaController");
//const Validation = require("express-validation");


const lojaController = new LojaController();

router.get("/", lojaController.index); // testado
router.get("/:id", lojaController.show);
//router.get("/:id", Validation(LojaValidation.show), lojaController.show); // testado

router.post("/", auth.required, lojaController.store);
router.put("/:id", auth.required, lojaValidation, lojaController.update);
router.delete("/:id", auth.required, lojaValidation, lojaController.remove);

// router.post("/", auth.required, Validation(lojaValidation.store), lojaController.store); // testado
// router.put("/:id", auth.required, lojaValidation.admin, Validation(lojaValidation.update), lojaController.update); // testado
// router.delete("/:id", auth.required, lojaValidation.admin, lojaController.remove); // testado

module.exports = router;