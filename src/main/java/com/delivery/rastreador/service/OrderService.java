package com.delivery.rastreador.service;

import com.delivery.rastreador.dto.CreateOrderDTO;
import com.delivery.rastreador.dto.OrderResponseDTO;
import com.delivery.rastreador.dto.UpdateStatusDTO;
import com.delivery.rastreador.exception.ResourceNotFoundException;
import com.delivery.rastreador.model.Order;
import com.delivery.rastreador.model.OrderItem;
import com.delivery.rastreador.model.OrderStatus;
import com.delivery.rastreador.model.User;
import com.delivery.rastreador.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    public List<OrderResponseDTO> listUserOrders(User currentUser) {
        return orderRepository.findAllByUser(currentUser)
                .stream()
                .map(OrderResponseDTO::new)
                .toList();
    }
    
    public OrderResponseDTO findByIdAndUser(Long orderId, User currentUser) {
        Order order = orderRepository.findByIdAndUser(orderId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
        return new OrderResponseDTO(order);
    }
    
    @Transactional
    public OrderResponseDTO createOrder(CreateOrderDTO dto, User currentUser) {
        Order order = new Order(currentUser, dto.customerName(), dto.deliveryAddress());
        
        for (var itemDto : dto.items()) {
            OrderItem item = new OrderItem(itemDto.productName(), itemDto.quantity(), itemDto.price());
            order.addItem(item);
        }
        
        order = orderRepository.save(order);
        return new OrderResponseDTO(order);
    }
    
    @Transactional
    public OrderResponseDTO updateStatus(Long orderId, UpdateStatusDTO dto, User currentUser) {
        Order order = orderRepository.findByIdAndUser(orderId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
        
        order.setStatus(dto.status());
        order = orderRepository.save(order);
        return new OrderResponseDTO(order);
    }
}
