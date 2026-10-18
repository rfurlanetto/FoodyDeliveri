package com.delivery.rastreador.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderItemDTO(
        @NotBlank(message = "Nome do produto é obrigatório")
        String productName,
        
        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 1, message = "Quantidade mínima é 1")
        Integer quantity,
        
        @NotNull(message = "Preço é obrigatório")
        @Min(value = 0.01, message = "Preço mínimo é 0.01")
        Double price
) {
}
