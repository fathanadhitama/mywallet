from fastapi import FastAPI,status,HTTPException, Form
from pydantic import BaseModel
from typing import Optional,List, Union
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

import models

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Spend(BaseModel): #serializer
    id:Union[int,None]
    name:str
    description:str
    nominal:int

    class Config:
        orm_mode=True

db=SessionLocal()

@app.get('/items',response_model=List[Spend], status_code=200) #get all item
def get_all_items():
    items=db.query(models.Item).all()
    return items

@app.get('/item/{item_id}',response_model=Spend,status_code=status.HTTP_200_OK) #get an item
def get_an_item(item_id:int):
    item=db.query(models.Item).filter(models.Item.id==item_id).first()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource Not Found.")
    return item

@app.post('/items',response_model=Spend,
        status_code=status.HTTP_201_CREATED) #create an item
def create_an_item(item:Spend):
    new_item=models.Item(
        name=item.name,
        description=item.description,
        nominal=item.nominal
    )

    db.add(new_item)
    db.commit()
    return new_item

@app.put('/item/{item_id}',response_model=Spend,status_code=status.HTTP_200_OK) #update an item
def update_an_item(item_id:int,item:Spend):
    item_to_update=db.query(models.Item).filter(models.Item.id==item_id).first()
    item_to_update.name=item.name
    item_to_update.description=item.description
    item_to_update.nominal = item.nominal

    db.commit()

    return item_to_update

@app.delete('/item/{item_id}')
def delete_item(item_id:int):
    item_to_delete=db.query(models.Item).filter(models.Item.id==item_id).first()
    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource Not Found.")

    db.delete(item_to_delete)
    db.commit()

    return item_to_delete
