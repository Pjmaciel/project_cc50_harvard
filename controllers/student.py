from flask import Blueprint,request, Response
from models.models import db, Student
import json

student_bp =  Blueprint("students", __name__)

@student_bp.route("/")
def list():
    rows = Student.query.all()
    result = [s.to_dict() for s in rows]
    return Response(response=json.dumps(result), status=200, content_type="application/json")

@student_bp.route("/addStudent",methods=['POST'])
def add():
    student = Student(request.form['name'], request.form['age'], request.form['discipline_id'])
    db.session.add(student)
    db.session.commit()
    return Response(response=json.dumps({'status': 'success', 'data': student.to_dict()}), status=200, content_type="application/json")

@student_bp.route('/editStudent/<int:id>', methods=['PUT', 'POST'])
def edit(id):
    student = Student.query.get(id)
    student.name = request.form['name']
    student.age = request.form['age']
    student.discipline_id = request.form['discipline_id']
    db.session.commit()
    return Response(response=json.dumps(student.to_dict()), status=201, content_type="application/json")

@student_bp.route("/deleteStudent/<int:id>", methods=['DELETE'])
def delete(id):
    student = Student.query.get(id)
    db.session.delete(student)
    db.session.commit()
    return Response(request=json.dumps(student.to_dict()), status=200, content_type="application/json")