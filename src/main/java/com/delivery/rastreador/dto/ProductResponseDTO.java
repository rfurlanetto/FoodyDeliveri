package com.delivery.rastreador.dto;

import com.delivery.rastreador.model.Product;

public record ProductResponseDTO(
        Long id,
        String name,
        String description,
        Double price,
        Integer stock,
        String category,
        boolean available
) {
    public ProductResponseDTO(Product product) {
        this(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory(),
                product.isAvailable()
        );
    }
}
