const students = require('../repo/repo');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
  try {
      const { name, email, password, phonenumber } = req.body;
      console.log('Request Body:', req.body);
      if (!name || !email || !password || !phonenumber) {
          return res.status(400).json({ error: 'Invalid data format' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);
      const newUser = await students.createUser({
          name,
          email,
          password: hashedPassword,
          phonenumber
      });
      console.log('New User Created:', newUser);
      return res.json({ success: true, data: newUser });
  } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
}
  async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log('Request Body:', req.body);
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
      const existingUser = await students.loginByEmail(email);
       if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({ success: true, message: 'Login successful', data: existingUser });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  function deleteUser(req, res) {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    try {
      students.deleteById(user_id); 
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

async function getAllUser(req, res) {
  try {
    const allUser= await students.getAllUser();
    res.json({ success: true, data: allUser });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
}

  module.exports = {
    createUser,
    loginUser,
    deleteUser,
    getAllUser,
};
