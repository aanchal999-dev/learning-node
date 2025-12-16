import fs from "fs";
import jwt from "jsonwebtoken"

const admin ={username: 'admin@mail.com', password: 'adminpassword'}

export const getUser = async(req, res) => {
    console.log(req.body);
    const isAdmin = req.body.username.include('admin');
    const role = isAdmin ? 'admin' : 'user'
    let status = 200
    let data;
    let userArray;
    try{
        const userData = await fs.promises.readFile('./storage/data.json', 'utf8');
        userArray = await JSON.parse(userData);
        const foundUser = findUser(userArray, req.body.username);
        if(!isAdmin && !foundUser)
        {
            status = 404
            data = 'User not found!';
        }
        else if(isAdmin)
        {
            data = userArray;
        }
        else if(foundUser)
        {
            data = foundUser;
        }
    }catch(error)
    {
        status = 500;
        data = 'Error reading file';
        console.error('Error reading file', error);
    }
    return res.status(status).json(data);
}

export const login =  async(req, res) => {
    const loginDetails = req.body;
    let status = 200;
    let data;
    if (!loginDetails.username?.length){
        status = 422;
        data = 'Username is required';
    }
    else if (!loginDetails.password?.length>=6){
        status = 422;
        data = 'Password is required';
    }
    else
    {
        let userArray;
        try{
            const userData = await fs.promises.readFile('./storage/data.json', 'utf8');
            userArray = await JSON.parse(userData);
            const foundUser = findUser(userArray, loginDetails.username);
            if(foundUser)
            {
               if(foundUser.password === loginDetails.password)
               {
                const token = jwt.sign({ username: foundUser.username, role: 'user'}, 'xyz-secret-key', {
                    expiresIn: '1h',
                    });
                    data = {message:'login successful', token};
               }    
               else
               {
                    status = 500;
                    data = 'password incorrect!'
               }            
            }
            else
            {
                status = 404;
                data = 'User not found!'
            }

        } catch(error) {
            status = 500;
            data = 'Error reading file';
            console.error('Error reading file', error);
        }
    }
    return res.status(status).json(data);
  };

export const register = async (req, res) => {
    const payload = req.body;
    let status = 201;
    let data;
    if(!payload.name?.length ){
        status = 422;
        data = 'Name is required';
    } 
    else if (!payload.designation?.length){
        status = 422;
        data = 'Designation is required';
    }
    else if (!payload.username?.length){
        status = 422;
        data = 'Username is required';
    }
    else if (!payload.password?.length>=6){
        status = 422;
        data = 'Password is required';
    }
    else
    {
        let userdata;
        try {
            const registerData = await fs.promises.readFile('./storage/data.json', 'utf8');
            userdata = await JSON.parse(registerData);
            const userExists = userdata.some((obj) => {
                return (obj.username === payload.username);
            });
            if(!userExists)
            {
                userdata.push(payload);
                try {
                    await fs.promises.writeFile('./storage/data.json', JSON.stringify(userdata, null, 1), 'utf8');
                    data = {message: 'User data saved', isRegistered: true}
                    console.log('User data saved');   
                } catch (error) {
                    status = 500;
                    data = 'Error parsing JSON';
                    console.error('Error parsing JSON:', error);
                }
            }
            else
            {
                status = 422;
                data = 'Username already exists!'
            }

        } catch (error) {
            status = 500;
            data = 'Error reading file';
            console.error('Error reading file', error);
        }
    }
    return res.status(status).json(data);
  }

export function findUser(userArray, username) {
    const foundUser = userArray.find((user) =>
        user.username === username);
    return foundUser;
}
