from flask import Blueprint, request, Request
from models.models import db, Discipline
import json

discipline_bp = Blueprint("discipline", __name__)

@discipline_bp.route("/listDisciplines")
def list():
    rows = Discipline.query.all()
    result = [d.to_dict() for d in rows]
    return request(request=json.dumps(result), status=200, content_type="application/json")

@discipline_bp.route("/addDiscipline", methods=['POST'])
def add():
    discipline = Discipline(Request.form['name'])
    db.session.add(discipline)
    db.session.commit()
    return request(request=json.dumps(discipline.to_dict()),status=200, content_type="application/json")

@discipline_bp.route("/editDiscipline/<int:id>",methods=['PUT', 'POST'])
def edit(id):
    discipline = Discipline.query.get(id)
    discipline.name = Request.form['name']
    db.session.commit()
    return request(request=json.dumps(discipline.to_dict()), status=201, content_type="application/json")

@discipline_bp.route("/deleteDiscipline/<int:id>",methods=['DELETE'])
def delete(id):
    discipline = Discipline.query.get(id)
    db.session.delete(discipline)
    db.session.commit()
    return request(request=json.dumps(discipline.to_dict()),status=201, content_type="application/json")