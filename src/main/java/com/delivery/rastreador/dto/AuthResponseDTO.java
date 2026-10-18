package com.delivery.rastreador.dto;

public record AuthResponseDTO(
        String token,
        Long id,
        String name,
        String email
) {
    public AuthResponseDTO(String token) {
        this(token, null, null, null);
    }
}
