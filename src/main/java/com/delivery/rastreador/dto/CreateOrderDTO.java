package com.delivery.rastreador.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateOrderDTO(
        @NotBlank(message = "Nome do destinatário é obrigatório")
        String customerName,
        
        @NotBlank(message = "Endereço de entrega é obrigatório")
        String deliveryAddress,
        
        @NotEmpty(message = "Pedido deve ter pelo menos um item")
        @Valid
        List<OrderItemDTO> items
) {
}
