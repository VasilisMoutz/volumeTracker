import express from "express";
import { ProjectCreate, ProjectsGet, ProjectUpdate } from "../controllers/project.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage})

router.post('/project/create', upload.single('projectImage'), ProjectCreate);
router.get('/projects/get', ProjectsGet);
router.put('/projects/update', ProjectUpdate)

export default router;