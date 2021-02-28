//Create variables here
var dog, sittingDog, happyDog, nameDog
var database, foodS, foodStock
var feedDog, addFood, fedTime, lastFed, foodObj
function preload()
{
	//load images here
  sittingDog=loadImage('dogImg.png')

  happyDog=loadImage('dogImg1.png')
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  foodObj=new Food()

  foodStock=database.ref('food')
  foodStock.on("value",readStock)

  dog=createSprite(850,250)
  dog.addImage(sittingDog)
  dog.scale=0.3

  feed=createButton("Feed the Dog")
  feed.position(700,95);
  feed.mousePressed(feedDog)
  addFood=createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
  nameDog=createInput("Name the Dog")
  nameDog.position(900,95)
}


function draw() {  
  background(46,139,87);
  foodObj.display();
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val()
  })
  fill(255,255,255)
  textSize(15)
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }
  else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }
  else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   fill('white')
   text("Food Remaining: "+foodStock,800,50)
  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

  function addFoods(){
    foodS++;
    foodObj.updateFoodStock(foodObj.getFoodStock()+1);
    database.ref('/').update({
      Food:foodS
    })
  }
  function feedDog(){
    dog.addImage(happyDog);
    foodS=foodS-1;
    if(foodObj.getFoodStock()<= 0){
      foodObj.updateFoodStock(foodObj.getFoodStock()*0);
    }
    else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    }
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }