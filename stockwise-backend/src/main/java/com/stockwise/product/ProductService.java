package com.stockwise.product;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@Transactional
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Product> findAll(String search) {
        if (search == null || search.isBlank()) return repository.findAll();
        return repository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrderByIdDesc(search, search);
    }

    @Transactional(readOnly = true)
    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public Product create(Product product) {
        if (repository.existsBySkuIgnoreCase(product.getSku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU already exists");
        }
        product.setId(null);
        return repository.save(product);
    }

    public Product update(Long id, Product input) {
        Product product = findById(id);
        if (!product.getSku().equalsIgnoreCase(input.getSku())
                && repository.existsBySkuIgnoreCase(input.getSku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU already exists");
        }
        product.setName(input.getName());
        product.setSku(input.getSku());
        product.setCategory(input.getCategory());
        product.setPrice(input.getPrice());
        product.setQuantity(input.getQuantity());
        product.setReorderLevel(input.getReorderLevel());
        return repository.save(product);
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }
}
