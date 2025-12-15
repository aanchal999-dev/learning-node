import { log } from "console";
import fs from "fs";

export const login =  async(req, res) => {
    let userdata;
    fs.readFile('./storage/data.json', 'utf8', async(error, data) => {
        if (error) {
          console.error('Error reading file', error);
          return;
        }
        try {
          userdata = await JSON.parse(data);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
        }
    });
    res.status(200).json(userdata);
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