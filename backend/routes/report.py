from flask import Blueprint, render_template
from backend.database.db import get_all_products

report_bp = Blueprint("report", __name__)

@report_bp.route("/report")
def report():
    products = get_all_products()
    return render_template("report.html", products=products)
