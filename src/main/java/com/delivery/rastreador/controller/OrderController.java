package com.delivery.rastreador.controller;

import com.delivery.rastreador.dto.CreateOrderDTO;
import com.delivery.rastreador.dto.OrderResponseDTO;
import com.delivery.rastreador.dto.UpdateStatusDTO;
import com.delivery.rastreador.model.User;
import com.delivery.rastreador.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> listOrders(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.listUserOrders(currentUser));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long id, 
                                                      @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.findByIdAndUser(id, currentUser));
    }
    
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody CreateOrderDTO dto,
                                                        @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.createOrder(dto, currentUser));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(@PathVariable Long id,
                                                         @Valid @RequestBody UpdateStatusDTO dto,
                                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.updateStatus(id, dto, currentUser));
    }
}
