from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.CharField(max_length=100)

    def __str__(self):
        return self.name
