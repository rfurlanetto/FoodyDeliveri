package com.delivery.rastreador.repository;

import com.delivery.rastreador.model.Order;
import com.delivery.rastreador.model.OrderStatus;
import com.delivery.rastreador.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUser(User user);
    Optional<Order> findByIdAndUser(Long id, User user);
    List<Order> findByStatusIn(List<OrderStatus> statuses);
}
