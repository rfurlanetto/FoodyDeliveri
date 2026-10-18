package com.delivery.rastreador.dto;

import com.delivery.rastreador.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusDTO(
        @NotNull(message = "Status é obrigatório")
        OrderStatus status
) {
}
