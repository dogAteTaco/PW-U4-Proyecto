class Product():
	def __init__(self, id, name, author, img, price, type) -> None:
		self.id = id
		self.name = name
		self.author = author
		self.img = img
		self.price = price
		self.type = type
    
	def __str__(self):
		return f"id={self.id}, name='{self.name}', author='{self.author}', img='{self.img}', price={self.price}, type='{self.type}'"