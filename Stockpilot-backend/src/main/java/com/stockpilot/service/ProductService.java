package com.stockpilot.service;

import com.stockpilot.dto.ProductRequest;
import com.stockpilot.entity.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(ProductRequest request);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    List<Product> searchProductsByName(String name);

    List<Product> getLowStockProducts();
}
