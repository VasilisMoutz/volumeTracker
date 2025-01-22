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
  const { projectId, volume, userId } = req.body;
  const date = new Date();
  const month = date.getMonth();
  let volumeToUpdate;

  // if volume is durational
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
    await User.updateOne(
      { _id: userId },
      { 
        $inc: {
          'projects.$[project].generalVolume.daily': volumeToUpdate,
          'projects.$[project].generalVolume.weekly': volumeToUpdate,
          'projects.$[project].generalVolume.monthly': volumeToUpdate,
          'projects.$[project].generalVolume.yearly': volumeToUpdate,
          'projects.$[project].generalVolume.total': volumeToUpdate,
          [`projects.$[project].dateVolume.$[dateVolume].${month}`]: volumeToUpdate
        }
      }, 
      {
        arrayFilters: [
          { "project._id": projectId },
          { "dateVolume.year": 2025 } // TODO dynamicaly get the year
        ]
      }
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

  const validUser = await User.findById(userID);
  
  if (!validUser) {
    return res.status(400).json({message: 'User Not Found'});
  }

  const projectsDB = validUser.projects;
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
        user: validUser._id,
        id: project._id,
        name: project.name,
        image: url,
        type: project.volumeType,
        volume: {
          daily: project.generalVolume.daily,
          weekly: project.generalVolume.weekly,
          monthly: project.generalVolume.monthly,
          yearly: project.generalVolume.yearly,
          total: project.generalVolume.total,
        },
        dateVolume: project.dateVolume
      }
    )
  }
  res.send(projects)
}

export async function ProjectCreate(req, res) {

  // User specific update
  const token = req.cookies["authToken"];
  const payload = jsonwebtoken.verify(token, jwt_secret);
  const { userID } = payload;

  const validUser = await User.findById(userID);

  if (!validUser) {
    return res.status(400).json({message: 'User Not Found'});
  }

  // Save Image to AWS
  const imageName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params)
  await s3.send(command)

  // Create the object data
  const date = new Date();
  const thisYear = date.getFullYear();
  const dateVol = { year: thisYear }

  const newProject = {
    name: req.body.projectName,
    volumeType: req.body.projectType,
    image: imageName,
    dateVolume: dateVol
  }

  validUser.projects.push(newProject);
  await validUser.save();

  res.status(newProject);
}