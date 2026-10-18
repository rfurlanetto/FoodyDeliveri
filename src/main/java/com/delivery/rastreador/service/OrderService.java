package com.delivery.rastreador.service;

import com.delivery.rastreador.dto.CreateOrderDTO;
import com.delivery.rastreador.dto.OrderResponseDTO;
import com.delivery.rastreador.dto.UpdateStatusDTO;
import com.delivery.rastreador.exception.InsufficientStockException;
import com.delivery.rastreador.exception.ResourceNotFoundException;
import com.delivery.rastreador.model.Order;
import com.delivery.rastreador.model.OrderItem;
import com.delivery.rastreador.model.Product;
import com.delivery.rastreador.model.User;
import com.delivery.rastreador.repository.OrderRepository;
import com.delivery.rastreador.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
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
            Product product;
            if (itemDto.productId() != null) {
                product = productRepository.findById(itemDto.productId())
                        .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + itemDto.productId() + " não encontrado"));
            } else {
                product = productRepository.findByName(itemDto.productName())
                        .orElseThrow(() -> new ResourceNotFoundException("Produto '" + itemDto.productName() + "' não encontrado"));
            }

            if (product.getStock() <= 0) {
                throw new InsufficientStockException("O produto '" + product.getName() + "' está indisponível (estoque esgotado).");
            }

            if (product.getStock() < itemDto.quantity()) {
                throw new InsufficientStockException("Estoque insuficiente para '" + product.getName() + "'. Disponível: " + product.getStock() + ", Solicitado: " + itemDto.quantity());
            }

            // Decrement stock
            product.setStock(product.getStock() - itemDto.quantity());
            productRepository.save(product);

            // Add item to order with current price snapshot
            OrderItem item = new OrderItem(product.getName(), itemDto.quantity(), product.getPrice());
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
