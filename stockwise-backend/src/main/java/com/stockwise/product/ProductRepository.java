package com.stockwise.product;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrderByIdDesc(String name, String sku);
    boolean existsBySkuIgnoreCase(String sku);
}
