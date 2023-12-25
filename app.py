from flask import Flask, render_template
from models.models import db, Student,Discipline
from controllers.student import student_bp as student_controller
from controllers.discipline import discipline_bp as discipline_controller
import os

app = Flask(__name__,template_folder="templates")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.sqlite3'
db.init_app(app)

app.register_blueprint(student_controller, url_prefix="/student/", name="students")
app.register_blueprint(discipline_controller, url_prefix="/discipline/", name="disciplines")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)