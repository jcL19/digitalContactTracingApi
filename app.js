const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const jsonParser = bodyParser.json();



app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

mongoose.connect("mongodb+srv://jcl20:gYD72UUQavipuptf@cluster0.hocpu.mongodb.net/digitalContractTracingDB", {useNewUrlParser: true})

//DATABASE SCHEMAS



const adminAccountSchema = {
    username: String,
    password: String
}

const contactDataSchema = {
    fullName: String,
    address: String,
    contactNum: String,
    securityName: String,
    dateIn: {
        type: String,
    },
    timeIn: {
        type: String,
    }
}



const visitorUserSchema = {
    email: String,
    password: String
}

const securityPersonnelSchema = {
    fullName: String,
    address: String,
    contact: String,
    email: String,
    password: String
}

const ContactData = mongoose.model("ContactData", contactDataSchema);
const VisitorUser = mongoose.model("VisitorUser", visitorUserSchema);
const SecurityPersonnel = mongoose.model("SecurityPersonnel", securityPersonnelSchema);
const AdminAccount = mongoose.model("AdminAccount", adminAccountSchema);



app.route("/visitor/login")
.post(jsonParser, (req, res)=>{
    const wrongPass = {
        pass: {
            isLogged: false,
            msg: "Wrong password! Try again."
        }
    };
    const emailNotFound = {
        email: {
            isLogged: false,
            msg: "Email not found! Try again."
        }
    }
    const logged = {
        logged: {
            isLogged: true
        }
        
    }
    VisitorUser.findOne({email: req.body.email}, (err, foundVisitorUser)=>{
        if(err){
            res.send(err);
        }else{
            if(foundVisitorUser){
                if(foundVisitorUser.password === req.body.password){
                    res.send(true);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    })
})

app.route("/visitor/signup")
.post(jsonParser, (req, res)=>{
    VisitorUser.findOne({email: req.body.email}, (err, foundVisitorUser)=>{
        if(err){
            res.send(err);
        }else{
            if(!foundVisitorUser){
                const newVisitorUser = new VisitorUser({
                    email: req.body.email,
                    password: req.body.password
                })
                newVisitorUser.save();
                res.send(true);
            }else{
                res.send(false);
            }
        }
    })
});

app.route("/personnel/security/login")
.post(jsonParser, (req, res)=>{
    
    SecurityPersonnel.findOne({email: req.body.email}, (err, foundSecurityPersonnel)=>{
        if(err){
            res.send(err);
        }else{
            if(foundSecurityPersonnel){
                if(foundSecurityPersonnel.password === req.body.password){
                    let returnData = {
                        isLog: true,
                        name: foundSecurityPersonnel.fullName
                    }
                    res.send(returnData);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    })
})

app.route("/personnel/security/signup")
.post(jsonParser, (req, res)=>{
    SecurityPersonnel.findOne({email: req.body.email}, (err, foundSecurityPersonnel)=>{
        if(err){
            res.send(err);
        }else{
            if(!foundSecurityPersonnel){
                const newSecurityUser = new SecurityPersonnel({
                    fullName: req.body.fullName,
                    address: req.body.address,
                    contact: req.body.contact,
                    email: req.body.email,
                    password: req.body.password
                })
                newSecurityUser.save();
                res.send(true);
            }else{
                res.send(false);
            }
        }
    })
});

app.route("/personnel/security/addrecord")
.post(jsonParser, (req, res)=>{
    const newContactData = new ContactData({
        fullName: req.body.fullName,
        address: req.body.address,
        contactNum: req.body.contact,
        securityName: req.body.loggedSecurity,
        dateIn: req.body.dateIn,
        timeIn: req.body.timeIn
    })
    newContactData.save();
    res.send(true);
})


app.route("/personnel/admin/getAll/:dateNow")
.get((req, res)=>{
    ContactData.find({dateIn: req.params.dateNow}, (err, foundResults)=>{
        if(err){
            res.send(err);
        }else{
            res.send(foundResults);
        }
    });
});

app.route("/personnel/admin/getAll")
.get((req, res)=>{
    
    ContactData.find((err, foundResults)=>{
        if(err){
            res.send(err);
        }else{
            res.send(foundResults);
        }
    });
});

// app.route("/personnel/admin/reviewbydate/:from/:to")
// .get((req, res)=>{
//     DailyRecord.find({dateOfEntry:{
//         "$gte": new Date(req.params.from), "$lte": new Date(req.params.to)
//     }}, (err, foundResults)=>{
//         if(err){
//             res.send(err);
//         }else{
//             res.send(foundResults);
//         }
//     });
// });

app.route("/admin/register")
.post(jsonParser, (req, res)=>{
    AdminAccount.findOne({username: req.body.username}, (err, foundAdminAccount)=>{
        if(err){
            res.send(err);
        }else{
            if(!foundAdminAccount){
                const newAdminAccount = new AdminAccount({
                    username: req.body.username,
                    password: req.body.password
                })
                newAdminAccount.save();
                res.send(true);
            }else{
                res.send(false);
            }
        }
    })
});

app.route("/admin/login")
.post(jsonParser, (req, res)=>{
    AdminAccount.findOne({username: req.body.username}, (err, foundAdminAccount)=>{
        if(err){
            res.send(err);
        }else{
            if(foundAdminAccount){
                if(foundAdminAccount.password === req.body.password){
                    const returnData =  {
                        isLog: true,
                        username: foundAdminAccount.username
                    }
                    res.send(returnData);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    })
})

const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
    console.log("Server open on port 3001")
})