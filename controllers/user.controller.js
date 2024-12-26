import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

export async function login(req, res) {
    try {
    const {username, password} = req.body;

    if (!username || !password ) {
      throw new Error('Insufficient input data');
    }

    const user = await User.findOne({username});

    if (!user) {
      throw new Error('User is not yet registered');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error('Invalid Credentials');
    }

    const token = jsonwebtoken.sign({username}, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({message: "Login Succesfull", token});
    
  } catch (error) {
    return res.status(500).json({message: 'Login Failed', error: error.message})
  }
}

export async function signup(req, res) {

  const saltRounds = Number(process.env.SALT_ROUNDS);

  try {

    const { username, password } = req.body;

    if (!username || !password ) {
      throw new Error('Insufficient input data');
    }

    const userExists = await User.findOne({username});
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (userExists) {
      throw new Error('User already registered');
    }

    const newUser = new User({
      username: username,
      password: hashedPassword
    })

    await newUser.save();

  } catch (error) {
    res.status(500).json({message: 'Registration Failed', error: error.message});
    return;
  }

  return res.status(200).json({message: 'Registration complete'});
}