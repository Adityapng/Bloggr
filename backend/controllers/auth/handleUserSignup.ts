import User from "../../models/users";
import { Request, Response } from "express";

const handleUserSignup = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;

    if( !firstName || !lastName || !email || !username || !password ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if(existingEmail){
        return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if(existingUsername){
        return res.status(400).json({ error: "A user already exists with this username" });
    }

    const newUSer = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: password
    });

    const savedUser = await newUSer.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    console.log("User created successfully")
    res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword
    });
    } catch (error) {
        console.log("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export default handleUserSignup;