import express from "express";
import { ProjectCreate, ProjectsGet } from "../controllers/project.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage})



router.post('/project/create', upload.single('projectImage'), ProjectCreate);
router.get('/project/get', ProjectsGet);

export default router;