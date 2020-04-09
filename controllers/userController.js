require('dotenv').config()
const jwt = require('jsonwebtoken')
const {accessTokenSecret, refreshTokenSecret, refreshTokenList, expirationTime} = require('../middlewares/jwtAuthenticator')

const {Users} = require('../models')

const userController = {
  signin : (req, res) => {
    const {username, password} = req.body

    Users.findOne({
      where:{
        username
      }
    }).then(result => {
      if (!result) {
        res.sendStatus(404)
      } else {
        if (result.dataValues.password !== `${password}`) {
          res.sendStatus(401)
        } else {
          const user_id = result.dataValues.id

          const accessToken = jwt.sign({
            sub:user_id
          }, accessTokenSecret, {expiresIn:expirationTime})

          const refreshToken = jwt.sign({
            sub:user_id
          }, refreshTokenSecret)

          refreshTokenList.push(refreshToken)

          res.status(200).json({
            accessToken,
            refreshToken
          })
        }

      }
      
    })
    
    
  },
  signup : (req, res) => {
    const {username, password, nickname, email} = req.body

    Users.findOrCreate({
      where: {
        username
      },
      defaults: {
        password,
        nickname,
        email
      }
    }).then(([result, created]) => {
      if (!created) {
        res.sendStatus(409)
      } else {
        res.sendStatus(201)
      }
    }).catch(err => {
      res.sendStatus(409)
    })
  },
  signout : (req, res) => {
    const {token} = req.body
    refreshTokenList = refreshTokenList.filter(t => t !== token)
    res.status(200).send("Logout successful")
  }
}

module.exports = userController