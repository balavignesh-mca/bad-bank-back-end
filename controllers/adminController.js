const admin = require("../models/adminSchema");
const bcrypt = require("bcrypt");
const hashRounds = 13;
const jwt = require("jsonwebtoken");
const customer = require("../models/bankSchema");

//===============controller for register ===================
exports.register = async (req, res) => {
  try {
    //check email already is exsist or not
    const existingadmin = await admin.findOne({ email: req.body.email });
    if (existingadmin) {
      return res.send({
        message: `Email: ${req.body.email} already exsist`,
        statusCode: 401,
      });
    }
    //hashing password using bcrypt
    bcrypt.hash(req.body.password, hashRounds, async (err, hash) => {
      //id generate
      const lastadmin = (await admin.findOne(
        {},
        { adminid: 1 },
        { sort: { adminid: -1 } }
      )) || { adminid: 0 };
      const adminid = lastadmin.adminid + 1;
      //creating new admin
      await admin
        .create({
          adminid: adminid,
          name: req.body.name,
          email: req.body.email,
          password: hash,
         
        })
        .then(() => {
          return res.status(201).send({
            id: adminid,
            message: "account created successfully",
            statuscode: 201,
          });
        })
        .catch((err) => res.status(402).send(err));
    });
  } catch (error) {
    //if any error in server that will send response
    return res.status(500).send(message`internal server error: ${error}`);
  }
};

//=====================controller login ========================

exports.login = async (req, res) => {
  try {
    
    //find admin by email
    const foundadmin = await admin.findOne({ email: req.body.email });

    if (foundadmin) {
      //compare password using bcrypt
      bcrypt.compare(
        req.body.password,
        foundadmin.password,
        (err, result) => {
          if (result === true) {
            //success message for successful login
            const token = jwt.sign({ user:foundadmin }, process.env.ACCESS_TOKEN);
            res.send({ token, statuscode: 201 });
          } else {
            // error message for password mismatch
            res.send({ message: `password mismatch `, statuscode: 401 });
          }
        }
      );
    } else {
      // error message for account not found
      res.send({ message: `account not found`, statuscode: 404 });
    }
  } catch (error) {
    //if any error in server that will send response
    res.status(500).send(`internal server error: ${error}`);
  }
};

//========================controller get allData ======================

exports.allData = async (req, res) => {
  console.log("allData route accessed");
  const data = await customer.find();
  if (!data) {
    res.send(`data not found`);
  } else {
    res.send(data);
  }
};

//==========================get indvidual data==========================
exports.dataById = async (req, res) => {
  try {
    const data = await customer.findOne({ adminid: Number(req.params.id) });

    if (data === null) {
      return res.send({ message: `ID not found` });
    } else {
      return res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
};
//======================update data ====================================

exports.update = async (req, res) => {
  const data = await customer.findOneAndUpdate(
    { adminid: req.params.id },
    { money: req.body.balance }
  );
  console.log(data);
};

//==========================delete indvidual data==========================
exports.deleteById = async (req, res) => {
  try {
    const data = await customer.findOneAndDelete({
      custid: Number(req.params.id),
    });

    if (data === null) {
      return res.send({ message: `ID not found` });
    } else {
      return res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
};


//=============================================================
exports.getAdminData = async (req, res) => {
  try {
    console.log(req.user);
    const data = await admin.findOne({
      adminid: Number(req.user.adminid),
    });

    if (data === null) {
      return res.send({ message: `ID not found` });
    } else {
      return res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
};