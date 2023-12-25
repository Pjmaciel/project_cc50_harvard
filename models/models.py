from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student(db.Model):
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150))
    age =  db.Column(db.Integer)
    discipline_id = db.Column(db.Integer)

    def __init__(self,name,age,discipline_id):
        self.name = name
        self.age = age
        self.discipline_id = discipline_id

    
    def to_dict(self, columns=[]):
        if not columns:
            return{"id": self.id, "name": self.name, "age": self.age, "discipline_id": self.discipline_id}
        else:
            return {col: getattr(self, col) for col in columns}

class Discipline(db.Model):
    id = db.Column("id", db.Integer,primary_key=True, autoincrement=True)
    name = db.Column(db.String(150))

    def __init__(self,name):
        self.name = name
    
    def to_dict(self, columns=[]):
        if not columns:
            return{"id": self.id, "name": self.name}
        else:
            return {col: getattr(self, col) for col in columns}