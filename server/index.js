const express = require("express")
const multer = require("multer")
const bcrypt = require('bcrypt')
const passwordValidator = require('password-validator')
const fs = require("fs")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');
const cors = require("cors")

// const path = require("path")

dotenv.config()

const Maincategory = require("./models/Maincategory")
const Subcategory = require("./models/Subcategory")
const Brand = require("./models/Brand")
const Product = require("./models/Product")
const User = require("./models/User")
const Cart = require("./models/Cart")
const Wishlist = require("./models/Wishlist")
const Checkout = require("./models/Checkout")
const Contact = require("./models/Contact")
const Newslatter = require("./models/Newslatter")


require("./dbConnect")
const app = express()
app.use(cors())

app.use(express.json())
app.use("/public", express.static("public"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

var schema = new passwordValidator()
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have uppercase letters
    .has().lowercase(1)                             // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Password@123', 'Password123', 'Admin@123', 'Admin123', "User@123"])

const from = process.env.MAILSENDER
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: from,
        pass: process.env.PASSWORD
    }
})

async function verifyToken(req, res, next) {
    var token = req.headers.authorization
    var user = await User.findOne({ username: req.headers.username })
    if (token && user) {
        if (user.role === "User" && jwt.verify(token, process.env.USERSAULTKEY)) {
            if (user.tokens.find((item) => item == token))
                next()
            else
                res.status(401).send({ result: "Fail", message: "You Logged Out!!! \nPlease Login Again!!!" })
        }
        else if (user.role === "Admin" && jwt.verify(token, process.env.AdminSAULTKEY)) {
            if (user.tokens.find((item) => item == token))
                next()
            else
                res.status(401).send({ result: "Fail", message: "You Logged Out!!! \nPlease Login Again!!!" })
        }

        else
            res.status(401).send({ result: "Fail", message: "You Are Not Authorized to Access this API!!!" })
    }
    else
        res.status(401).send({ result: "Fail", message: "You Are Not Authorized to Access this API!!!" })
}
async function verifyTokenAdmin(req, res, next) {
    try {
        var token = req.headers.authorization
        var user = await User.findOne({ username: req.headers.username })
        if (token && user) {
            if (jwt.verify(token, process.env.ADMINSAULTKEY)) {
                if (user.tokens.find((item) => item == token))
                    next()
                else
                    res.status(401).send({ result: "Fail", message: "You Logged Out!!! \nPlease Login Again!!!" })
            }
            else
                res.status(401).send({ result: "Fail", message: "You Are Not Authorized to Access this API!!!" })
        }
        else
            res.status(401).send({ result: "Fail", message: "You Are Not Authorized to Access this API!!!" })
    }
    catch (error) {
        res.status(401).send({ result: "Fail", message: "You Are Not Authorized to Access this API!!!" })
    }
}

//API for maincategory
app.post("/maincategory", verifyTokenAdmin, async (req, res) => {
    try {
        var data = new Maincategory(req.body)
        await data.save()
        res.send({ result: "Done", message: "Maincategory is Created!!!!!" })
    }
    catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Maincategory Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/maincategory", async (req, res) => {
    try {
        var data = await Maincategory.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/maincategory/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Maincategory.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/maincategory/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Maincategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Maincategory Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/maincategory/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Maincategory.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})

//API for subcategory
app.post("/subcategory", verifyTokenAdmin, async (req, res) => {
    try {
        var data = new Subcategory(req.body)
        await data.save()
        res.send({ result: "Done", message: "Subcategory is Created!!!!!" })
    }
    catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Subcategory Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/subcategory", async (req, res) => {
    try {
        var data = await Subcategory.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/subcategory/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Subcategory.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/subcategory/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Subcategory Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/subcategory/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})

//API for brand
app.post("/brand", verifyTokenAdmin, async (req, res) => {
    try {
        var data = new Brand(req.body)
        await data.save()
        res.send({ result: "Done", message: "Brand is Created!!!!!" })
    }
    catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Brand Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/brand", async (req, res) => {
    try {
        var data = await Brand.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/brand/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Brand.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/brand/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Brand.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Brand Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/brand/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Brand.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})


//API for Product
app.post("/product",
    upload.fields(
        [
            { name: 'pic1', maxCount: 1 },
            { name: 'pic2', maxCount: 2 },
            { name: 'pic3', maxCount: 3 },
            { name: 'pic4', maxCount: 4 }
        ]
    )
    , verifyTokenAdmin, async (req, res) => {
        try {
            var data = new Product(req.body)
            if (req.files && req.files.pic1)
                data.pic1 = req.files.pic1[0].filename
            if (req.files && req.files.pic2)
                data.pic2 = req.files.pic2[0].filename
            if (req.files && req.files.pic3)
                data.pic3 = req.files.pic3[0].filename
            if (req.files && req.files.pic4)
                data.pic4 = req.files.pic4[0].filename
            await data.save()
            res.send({ result: "Done", message: "Product is Created!!!!!" })
        }
        catch (error) {
            if (error.errors.name)
                res.status(401).send({ result: "Fail", message: error.errors.name.message })
            else if (error.errors.maincategory)
                res.status(401).send({ result: "Fail", message: error.errors.maincategory.message })
            else if (error.errors.subcategory)
                res.status(401).send({ result: "Fail", message: error.errors.subcategory.message })
            else if (error.errors.brand)
                res.status(401).send({ result: "Fail", message: error.errors.brand.message })
            else if (error.errors.color)
                res.status(401).send({ result: "Fail", message: error.errors.color.message })
            else if (error.errors.size)
                res.status(401).send({ result: "Fail", message: error.errors.size.message })
            else if (error.errors.baseprice)
                res.status(401).send({ result: "Fail", message: error.errors.baseprice.message })
            else if (error.errors.finalprice)
                res.status(401).send({ result: "Fail", message: error.errors.finalprice.message })

            else
                res.status(500).send({ result: "Fail", message: "Internal Server Error" })
        }
    })
app.get("/product", async (req, res) => {
    try {
        var data = await Product.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/product/:_id", async (req, res) => {
    try {
        var data = await Product.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/product/:_id",
    upload.fields(
        [
            { name: 'pic1', maxCount: 1 },
            { name: 'pic2', maxCount: 2 },
            { name: 'pic3', maxCount: 3 },
            { name: 'pic4', maxCount: 4 }
        ]
    ), verifyTokenAdmin, async (req, res) => {
        try {
            var data = await Product.findOne({ _id: req.params._id })
            if (data) {
                data.name = req.body.name ?? data.name
                data.maincategory = req.body.maincategory ?? data.maincategory
                data.subcategory = req.body.subcategory ?? data.subcategory
                data.brand = req.body.brand ?? data.brand
                data.color = req.body.color ?? data.color
                data.size = req.body.size ?? data.size
                data.baseprice = req.body.baseprice ?? data.baseprice
                data.discount = req.body.discount ?? data.discount
                data.finalprice = req.body.finalprice ?? data.finalprice
                data.stock = req.body.stock ?? data.stock
                data.description = req.body.description ?? data.description
                if (req.files && req.files.pic1) {
                    try {
                        fs.unlink("./public/uploads/" + data.pic1, () => { })
                    } catch (error) {
                        console.log(error);
                    }
                    data.pic1 = req.files.pic1[0].filename
                }
                if (req.files && req.files.pic2) {
                    try {
                        fs.unlink("./public/uploads/" + data.pic2, () => { })
                    } catch (error) { }
                    data.pic2 = req.files.pic2[0].filename
                }
                if (req.files && req.files.pic3) {
                    try {
                        fs.unlink("./public/uploads/" + data.pic3, () => { })
                    } catch (error) { }
                    data.pic3 = req.files.pic3[0].filename
                }
                if (req.files && req.files.pic4) {
                    try {
                        fs.unlink("./public/uploads/" + data.pic4, () => { })
                    } catch (error) { }
                    data.pic4 = req.files.pic4[0].filename
                }
                await data.save()
                res.send({ result: "Done", message: "Record is Updated!!!!!" })
            }
            else
                res.status(404).send({ result: "Fail", message: "Invalid ID" })
        } catch (error) {
            if (error.errors.name)
                res.status(401).send({ result: "Fail", message: error.errors.name.message })
            else if (error.errors.maincategory)
                res.status(401).send({ result: "Fail", message: error.errors.maincategory.message })
            else if (error.errors.subcategory)
                res.status(401).send({ result: "Fail", message: error.errors.subcategory.message })
            else if (error.errors.brand)
                res.status(401).send({ result: "Fail", message: error.errors.brand.message })
            else if (error.errors.color)
                res.status(401).send({ result: "Fail", message: error.errors.color.message })
            else if (error.errors.size)
                res.status(401).send({ result: "Fail", message: error.errors.size.message })
            else if (error.errors.baseprice)
                res.status(401).send({ result: "Fail", message: error.errors.baseprice.message })
            else if (error.errors.finalprice)
                res.status(401).send({ result: "Fail", message: error.errors.finalprice.message })

            else
                res.status(500).send({ result: "Fail", message: "Internal Server Error" })
        }
    })
app.delete("/product/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlink("./public/uploads/" + data.pic1, () => { })
            } catch (error) { }
            try {
                fs.unlink("./public/uploads/" + data.pic2, () => { })
            } catch (error) { }
            try {
                fs.unlink("./public/uploads/" + data.pic3, () => { })
            } catch (error) { }
            try {
                fs.unlink("./public/uploads/" + data.pic4, () => { })
            } catch (error) { }
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
//API for User
app.post("/user", async (req, res) => {
    try {
        var data = new User(req.body)
        if (schema.validate(req.body.password)) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    res.status(500).send({ result: "Fail", message: "Internal Server Error" })
                else {
                    data.password = hash
                    await data.save()
                    res.send({ result: "Done", message: "User is Created!!!!!" })
                }
            })
        }
        else
            res.status(401).send({ result: "Fail", message: "Password Must Containe Atleast 8 Character, Max 100, Must container atleast 1 Lower Case Alphabet,1 Upper Case Alphabet,1 Digit and it can't Contain any Space" })
    }
    catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "User Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else if (error.errors.email)
            res.status(401).send({ result: "Fail", message: error.errors.email.message })
        else if (error.errors.phone)
            res.status(401).send({ result: "Fail", message: error.errors.phone.message })
        else if (error.errors.username)
            res.status(401).send({ result: "Fail", message: error.errors.username.message })
        else if (error.errors.password)
            res.status(401).send({ result: "Fail", message: error.errors.password.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/user", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await User.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/user/:_id", verifyToken, async (req, res) => {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/user/:_id", verifyToken, upload.single('pic'), async (req, res) => {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.addressline1 = req.body.addressline1 ?? data.addressline1
            data.addressline2 = req.body.addressline2 ?? data.addressline2
            data.addressline3 = req.body.addressline3 ?? data.addressline3
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            if (req.file) {
                try {
                    fs.unlink("./public/uploads/" + data.pic, () => { })
                } catch (error) { }
                data.pic = req.file.filename
            }
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "User Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else if (error.errors.email)
            res.status(401).send({ result: "Fail", message: error.errors.email.message })
        else if (error.errors.phone)
            res.status(401).send({ result: "Fail", message: error.errors.phone.message })
        else if (error.errors.username)
            res.status(401).send({ result: "Fail", message: error.errors.username.message })
        else if (error.errors.password)
            res.status(401).send({ result: "Fail", message: error.errors.password.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/user/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlink("./public/uploads/" + data.pic, () => { })
            } catch (error) { }
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
//api for login
app.post("/login", async (req, res) => {
    try {
        var data = await User.findOne({ username: req.body.username })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                if (data.role == "Admin") {
                    jwt.sign({ data }, process.env.ADMINSAULTKEY, async (error, token) => {
                        // if (data.tokens.length < 3) {
                            data.tokens.push(token)
                            await data.save()
                            res.send({ result: "Done", data: data, token: token })
                        // }
                        // else
                        //     res.status(401).send({ result: "Fail", message: "Your Already Logged in From 3 Device\nTo Login on This Device please Logout from Other Device" })
                    })
                }
                else {
                    jwt.sign({ data }, process.env.USERSAULTKEY, async (error, token) => {
                        // if (data.tokens.length < 3) {
                            data.tokens.push(token)
                            await data.save()
                            res.send({ result: "Done", data: data, token: token })
                        // }
                        // else
                        //     res.status(401).send({ result: "Fail", message: "Your Already Logged in From 3 Device\nTo Login on This Device please Logout from Other Device" })
                    })
                }
            }
            else
                res.status(404).send({ result: "Fail", message: "Invalid Username or Password" })

        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid Username or Password" })
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
//api for logout
app.post("/logout", async (req, res) => {
    try {
        let data = await User.findOne({ username: req.body.username })
        var index = data.tokens.findIndex((item) => item == req.body.token)
        if (index != -1) {
            data.tokens.splice(index, 1)
            await data.save()
        }
        res.send({ result: "Done", message: "You Logged Out!!!" })
    }
    catch (error) {
        console.status(500).log({ result: "Fail", message: "Internal Server Error" })
    }
})
app.post("/logoutall", async (req, res) => {
    try {
        let data = await User.findOne({ username: req.body.username })
        data.tokens = []
        await data.save()
        res.send({ result: "Done", message: "You Logged Out from All Device!!!" })
    }
    catch (error) {
        console.status(500).log({ result: "Fail", message: "Internal Server Error" })
    }
})






//API for Cart
app.post("/cart", verifyToken, async (req, res) => {
    try {
        var data = new Cart(req.body)
        await data.save()
        res.send({ result: "Done", message: "Cart is Created!!!!!" })
    }
    catch (error) {
        if (error.errors.userid)
            res.status(401).send({ result: "Fail", message: error.errors.userid.message })
        else if (error.errors.productid)
            res.status(401).send({ result: "Fail", message: error.errors.productid.message })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else if (error.errors.maincategory)
            res.status(401).send({ result: "Fail", message: error.errors.maincategory.message })
        else if (error.errors.subcategory)
            res.status(401).send({ result: "Fail", message: error.errors.subcategory.message })
        else if (error.errors.brand)
            res.status(401).send({ result: "Fail", message: error.errors.brand.message })
        else if (error.errors.color)
            res.status(401).send({ result: "Fail", message: error.errors.color.message })
        else if (error.errors.size)
            res.status(401).send({ result: "Fail", message: error.errors.size.message })
        else if (error.errors.price)
            res.status(401).send({ result: "Fail", message: error.errors.price.message })
        else if (error.errors.total)
            res.status(401).send({ result: "Fail", message: error.errors.total.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/cartUser/:userid", verifyToken, async (req, res) => {
    try {
        var data = await Cart.find({ userid: req.params.userid })
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/cart/:_id", verifyToken, async (req, res) => {
    try {
        var data = await Cart.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/cart/:_id", verifyToken, async (req, res) => {
    try {
        var data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            data.qty = req.body.qty
            data.total = req.body.total
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Cart Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/cart/:_id", verifyToken, async (req, res) => {
    try {
        var data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/cartall/:userid", verifyToken, async (req, res) => {
    try {
        await Cart.deleteMany({ userid: req.params.userid })
        res.send({ result: "Done", message: "All Carts Are Deleted!!!!!" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})

//API for Wishlist
app.post("/wishlist", verifyToken, async (req, res) => {
    try {
        var data = new Wishlist(req.body)
        await data.save()
        res.send({ result: "Done", message: "Wishlist is Created!!!!!" })
    }
    catch (error) {
        if (error.errors.userid)
            res.status(401).send({ result: "Fail", message: error.errors.userid.message })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else if (error.errors.maincategory)
            res.status(401).send({ result: "Fail", message: error.errors.maincategory.message })
        else if (error.errors.subcategory)
            res.status(401).send({ result: "Fail", message: error.errors.subcategory.message })
        else if (error.errors.brand)
            res.status(401).send({ result: "Fail", message: error.errors.brand.message })
        else if (error.errors.color)
            res.status(401).send({ result: "Fail", message: error.errors.color.message })
        else if (error.errors.size)
            res.status(401).send({ result: "Fail", message: error.errors.size.message })
        else if (error.errors.price)
            res.status(401).send({ result: "Fail", message: error.errors.price.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/wishlist/:userid", verifyToken, async (req, res) => {
    try {
        var data = await Wishlist.find({ userid: req.params.userid })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/wishlist/:_id", verifyToken, async (req, res) => {
    try {
        var data = await Wishlist.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})

//API for Checkout
app.post("/checkout", verifyToken, async (req, res) => {
    try {
        var data = new Checkout(req.body)
        await data.save()
        res.send({ result: "Done", message: "Checkout is Created!!!!!" })
    }
    catch (error) {
        console.log(error);
        if (error.errors.userid)
            res.status(401).send({ result: "Fail", message: error.errors.userid.message })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else if (error.errors.maincategory)
            res.status(401).send({ result: "Fail", message: error.errors.maincategory.message })
        else if (error.errors.subcategory)
            res.status(401).send({ result: "Fail", message: error.errors.subcategory.message })
        else if (error.errors.brand)
            res.status(401).send({ result: "Fail", message: error.errors.brand.message })
        else if (error.errors.color)
            res.status(401).send({ result: "Fail", message: error.errors.color.message })
        else if (error.errors.size)
            res.status(401).send({ result: "Fail", message: error.errors.size.message })
        else if (error.errors.price)
            res.status(401).send({ result: "Fail", message: error.errors.price.message })
        else if (error.errors.total)
            res.status(401).send({ result: "Fail", message: error.errors.total.message })
        else if (error.errors.totalamount)
            res.status(401).send({ result: "Fail", message: error.errors.totalamount.message })
        else if (error.errors.shippingamount)
            res.status(401).send({ result: "Fail", message: error.errors.shippingamount.message })
        else if (error.errors.finalamount)
            res.status(401).send({ result: "Fail", message: error.errors.finalamount.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/checkout", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Checkout.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/checkoutUser/:userid", verifyToken, async (req, res) => {
    try {
        var data = await Checkout.find({ userid: req.params.userid })
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/checkout/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Checkout.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/checkout/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            data.paymentmode = req.body.paymentmode ?? data.paymentmode
            data.orderstatus = req.body.orderstatus ?? data.orderstatus
            data.paymentstatus = req.body.paymentstatus ?? data.paymentstatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Checkout Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/checkout/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
//API for contact
app.post("/contact", async (req, res) => {
    try {
        var data = new Contact(req.body)
        await data.save()
        res.send({ result: "Done", message: "Thanks to Share Your Query With Us!!!! Our Team Will Contact You Soon!!!!" })
    }
    catch (error) {
        if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else if (error.errors.email)
            res.status(401).send({ result: "Fail", message: error.errors.email.message })
        else if (error.errors.phone)
            res.status(401).send({ result: "Fail", message: error.errors.phone.message })
        else if (error.errors.subject)
            res.status(401).send({ result: "Fail", message: error.errors.subject.message })
        else if (error.errors.message)
            res.status(401).send({ result: "Fail", message: error.errors.message.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/contact", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Contact.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/contact/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Contact.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.put("/contact/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Contact.findOne({ _id: req.params._id })
        if (data) {
            data.status = req.body.status
            await data.save()
            res.send({ result: "Done", message: "Record is Updated!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Contact Name Must be Unique" })
        else if (error.errors.name)
            res.status(401).send({ result: "Fail", message: error.errors.name.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/contact/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Contact.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
//API for newslatter
app.post("/newslatter", async (req, res) => {
    try {
        var data = new Newslatter(req.body)
        await data.save()
        res.send({ result: "Done", message: "Thanks to Subscribe our Newslatter Service!!!! Now We Will Send an Email About Our Latest Products and Offerse!!!" })
    }
    catch (error) {
        if (error.keyValue)
            res.status(401).send({ result: "Fail", message: "Your Email Id is Already Registered With US" })
        else if (error.errors.email)
            res.status(401).send({ result: "Fail", message: error.errors.email.message })
        else
            res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.get("/newslatter", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Newslatter.find()
        res.send({ result: "Done", data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.delete("/newslatter/:_id", verifyTokenAdmin, async (req, res) => {
    try {
        var data = await Newslatter.findOne({ _id: req.params._id })
        if (data) {
            await data.delete()
            res.send({ result: "Done", message: "Record is Deleted!!!!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid ID" })
    } catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})


//API to Search
app.post("/search", async (req, res) => {
    try {
        var data = await Product.find({
            $or: [
                { name: { $regex: `${req.body.search}`, $options: "i" } },
                { maincategory: { $regex: `${req.body.search}`, $options: "i" } },
                { subcategory: { $regex: `${req.body.search}`, $options: "i" } },
                { brand: { $regex: `${req.body.search}`, $options: "i" } },
                { color: { $regex: `${req.body.search}`, $options: "i" } },
                { size: { $regex: `${req.body.search}`, $options: "i" } },
                { stock: { $regex: `${req.body.search}`, $options: "i" } },
                { description: { $regex: `${req.body.search}`, $options: "i" } }
            ]
        })
        res.send({ result: "Done", data: data })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})

//API for Password Reset
app.post("/reset-username", async (req, res) => {
    try {
        var data = await User.findOne({ username: req.body.username })
        if (data) {
            let otp = parseInt(Math.random() * 1000000)
            data.otp = otp
            await data.save()
            mailOption = {
                from: from,
                to: data.email,
                subject: "OTP for Password Reset !!! : Team Ecom",
                text: `
                            OTP for Password Reset is ${otp}
                            Team : Ecom PVT LTD
                            Noida
                        `
            }
            transporter.sendMail(mailOption, (error, data) => {
                if (error)
                    console.log(error);
            })
            res.send({ result: "Done", message: "OTP is Sent on Your Registered Email Id!!" })
        }
        else
            res.status(404).send({ result: "Fail", message: "Invalid Username!!" })
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!" })
    }
})
app.post("/reset-otp", async (req, res) => {
    try {
        var data = await User.findOne({ username: req.body.username })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({ result: "Done" })
            else
                res.status(401).send({ result: "Fail", message: "Invalid OTP!!!" })
        }
        else
            res.status(401).send({ result: "Fail", message: "UnAuthorized!!!" })
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.post("/reset-password", async (req, res) => {
    try {
        var data = await User.findOne({ username: req.body.username })
        if (data) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    res.status(500).send({ result: "Fail", message: "Internal Server Error" })
                else {
                    data.password = hash
                    await data.save()
                    res.send({ result: "Done", message: "Password Has Been Reset!!!!!" })
                }
            })
        }
        else
            res.status(401).send({ result: "Fail", message: "UnAuthorized!!!" })
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    }
})
app.listen(8000, () => console.log("Server is Running at PORT 8000"))