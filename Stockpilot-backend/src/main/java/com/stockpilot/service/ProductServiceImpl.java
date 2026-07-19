package com.stockpilot.service;

import com.stockpilot.dto.ProductRequest;
import com.stockpilot.entity.Category;
import com.stockpilot.entity.Product;
import com.stockpilot.repository.CategoryRepository;
import com.stockpilot.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;


    // Using constructor injection (not using @Autowired)

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }


    @Override
    public Product addProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);

        if (category == null) {
            return null;
        }

        Product product = new Product();

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setReorderLevel(request.getReorderLevel());
        product.setCategory(category);

        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Product updateProduct(Long id, ProductRequest request) {

        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);

        if (category == null) {
            return null;
        }

        existingProduct.setName(request.getName());
        existingProduct.setSku(request.getSku());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setQuantity(request.getQuantity());
        existingProduct.setReorderLevel(request.getReorderLevel());
        existingProduct.setCategory(category);

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
}