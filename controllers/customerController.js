const customer = require("../models/bankSchema");
const bcrypt = require("bcrypt");
const hashRounds = 13;
const jwt = require("jsonwebtoken");

//===============controller for register ===================
exports.register = async (req, res) => {
  try {
    //check email already is exsist or not
    const existingCustomer = await customer.findOne({ email: req.body.email });
    if (existingCustomer) {
      return res.send({
        message: `Email: ${req.body.email} already exsist`,
        statusCode: 401,
      });
    }
    //hashing password using bcrypt
    bcrypt.hash(req.body.password, hashRounds, async (err, hash) => {
      //id generate
      const lastCustomer = (await customer.findOne(
        {},
        { custid: 1 },
        { sort: { custid: -1 } }
      )) || { custid: 0 };
      const customerId = lastCustomer.custid + 1;
      //creating new customer
      await customer
        .create({
          custid: customerId,
          name: req.body.name,
          email: req.body.email,
          password: hash,
          money: 0.0,
        })
        .then(() => {
          return res.status(201).send({
            id: customerId,
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
    //find customer by email
    const foundCustomer = await customer.findOne({ email: req.body.email });

    if (foundCustomer) {
      //compare password using bcrypt
      bcrypt.compare( 
        req.body.password,foundCustomer.password,
        (err, result) => {
          if (result === true) {
            //success message for successful login
          const token = jwt.sign({ user:foundCustomer }, process.env.ACCESS_TOKEN);
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


//==========================get indvidual data==========================
exports.dataById = async (req, res) => {
  try {
    const data = await customer.findOne({ custid: Number(req.user.custid) });

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
    { custid: req.params.id },
    { money: req.body.balance }
  );
  console.log(data);
};


