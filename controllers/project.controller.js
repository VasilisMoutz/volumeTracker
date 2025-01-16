import Project from "../models/Project.js";
import dotenv from 'dotenv';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client,PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import User from "../models/User.js";

dotenv.config();

const randomImageName = (bytes = 32) => crypto.randomBytes(16).toString('hex');

const bucketName =  process.env.BUCKET_NAME
const bucketRegion =  process.env.BUCKET_REGION
const accessKey =  process.env.ACCESS_KEY
const secretAccessKey =  process.env.SECRET_ACCESS_KEY
const jwt_secret = process.env.JWT_SECRET

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});

export async function ProjectUpdate(req, res) {
  const { projectId, volume } = req.body;

  let volumeToUpdate;

  if (typeof volume === 'string'){
    const volumeTime = volume.split(':');
    const hours = parseInt(volumeTime[0]);
    const minutes = parseInt(volumeTime[1]);
    const seconds = parseInt(volumeTime[2]);
    volumeToUpdate = hours * 3600 + minutes * 60 + seconds;
  } else {
    volumeToUpdate = volume;
  }

  try {
    await Project.updateOne(
      { _id: projectId },
      { $inc: {
        dailyVol: volumeToUpdate,
        weeklyVol: volumeToUpdate,
        monthlyVol: volumeToUpdate,
        yearlyVol: volumeToUpdate,
        totalVol: volumeToUpdate
      }}
    )
  } catch (err) {
    console.log(err);
  }

  res.send({});
}

export async function ProjectsGet(req, res) {
  const token = req.cookies["authToken"];
  const payload = jsonwebtoken.verify(token, jwt_secret);
  const { userID } = payload
  
  if (!userID) {
    res.status(400).json({message: 'Unauthenticated'})
  }

  const projectsDB = await Project.find({owner: userID})

  const projects = []

  for (const project of projectsDB) {

    // Get image url from S3
    const getObjectParams = {
      Bucket: bucketName,
      Key: project.image,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Get onlt the neccessart info for the client
    projects.push(
      {
        id: project._id,
        name: project.name,
        image: url,
        type: project.volumeType,
        volume : {
          daily: project.dailyVol,
          weekly: project.weeklyVol,
          monthly: project.monthlyVol,
          yearly: project.yearlyVol,
          total: project.totalVol,
        }
      }
    )
  }
  res.send(projects)
}


export async function ProjectCreate(req, res) {

  const token = req.cookies["authToken"];
  const payload = jsonwebtoken.verify(token, jwt_secret);
  const { userID } = payload;

  const validateUser = await User.findById(userID);

  if (!validateUser) {
    return res.status(400).json({message: 'User Not Found'});
  }

  // const buffer = await sharp(req.file.buffer).resize({height: 1080, width: 1920, fit: "contain"}).toBuffer()
  const imageName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params)
  await s3.send(command)

  const newProject = new Project({
    name: req.body.projectName,
    volumeType: req.body.projectType,
    image: imageName,
    owner: userID
  })

  await newProject.save();

  res.status(newProject);
}