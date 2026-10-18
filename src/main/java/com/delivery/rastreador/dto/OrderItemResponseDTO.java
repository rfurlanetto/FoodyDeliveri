package com.delivery.rastreador.dto;

import com.delivery.rastreador.model.OrderItem;

public record OrderItemResponseDTO(
        Long id,
        String productName,
        Integer quantity,
        Double price
) {
    public OrderItemResponseDTO(OrderItem item) {
        this(
                item.getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPrice()
        );
    }
}
