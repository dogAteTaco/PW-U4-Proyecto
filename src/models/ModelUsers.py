from .entities.users import User

class ModelUsers():
	@classmethod
	def login(self, db, user):
		try:
			cursor = db.connection.cursor()
			cursor.execute("call sp_verifyIdentity(%s, %s)",(user.username, user.password))
			row = cursor.fetchone()
			if row[0] != None:
				user = User(row[0], row[1], row[2], row[4], row[3])
				return user
			else:
				return None
		except Exception as ex:
			raise Exception(ex)
		
	@classmethod
	def get_by_id(self, db, id):
		try:
			cursor = db.connection.cursor()
			cursor.execute("SELECT id, username,usertype, fullname FROM users WHERE id = %s", (id))
			row = cursor.fetchone()
			if row != None:
				return User(row[0], row[1], None, row[2], row[3])
			else:
				return None
		except Exception as ex:
			raise Exception(ex)
	@classmethod
	def insert_user(self, db, user):
		try:
			cursor = db.connection.cursor()
			cursor.execute(f"CALL sp_AddUser('{user.username}','{user.password}','{user.fullname}','{user.usertype}')")
			db.connection.commit() 
		except Exception as ex:
			raise Exception(ex)
		
	@classmethod
	def update_user(self, db, user):
		try:
			cursor = db.connection.cursor()
			if user.password=="":
				cursor.execute(f"UPDATE users SET fullname='{user.fullname}',usertype='{user.usertype}' WHERE id='{user.id}'")
			else:
				cursor.execute(f"UPDATE users SET password=SHA2('{user.password}',256),fullname='{user.fullname}',usertype='{user.usertype}' WHERE id='{user.id}'")
			db.connection.commit() 
		except Exception as ex:
			raise Exception(ex)
		
	@classmethod
	def delete_user(self, db, id):
		try:
			cursor = db.connection.cursor()
			cursor.execute(f"DELETE FROM users WHERE id='{id}'")
			db.connection.commit() 
		except Exception as ex:
			raise Exception(ex)
		
	@classmethod
	def get_users(self, db):
		try:
			cursor = db.connection.cursor()
			cursor.execute("SELECT id, username,usertype, fullname FROM users")
			rows = cursor.fetchall()
			users = []
			for row in rows:
				if row[0] != None:
					user = User(row[0], row[1], None, row[2], row[3])
					users.append(user)
			return users
		except Exception as ex:
			raise Exception(ex)