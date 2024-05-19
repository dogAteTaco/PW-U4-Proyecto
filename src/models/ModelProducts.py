from .entities.products import Product

class ModelProducts():
	@classmethod
	def get_products(self, db):
		try:
			cursor = db.connection.cursor()
			cursor.execute("SELECT id, name, author, img, price, type FROM products")
			rows = cursor.fetchall()
			products = []
			for row in rows:
				if row[0] != None:
					product = Product(row[0], row[1], row[2], row[3], row[4],row[5])
					products.append(product)
			return products
		except Exception as ex:
			raise Exception(ex)
		

	@classmethod
	def get_filtered(self, db, text, type):
		try:
			cursor = db.connection.cursor()
			query = f"SELECT id, name, author, img, price, type FROM products where (LOWER(author) LIKE LOWER('%{text}%') or LOWER(name) LIKE LOWER('%{text}%')) "
			if type != None and type!='E':
				query = query+f" and LOWER(type)=LOWER('{type}')"
			cursor.execute(query)
			rows = cursor.fetchall()
			products = []
			for row in rows:
				if row[0] != None:
					product = Product(row[0], row[1], row[2], row[3], row[4],row[5])
					products.append(product)
			return products
		except Exception as ex:
			raise Exception(ex)
		
	@classmethod
	def update_product(self, db, product):
		try:
			cursor = db.connection.cursor()
			query = f"UPDATE products set name='{product.name}', author='{product.author}', img='{product.img}', price='{product.price}', type='{product.type}' WHERE id='{product.id}'"
			cursor.execute(query)
			db.connection.commit() 
			return
		except Exception as ex:
			raise Exception(ex)
		
	@classmethod
	def insert_product(self, db, product):
		try:
			cursor = db.connection.cursor()
			query = f"CALL sp_AddProduct('{product.name}','{product.author}','{product.img}','{product.price}','{product.type}')"
			print(query)
			cursor.execute(query)
			db.connection.commit() 
			return
		except Exception as ex:
			raise Exception(ex)
	
	@classmethod
	def delete_product(self, db, id):
		try:
			cursor = db.connection.cursor()
			
			query = f"DELETE FROM products WHERE id='{id}'"
			print('query: ',query)
			cursor.execute(query)
			db.connection.commit() 
			return
		except Exception as ex:
			raise Exception(ex)
