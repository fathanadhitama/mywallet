from database import Base
from sqlalchemy import String,Integer,Column,Text

class Item(Base):
    __tablename__="spending"
    id = Column(Integer, primary_key=True)
    name = Column(String(256))
    description=Column(Text)
    nominal = Column(Integer)

    def __repr__(self):
        return f"<Item name={self.name} nominal={self.nominal}>"