package com.delivery.rastreador.dto;

import com.delivery.rastreador.model.Order;
import com.delivery.rastreador.model.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResponseDTO(
        Long id,
        String customerName,
        String deliveryAddress,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemResponseDTO> items
) {
    public OrderResponseDTO(Order order) {
        this(
                order.getId(),
                order.getCustomerName(),
                order.getDeliveryAddress(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getItems().stream()
                        .map(OrderItemResponseDTO::new)
                        .collect(Collectors.toList())
        );
    }
}
