## py -m venv env
## env\Scripts\activate
## Set-ExecutionPolicy Unrestricted -Scope Process
from flask import Flask, redirect, render_template, request, url_for, flash, abort, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_mysqldb import MySQL
from config import config
from models.ModelUsers import ModelUsers
from models.entities.users import User
from functools import wraps
from models.ModelProducts import ModelProducts
from models.entities.products import Product
import json

app = Flask(__name__)
db = MySQL(app)
login_manager_app = LoginManager(app)
filtered_catalog = None
complete_catalog = None
text_filter_global = None
type_filter_global = None

#Decorador custom
def admin_required(func):
	@wraps(func)
	def decorated_view(*args, **kwargs):
	# Verificar si el usuario está autenticado y es un administrador
		if not current_user.is_authenticated or current_user.usertype != 1:
			abort(403) # Acceso prohibido
		return func(*args, **kwargs)
	return decorated_view

@app.route("/")
def index():
	return redirect("login")

@app.route("/login", methods=["GET", "POST"])
def login():
	if current_user.is_authenticated:
		return redirect(url_for("home"))
	if request.method == "POST":
		user = User(0, request.form['username'], request.form['password'],0)
		logged_user = ModelUsers.login(db, user)
		if logged_user != None:
			login_user(logged_user)
			if logged_user.usertype == 1:
				return redirect(url_for("home"))
			else:
				return redirect(url_for("home"))
		else:
			flash("Acceso rechazado...")
			return render_template("auth/login.html")
	else:
		return render_template("auth/login.html")

@app.route("/home")
@login_required
def home():
	global filtered_catalog
	global text_filter_global
	global type_filter_global

	text_filter_global = request.args.get('text_filter')
	type_filter_global = request.args.get('type_filter')
    
	if text_filter_global is None and type_filter_global is None:
		filtered_json_products = get_products()
	else:
		filtered_json_products = get_products_filtered()
	# Gets complete product list
	json_products = get_products()

	return render_template("home.html",mysql_host=app.config["MYSQL_HOST"],
                           mysql_user=app.config["MYSQL_USER"],
                           mysql_password=app.config["MYSQL_PASSWORD"],
                           mysql_db=app.config["MYSQL_DB"],catalog = json_products, filtered = filtered_json_products, text_filter = text_filter_global, type_filter = type_filter_global, type_user = current_user.usertype, current_user_id = current_user.id )

@app.route("/catalog", methods=["GET", "POST"])
@login_required #requiere que haya un usuario loggeado
@admin_required
def catalog():
	if request.method == "POST":
		if request.form['action']=='save':
			product = Product(request.form['id'], request.form['name'],request.form['author'],request.form['img'],request.form['price'],request.form['type'])
			ModelProducts.update_product(db,product)
		elif request.form['action']=='delete':
			ModelProducts.delete_product(db,request.form['id'])
	json_products = get_products()
	return render_template("html/catalog.html",catalog = json_products,type_user = current_user.usertype, current_user_id = current_user.id )

@app.route("/newproduct", methods=["GET", "POST"])
@login_required #requiere que haya un usuario loggeado
@admin_required
def newproduct():
	if request.method == "POST":
		product = Product(0,request.form['name'],request.form['author'],request.form['img'],request.form['price'],request.form['type'])
		ModelProducts.insert_product(db,product)
		return redirect(url_for("catalog"))
	json_products = get_products()
	return render_template("html/newProduct.html",catalog = json_products,type_user = current_user.usertype, current_user_id = current_user.id )

@app.route("/users", methods=["GET", "POST"])
@login_required #requiere que haya un usuario loggeado
@admin_required
def users():
	if request.method == "POST":
		print(request.form)
		user= User(request.form['id'],request.form['username'],request.form['password'],request.form['usertype'],request.form['fullname'])
		if user.usertype=="1":
			user.usertype = 1
		else:
			user.usertype = 0
		if request.form['action']=='save':
			ModelUsers.insert_user(db,user)
		elif request.form['action']=='update':
			ModelUsers.update_user(db,user)
		elif request.form['action']=='delete':
			ModelUsers.delete_user(db,user.id)
			# Logs out the user if it deleted itself
			print(current_user)
			if user.id==current_user.id:
				return redirect(url_for("logout"))
		return redirect(url_for("users"))
	users = load_users()
	json_products = get_products()
	return render_template("html/users.html",catalog = json_products, users_catalog = users, type_user = current_user.usertype, current_user_id = current_user.id )

@app.route("/checkout")
@login_required
def checkout():
	complete_catalog = get_products()
	return render_template("html/checkout.html",catalog = complete_catalog, type_user = current_user.usertype, current_user_id = current_user.id )

@app.route("/ticket")
@login_required
def ticket():
	complete_catalog = get_products()
	return render_template("html/ticket.html",catalog = complete_catalog, type_user = current_user.usertype, current_user_id = current_user.id )

@app.route("/calculator")
def calculator():
	return render_template("html/calculator.html")

@login_manager_app.user_loader
def load_user(id):
	return ModelUsers.get_by_id(db, id)

def load_users():
	users_catalog = ModelUsers.get_users(db)
	users_dicts = [{key: getattr(product, key) for key in vars(product)} for product in users_catalog]

	# Decode HTML entities in string values
	for user_dict in users_dicts:
		for key, value in user_dict.items():
			if isinstance(value, str):
				user_dict[key] = value.replace('&quot;', '"')
	json_users = json.dumps(users_dicts)
	return json_users

def get_products():
	complete_catalog = ModelProducts.get_products(db)
	product_dicts = [{key: getattr(product, key) for key in vars(product)} for product in complete_catalog]

	# Decode HTML entities in string values
	for product_dict in product_dicts:
		for key, value in product_dict.items():
			if isinstance(value, str):
				product_dict[key] = value.replace('&quot;', '"')
	json_products = json.dumps(product_dicts)
	return json_products

def get_products_filtered():
	global text_filter_global
	global type_filter_global
	filtered_products= ModelProducts.get_filtered(db, text_filter_global, type_filter_global)
	json_product_dicts = [{key: getattr(product, key) for key in vars(product)} for product in filtered_products]

	# Decode HTML entities in string values
	for product_dict in json_product_dicts:
		for key, value in product_dict.items():
			if isinstance(value, str):
				product_dict[key] = value.replace('&quot;', '"')
	filtered_json_products = json.dumps(json_product_dicts)
	return filtered_json_products

@app.route("/logout")
@login_required 
def logout():
	logout_user()
	return redirect(url_for("login"))
	

if __name__ == '__main__':
	app.config.from_object(config['development'])
	app.run()

