import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"jk32@12345AA",
  port:5432
})
db.connect()
let items = [];

app.get("/",async(req, res) => {
  try {
    const data= await db.query("SELECT * FROM items")
  console.log(data.rows)
  // items.push(data.rows)-->wrong way 
  items=data.rows   //--> right way
  res.render("index.ejs", {
    listTitle: "Today",
    listItems:items
   });
    
  } catch (error) {
    console.log("Error in /get route ",error.message)
    
  }
  
});

app.post("/add", async(req, res) => {
  // console.log(req.body)
  // console.log(req.body.newItem)
  try {
    const task=req.body.newItem
     await db.query("INSERT INTO items(title) VALUES($1)",[task])
  
    res.redirect("/");
    
  } catch (error) {
    console.log("Something wrong in /add route", error.message)
  }
});

app.post("/edit", async (req, res) => {
try {
  console.log("looking at result for /edit route",req.body)
  const new_value=req.body.updatedItemTitle
  const new_value_id=req.body.updatedItemId
  await db.query("UPDATE items SET title=$1 WHERE ID=$2",[new_value,new_value_id])
  res.redirect("/")
} catch (error) {
  console.log("Error in /edit route",error.message)
}


});

app.post("/delete", async (req, res) => {
  try {
    console.log(req.body)
    const deleteItem=req.body.deleteItemId
    await db.query("DELETE FROM items WHERE id=$1",[deleteItem])
    res.redirect("/")
    
  } catch (error) {
   console.log("Error in /delete route",error.message)   
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
