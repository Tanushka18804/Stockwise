package com.stockwise.dashboard;

import com.stockwise.product.Product;
import com.stockwise.product.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ProductRepository repository;

    public DashboardController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        var products = repository.findAll();
        int totalUnits = products.stream().mapToInt(Product::getQuantity).sum();
        long lowStock = products.stream()
                .filter(p -> p.getQuantity() <= p.getReorderLevel()).count();
        BigDecimal inventoryValue = products.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return Map.of(
                "totalProducts", products.size(),
                "totalUnits", totalUnits,
                "lowStockItems", lowStock,
                "inventoryValue", inventoryValue
        );
    }
}
