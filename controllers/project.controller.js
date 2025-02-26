import dotenv from 'dotenv';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client,PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import User from "../models/User.js";
import NodeCache from 'node-cache';

dotenv.config();
const randomImageName = (bytes = 32) => crypto.randomBytes(16).toString('hex');
const projectCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

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
  try {
    // Ensure cookie
    const token = req.cookies["authToken"];
    if (!token) {
      res.statusMessage = "No token found";
      res.status(400).end();
      return;
    }

    // Prepare variables
    const { projectId, volume } = req.body;
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    let volumeToUpdate;
    const userID = getUserIdFromCookie(token);

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

  
    await User.updateOne(
      { _id: userID },
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
          { "dateVolume.year": year }
        ]
      }
    )

    res.send({});

  } catch (err) {
    console.log(err);
  }
}

export async function ProjectsGet(req, res) {

  const useCached = req.query.cached;

  try {
    const token = req.cookies["authToken"];

    // Ensure cookie
    if (!token) {
      res.statusMessage = "No token found";
      res.status(400).end();
      return;
    }

    // Ensure valid cookie
    const userID = getUserIdFromCookie(token);
    const cashedProjects = projectCache.get(userID);
  
    if (!cashedProjects || useCached === 'false') {
      
      const projects = [];
      const validUser = await User.findById(userID);

      if (!validUser) {
        throw new Error('User Not Found');
      }

      const projectsDB = validUser.projects;
      
      for (const project of projectsDB) {
    
        // Get image url from S3
        const getObjectParams = {
          Bucket: bucketName,
          Key: project.image,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        const objProject = project.toObject();
    
        // Get only the neccessary info for the client
        projects.push(
          {
            user: validUser._id,
            id: objProject._id,
            name: objProject.name,
            image: url,
            type: objProject.volumeType,
            volume: {
              daily: objProject.generalVolume.daily,
              weekly: objProject.generalVolume.weekly,
              monthly: objProject.generalVolume.monthly,
              yearly: objProject.generalVolume.yearly,
              total: objProject.generalVolume.total,
            },
            dateVolume: objProject.dateVolume
          }
        )
      }
  
      projectCache.set(userID, projects);
      res.send(projects)
    }
    else {
      res.send(cashedProjects);
    }
  } catch (err) {
    console.log("Error Fetching Projects ", err);
  }

}

export async function ProjectCreate(req, res) {

  // User specific update
  const token = req.cookies["authToken"];

  // Ensure cookie
  if (!token) {
    res.statusMessage = "No token found";
    res.status(400).end();
    return;
  }

  const userID = getUserIdFromCookie(token);
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

function getUserIdFromCookie(cookie) {
  const payload = jsonwebtoken.verify(cookie, jwt_secret);
  const { userID } = payload
  return userID;
}