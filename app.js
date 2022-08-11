const express=require('express');
const mysql=require('mysql');
const { dirname } = require('path');
const app=express();
app.set('view engine','ejs');
app.set('views','views');
const path=require('path');
const bodyparser=require('body-parser');
const encoder=bodyparser.urlencoded({extended:false});

const connection=mysql.createConnection(
    {
    host:"localhost",
    user:"root",
    port:3306,
    password:"password",
    database:"xyz_college_symposium"
    }
);
connection.connect(function(error){
    if(error) throw error
    else{
        console.log("database connected successfully");
    }
});


app.get('/home',(req,res)=>
{
res.sendFile(path.join(__dirname,'views','homepage.html'));
});
app.post('/home',encoder,(req,res)=>{
const name=req.body.name;
const id=req.body.id;
const date=req.body.date;
const collegename=req.body.college;
// console.log(date);


// if(date== '2022-08-11' ||date== '2022-08-12' ||date== '2022-08-13' ||date== '2022-08-14' ||date== '2022-08-15')
// {
const q1=`INSERT INTO details VALUES('${name}','${id}','${date}','${collegename}');`;
connection.query(q1,function(err,res){
    if(err) throw err
    else{
        console.log("inserted datas in table successfully");
        console.log(res);
    }
});
res.sendFile(path.join(__dirname,'views','thankyou.html'));
});
// else{
//     res.sendFile(path.join(__dirname,'views','incorrect.html'));
// }});


// For admin ............................................................................................
app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','adminpage.html'));
});

app.post('/admin/data',encoder,(req,res)=>{
const aname=req.body.name;
const apassword=req.body.pass;
connection.query(`SELECT * FROM admin WHERE username='${aname}' and password='${apassword}' `,function(error,results,fields)
{
    if(results.length>0)
        {
            console.log('valid admin login..success');
            res.redirect('/admin/data/query');
        }
        else 
        {
            res.sendFile(path.join(__dirname,'views','incorrectadmin.html'));
        }
})
});

app.get('/admin/data/query',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','query.html'));
});
app.post('/admin/data/query/getall',(req,res)=>{
    const q='SELECT * from details';
    connection.query(q,function(error,result){
        // const result1=JSON.stringify(result);
        
        if(result.length>0)
        {
            res.render('sendfile',{finalresult:result});
            
        }
        else throw error
    });
});

app.post('/admin/data/query/getdetailsbyname',encoder,(req,res)=>{
    const name=req.body.name;
    connection.query(`SELECT * FROM details WHERE student_name='${name}';`,function(error,result){
        // const result1=JSON.stringify(result);
        if(result.length>0)
        {
            res.render('sendfile',{finalresult:result});
        }
    });
});

app.post('/admin/data/query/getdetailsbyclgname',encoder,(req,res)=>{
const collegename=req.body.name;
connection.query(`SELECT * FROM details WHERE college_name='${collegename}';`,function(error,result){
    // const result1=JSON.stringify(result);
    if(result.length>0)
    {
        res.render('sendfile',{finalresult:result});
    }
});
});

app.post('/admin/data/query/getdetailsbyeventdate',encoder,(req,res)=>{
    const event_date=req.body.date;
    connection.query(`SELECT * FROM details WHERE event_date='${event_date}';`,function(error,result){
        // const result1=JSON.stringify(result);
        // console.log(result1);
        if(result.length>0)
        {
            res.render('sendfile',{finalresult:result});
        }
        else{
            res.sendFile(path.join(__dirname,'views','incorrect.html'));
        }
    });
    });
// For admin............................................................................
app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'views','error.html'));
});
app.listen(3000);